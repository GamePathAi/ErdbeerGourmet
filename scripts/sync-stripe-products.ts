import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.development' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database functions (simplified for script)
const db = {
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return { data }
    },
    
    async create(product: any) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    async update(id: string, updates: any) {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

interface StripeProductWithPrice {
  id: string
  name: string
  description: string | null
  active: boolean
  default_price: string | null
  images: string[]
  metadata: Record<string, string>
  priceData?: {
    id: string
    unit_amount: number
    currency: string
  }
}

async function syncStripeProducts() {
  try {
    console.log('🔄 Iniciando sincronização de produtos do Stripe...')
    
    // 1. Buscar todos os produtos do Stripe
    const products = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ['data.default_price']
    })
    
    console.log(`📦 Encontrados ${products.data.length} produtos no Stripe`)
    
    // 2. Para cada produto, buscar informações de preço
    const productsWithPrices: StripeProductWithPrice[] = []
    
    for (const product of products.data) {
      let priceData = null
      
      if (product.default_price) {
        if (typeof product.default_price === 'string') {
          // Se default_price é uma string, buscar o preço
          const price = await stripe.prices.retrieve(product.default_price)
          priceData = {
            id: price.id,
            unit_amount: price.unit_amount || 0,
            currency: price.currency
          }
        } else {
          // Se default_price já é um objeto expandido
          priceData = {
            id: product.default_price.id,
            unit_amount: product.default_price.unit_amount || 0,
            currency: product.default_price.currency
          }
        }
      }
      
      productsWithPrices.push({
        ...product,
        priceData
      })
    }
    
    // 3. Sincronizar com Supabase
    let syncedCount = 0
    let errorCount = 0
    
    for (const product of productsWithPrices) {
      try {
        if (!product.priceData) {
          console.log(`⚠️  Produto ${product.name} não tem preço definido, pulando...`)
          continue
        }
        
        // Verificar se o produto já existe
        const { data: existingProducts } = await db.products.getAll()
        const existingProduct = existingProducts?.find(p => p.stripe_product_id === product.id)
        
        const productData = {
          stripe_product_id: product.id,
          stripe_price_id: product.priceData.id,
          name: product.name,
          description: product.description || '',
          price_cents: product.priceData.unit_amount,
          currency: product.priceData.currency.toUpperCase(),
          image_url: product.images[0] || null,
          category: product.metadata.category || 'geral',
          weight_grams: product.metadata.weight_grams ? parseInt(product.metadata.weight_grams) : null,
          is_active: product.active
        }
        
        if (existingProduct) {
          // Atualizar produto existente
          await db.products.update(existingProduct.id, productData)
          console.log(`✅ Produto atualizado: ${product.name}`)
        } else {
          // Criar novo produto
          await db.products.create(productData)
          console.log(`🆕 Produto criado: ${product.name}`)
        }
        
        syncedCount++
      } catch (error) {
        console.error(`❌ Erro ao sincronizar produto ${product.name}:`, error)
        errorCount++
      }
    }
    
    console.log('\n📊 Resumo da sincronização:')
    console.log(`✅ Produtos sincronizados: ${syncedCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📦 Total de produtos no Stripe: ${products.data.length}`)
    
    // 4. Listar produtos sincronizados
    const { data: allProducts } = await db.products.getAll()
    console.log('\n🛍️  Produtos no banco de dados:')
    allProducts?.forEach(product => {
      console.log(`- ${product.name}: ${product.price_cents/100} ${product.currency} (${product.stripe_product_id})`)
    })
    
  } catch (error) {
    console.error('💥 Erro na sincronização:', error)
    process.exit(1)
  }
}

// Executar sincronização
syncStripeProducts()
  .then(() => {
    console.log('\n🎉 Sincronização concluída com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha na sincronização:', error)
    process.exit(1)
  })

export { syncStripeProducts }
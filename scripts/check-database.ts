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

async function checkDatabase() {
  console.log('🔍 Verificando estrutura do banco de dados...')
  
  const tables = ['customers', 'products', 'orders', 'order_items', 'payment_events']
  const results: { [key: string]: boolean } = {}
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        results[table] = false
        console.log(`❌ Tabela '${table}': ${error.message}`)
      } else {
        results[table] = true
        console.log(`✅ Tabela '${table}': OK`)
      }
    } catch (err) {
      results[table] = false
      console.log(`❌ Tabela '${table}': Erro de conexão`)
    }
  }
  
  const allTablesExist = Object.values(results).every(exists => exists)
  
  console.log('\n📊 Resumo:')
  console.log(`✅ Tabelas funcionando: ${Object.values(results).filter(Boolean).length}/${tables.length}`)
  console.log(`❌ Tabelas com problema: ${Object.values(results).filter(x => !x).length}/${tables.length}`)
  
  if (allTablesExist) {
    console.log('\n🎉 Banco de dados configurado corretamente!')
    console.log('Você pode executar: npm run sync:stripe:dev')
  } else {
    console.log('\n⚠️  Algumas tabelas estão faltando.')
    console.log('📋 Para corrigir:')
    console.log('1. Acesse: https://supabase.com/dashboard/project/ckwnxnzadsxmalcptkle/sql')
    console.log('2. Execute o conteúdo do arquivo supabase-schema.sql')
    console.log('3. Execute novamente: npm run check:db')
    console.log('\n📖 Veja o guia completo em: SETUP_SUPABASE_QUICK.md')
  }
  
  return allTablesExist
}

// Executar verificação
checkDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Erro na verificação:', error)
    process.exit(1)
  })

export { checkDatabase }
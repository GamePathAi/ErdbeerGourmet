import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.development' })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkEbookTable() {
  console.log('🔍 Verificando tabela ebook_purchases...')
  
  try {
    // Try to query the ebook_purchases table
    const { data, error } = await supabase
      .from('ebook_purchases')
      .select('*')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "ebook_purchases" does not exist')) {
        console.log('❌ Tabela ebook_purchases NÃO EXISTE')
        console.log('\n📋 Para criar a tabela, execute o SQL:')
        console.log('\n-- No painel do Supabase, vá em SQL Editor e execute:')
        console.log('-- Conteúdo do arquivo: supabase/migrations/20241201000000_create_ebook_purchases.sql')
        return false
      } else {
        console.error('❌ Erro ao verificar tabela:', error.message)
        return false
      }
    }
    
    console.log('✅ Tabela ebook_purchases existe!')
    console.log(`📊 Registros encontrados: ${data?.length || 0}`)
    
    if (data && data.length > 0) {
      console.log('\n📋 Últimos registros:')
      data.forEach((record, index) => {
        console.log(`${index + 1}. Status: ${record.status}, Criado em: ${record.created_at}`)
      })
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Verificando configuração do e-book...')
  
  const tableExists = await checkEbookTable()
  
  if (tableExists) {
    console.log('\n🎉 Sistema de e-book configurado corretamente!')
    console.log('\n📝 Próximos passos:')
    console.log('1. Teste o fluxo em: http://localhost:8888/ebook')
    console.log('2. Verifique se as chaves do Stripe estão corretas')
    console.log('3. Configure o webhook no Stripe Dashboard')
  } else {
    console.log('\n⚠️  Tabela ebook_purchases precisa ser criada!')
    console.log('\n📋 Instruções:')
    console.log('1. Acesse o painel do Supabase: https://supabase.com/dashboard')
    console.log('2. Vá para o projeto: ckwnxnzadsxmalcptkle')
    console.log('3. Clique em "SQL Editor"')
    console.log('4. Execute o conteúdo do arquivo: supabase/migrations/20241201000000_create_ebook_purchases.sql')
  }
}

main().catch(console.error)
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config({ path: '.env.development' })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyEbookMigration() {
  console.log('🚀 Aplicando migração da tabela ebook_purchases...')
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20241201000000_create_ebook_purchases.sql')
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Arquivo de migração não encontrado:', migrationPath)
      return false
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    console.log('📄 Arquivo de migração carregado')
    
    // Execute the migration
    console.log('⚡ Executando migração...')
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    })
    
    if (error) {
      console.error('❌ Erro ao executar migração:', error.message)
      
      // Try alternative method - execute each statement separately
      console.log('🔄 Tentando método alternativo...')
      
      // Split SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`📝 Executando: ${statement.substring(0, 50)}...`)
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          })
          
          if (stmtError) {
            console.error(`❌ Erro na declaração: ${stmtError.message}`)
            console.log('📋 Declaração que falhou:', statement)
            return false
          }
        }
      }
      
      console.log('✅ Migração aplicada com método alternativo!')
    } else {
      console.log('✅ Migração aplicada com sucesso!')
    }
    
    // Verify the table was created
    console.log('🔍 Verificando se a tabela foi criada...')
    const { data: tableData, error: tableError } = await supabase
      .from('ebook_purchases')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Tabela ainda não existe:', tableError.message)
      return false
    }
    
    console.log('✅ Tabela ebook_purchases criada com sucesso!')
    return true
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
    return false
  }
}

async function main() {
  console.log('🎯 Configurando sistema de e-book...')
  
  const success = await applyEbookMigration()
  
  if (success) {
    console.log('\n🎉 Sistema de e-book configurado com sucesso!')
    console.log('\n📝 Próximos passos:')
    console.log('1. Teste o fluxo em: http://localhost:8888/ebook')
    console.log('2. Verifique se as chaves do Stripe estão corretas')
    console.log('3. Configure o webhook no Stripe Dashboard')
    console.log('4. Teste uma compra completa')
  } else {
    console.log('\n⚠️  Falha na configuração!')
    console.log('\n📋 Solução manual:')
    console.log('1. Acesse: https://supabase.com/dashboard/project/ckwnxnzadsxmalcptkle')
    console.log('2. Vá para "SQL Editor"')
    console.log('3. Cole e execute o conteúdo do arquivo:')
    console.log('   supabase/migrations/20241201000000_create_ebook_purchases.sql')
  }
}

main().catch(console.error)
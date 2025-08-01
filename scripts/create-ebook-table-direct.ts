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

async function executeSQL(sql: string) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey
    },
    body: JSON.stringify({ sql })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HTTP ${response.status}: ${error}`)
  }
  
  return response.json()
}

async function createEbookTable() {
  console.log('🚀 Criando tabela ebook_purchases diretamente...')
  
  try {
    // Create the table with a simple SQL statement
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ebook_purchases (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
        stripe_session_id TEXT UNIQUE NOT NULL,
        stripe_payment_intent_id TEXT,
        access_token TEXT UNIQUE,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
        amount_cents INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'BRL',
        completed_at TIMESTAMPTZ,
        last_accessed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    
    console.log('📝 Criando tabela ebook_purchases...')
    
    // Use direct SQL execution via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: createTableSQL
      })
    })
    
    if (!response.ok) {
      console.log('❌ Método REST falhou, tentando método alternativo...')
      
      // Alternative: Use the SQL editor endpoint
      const altResponse = await fetch(`${supabaseUrl}/platform/pg-meta/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          query: createTableSQL
        })
      })
      
      if (!altResponse.ok) {
        console.log('❌ Todos os métodos automáticos falharam.')
        console.log('\n📋 SOLUÇÃO MANUAL NECESSÁRIA:')
        console.log('\n1. Acesse: https://supabase.com/dashboard/project/ckwnxnzadsxmalcptkle')
        console.log('2. Vá para "SQL Editor"')
        console.log('3. Cole e execute este SQL:')
        console.log('\n' + '='.repeat(50))
        console.log(createTableSQL)
        console.log('='.repeat(50))
        return false
      }
    }
    
    console.log('✅ Tabela criada com sucesso!')
    
    // Now create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_ebook_purchases_customer_id ON ebook_purchases(customer_id);',
      'CREATE INDEX IF NOT EXISTS idx_ebook_purchases_stripe_session_id ON ebook_purchases(stripe_session_id);',
      'CREATE INDEX IF NOT EXISTS idx_ebook_purchases_access_token ON ebook_purchases(access_token);',
      'CREATE INDEX IF NOT EXISTS idx_ebook_purchases_status ON ebook_purchases(status);'
    ]
    
    console.log('📝 Criando índices...')
    for (const indexSQL of indexes) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ query: indexSQL })
        })
      } catch (error) {
        console.log(`⚠️  Índice pode não ter sido criado: ${indexSQL.substring(0, 50)}...`)
      }
    }
    
    console.log('✅ Configuração concluída!')
    return true
    
  } catch (error) {
    console.error('❌ Erro:', error)
    console.log('\n📋 SOLUÇÃO MANUAL:')
    console.log('1. Acesse: https://supabase.com/dashboard/project/ckwnxnzadsxmalcptkle')
    console.log('2. Vá para "SQL Editor"')
    console.log('3. Cole e execute o conteúdo completo do arquivo:')
    console.log('   supabase/migrations/20241201000000_create_ebook_purchases.sql')
    return false
  }
}

async function main() {
  console.log('🎯 Configurando tabela do e-book...')
  
  const success = await createEbookTable()
  
  if (success) {
    console.log('\n🎉 Tabela ebook_purchases configurada!')
    console.log('\n📝 Agora você pode:')
    console.log('1. Testar o fluxo em: http://localhost:8888/ebook')
    console.log('2. Fazer uma compra de teste')
    console.log('3. Verificar se o acesso ao e-book funciona')
  } else {
    console.log('\n⚠️  Configure manualmente no painel do Supabase')
  }
}

main().catch(console.error)
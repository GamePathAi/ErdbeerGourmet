const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

// Get environment variables from Netlify or local
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ckwnxnzadsxmalcptkle.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.log('❌ Variáveis do Supabase não encontradas. Usando netlify env para obter valores...');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testWebhookFlow() {
  console.log('🔍 TESTE DO FLUXO DE WEBHOOK STRIPE');
  console.log('=====================================\n');

  // Test 1: Check environment variables
  console.log('1. 📋 Verificando variáveis de ambiente...');
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET', 
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'VITE_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = [];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      console.log(`   ✅ ${varName}: Configurada`);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`   ❌ Variáveis faltando: ${missingVars.join(', ')}`);
    return false;
  }
  
  // Test 2: Check Supabase connection
  console.log('\n2. 🗄️ Testando conexão com Supabase...');
  try {
    const { data, error } = await supabase
      .from('ebook_purchases')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Erro na conexão: ${error.message}`);
      return false;
    }
    console.log('   ✅ Conexão com Supabase OK');
  } catch (error) {
    console.log(`   ❌ Erro na conexão: ${error.message}`);
    return false;
  }
  
  // Test 3: Check for existing test purchases
  console.log('\n3. 🔍 Verificando compras de teste existentes...');
  try {
    const { data: testPurchases, error } = await supabase
      .from('ebook_purchases')
      .select('*')
      .eq('stripe_session_id', 'cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM');
    
    if (error) {
      console.log(`   ❌ Erro ao buscar compras: ${error.message}`);
      return false;
    }
    
    if (testPurchases && testPurchases.length > 0) {
      console.log(`   ✅ Encontrada compra existente:`);
      console.log(`      - ID: ${testPurchases[0].id}`);
      console.log(`      - Status: ${testPurchases[0].status}`);
      console.log(`      - Email: ${testPurchases[0].customer_email}`);
      console.log(`      - Token: ${testPurchases[0].access_token ? 'Presente' : 'Ausente'}`);
      console.log(`      - Criado em: ${testPurchases[0].created_at}`);
    } else {
      console.log('   ⚠️ Nenhuma compra encontrada para este session_id');
    }
  } catch (error) {
    console.log(`   ❌ Erro ao verificar compras: ${error.message}`);
    return false;
  }
  
  // Test 4: Simulate webhook processing
  console.log('\n4. 🎯 Simulando processamento de webhook...');
  try {
    const accessToken = crypto.randomBytes(32).toString('hex');
    console.log(`   ✅ Token de acesso gerado: ${accessToken.substring(0, 16)}...`);
    
    // Try to update or create a test purchase
    const testSessionId = 'cs_test_webhook_' + Date.now();
    const { data: insertData, error: insertError } = await supabase
      .from('ebook_purchases')
      .insert({
        stripe_session_id: testSessionId,
        customer_email: 'test@erdbeergourmet.com',
        status: 'completed',
        access_token: accessToken,
        stripe_payment_intent_id: 'pi_test_' + Date.now(),
        completed_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) {
      console.log(`   ❌ Erro ao inserir compra de teste: ${insertError.message}`);
      return false;
    }
    
    console.log('   ✅ Compra de teste criada com sucesso');
    
    // Clean up test data
    await supabase
      .from('ebook_purchases')
      .delete()
      .eq('stripe_session_id', testSessionId);
    
    console.log('   ✅ Dados de teste limpos');
    
  } catch (error) {
    console.log(`   ❌ Erro na simulação: ${error.message}`);
    return false;
  }
  
  console.log('\n🎉 TODOS OS TESTES PASSARAM!');
  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('1. Verificar se o SMTP_PASS está correto (senha de app do Gmail)');
  console.log('2. Testar um webhook real do Stripe');
  console.log('3. Verificar logs das functions no Netlify');
  
  return true;
}

// Run the test
testWebhookFlow().catch(console.error);
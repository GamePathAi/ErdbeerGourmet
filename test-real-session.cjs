const { execSync } = require('child_process');
const crypto = require('crypto');

// Use native fetch (Node.js 18+)
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Get environment variables from Netlify
function getNetlifyEnv(varName) {
  try {
    const result = execSync(`netlify env:get ${varName}`, { encoding: 'utf8' }).trim();
    return result;
  } catch (error) {
    console.error(`❌ Erro ao obter ${varName}:`, error.message);
    return null;
  }
}

console.log('🔍 Obtendo variáveis de ambiente do Netlify...');
const STRIPE_SECRET_KEY = getNetlifyEnv('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = getNetlifyEnv('STRIPE_WEBHOOK_SECRET');

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY não configurado no Netlify');
  process.exit(1);
}

if (!STRIPE_WEBHOOK_SECRET) {
  console.error('❌ STRIPE_WEBHOOK_SECRET não configurado no Netlify');
  process.exit(1);
}

const stripe = require('stripe')(STRIPE_SECRET_KEY);
console.log('✅ Stripe configurado com sucesso');

console.log('🔍 TESTE COM SESSION_ID REAL');
console.log('============================');

const REAL_SESSION_ID = 'cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM';
const WEBHOOK_URL = 'https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook';

async function testRealSession() {
  try {
    console.log('\n1. 🔍 Recuperando dados da sessão real do Stripe...');
    
    // Recuperar a sessão real do Stripe
    const session = await stripe.checkout.sessions.retrieve(REAL_SESSION_ID);
    
    console.log('📊 Dados da sessão:');
    console.log('   - ID:', session.id);
    console.log('   - Status:', session.status);
    console.log('   - Payment Status:', session.payment_status);
    console.log('   - Customer Email:', session.customer_details?.email);
    console.log('   - Metadata:', session.metadata);
    console.log('   - Payment Intent:', session.payment_intent);
    console.log('   - Amount Total:', session.amount_total);
    console.log('   - Currency:', session.currency);
    
    console.log('\n2. 🎯 Criando evento de teste com dados reais...');
    
    // Criar evento de teste com dados reais
    const testEvent = {
      id: 'evt_test_' + Date.now(),
      object: 'event',
      api_version: '2020-08-27',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: session
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null
      },
      type: 'checkout.session.completed'
    };
    
    console.log('\n3. 🔐 Gerando assinatura do webhook...');
    
    const payload = JSON.stringify(testEvent);
    const timestamp = Math.floor(Date.now() / 1000);
    const secret = STRIPE_WEBHOOK_SECRET;
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(timestamp + '.' + payload, 'utf8')
      .digest('hex');
    
    const stripeSignature = `t=${timestamp},v1=${signature}`;
    
    console.log('\n4. 📤 Enviando para o webhook...');
    console.log('   🎯 URL:', WEBHOOK_URL);
    console.log('   📝 Payload size:', payload.length, 'bytes');
    console.log('   🔐 Signature:', stripeSignature.substring(0, 50) + '...');
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': stripeSignature
      },
      body: payload
    });
    
    console.log('\n5. 📊 Resultado:');
    console.log('   📊 Status:', response.status);
    console.log('   📋 Headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('   📄 Response:', responseText);
    
    if (response.status === 200) {
      console.log('\n✅ WEBHOOK PROCESSADO COM SUCESSO!');
      console.log('\n📧 Verificar se o email foi enviado para:', session.customer_details?.email);
      console.log('\n🔍 Próximos passos:');
      console.log('   1. Verificar logs do Netlify para detalhes do processamento');
      console.log('   2. Verificar se o registro foi atualizado no Supabase');
      console.log('   3. Verificar se o email foi enviado');
      console.log('   4. Testar o acesso ao ebook com o token gerado');
    } else {
      console.log('\n❌ ERRO NO PROCESSAMENTO DO WEBHOOK');
      console.log('   Status:', response.status);
      console.log('   Response:', responseText);
    }
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar o teste
testRealSession();
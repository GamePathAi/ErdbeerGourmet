const https = require('https');
const crypto = require('crypto');
const { execSync } = require('child_process');

async function testWebhookFunction() {
  console.log('🔍 TESTE DA FUNCTION STRIPE-EBOOK-WEBHOOK');
  console.log('==========================================\n');

  // Get webhook secret
  let webhookSecret;
  try {
    webhookSecret = execSync('netlify env:get STRIPE_WEBHOOK_SECRET', { encoding: 'utf8' }).trim();
    if (webhookSecret.includes('No value set')) {
      console.log('❌ STRIPE_WEBHOOK_SECRET não configurado!');
      return;
    }
    console.log('✅ Webhook secret obtido');
  } catch (error) {
    console.log('❌ Erro ao obter webhook secret:', error.message);
    return;
  }

  // Create a test webhook payload
  const testPayload = {
    id: 'evt_test_webhook',
    object: 'event',
    api_version: '2020-08-27',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM',
        object: 'checkout.session',
        payment_intent: 'pi_test_12345',
        payment_status: 'paid',
        status: 'complete',
        metadata: {
          product_type: 'ebook'
        },
        customer_details: {
          email: 'test@erdbeergourmet.com'
        }
      }
    },
    livemode: true,
    pending_webhooks: 1,
    request: {
      id: 'req_test_12345',
      idempotency_key: null
    },
    type: 'checkout.session.completed'
  };

  const payloadString = JSON.stringify(testPayload);
  console.log('📦 Payload de teste criado');
  
  // Create Stripe signature
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createStripeSignature(payloadString, timestamp, webhookSecret);
  console.log('🔐 Assinatura Stripe criada');

  // Test production webhook
  console.log('\n1. 🌐 Testando webhook de produção...');
  await testWebhook('https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook', payloadString, signature, timestamp);
  
  // Test local webhook (if available)
  console.log('\n2. 🏠 Testando webhook local...');
  await testWebhook('http://localhost:8888/.netlify/functions/stripe-ebook-webhook', payloadString, signature, timestamp);
}

function createStripeSignature(payload, timestamp, secret) {
  const elements = `${timestamp}.${payload}`;
  const signature = crypto.createHmac('sha256', secret).update(elements, 'utf8').digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

function testWebhook(url, payload, signature, timestamp) {
  return new Promise((resolve) => {
    console.log(`   🎯 URL: ${url}`);
    console.log(`   📝 Payload size: ${payload.length} bytes`);
    console.log(`   🔐 Signature: ${signature.substring(0, 50)}...`);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Stripe-Signature': signature
      }
    };
    
    const client = url.startsWith('https') ? https : require('http');
    
    const req = client.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   📊 Status: ${res.statusCode}`);
        console.log(`   📋 Headers:`, res.headers);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`   📄 Response:`, JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log(`   📄 Response (raw):`, data);
        }
        
        if (res.statusCode === 200) {
          console.log(`   ✅ Webhook processado com sucesso!`);
        } else if (res.statusCode === 400) {
          console.log(`   ❌ Erro de validação (400)`);
        } else if (res.statusCode === 500) {
          console.log(`   ❌ Erro interno do servidor (500)`);
        } else {
          console.log(`   ⚠️  Status inesperado: ${res.statusCode}`);
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Erro de conexão: ${error.message}`);
      resolve();
    });
    
    req.setTimeout(15000, () => {
      console.log(`   ⏰ Timeout após 15s`);
      req.destroy();
      resolve();
    });
    
    req.write(payload);
    req.end();
  });
}

// Run the test
testWebhookFunction().catch(console.error);
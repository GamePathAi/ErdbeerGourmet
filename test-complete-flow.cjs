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

console.log('🔍 TESTE COMPLETO DO FLUXO DE COMPRA');
console.log('===================================');

console.log('\n1. 🔍 Obtendo variáveis de ambiente do Netlify...');
const STRIPE_SECRET_KEY = getNetlifyEnv('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = getNetlifyEnv('STRIPE_WEBHOOK_SECRET');
const SUPABASE_URL = getNetlifyEnv('VITE_SUPABASE_URL');
const SUPABASE_SERVICE_KEY = getNetlifyEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const stripe = require('stripe')(STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('✅ Configurações carregadas com sucesso');

const WEBHOOK_URL = 'https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook';
const TEST_EMAIL = 'test@erdbeergourmet.com';

async function testCompleteFlow() {
  try {
    console.log('\n2. 🛒 Criando sessão de checkout de teste...');
    
    // Criar uma sessão de checkout de teste
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'E-book: Morango Gourmet Profissional',
            description: 'Guia completo para cultivo profissional de morangos'
          },
          unit_amount: 2900, // 29.00 EUR
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://erdbeergourmet.ch/sucesso.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://erdbeergourmet.ch/',
      customer_email: TEST_EMAIL,
      metadata: {
        product_type: 'ebook',
        ebook_id: 'morango-gourmet-profissional'
      }
    });
    
    console.log('✅ Sessão criada:', session.id);
    console.log('   Email:', TEST_EMAIL);
    console.log('   Status:', session.status);
    
    console.log('\n3. 💾 Obtendo customer existente...');
    
    // Obter um customer existente
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id, email')
      .limit(1);
    
    if (customerError || !customers || customers.length === 0) {
      console.error('❌ Erro ao obter customer:', customerError);
      return;
    }
    
    const customerId = customers[0].id;
    console.log('✅ Customer encontrado:', customerId);
    
    console.log('\n4. 💾 Inserindo registro inicial no Supabase...');
    
    // Inserir registro inicial no banco com a estrutura correta
    const { data: insertData, error: insertError } = await supabase
      .from('ebook_purchases')
      .insert({
        stripe_session_id: session.id,
        customer_id: customerId,
        amount_cents: 2900, // 29.00 EUR em centavos
        currency: 'EUR',
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir no Supabase:', insertError);
      return;
    }
    
    console.log('✅ Registro inserido no Supabase:', insertData[0].id);
    
    console.log('\n5. 🎯 Simulando evento checkout.session.completed...');
    
    // Simular o evento de checkout completado
    const completedSession = {
      ...session,
      status: 'complete',
      payment_status: 'paid',
      payment_intent: 'pi_test_' + Date.now(),
      customer_details: {
        email: TEST_EMAIL,
        name: 'Test Customer'
      }
    };
    
    const testEvent = {
      id: 'evt_test_' + Date.now(),
      object: 'event',
      api_version: '2020-08-27',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: completedSession
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null
      },
      type: 'checkout.session.completed'
    };
    
    console.log('\n6. 🔐 Gerando assinatura do webhook...');
    
    const payload = JSON.stringify(testEvent);
    const timestamp = Math.floor(Date.now() / 1000);
    const secret = STRIPE_WEBHOOK_SECRET;
    
    const signature = crypto
      .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
      .update(timestamp + '.' + payload, 'utf8')
      .digest('hex');
    
    const stripeSignature = `t=${timestamp},v1=${signature}`;
    
    console.log('\n7. 📤 Enviando para o webhook...');
    console.log('   🎯 URL:', WEBHOOK_URL);
    console.log('   📝 Session ID:', session.id);
    console.log('   📧 Email:', TEST_EMAIL);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': stripeSignature
      },
      body: payload
    });
    
    console.log('\n8. 📊 Resultado do webhook:');
    console.log('   📊 Status:', response.status);
    
    const responseText = await response.text();
    console.log('   📄 Response:', responseText);
    
    if (response.status === 200) {
      console.log('\n✅ WEBHOOK PROCESSADO COM SUCESSO!');
      
      // Aguardar um pouco para o processamento
      console.log('\n⏳ Aguardando processamento...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('\n9. 🔍 Verificando resultado no Supabase...');
      
      const { data: updatedData, error: selectError } = await supabase
        .from('ebook_purchases')
        .select('*')
        .eq('stripe_session_id', session.id)
        .single();
      
      if (selectError) {
        console.error('❌ Erro ao consultar Supabase:', selectError);
      } else {
        console.log('✅ Registro atualizado:');
        console.log('   - Status:', updatedData.status);
        console.log('   - Access Token:', updatedData.access_token ? 'Gerado' : 'Não gerado');
        console.log('   - Payment Intent:', updatedData.stripe_payment_intent_id);
        console.log('   - Completed At:', updatedData.completed_at);
        
        if (updatedData.status === 'completed' && updatedData.access_token) {
          console.log('\n🎉 FLUXO COMPLETO FUNCIONANDO!');
          console.log('\n9. 🔗 Testando acesso ao ebook...');
          
          const accessUrl = `https://erdbeergourmet.ch/ebook-acesso.html?token=${updatedData.access_token}`;
          console.log('   🔗 URL de acesso:', accessUrl);
          
          // Testar a função de acesso com o token
          const accessResponse = await fetch(`https://erdbeergourmet.ch/.netlify/functions/verify-ebook-access?token=${updatedData.access_token}`);
          console.log('   📊 Status da função de acesso:', accessResponse.status);
          
          if (accessResponse.status === 200) {
            const accessData = await accessResponse.json();
            console.log('   ✅ Acesso ao ebook funcionando!');
            console.log('   📄 Dados:', accessData);
          } else {
            const errorText = await accessResponse.text();
            console.log('   ❌ Erro no acesso ao ebook:', errorText);
          }
        } else {
          console.log('\n⚠️ Webhook processado mas registro não foi completamente atualizado');
        }
      }
    } else {
      console.log('\n❌ ERRO NO PROCESSAMENTO DO WEBHOOK');
    }
    
    console.log('\n🧹 Limpando dados de teste...');
    
    // Limpar dados de teste
    const { error: deleteError } = await supabase
      .from('ebook_purchases')
      .delete()
      .eq('stripe_session_id', session.id);
    
    if (deleteError) {
      console.error('⚠️ Erro ao limpar dados de teste:', deleteError);
    } else {
      console.log('✅ Dados de teste removidos');
    }
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar o teste
testCompleteFlow();
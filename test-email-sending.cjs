const { execSync } = require('child_process');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Função para obter variáveis de ambiente do Netlify
function getNetlifyEnv(varName) {
  try {
    const result = execSync(`netlify env:get ${varName}`, { encoding: 'utf8' });
    const value = result.trim();
    
    // Verificar se o valor contém mensagens de erro do Netlify
    if (value.includes('No value set') || value.includes('not found') || value === '') {
      console.error(`❌ Variável ${varName} não encontrada no Netlify`);
      return null;
    }
    
    return value;
  } catch (error) {
    console.error(`❌ Erro ao obter ${varName}:`, error.message);
    return null;
  }
}

// Função para fazer fetch (Node.js 18+ ou fallback)
const fetch = globalThis.fetch || require('node-fetch');

async function testEmailSending() {
  console.log('📧 TESTE DE ENVIO DE E-MAIL');
  console.log('============================\n');
  
  console.log('1. 🔍 Obtendo variáveis de ambiente do Netlify...');
  
  const STRIPE_SECRET_KEY = getNetlifyEnv('STRIPE_SECRET_KEY');
  const STRIPE_WEBHOOK_SECRET = getNetlifyEnv('STRIPE_WEBHOOK_SECRET');
  const SUPABASE_URL = getNetlifyEnv('VITE_SUPABASE_URL');
  const SUPABASE_SERVICE_KEY = getNetlifyEnv('SUPABASE_SERVICE_ROLE_KEY') || getNetlifyEnv('SUPABASE_SERVICE_KEY');
  
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variáveis de ambiente não encontradas');
    console.log('   STRIPE_SECRET_KEY:', STRIPE_SECRET_KEY ? '✅' : '❌');
    console.log('   STRIPE_WEBHOOK_SECRET:', STRIPE_WEBHOOK_SECRET ? '✅' : '❌');
    console.log('   SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
    console.log('   SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
    return;
  }
  
  console.log('✅ Configurações carregadas com sucesso');
  
  // Inicializar Supabase com service key (privilégios administrativos)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('🔑 Usando service key para privilégios administrativos');
  
  console.log('\n2. 🛒 Criando sessão de checkout de teste...');
  
  const stripe = require('stripe')(STRIPE_SECRET_KEY);
  
  // Criar uma sessão de checkout de teste
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Ebook: Morango Gourmet Profissional',
          description: 'Guia completo para cultivo profissional de morangos'
        },
        unit_amount: 2900, // 29.00 EUR
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://erdbeergourmet.ch/sucesso?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://erdbeergourmet.ch/cancelado',
    customer_email: 'test@erdbeergourmet.com',
    metadata: {
      product_type: 'ebook'
    }
  });
  
  console.log('✅ Sessão criada:', session.id);
  console.log('   Email:', session.customer_email || session.customer_details?.email);
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
  const testEvent = {
    id: 'evt_test_' + Date.now(),
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        ...session,
        payment_status: 'paid',
        payment_intent: 'pi_test_' + Date.now(),
        customer_details: {
          email: 'test@erdbeergourmet.com',
          name: 'Cliente Teste'
        }
      }
    },
    created: Math.floor(Date.now() / 1000)
  };
  
  console.log('\n6. 🔐 Gerando assinatura do webhook...');
  
  const payload = JSON.stringify(testEvent);
  const timestamp = Math.floor(Date.now() / 1000);
  
  const signature = crypto
    .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
    .update(timestamp + '.' + payload, 'utf8')
    .digest('hex');
  
  const stripeSignature = `t=${timestamp},v1=${signature}`;
  
  console.log('\n7. 📤 Enviando para o webhook (com foco no e-mail)...');
  console.log('   🎯 URL: https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook');
  console.log('   📝 Session ID:', session.id);
  console.log('   📧 Email:', 'test@erdbeergourmet.com');
  
  const WEBHOOK_URL = 'https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook';
  
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
  
  if (response.status === 200) {
    const responseData = await response.json();
    console.log('   📄 Response:', responseData);
    console.log('\n✅ WEBHOOK PROCESSADO COM SUCESSO!');
    
    // Aguardar um pouco para o processamento
    console.log('\n⏳ Aguardando processamento...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n9. 🔍 Verificando se o e-mail foi enviado...');
    
    // Verificar se o registro foi atualizado (indicando que o e-mail foi processado)
    const { data: updatedData, error: selectError } = await supabase
      .from('ebook_purchases')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();
    
    if (selectError) {
      console.error('❌ Erro ao consultar Supabase:', selectError);
    } else {
      console.log('✅ Status do registro:');
      console.log('   - Status:', updatedData.status);
      console.log('   - Access Token:', updatedData.access_token ? 'Gerado ✅' : 'Não gerado ❌');
      console.log('   - Payment Intent:', updatedData.stripe_payment_intent_id);
      console.log('   - Completed At:', updatedData.completed_at);
      
      if (updatedData.status === 'completed' && updatedData.access_token) {
        console.log('\n🎉 PROCESSAMENTO COMPLETO!');
        console.log('\n📧 VERIFICAÇÃO DE E-MAIL:');
        console.log('   ✅ Webhook processou o evento');
        console.log('   ✅ Token de acesso foi gerado');
        console.log('   ✅ Registro foi marcado como completed');
        console.log('   📤 E-mail deve ter sido enviado para: test@erdbeergourmet.com');
        console.log('\n💡 IMPORTANTE:');
        console.log('   - Verifique a caixa de entrada de test@erdbeergourmet.com');
        console.log('   - Verifique também a pasta de spam/lixo eletrônico');
        console.log('   - O e-mail pode levar alguns minutos para chegar');
        
        console.log('\n🔗 Link de acesso direto:');
        console.log(`   https://erdbeergourmet.ch/ebook-acesso.html?token=${updatedData.access_token}`);
      } else {
        console.log('\n⚠️ Webhook processado mas registro não foi completamente atualizado');
        console.log('   Isso pode indicar um problema no envio do e-mail');
      }
    }
  } else {
    console.log('   ❌ Erro:', await response.text());
  }
  
  console.log('\n🧹 Limpando dados de teste...');
  
  // Limpar dados de teste
  await supabase
    .from('ebook_purchases')
    .delete()
    .eq('stripe_session_id', session.id);
  
  console.log('✅ Dados de teste removidos');
}

// Executar o teste
testEmailSending().catch(console.error);
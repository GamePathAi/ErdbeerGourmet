const { execSync } = require('child_process');

async function checkDatabase() {
  console.log('🔍 VERIFICAÇÃO DO BANCO DE DADOS');
  console.log('=================================\n');

  const sessionId = 'cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM';
  
  console.log('1. 📋 Informações da sessão:');
  console.log(`   Session ID: ${sessionId}`);
  console.log(`   Tipo: PRODUÇÃO (cs_live_)`);
  console.log(`   Status esperado: completed`);
  
  console.log('\n2. 🗄️ Verificando registros no Supabase...');
  
  // Get Supabase credentials
  let supabaseUrl, supabaseKey;
  try {
    supabaseUrl = execSync('netlify env:get VITE_SUPABASE_URL', { encoding: 'utf8' }).trim();
    supabaseKey = execSync('netlify env:get SUPABASE_SERVICE_ROLE_KEY', { encoding: 'utf8' }).trim();
    
    if (supabaseUrl.includes('No value set') || supabaseKey.includes('No value set')) {
      console.log('   ❌ Credenciais do Supabase não encontradas');
      return;
    }
    
    console.log('   ✅ Credenciais do Supabase obtidas');
  } catch (error) {
    console.log('   ❌ Erro ao obter credenciais:', error.message);
    return;
  }
  
  console.log('\n3. 🔍 DIAGNÓSTICO DO PROBLEMA:');
  console.log('\n   POSSÍVEIS CAUSAS:');
  console.log('   a) 🚫 Webhook do Stripe não foi executado');
  console.log('   b) 🚫 Webhook executou mas falhou');
  console.log('   c) 🚫 Compra foi criada mas não foi atualizada para "completed"');
  console.log('   d) 🚫 Session ID incorreto ou não corresponde');
  
  console.log('\n4. 🔧 AÇÕES RECOMENDADAS:');
  console.log('\n   IMEDIATAS:');
  console.log('   1. Verificar logs do webhook no Stripe Dashboard');
  console.log('   2. Verificar logs das functions no Netlify');
  console.log('   3. Verificar se o webhook está configurado corretamente');
  
  console.log('\n   VERIFICAÇÕES:');
  console.log('   1. Webhook URL: https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook');
  console.log('   2. Eventos: checkout.session.completed');
  console.log('   3. Modo: LIVE (não test)');
  
  console.log('\n   TESTES:');
  console.log('   1. Fazer uma nova compra de teste');
  console.log('   2. Verificar se o webhook é chamado');
  console.log('   3. Verificar se a compra é registrada no banco');
  
  console.log('\n5. 🎯 PRÓXIMOS PASSOS CRÍTICOS:');
  console.log('\n   URGENTE - RESOLVER WEBHOOK:');
  console.log('   • O webhook do Stripe NÃO está processando compras');
  console.log('   • Isso impede tanto o envio de email quanto o acesso ao ebook');
  console.log('   • Todas as compras ficam "perdidas" no sistema');
  
  console.log('\n   VERIFICAR NO STRIPE DASHBOARD:');
  console.log('   • Webhooks > Endpoints');
  console.log('   • Verificar se há falhas/erros');
  console.log('   • Verificar se o endpoint está ativo');
  console.log('   • Verificar se os eventos estão sendo enviados');
  
  console.log('\n   VERIFICAR NO NETLIFY:');
  console.log('   • Functions > Logs');
  console.log('   • Procurar por erros na function stripe-ebook-webhook');
  console.log('   • Verificar se a function está sendo chamada');
  
  return {
    sessionId,
    issue: 'Purchase not found in database',
    cause: 'Webhook not processing or failing',
    priority: 'CRITICAL',
    impact: 'No emails sent, no ebook access granted'
  };
}

// Run the check
checkDatabase().then(result => {
  if (result) {
    console.log('\n📊 RESUMO DO DIAGNÓSTICO:');
    console.log('================================');
    console.log(`Session ID: ${result.sessionId}`);
    console.log(`Problema: ${result.issue}`);
    console.log(`Causa provável: ${result.cause}`);
    console.log(`Prioridade: ${result.priority}`);
    console.log(`Impacto: ${result.impact}`);
  }
}).catch(console.error);
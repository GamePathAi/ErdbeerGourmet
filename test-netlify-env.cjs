const { execSync } = require('child_process');

async function testNetlifyEnvironment() {
  console.log('🔍 TESTE DAS VARIÁVEIS DE AMBIENTE DO NETLIFY');
  console.log('===============================================\n');

  // Test 1: Check critical environment variables
  console.log('1. 📋 Verificando variáveis críticas...');
  const criticalVars = [
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
  
  const results = {};
  
  for (const varName of criticalVars) {
    try {
      const result = execSync(`netlify env:get ${varName}`, { encoding: 'utf8' }).trim();
      if (result.includes('No value set')) {
        console.log(`   ❌ ${varName}: NÃO CONFIGURADA`);
        results[varName] = false;
      } else {
        console.log(`   ✅ ${varName}: Configurada`);
        results[varName] = true;
      }
    } catch (error) {
      console.log(`   ❌ ${varName}: ERRO ao verificar`);
      results[varName] = false;
    }
  }
  
  // Test 2: Check function deployment status
  console.log('\n2. 🚀 Verificando status das functions...');
  try {
    const functionsResult = execSync('netlify functions:list', { encoding: 'utf8' });
    console.log('   ✅ Functions disponíveis:');
    console.log(functionsResult);
  } catch (error) {
    console.log('   ❌ Erro ao listar functions:', error.message);
  }
  
  // Test 3: Summary and recommendations
  console.log('\n3. 📊 RESUMO E RECOMENDAÇÕES:');
  
  const missingVars = Object.entries(results)
    .filter(([_, isSet]) => !isSet)
    .map(([varName, _]) => varName);
  
  if (missingVars.length > 0) {
    console.log('\n❌ PROBLEMAS ENCONTRADOS:');
    console.log(`   Variáveis não configuradas: ${missingVars.join(', ')}`);
    
    console.log('\n🔧 AÇÕES NECESSÁRIAS:');
    if (missingVars.includes('SMTP_PASS')) {
      console.log('   1. Configure SMTP_PASS com senha de app do Gmail');
      console.log('      netlify env:set SMTP_PASS "sua_senha_de_app_gmail"');
    }
    if (missingVars.includes('STRIPE_WEBHOOK_SECRET')) {
      console.log('   2. Configure STRIPE_WEBHOOK_SECRET do dashboard do Stripe');
      console.log('      netlify env:set STRIPE_WEBHOOK_SECRET "whsec_..."');
    }
    if (missingVars.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      console.log('   3. Configure SUPABASE_SERVICE_ROLE_KEY do dashboard do Supabase');
      console.log('      netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJ..."');
    }
  } else {
    console.log('\n✅ TODAS AS VARIÁVEIS ESTÃO CONFIGURADAS!');
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('   1. Testar webhook real do Stripe');
    console.log('   2. Verificar logs das functions no Netlify');
    console.log('   3. Fazer uma compra de teste');
  }
  
  // Test 4: Check specific session_id issue
  console.log('\n4. 🔍 INVESTIGANDO SESSION_ID ESPECÍFICO:');
  console.log('   Session ID: cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM');
  console.log('   Este é um session_id de PRODUÇÃO (cs_live_)');
  console.log('   ⚠️  Certifique-se de que:');
  console.log('      - O webhook está configurado no Stripe LIVE mode');
  console.log('      - As chaves do Stripe são de PRODUÇÃO (pk_live_, sk_live_)');
  console.log('      - O webhook secret é do endpoint de PRODUÇÃO');
  
  return results;
}

// Run the test
testNetlifyEnvironment().catch(console.error);
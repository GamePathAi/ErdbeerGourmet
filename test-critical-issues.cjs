#!/usr/bin/env node

/**
 * 🚨 SCRIPT DE TESTE PARA PROBLEMAS CRÍTICOS
 * 
 * Este script testa:
 * 1. Sistema de email SMTP
 * 2. Acesso ao ebook via session_id
 * 3. Webhook processing
 * 4. Database connectivity
 */

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const stripe = require('stripe');
require('dotenv').config({ path: '.env.development' });

// Configurações
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 1. TESTE DE CONFIGURAÇÃO SMTP
async function testSMTPConfig() {
  log('blue', '\n🔧 TESTANDO CONFIGURAÇÃO SMTP...');
  
  const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? '✅ Configurado' : '❌ Faltando'
  };
  
  console.log('Configuração SMTP:', config);
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    log('red', '❌ SMTP_USER ou SMTP_PASS não configurados!');
    log('yellow', '💡 Configure as variáveis no Netlify:');
    log('yellow', '   netlify env:set SMTP_PASS sua-senha-de-app-gmail');
    return false;
  }
  
  try {
    await transporter.verify();
    log('green', '✅ Conexão SMTP funcionando!');
    return true;
  } catch (error) {
    log('red', `❌ Erro na conexão SMTP: ${error.message}`);
    return false;
  }
}

// 2. TESTE DE ENVIO DE EMAIL
async function testEmailSending() {
  log('blue', '\n📧 TESTANDO ENVIO DE EMAIL...');
  
  const testEmail = {
    from: `ErdbeerGourmet <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // Envia para si mesmo
    subject: '🧪 Teste do Sistema de Email - ErdbeerGourmet',
    html: `
      <h2>🍓 Teste do Sistema de Email</h2>
      <p>Se você recebeu este email, o sistema SMTP está funcionando!</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>Ambiente:</strong> ${process.env.NODE_ENV || 'development'}</p>
    `
  };
  
  try {
    const result = await transporter.sendMail(testEmail);
    log('green', `✅ Email de teste enviado! ID: ${result.messageId}`);
    log('yellow', `📬 Verifique sua caixa de entrada: ${process.env.SMTP_USER}`);
    return true;
  } catch (error) {
    log('red', `❌ Erro ao enviar email: ${error.message}`);
    return false;
  }
}

// 3. TESTE DE CONEXÃO COM SUPABASE
async function testSupabaseConnection() {
  log('blue', '\n🗄️ TESTANDO CONEXÃO COM SUPABASE...');
  
  try {
    const { data, error } = await supabase
      .from('ebook_purchases')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    log('green', '✅ Conexão com Supabase funcionando!');
    return true;
  } catch (error) {
    log('red', `❌ Erro na conexão Supabase: ${error.message}`);
    return false;
  }
}

// 4. TESTE DE ACESSO AO EBOOK
async function testEbookAccess() {
  log('blue', '\n📚 TESTANDO ACESSO AO EBOOK...');
  
  try {
    // Buscar uma compra recente
    const { data: purchases, error } = await supabase
      .from('ebook_purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    if (!purchases || purchases.length === 0) {
      log('yellow', '⚠️ Nenhuma compra encontrada no banco de dados');
      log('yellow', '💡 Faça uma compra de teste primeiro');
      return false;
    }
    
    log('green', `✅ Encontradas ${purchases.length} compras no banco`);
    
    // Verificar status das compras
    purchases.forEach((purchase, index) => {
      const status = purchase.status;
      const hasToken = purchase.access_token ? '✅' : '❌';
      const sessionId = purchase.stripe_session_id?.substring(0, 20) + '...';
      
      console.log(`  ${index + 1}. ${sessionId} - Status: ${status} - Token: ${hasToken}`);
    });
    
    // Verificar compras sem token
    const incompletePurchases = purchases.filter(p => p.status === 'completed' && !p.access_token);
    if (incompletePurchases.length > 0) {
      log('red', `❌ ${incompletePurchases.length} compras completadas sem token de acesso!`);
      log('yellow', '💡 Isso indica problema no webhook ou processamento');
    }
    
    return true;
  } catch (error) {
    log('red', `❌ Erro ao verificar acesso ao ebook: ${error.message}`);
    return false;
  }
}

// 5. TESTE DE SESSION_ID ESPECÍFICO
async function testSpecificSessionId(sessionId) {
  log('blue', `\n🔍 TESTANDO SESSION_ID: ${sessionId}`);
  
  try {
    // Verificar no Stripe
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);
    log('green', `✅ Session encontrada no Stripe - Status: ${session.payment_status}`);
    
    // Verificar no banco
    const { data: purchase, error } = await supabase
      .from('ebook_purchases')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();
    
    if (error || !purchase) {
      log('red', '❌ Session não encontrada no banco de dados!');
      log('yellow', '💡 Webhook pode não ter processado esta compra');
      return false;
    }
    
    log('green', `✅ Compra encontrada no banco - Status: ${purchase.status}`);
    
    if (purchase.status !== 'completed') {
      log('yellow', `⚠️ Status da compra: ${purchase.status} (deveria ser 'completed')`);
    }
    
    if (!purchase.access_token) {
      log('red', '❌ Token de acesso não foi gerado!');
      log('yellow', '💡 Webhook não completou o processamento');
    } else {
      log('green', '✅ Token de acesso disponível');
    }
    
    return true;
  } catch (error) {
    log('red', `❌ Erro ao verificar session_id: ${error.message}`);
    return false;
  }
}

// FUNÇÃO PRINCIPAL
async function runDiagnostics() {
  log('blue', '🚨 DIAGNÓSTICO DE PROBLEMAS CRÍTICOS - ErdbeerGourmet');
  log('blue', '=' .repeat(60));
  
  const results = {
    smtp: await testSMTPConfig(),
    email: false,
    supabase: await testSupabaseConnection(),
    ebook: await testEbookAccess()
  };
  
  // Só testa email se SMTP estiver funcionando
  if (results.smtp) {
    results.email = await testEmailSending();
  }
  
  // Teste de session_id específico se fornecido
  const sessionId = process.argv[2];
  if (sessionId) {
    await testSpecificSessionId(sessionId);
  }
  
  // RESUMO FINAL
  log('blue', '\n📊 RESUMO DOS TESTES:');
  log('blue', '=' .repeat(30));
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSOU' : '❌ FALHOU';
    const color = passed ? 'green' : 'red';
    log(color, `${test.toUpperCase()}: ${status}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    log('green', '\n🎉 TODOS OS TESTES PASSARAM!');
    log('green', 'O sistema deveria estar funcionando normalmente.');
  } else {
    log('red', '\n🚨 PROBLEMAS DETECTADOS!');
    log('yellow', '\n🔧 PRÓXIMOS PASSOS:');
    
    if (!results.smtp) {
      log('yellow', '1. Configure SMTP_PASS no Netlify com senha de app do Gmail');
    }
    if (!results.email) {
      log('yellow', '2. Verifique credenciais SMTP e configuração do Gmail');
    }
    if (!results.supabase) {
      log('yellow', '3. Verifique configuração do Supabase e RLS policies');
    }
    if (!results.ebook) {
      log('yellow', '4. Verifique webhook processing e geração de tokens');
    }
  }
  
  log('blue', '\n💡 COMO USAR:');
  log('blue', '  node test-critical-issues.js                    # Teste geral');
  log('blue', '  node test-critical-issues.js cs_live_abc123     # Teste session específico');
}

// Executar diagnósticos
runDiagnostics().catch(error => {
  log('red', `\n💥 Erro fatal: ${error.message}`);
  process.exit(1);
});
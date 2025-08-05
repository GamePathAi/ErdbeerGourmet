const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Função para obter variáveis de ambiente do Netlify
function getNetlifyEnv(varName) {
  try {
    const result = execSync(`netlify env:get ${varName}`, { encoding: 'utf8' }).trim();
    if (result.includes('No value set') || result.includes('not found') || !result) {
      return null;
    }
    return result;
  } catch (error) {
    console.log(`❌ Erro ao obter ${varName}:`, error.message);
    return null;
  }
}

// Configuração do Supabase
const supabaseUrl = getNetlifyEnv('VITE_SUPABASE_URL');
const supabaseServiceKey = getNetlifyEnv('SUPABASE_SERVICE_ROLE_KEY') || getNetlifyEnv('SUPABASE_SERVICE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuração do email
const emailConfig = {
  host: getNetlifyEnv('SMTP_HOST'),
  port: parseInt(getNetlifyEnv('SMTP_PORT') || '587'),
  secure: false,
  auth: {
    user: getNetlifyEnv('SMTP_USER'),
    pass: getNetlifyEnv('SMTP_PASS')
  }
};

// Template do email
function createEmailTemplate(accessLink) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Seu Ebook ErdbeerGourmet está pronto!</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d32f2f;">🍓 ErdbeerGourmet</h1>
        <h2 style="color: #333;">Parabéns! Sua compra foi confirmada</h2>
    </div>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3>✅ Pagamento Confirmado!</h3>
        <p><strong>Produto:</strong> ErdbeerGourmet Profissional - Ebook</p>
        <p><strong>Valor:</strong> 7 CHF (R$ 47,00)</p>
        <p><strong>Status:</strong> ✅ Confirmado</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${accessLink}" 
           style="background: #d32f2f; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 5px; font-size: 18px;"> 
            🚀 ACESSAR MEU EBOOK AGORA 
        </a>
    </div>
    
    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>💡 Importante:</strong></p>
        <ul>
            <li>Salve este email nos seus favoritos</li>
            <li>O link de acesso é permanente</li>
            <li>Baixe o ebook quantas vezes quiser</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666;">
        <p>Obrigado por escolher ErdbeerGourmet!</p>
        <p>🍓 O doce artesanal que conquistou a Suíça</p>
    </div>
</body>
</html>
`;
}

async function createManualAccess() {
  try {
    console.log('🚀 Iniciando criação de acesso manual...');
    
    // Dados do proprietário
    const ownerData = {
      email: 'igor.antonio.garcia.bonafe@gmail.com',
      first_name: 'Igor Antonio',
      last_name: 'Garcia Bonafe',
      product: 'ErdbeerGourmet Profissional - Ebook',
      amount: 700, // 7 CHF em centavos
      currency: 'chf'
    };
    
    // Gerar token único
    const accessToken = crypto.randomBytes(32).toString('hex');
    console.log('🔑 Token gerado:', accessToken);
    
    // Verificar se cliente já existe
    let { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', ownerData.email)
      .single();
    
    let customerId;
    if (existingCustomer) {
      customerId = existingCustomer.id;
      console.log('👤 Cliente existente encontrado:', customerId);
    } else {
      // Criar novo cliente
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: ownerData.email,
          first_name: ownerData.first_name,
          last_name: ownerData.last_name,
          stripe_customer_id: `manual_${Date.now()}`
        })
        .select()
        .single();
      
      if (customerError) {
        throw new Error(`Erro ao criar cliente: ${customerError.message}`);
      }
      
      customerId = newCustomer.id;
      console.log('👤 Novo cliente criado:', customerId);
    }
    
    // Criar registro de compra do ebook
    const { data: purchase, error: purchaseError } = await supabase
      .from('ebook_purchases')
      .insert({
        customer_id: customerId,
        amount_cents: ownerData.amount,
        currency: ownerData.currency,
        status: 'completed',
        access_token: accessToken,
        stripe_session_id: `manual_${Date.now()}`,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (purchaseError) {
      throw new Error(`Erro ao criar compra: ${purchaseError.message}`);
    }
    
    console.log('📝 Compra criada no banco:', purchase.id);
    
    // Gerar link de acesso
    const accessLink = `https://erdbeergourmet.ch/ebook-acesso.html?token=${accessToken}`;
    console.log('🔗 Link de acesso:', accessLink);
    
    // Mostrar informações do email (SMTP não configurado para desenvolvimento)
    console.log('📧 INFORMAÇÕES DO EMAIL:');
    console.log('   Para:', ownerData.email);
    console.log('   Assunto: 🎉 Seu ErdbeerGourmet Profissional - Ebook está pronto! [TESTE MANUAL]');
    console.log('   Link de acesso:', accessLink);
    console.log('\n📝 TEMPLATE DO EMAIL:');
    console.log(createEmailTemplate(accessLink));
    console.log('\n⚠️  Para enviar email real, configure as credenciais SMTP no Netlify');
    
    // Resumo final
    console.log('\n🎉 ACESSO MANUAL CRIADO COM SUCESSO!');
    console.log('=' .repeat(50));
    console.log('👤 Cliente:', `${ownerData.first_name} ${ownerData.last_name}`);
    console.log('📧 Email:', ownerData.email);
    console.log('🛍️  Produto:', ownerData.product);
    console.log('💰 Valor: 7 CHF (R$ 47,00)');
    console.log('🔑 Token:', accessToken);
    console.log('🔗 Link:', accessLink);
    console.log('📊 Status: completed');
    console.log('=' .repeat(50));
    
    // Testar acesso
    console.log('\n🧪 Testando acesso ao ebook...');
    try {
      const response = await fetch(`https://erdbeergourmet.ch/.netlify/functions/verify-ebook-access?token=${accessToken}`);
      if (response.ok) {
        console.log('✅ Teste de acesso: SUCESSO');
      } else {
        console.log('❌ Teste de acesso: FALHOU');
      }
    } catch (error) {
      console.log('⚠️  Não foi possível testar o acesso automaticamente');
    }
    
    console.log('\n🚀 O proprietário pode agora testar o sistema completo!');
    
  } catch (error) {
    console.error('❌ Erro ao criar acesso manual:', error.message);
    process.exit(1);
  }
}

// Executar
createManualAccess();
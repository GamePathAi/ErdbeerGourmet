const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.development' });

const app = express();
const PORT = 8888;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Stripe
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create Ebook Checkout Function
app.post('/.netlify/functions/create-ebook-checkout', async (req, res) => {
  try {
    console.log('🛒 Recebida requisição para create-ebook-checkout');
    console.log('Body:', req.body);

    const { customerEmail } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Email do cliente é obrigatório' });
    }

    // Verificar se cliente já existe no Supabase
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Erro ao buscar cliente:', customerError);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    // Se cliente não existe, criar novo
    if (!customer) {
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert([{ email: customerEmail }])
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar cliente:', createError);
        return res.status(500).json({ error: 'Erro ao criar cliente' });
      }

      customer = newCustomer;
    }

    // Criar sessão de checkout no Stripe
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Ebook: Segredos do Morango Gourmet',
              description: 'Guia completo para cultivar morangos gourmet em casa',
            },
            unit_amount: 4700, // R$ 47,00 em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3001/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3001/`,
      customer_email: customerEmail,
      billing_address_collection: 'required',
      metadata: {
        customer_id: customer.id,
        type: 'ebook',
      },
    });

    console.log('✅ Sessão de checkout criada:', session.id);

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Erro na função create-ebook-checkout:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get Ebook Access Function
app.get('/.netlify/functions/get-ebook-access', async (req, res) => {
  try {
    const { session_id } = req.query;
    console.log('🔍 Buscando acesso para session_id:', session_id);
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID é obrigatório' });
    }

    // Test mode for development
    if (session_id.includes('simulado')) {
      console.log('🧪 Modo de teste ativado para get-ebook-access:', session_id);
      const accessToken = 'test_access_token_' + Date.now();
      
      return res.json({ 
        accessToken,
        customer: {
          email: 'teste@exemplo.com',
          name: 'Usuário Teste'
        },
        purchaseDate: new Date().toISOString()
      });
    }

    // Buscar compra no Supabase
    const { data: purchase, error } = await supabase
      .from('ebook_purchases')
      .select(`
        *,
        customers (
          email,
          first_name,
          last_name
        )
      `)
      .eq('stripe_session_id', session_id)
      .single();

    if (error || !purchase) {
      console.log('❌ Compra não encontrada:', error);
      return res.status(404).json({ error: 'Compra não encontrada' });
    }

    console.log('✅ Acesso encontrado:', purchase.access_token);
    res.json({ 
      accessToken: purchase.access_token,
      customer: purchase.customers,
      purchaseDate: purchase.completed_at
    });
  } catch (error) {
    console.error('❌ Erro em get-ebook-access:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verify Ebook Access Function
app.get('/.netlify/functions/verify-ebook-access', async (req, res) => {
  try {
    const { token } = req.query;
    console.log('🔐 Verificando token:', token);
    
    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório' });
    }

    // Buscar compra pelo token
    const { data: purchase, error } = await supabase
      .from('ebook_purchases')
      .select('*, customers(*)')
      .eq('access_token', token)
      .single();

    if (error || !purchase) {
      console.log('❌ Token inválido:', error);
      return res.status(404).json({ error: 'Token inválido', hasAccess: false });
    }

    console.log('✅ Token válido para:', purchase.customers?.email);
    res.json({ 
      hasAccess: true, 
      customer: purchase.customers 
    });
  } catch (error) {
    console.error('❌ Erro em verify-ebook-access:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Stripe Verify Function
app.get('/.netlify/functions/stripe-verify/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  console.log('💳 Verificando sessão Stripe:', sessionId);
  
  try {
    
    let session;
    
    if (sessionId.includes('simulado')) {
      // Modo de teste - simular sessão paga
      console.log('🧪 Modo de teste ativado para stripe-verify');
      session = {
        session_id: sessionId,
        payment_status: 'paid',
        amount_total: 4700,
        currency: 'brl',
        customer_email: 'teste@exemplo.com',
        customer_name: 'Usuário Teste',
        created: Math.floor(Date.now() / 1000),
        mode: 'payment'
      };
    } else {
      session = await stripeClient.checkout.sessions.retrieve(sessionId);
      session.session_id = sessionId;
    }
    
    console.log('✅ Sessão verificada:', session.payment_status);
    res.json(session);
  } catch (error) {
    console.error('❌ Erro em stripe-verify:', error);
    
    // Tratar erros específicos do Stripe
    if (error.code === 'resource_missing') {
      console.log('🔍 Sessão não encontrada no Stripe:', sessionId);
      return res.status(404).json({ 
        error: 'Sessão não encontrada',
        message: 'O session_id fornecido não existe ou expirou',
        session_id: sessionId
      });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Requisição inválida',
        message: error.message
      });
    }
    
    // Erro genérico
    res.status(500).json({ 
      error: 'Erro ao verificar sessão',
      message: 'Erro interno do servidor'
    });
  }
});

// Manual Access Function
app.post('/.netlify/functions/manual-access', async (req, res) => {
  try {
    const { session_id, test_mode } = req.body;
    console.log('🔧 Criando acesso manual para:', session_id);
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID é obrigatório' });
    }

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('ebook_purchases')
      .select('*')
      .eq('stripe_session_id', session_id)
      .single();

    if (existing) {
      console.log('✅ Acesso já existe:', existing.access_token);
      return res.json({ accessToken: existing.access_token });
    }

    let session;
    
    if (test_mode || session_id.includes('simulado')) {
      // Modo de teste - simular sessão paga
      console.log('🧪 Modo de teste ativado');
      session = {
        payment_status: 'paid',
        customer_email: 'teste@exemplo.com',
        amount_total: 4700,
        currency: 'brl'
      };
    } else {
      // Buscar sessão no Stripe
      session = await stripeClient.checkout.sessions.retrieve(session_id);
      
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Pagamento não confirmado' });
      }
    }

    // Buscar ou criar cliente
    let { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', session.customer_email)
      .single();

    if (!customer) {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert([{ email: session.customer_email }])
        .select()
        .single();
      customer = newCustomer;
    }

    // Gerar token de acesso
    const crypto = require('crypto');
    const accessToken = crypto.randomBytes(32).toString('hex');

    // Criar registro de compra
    const { data: purchase, error } = await supabase
      .from('ebook_purchases')
      .insert([{
        customer_id: customer.id,
        stripe_session_id: session_id,
        access_token: accessToken,
        amount_cents: session.amount_total || 4700,
        currency: session.currency || 'brl',
        status: 'completed',
        completed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar compra:', error);
      return res.status(500).json({ error: 'Erro ao criar acesso' });
    }

    console.log('✅ Acesso manual criado:', accessToken);
    res.json({ 
      accessToken, 
      customer: {
        email: customer.email,
        name: customer.first_name || 'Usuário Teste'
      },
      message: 'Manual access created successfully' + (session_id.includes('simulado') ? ' (test mode)' : '')
    });
  } catch (error) {
    console.error('❌ Erro em manual-access:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Servidor de funções Netlify local funcionando!',
    version: '1.0.0',
    endpoints: [
      'POST /.netlify/functions/create-ebook-checkout',
      'GET /.netlify/functions/get-ebook-access',
      'GET /.netlify/functions/verify-ebook-access',
      'POST /.netlify/functions/stripe-verify',
      'POST /.netlify/functions/manual-access'
    ],
    testEndpoint: 'GET /test'
  });
});

// Rota para /.netlify/functions/
app.get('/.netlify/functions/', (req, res) => {
  res.json({
    message: 'Funções Netlify disponíveis',
    functions: [
      'create-ebook-checkout',
      'get-ebook-access',
      'verify-ebook-access',
      'stripe-verify',
      'manual-access'
    ],
    usage: {
      'create-ebook-checkout': 'POST /.netlify/functions/create-ebook-checkout',
      'get-ebook-access': 'GET /.netlify/functions/get-ebook-access?session_id=xxx',
      'verify-ebook-access': 'GET /.netlify/functions/verify-ebook-access?token=xxx',
      'stripe-verify': 'POST /.netlify/functions/stripe-verify',
      'manual-access': 'POST /.netlify/functions/manual-access'
    }
  });
});

// Rota de teste para listar endpoints
app.get('/test', (req, res) => {
  res.json({
    message: 'Servidor de funções Netlify local funcionando!',
    endpoints: [
      'POST /.netlify/functions/create-ebook-checkout',
      'GET /.netlify/functions/get-ebook-access',
      'GET /.netlify/functions/verify-ebook-access',
      'POST /.netlify/functions/stripe-verify',
      'POST /.netlify/functions/manual-access'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor local de funções Netlify rodando na porta ${PORT}`);
  console.log(`📍 Endpoints disponíveis:`);
  console.log(`   - POST http://localhost:${PORT}/.netlify/functions/create-ebook-checkout`);
  console.log(`   - GET  http://localhost:${PORT}/test`);
});
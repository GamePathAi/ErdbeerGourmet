const express = require('express');
const stripe = require('stripe');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.development' });

const app = express();
const port = process.env.WEBHOOK_PORT || 4242;

// Configuração do Stripe
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Função para gerar token de acesso
function generateAccessToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Função para enviar e-mail de agradecimento
async function sendThankYouEmail(customerEmail, customerName, accessToken) {
  const accessUrl = `${process.env.VITE_APP_URL}/ebook-acesso.html?token=${accessToken}`;
  
  const mailOptions = {
    from: `"ErdbeerGourmet" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: '🍓 Obrigado pela sua compra! Acesse seu E-book Exclusivo',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d63384; margin: 0; font-size: 28px;">🍓 ErdbeerGourmet</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">O doce artesanal que conquistou a Suíça</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Olá ${customerName || 'Cliente'}!</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Muito obrigado pela sua compra! Estamos muito felizes em ter você como parte da família ErdbeerGourmet.
          </p>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
            Seu e-book <strong>"Morango Gourmet Profissional"</strong> está pronto para download. 
            Clique no botão abaixo para acessar todo o conteúdo exclusivo:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${accessUrl}" 
               style="background-color: #d63384; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
              🍓 ACESSAR MEU E-BOOK
            </a>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 30px 0;">
            <h3 style="color: #d63384; margin-top: 0;">O que você vai encontrar:</h3>
            <ul style="color: #555; line-height: 1.6;">
              <li>Receitas exclusivas de morangos gourmet</li>
              <li>Técnicas profissionais de preparo</li>
              <li>Dicas de apresentação e decoração</li>
              <li>Segredos da culinária suíça</li>
            </ul>
          </div>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Se você tiver alguma dúvida ou precisar de ajuda, não hesite em nos contatar. 
            Estamos aqui para ajudar!
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Com carinho,<br>
              <strong style="color: #d63384;">Equipe ErdbeerGourmet</strong>
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado com sucesso para: ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
}

// Webhook do Stripe
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);
      
      // Processar compra do ebook
      if (session.metadata && session.metadata.type === 'ebook') {
        try {
          // Gerar token de acesso
          const accessToken = generateAccessToken();
          
          // Obter informações do cliente
          const customerEmail = session.customer_details?.email;
          const customerName = session.customer_details?.name;
          
          if (customerEmail) {
            // Enviar e-mail de agradecimento com link de acesso
            await sendThankYouEmail(customerEmail, customerName, accessToken);
            console.log(`Token de acesso gerado: ${accessToken}`);
          } else {
            console.log('E-mail do cliente não disponível');
          }
        } catch (error) {
          console.error('Erro ao processar compra do ebook:', error);
        }
      }
      break;
      
    case 'checkout.session.expired':
      console.log('Checkout session expired:', event.data.object.id);
      break;
      
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Endpoint para verificar acesso ao ebook
app.get('/verify-ebook-access', (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'Token é obrigatório' });
  }
  
  // Para desenvolvimento, aceitar tokens específicos ou tokens de 64 caracteres
  const isValidToken = token.startsWith('dev_token_') || 
                      token.startsWith('manual_token_') || 
                      (token.length === 64 && /^[a-f0-9]+$/.test(token));
  
  if (isValidToken) {
    res.json({ 
      valid: true, 
      message: 'Acesso autorizado ao ebook',
      ebook_url: '/ebook/morango-gourmet-profissional.html'
    });
  } else {
    res.status(403).json({ 
      valid: false, 
      message: 'Token inválido ou expirado' 
    });
  }
});

// Endpoint de teste
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Webhook server funcionando!',
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: '/webhook',
      verify_access: '/verify-ebook-access?token=YOUR_TOKEN'
    }
  });
});

app.listen(port, () => {
  console.log(`Webhook server rodando na porta ${port}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`- POST http://localhost:${port}/webhook`);
  console.log(`- GET http://localhost:${port}/test`);
  console.log(`\nPara usar com Stripe CLI:`);
  console.log(`stripe listen --forward-to localhost:${port}/webhook`);
  console.log(`\nPara usar com ngrok:`);
  console.log(`ngrok http ${port}`);
});
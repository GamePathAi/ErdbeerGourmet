const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });

console.log(`Loading environment from: ${envFile}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Stripe key starts with: ${process.env.STRIPE_SECRET_KEY?.substring(0, 10)}...`);

const app = express();
const port = 3004;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Middleware
app.use(cors());
app.use(express.json());

// Products data (since we're using mock data)
const PRODUCTS = {
  'prod_SlJhFlcqk91ae8': {
    id: 'prod_SlJhFlcqk91ae8',
    name: '1 Erdbeere',
    description: 'Morango gourmet premium individual',
    price_cents: 1400,
    currency: 'CHF',
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
  },
  'prod_SlJiCevrXOPhYV': {
    id: 'prod_SlJiCevrXOPhYV',
    name: '2 Erdbeere Gourmet',
    description: 'Pacote com 2 morangos gourmet premium',
    price_cents: 2600,
    currency: 'CHF',
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
  },
  'prod_SlJjaVyIKv8L1L': {
    id: 'prod_SlJjaVyIKv8L1L',
    name: '4 Erdbeere Gourmet',
    description: 'Pacote com 4 morangos gourmet premium - Mais Popular',
    price_cents: 5000,
    currency: 'CHF',
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
  },
  'prod_SlJjt03xRlmLKl': {
    id: 'prod_SlJjt03xRlmLKl',
    name: '6 Erdbeere Gourmet',
    description: 'Pacote com 6 morangos gourmet premium',
    price_cents: 7000,
    currency: 'CHF',
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
  },
  'prod_SlJkP5R9a0WXW6': {
    id: 'prod_SlJkP5R9a0WXW6',
    name: '10 Erdbeere Gourmet',
    description: 'Pacote com 10 morangos gourmet premium - Melhor Valor',
    price_cents: 11500,
    currency: 'CHF',
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
  }
};

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Create line items for Stripe
    const lineItems = items.map((item) => {
      const product = PRODUCTS[item.productId];
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      return {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.image_url],
            metadata: {
              product_id: product.id
            }
          },
          unit_amount: product.price_cents,
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:3002/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3002/cancel`,
      shipping_address_collection: {
        allowed_countries: ['CH', 'DE', 'AT', 'FR', 'IT'],
      },
      billing_address_collection: 'required',
      metadata: {
        source: 'erdbeergourmet_website'
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Stripe webhook endpoint for thin loads
app.post('/api/webhooks/stripe-thin', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed (thin):', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle only essential events for thin loads
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Thin webhook - Checkout completed:', event.data.object.id);
        break;
      
      case 'payment_intent.succeeded':
        console.log('Thin webhook - Payment succeeded:', event.data.object.id);
        break;
      
      default:
        // Ignore other events for thin processing
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing thin webhook:', error);
    res.status(500).json({ error: 'Thin webhook processing failed' });
  }
});

// Stripe webhook endpoint (full processing)
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object.id);
        // Here you would typically update your database
        // For now, just log the successful payment
        break;
      
      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data.object.id);
        break;
      
      case 'payment_intent.payment_failed':
        console.log('Payment intent failed:', event.data.object.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
  console.log(`Webhook endpoint (full): http://localhost:${port}/api/stripe/webhook`);
  console.log(`Webhook endpoint (thin): http://localhost:${port}/api/webhooks/stripe-thin`);
});
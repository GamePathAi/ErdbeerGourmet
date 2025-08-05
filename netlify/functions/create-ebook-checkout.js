const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { customerEmail, customerName } = JSON.parse(event.body);

    if (!customerEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Create or get customer in Supabase
    let customer;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (existingCustomer) {
      customer = existingCustomer;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: customerEmail,
          first_name: customerName?.split(' ')[0] || '',
          last_name: customerName?.split(' ').slice(1).join(' ') || ''
        })
        .select()
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error creating customer' })
        };
      }
      customer = newCustomer;
    }

    // Create Stripe checkout session for ebook with Adaptive Pricing
    // Note: Adaptive Pricing must be enabled in the Stripe Dashboard
    // Go to Dashboard > Settings > Payments > Checkout and enable "Adaptive Pricing"
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl', // Base currency - Stripe will convert automatically with Adaptive Pricing
          product_data: {
            name: 'Morango Gourmet Profissional - Ebook',
            description: 'Guia completo com técnicas secretas para fazer morangos gourmet perfeitos',
            images: ['https://your-domain.com/images/ebook-cover.jpg'],
            metadata: {
              product_type: 'digital_ebook',
              category: 'curso_digital'
            }
          },
          unit_amount: 4700, // R$ 47,00 em centavos - base price
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${(process.env.URL || 'http://localhost:8888').replace(/\/$/, '')}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${(process.env.URL || 'http://localhost:8888').replace(/\/$/, '')}/`,
      customer_email: customerEmail,
      billing_address_collection: 'required',
      metadata: {
        customer_id: customer.id,
        product_type: 'ebook',
        source: 'morango_gourmet_landing'
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
      // Adaptive Pricing is enabled via Stripe Dashboard, not API parameter
      // The customer's location will be detected automatically by Stripe
    });

    // Record the purchase attempt in Supabase
    const { error: purchaseError } = await supabase
      .from('ebook_purchases')
      .insert({
        customer_id: customer.id,
        stripe_session_id: session.id,
        status: 'pending',
        amount_cents: 4700, // Amount in cents
        currency: 'brl'
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        sessionId: session.id, 
        url: session.url,
        customerId: customer.id
      })
    };
  } catch (error) {
    console.error('Error creating ebook checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
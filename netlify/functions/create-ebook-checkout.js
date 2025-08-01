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

    // Create Stripe checkout session for ebook
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Morango Gourmet Profissional - Ebook',
            description: 'Guia completo com técnicas secretas para fazer morangos gourmet perfeitos',
            images: ['https://your-domain.com/images/ebook-cover.jpg'],
            metadata: {
              product_type: 'digital_ebook',
              category: 'curso_digital'
            }
          },
          unit_amount: 4700, // R$ 47,00 em centavos
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
    });

    // Store the session in Supabase for tracking
    await supabase
      .from('ebook_purchases')
      .insert({
        customer_id: customer.id,
        stripe_session_id: session.id,
        status: 'pending',
        amount_cents: 4700,
        currency: 'BRL'
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
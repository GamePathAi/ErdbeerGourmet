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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { session_id } = event.queryStringParameters || {};

    if (!session_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Session ID is required' })
      };
    }

    // Verify session with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Payment not completed',
          paymentStatus: session.payment_status
        })
      };
    }

    // Get purchase from database
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
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Purchase not found' })
      };
    }

    if (purchase.status !== 'completed' || !purchase.access_token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Access not yet granted. Please wait a few moments and try again.',
          status: purchase.status
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        accessToken: purchase.access_token,
        customer: {
          email: purchase.customers.email,
          name: `${purchase.customers.first_name} ${purchase.customers.last_name}`.trim()
        },
        purchaseDate: purchase.completed_at
      })
    };
  } catch (error) {
    console.error('Error getting ebook access:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
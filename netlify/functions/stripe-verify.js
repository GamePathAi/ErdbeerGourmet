const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    // Get session_id from path parameters
    const sessionId = event.path.split('/').pop();

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid Session ID is required' })
      };
    }

    console.log('Verifying session:', sessionId);

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    });

    // Get payment intent for more details
    let paymentIntent = null;
    if (session.payment_intent) {
      paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    }

    const response = {
      session_id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email || session.customer?.email,
      customer_name: session.customer_details?.name || session.customer?.name,
      created: session.created,
      mode: session.mode,
      status: session.status,
      line_items: session.line_items?.data || [],
      payment_intent_status: paymentIntent?.status || null,
      payment_method: paymentIntent?.payment_method_types || null
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error verifying Stripe session:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Session not found in Stripe',
          details: error.message
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};
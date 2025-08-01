const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    const { items, customerEmail, metadata = {} } = JSON.parse(event.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Items are required' })
      };
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'chf',
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.productId || '',
            category: item.category || '',
            weight_grams: item.weight_grams?.toString() || ''
          }
        },
        unit_amount: Math.round(item.price * 100), // item.price is in CHF, convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${(process.env.URL || 'http://localhost:3000').replace(/\/$/, '')}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${(process.env.URL || 'http://localhost:3000').replace(/\/$/, '')}/cancel`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['CH', 'DE', 'AT', 'FR', 'IT'], // Mesmos países da versão TypeScript
      },
      billing_address_collection: 'required',
      metadata: {
        ...metadata,
        source: 'erdbeergourmet_website'
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id, url: session.url })
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
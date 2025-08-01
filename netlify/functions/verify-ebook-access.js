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
    const { token } = event.queryStringParameters || {};

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          hasAccess: false, 
          error: 'Token is required' 
        })
      };
    }

    // Verify token in database
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
      .eq('access_token', token)
      .eq('status', 'completed')
      .single();

    if (error || !purchase) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          hasAccess: false, 
          error: 'Invalid or expired token' 
        })
      };
    }

    // Update last accessed timestamp
    await supabase
      .from('ebook_purchases')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', purchase.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        hasAccess: true,
        customer: {
          email: purchase.customers.email,
          name: `${purchase.customers.first_name} ${purchase.customers.last_name}`.trim()
        },
        purchaseDate: purchase.completed_at
      })
    };
  } catch (error) {
    console.error('Error verifying ebook access:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        hasAccess: false, 
        error: 'Internal server error' 
      })
    };
  }
};
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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
    const body = JSON.parse(event.body || '{}');
    const { session_id } = body;

    if (!session_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Session ID is required' })
      };
    }

    console.log('Creating manual access for session:', session_id);

    // Test mode for development
    if (session_id.includes('simulado')) {
      console.log('Test mode activated for manual access:', session_id);
      const accessToken = crypto.randomBytes(32).toString('hex');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          accessToken,
          customer: {
            email: 'teste@exemplo.com',
            name: 'Usuário Teste'
          },
          message: 'Manual access created successfully (test mode)'
        })
      };
    }

    // Verify session with Stripe first
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

    // Check if purchase already exists
    const { data: existingPurchase } = await supabase
      .from('ebook_purchases')
      .select('*')
      .eq('stripe_session_id', session_id)
      .single();

    if (existingPurchase && existingPurchase.status === 'completed') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          accessToken: existingPurchase.access_token,
          message: 'Access already exists'
        })
      };
    }

    // Generate access token
    const accessToken = crypto.randomBytes(32).toString('hex');
    
    // Get or create customer
    let customerId;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || '';
    const [firstName, ...lastNameParts] = customerName.split(' ');
    const lastName = lastNameParts.join(' ');

    // Check if customer exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customerEmail)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: customerEmail,
          first_name: firstName || '',
          last_name: lastName || '',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        throw new Error('Failed to create customer');
      }
      
      customerId = newCustomer.id;
    }

    // Create or update purchase record
    const purchaseData = {
      customer_id: customerId,
      stripe_session_id: session_id,
      stripe_payment_intent_id: session.payment_intent,
      amount: session.amount_total,
      currency: session.currency,
      status: 'completed',
      access_token: accessToken,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    if (existingPurchase) {
      // Update existing purchase
      const { error: updateError } = await supabase
        .from('ebook_purchases')
        .update({
          status: 'completed',
          access_token: accessToken,
          completed_at: new Date().toISOString()
        })
        .eq('id', existingPurchase.id);

      if (updateError) {
        console.error('Error updating purchase:', updateError);
        throw new Error('Failed to update purchase');
      }
    } else {
      // Create new purchase
      const { error: insertError } = await supabase
        .from('ebook_purchases')
        .insert(purchaseData);

      if (insertError) {
        console.error('Error creating purchase:', insertError);
        throw new Error('Failed to create purchase record');
      }
    }

    console.log('Manual access created successfully for session:', session_id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        accessToken,
        customer: {
          email: customerEmail,
          name: customerName
        },
        message: 'Manual access created successfully'
      })
    };

  } catch (error) {
    console.error('Error creating manual access:', error);
    
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
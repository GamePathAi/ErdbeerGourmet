const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateAccessToken() {
  return crypto.randomBytes(32).toString('hex');
}

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        
        // Verify this is an ebook purchase
        if (session.metadata?.product_type === 'ebook') {
          // Generate access token
          const accessToken = generateAccessToken();
          
          // Update the purchase record
          const { error: updateError } = await supabase
            .from('ebook_purchases')
            .update({
              status: 'completed',
              access_token: accessToken,
              stripe_payment_intent_id: session.payment_intent,
              completed_at: new Date().toISOString()
            })
            .eq('stripe_session_id', session.id);

          if (updateError) {
            console.error('Error updating ebook purchase:', updateError);
            throw updateError;
          }

          // Send confirmation email (you can implement this later)
          console.log(`Ebook access granted for session ${session.id} with token ${accessToken}`);
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = stripeEvent.data.object;
        
        if (expiredSession.metadata?.product_type === 'ebook') {
          await supabase
            .from('ebook_purchases')
            .update({ status: 'expired' })
            .eq('stripe_session_id', expiredSession.id);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = stripeEvent.data.object;
        
        // Find the purchase by payment intent
        const { data: purchase } = await supabase
          .from('ebook_purchases')
          .select('*')
          .eq('stripe_payment_intent_id', failedPayment.id)
          .single();

        if (purchase) {
          await supabase
            .from('ebook_purchases')
            .update({ status: 'failed' })
            .eq('id', purchase.id);
        }
        break;

      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
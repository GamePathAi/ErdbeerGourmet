const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log('Payment succeeded:', session.id);
        // TODO: Update database, send confirmation email, etc.
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        // TODO: Fulfill the order
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = stripeEvent.data.object;
        console.log('Payment failed:', failedPayment.id);
        // TODO: Handle failed payment
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
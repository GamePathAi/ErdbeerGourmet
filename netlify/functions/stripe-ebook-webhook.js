const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateAccessToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Configure email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendThankYouEmail(customerEmail, accessToken) {
  const accessLink = `https://erdbeergourmet.ch/ebook-acesso.html?token=${accessToken}`;
  
  const mailOptions = {
    from: 'ErdbeerGourmet <contato@erdbeergourmet.com>',
    to: customerEmail,
    subject: '🍓 ErdbeerGourmet agradece a sua compra!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #e53e3e; text-align: center;">🍓 ErdbeerGourmet</h2>
        
        <p>Hello,</p>
        
        <p>Thank you for reaching out to us!</p>
        
        <p>We've received your message and our team will get back to you as soon as possible.</p>
        
        <p>
          In the meantime, feel free to access your content right away by clicking the link below:<br>
          👉 <a href="${accessLink}" style="color: #e53e3e; text-decoration: none; font-weight: bold;" target="_blank">Access your exclusive page</a>
        </p>
        
        <p>If you have any additional questions or need further assistance, feel free to reply to this email.</p>
        
        <p>Best regards,<br>
        The Erdbeer Gourmet Team 🍓</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Thank you email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending thank you email:', error);
    return false;
  }
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

          // Send thank you email with access link
          const customerEmail = session.customer_details?.email;
          if (customerEmail) {
            await sendThankYouEmail(customerEmail, accessToken);
            console.log(`Ebook access granted and email sent for session ${session.id}`);
          } else {
            console.log(`Ebook access granted for session ${session.id} but no email found`);
          }
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
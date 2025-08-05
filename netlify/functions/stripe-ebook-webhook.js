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

// Configure email transporter with error handling
let transporter;
try {
  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    // Add timeout and connection options
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
  console.log('Email transporter configured successfully');
} catch (error) {
  console.error('Error configuring email transporter:', error);
  transporter = null;
}

async function sendThankYouEmail(customerEmail, accessToken) {
  // Check if transporter is available
  if (!transporter) {
    console.error('Email transporter not configured - cannot send email');
    return false;
  }
  
  const accessLink = `https://erdbeergourmet.ch/ebook-acesso.html?token=${accessToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'ErdbeerGourmet <contato@erdbeergourmet.com>',
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
    console.log(`Attempting to send email to ${customerEmail}`);
    await transporter.sendMail(mailOptions);
    console.log(`Thank you email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending thank you email:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  console.log('🔍 Webhook handler started');
  console.log('Environment check:', {
    hasStripeSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasSmtpConfig: !!process.env.SMTP_USER && !!process.env.SMTP_PASS
  });
  
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
    return {
      statusCode: 500,
      body: 'Webhook secret not configured'
    };
  }

  let stripeEvent;

  try {
    console.log('🔐 Verifying webhook signature...');
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    console.log('✅ Webhook signature verified, event type:', stripeEvent.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }

  try {
    console.log('📦 Processing event:', stripeEvent.type);
    
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        console.log('🛒 Processing checkout.session.completed');
        const session = stripeEvent.data.object;
        console.log('Session ID:', session.id);
        console.log('Session metadata:', session.metadata);
        
        // Verify this is an ebook purchase
        if (session.metadata?.product_type === 'ebook') {
          console.log('✅ Confirmed ebook purchase');
          
          // Generate access token
          const accessToken = generateAccessToken();
          console.log('🔑 Access token generated:', accessToken.substring(0, 10) + '...');
          
          // Update the purchase record
          console.log('💾 Updating purchase record in Supabase...');
          const { error: updateError } = await supabase
            .from('ebook_purchases')
            .update({
              status: 'completed',
              access_token: accessToken,
              stripe_payment_intent_id: session.payment_intent,
              completed_at: new Date().toISOString()
            })
            .eq('stripe_session_id', session.id);
          
          console.log('Update result - error:', updateError);

          if (updateError) {
            console.error('❌ Error updating ebook purchase:', updateError);
            throw updateError;
          }
          
          console.log('✅ Purchase record updated successfully');

          // Send thank you email with access link
          const customerEmail = session.customer_details?.email;
          console.log('📧 Customer email:', customerEmail);
          
          if (customerEmail) {
            console.log('📤 Sending thank you email...');
            const emailSent = await sendThankYouEmail(customerEmail, accessToken);
            if (emailSent) {
              console.log(`✅ Ebook access granted and email sent for session ${session.id}`);
            } else {
              console.log(`⚠️ Ebook access granted for session ${session.id} but email failed`);
            }
          } else {
            console.log(`⚠️ Ebook access granted for session ${session.id} but no email found`);
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
        console.log(`⚠️ Unhandled event type ${stripeEvent.type}`);
    }

    console.log('✅ Webhook processed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      body: `Server Error: ${error.message}`
    };
  }
};

// Add a simple health check
if (require.main === module) {
  console.log('🔍 Webhook function loaded successfully');
  console.log('Environment variables check:', {
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    SMTP_FROM: !!process.env.SMTP_FROM
  });
}
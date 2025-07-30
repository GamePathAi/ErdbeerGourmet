import Stripe from 'stripe'
import { db } from '../src/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature']
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    // Check if event already processed
    const existingEvent = await db.paymentEvents.findByStripeId(event.id)
    if (existingEvent) {
      console.log(`Event ${event.id} already processed`)
      return res.status(200).json({ received: true })
    }

    // Log the event
    await db.paymentEvents.create({
      stripe_event_id: event.id,
      event_type: event.type,
      data: event.data,
      processed: false
    })

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    await db.paymentEvents.markProcessed(event.id)

    res.status(200).json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session completed:', session.id)
  
  try {
    // Get customer information
    let customer = null
    if (session.customer) {
      const stripeCustomer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer
      
      // Find or create customer in database
      customer = await db.customers.findByStripeId(stripeCustomer.id)
      if (!customer && stripeCustomer.email) {
        customer = await db.customers.create({
          stripe_customer_id: stripeCustomer.id,
          email: stripeCustomer.email,
          first_name: stripeCustomer.name?.split(' ')[0] || '',
          last_name: stripeCustomer.name?.split(' ').slice(1).join(' ') || '',
          phone: stripeCustomer.phone || '',
          country: 'CH'
        })
      }
    } else if (session.customer_details?.email) {
      // Create customer from session details
      customer = await db.customers.findByEmail(session.customer_details.email)
      if (!customer) {
        customer = await db.customers.create({
          email: session.customer_details.email,
          first_name: session.customer_details.name?.split(' ')[0] || '',
          last_name: session.customer_details.name?.split(' ').slice(1).join(' ') || '',
          phone: session.customer_details.phone || '',
          country: session.customer_details.address?.country || 'CH'
        })
      }
    }

    if (!customer) {
      throw new Error('Could not create or find customer')
    }

    // Create order
    const order = await db.orders.create({
      customer_id: customer.id,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_session_id: session.id,
      status: 'processing',
      total_amount_cents: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || 'CHF',
      shipping_address: session.shipping_details?.address,
      billing_address: session.customer_details?.address,
      payment_status: 'paid',
      payment_method: session.payment_method_types?.[0] || 'card'
    })

    // Get line items and create order items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    })

    const orderItems = []
    for (const item of lineItems.data) {
      const product = item.price?.product as Stripe.Product
      if (product?.metadata?.product_id) {
        orderItems.push({
          order_id: order.id,
          product_id: product.metadata.product_id,
          quantity: item.quantity || 1,
          unit_price_cents: item.price?.unit_amount || 0,
          total_price_cents: (item.price?.unit_amount || 0) * (item.quantity || 1)
        })
      }
    }

    if (orderItems.length > 0) {
      await db.orderItems.createMany(orderItems)
    }

    console.log(`Order created successfully: ${order.order_number}`)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
    throw error
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment intent succeeded:', paymentIntent.id)
  
  try {
    // Find order by payment intent ID and update status
    const { data: orders } = await db.supabase
      .from('orders')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntent.id)
    
    if (orders && orders.length > 0) {
      await db.orders.updateStatus(orders[0].id, 'processing', 'paid')
      console.log(`Order ${orders[0].order_number} payment confirmed`)
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
    throw error
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment intent failed:', paymentIntent.id)
  
  try {
    // Find order by payment intent ID and update status
    const { data: orders } = await db.supabase
      .from('orders')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntent.id)
    
    if (orders && orders.length > 0) {
      await db.orders.updateStatus(orders[0].id, 'cancelled', 'failed')
      console.log(`Order ${orders[0].order_number} payment failed`)
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
    throw error
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log('Processing customer created:', customer.id)
  
  try {
    if (customer.email) {
      const existingCustomer = await db.customers.findByStripeId(customer.id)
      if (!existingCustomer) {
        await db.customers.create({
          stripe_customer_id: customer.id,
          email: customer.email,
          first_name: customer.name?.split(' ')[0] || '',
          last_name: customer.name?.split(' ').slice(1).join(' ') || '',
          phone: customer.phone || '',
          country: customer.address?.country || 'CH'
        })
        console.log(`Customer created: ${customer.email}`)
      }
    }
  } catch (error) {
    console.error('Error handling customer created:', error)
    throw error
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment succeeded:', invoice.id)
  // Handle subscription payments if needed in the future
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
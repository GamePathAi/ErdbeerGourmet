import Stripe from 'stripe'
import { db } from '../src/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { items, customerEmail, metadata = {} } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' })
    }

    // Get products from database
    const productIds = items.map((item: any) => item.productId)
    const { data: products, error: productsError } = await db.products.getAll()
    
    if (productsError) {
      console.error('Error fetching products:', productsError)
      return res.status(500).json({ error: 'Failed to fetch products' })
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const product = products?.find(p => p.id === item.productId)
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`)
      }

      return {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.name,
            description: product.description,
            images: product.image_url ? [product.image_url] : [],
            metadata: {
              product_id: product.id,
              category: product.category || '',
              weight_grams: product.weight_grams?.toString() || ''
            }
          },
          unit_amount: product.price_cents,
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/cancel`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['CH', 'DE', 'AT', 'FR', 'IT'],
      },
      billing_address_collection: 'required',
      metadata: {
        ...metadata,
        source: 'erdbeergourmet_website'
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    })
  }
}
import { loadStripe } from '@stripe/stripe-js'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

if (!stripePublicKey) {
  throw new Error('Missing Stripe public key')
}

export const stripePromise = loadStripe(stripePublicKey)

// Stripe product configuration
export const STRIPE_PRODUCTS = {
  MORANGO_PREMIUM: {
    name: 'Morango Gourmet Premium',
    description: 'Morangos suíços premium selecionados à mão',
    price: 2500, // em centavos (25.00 CHF)
    currency: 'chf',
    images: ['/images/morango-premium.jpg'],
    metadata: {
      category: 'premium',
      weight: '500g'
    }
  },
  MORANGO_ORGANICO: {
    name: 'Morango Orgânico',
    description: 'Morangos orgânicos cultivados sem pesticidas',
    price: 2000, // em centavos (20.00 CHF)
    currency: 'chf',
    images: ['/images/morango-organico.jpg'],
    metadata: {
      category: 'organico',
      weight: '500g'
    }
  },
  CESTA_MORANGOS: {
    name: 'Cesta de Morangos',
    description: 'Cesta com variedade de morangos gourmet',
    price: 4500, // em centavos (45.00 CHF)
    currency: 'chf',
    images: ['/images/cesta-morangos.jpg'],
    metadata: {
      category: 'cesta',
      weight: '1000g'
    }
  }
} as const

// Utility functions
export const formatPrice = (priceInCents: number, currency: string = 'CHF') => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(priceInCents / 100)
}

export const createCheckoutSession = async (items: Array<{productId: string, quantity: number}>, customerEmail?: string) => {
  try {
    // Map cart items to include product details
    const cartItems = items.map(item => {
      // Use the productId directly as it's already the Stripe product ID
      return {
        productId: item.productId,
        quantity: item.quantity
      }
    })

    const requestBody = {
      items: cartItems,
      ...(customerEmail && { customerEmail }),
      metadata: {
        source: 'erdbeergourmet_website',
        timestamp: new Date().toISOString()
      }
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { url } = await response.json()
    
    // Redirect directly to Stripe Checkout
    window.location.href = url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Types for Stripe integration
export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CheckoutSessionData {
  items: CartItem[]
  customerEmail?: string
  successUrl?: string
  cancelUrl?: string
  metadata?: Record<string, string>
}

export interface StripeCustomer {
  id: string
  email: string
  name?: string
  phone?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    postal_code?: string
    country?: string
  }
}

export interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  customer?: string
  metadata?: Record<string, string>
}
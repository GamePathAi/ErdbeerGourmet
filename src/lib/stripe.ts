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

export const createCheckoutSession = async (items: Array<{productId: string, quantity: number}>) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })
    
    if (error) {
      throw error
    }
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
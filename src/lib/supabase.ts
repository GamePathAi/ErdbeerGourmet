import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Customer {
  id: string
  stripe_customer_id?: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  address_line1?: string
  address_line2?: string
  city?: string
  postal_code?: string
  country: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  stripe_product_id?: string
  stripe_price_id?: string
  name: string
  description?: string
  price_cents: number
  currency: string
  image_url?: string
  category?: string
  weight_grams?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  stripe_payment_intent_id?: string
  stripe_session_id?: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount_cents: number
  currency: string
  shipping_address?: any
  billing_address?: any
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price_cents: number
  total_price_cents: number
  created_at: string
}

export interface PaymentEvent {
  id: string
  stripe_event_id: string
  event_type: string
  order_id?: string
  customer_id?: string
  data: any
  processed: boolean
  created_at: string
}

// Database functions
export const db = {
  // Customer functions
  customers: {
    async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async findByEmail(email: string) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    },

    async findByStripeId(stripeCustomerId: string) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('stripe_customer_id', stripeCustomerId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    },

    async update(id: string, updates: Partial<Customer>) {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Product functions
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Order functions
  orders: {
    async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>) {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async findByStripeSessionId(sessionId: string) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_items:order_items(*, product:products(*))
        `)
        .eq('stripe_session_id', sessionId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    },

    async updateStatus(id: string, status: Order['status'], paymentStatus?: Order['payment_status']) {
      const updates: any = { status }
      if (paymentStatus) updates.payment_status = paymentStatus
      
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async getByCustomer(customerId: string) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(*, product:products(*))
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  },

  // Order items functions
  orderItems: {
    async createMany(items: Omit<OrderItem, 'id' | 'created_at'>[]) {
      const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select()
      
      if (error) throw error
      return data
    }
  },

  // Payment events functions
  paymentEvents: {
    async create(event: Omit<PaymentEvent, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('payment_events')
        .insert(event)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async markProcessed(stripeEventId: string) {
      const { data, error } = await supabase
        .from('payment_events')
        .update({ processed: true })
        .eq('stripe_event_id', stripeEventId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async findByStripeId(stripeEventId: string) {
      const { data, error } = await supabase
        .from('payment_events')
        .select('*')
        .eq('stripe_event_id', stripeEventId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    }
  }
}
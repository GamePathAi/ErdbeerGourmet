// Environment configuration
export const config = {
  // Environment detection
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  // API URLs
  apiUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3001',
  
  // Stripe configuration
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  },
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  
  // Debug settings
  enableDebug: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.MODE === 'development',
  
  // App settings
  app: {
    name: 'ErdbeerGourmet',
    version: '1.0.0',
  }
};

// Debug logging in development
if (config.enableDebug) {
  console.log('🔧 Environment Config:', {
    mode: import.meta.env.MODE,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    apiUrl: config.apiUrl,
    hasStripeKey: !!config.stripe.publicKey,
    hasSupabaseConfig: !!(config.supabase.url && config.supabase.anonKey)
  });
}

export default config;
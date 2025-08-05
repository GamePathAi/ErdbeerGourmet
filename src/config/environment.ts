// Environment configuration
export const config = {
  // Environment detection
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  // API URLs
  apiUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3001',
  
  // Stripe configuration
  stripe: {
    publicKey: (() => {
      // Force test key for localhost/local IPs regardless of mode
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname.includes('127.0.0.1') ||
                         window.location.hostname.includes('192.168') ||
                         window.location.hostname.includes('172.20') ||
                         window.location.protocol === 'http:';
      
      const testKey = 'pk_test_51RpmEm4EgllpJRjmjxU5hdv7rSLe3coL6IlR3ho8W36VeteMEdFZ9JAsUAd25kQ4V17qKrMh6PQN2Oq9a5GO5TdA00gRv15tov';
      const prodKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      
      console.log('🔑 STRIPE KEY SELECTION:', {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        isLocalhost,
        mode: import.meta.env.MODE,
        usingTestKey: isLocalhost
      });
      
      if (isLocalhost) {
        console.log('✅ Using TEST key for localhost');
        return testKey;
      }
      
      console.log('🚀 Using PRODUCTION key for live site');
      return prodKey;
    })(),
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
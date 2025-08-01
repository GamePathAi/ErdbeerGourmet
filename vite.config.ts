import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    host: true,
    strictPort: false
  },
  build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          format: 'es',
          manualChunks: {
            vendor: ['react', 'react-dom'],
            stripe: ['@stripe/stripe-js'],
            supabase: ['@supabase/supabase-js']
          }
        }
      }
    },
    define: {
      // Make env variables available at build time
      __APP_ENV__: JSON.stringify(env.NODE_ENV || mode),
    },
    envPrefix: ['VITE_'], // Only expose VITE_ prefixed variables
  }
})
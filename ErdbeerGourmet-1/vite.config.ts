import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    host: true,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
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
  }
})
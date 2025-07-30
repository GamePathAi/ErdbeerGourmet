import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.development' })

console.log('🔍 Verificando variáveis de ambiente:')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ Não encontrado')
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não encontrado')
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurado' : '❌ Não encontrado')

if (process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key_here') {
  console.log('\n⚠️  ATENÇÃO: A chave do Stripe ainda está como placeholder!')
  console.log('   Você precisa substituir "your_stripe_secret_key_here" pela sua chave real do Stripe.')
}

if (process.env.VITE_STRIPE_PUBLIC_KEY === 'your_stripe_public_key_here') {
  console.log('\n⚠️  ATENÇÃO: A chave pública do Stripe ainda está como placeholder!')
  console.log('   Você precisa substituir "your_stripe_public_key_here" pela sua chave real do Stripe.')
}

console.log('\n📋 Para obter suas chaves do Stripe:')
console.log('1. Acesse https://dashboard.stripe.com/test/apikeys')
console.log('2. Copie a "Secret key" (começa com sk_test_...)')
console.log('3. Copie a "Publishable key" (começa com pk_test_...)')
console.log('4. Substitua os valores no arquivo .env.development')
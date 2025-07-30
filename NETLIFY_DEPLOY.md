# Deploy no Netlify - ErdbeerGourmet

Este guia explica como fazer o deploy da aplicação ErdbeerGourmet no Netlify.

## Pré-requisitos

- Conta no Netlify
- Chaves de API do Stripe (test e live)
- Projeto Supabase configurado

## Configuração das Variáveis de Ambiente

No painel do Netlify, configure as seguintes variáveis de ambiente:

### Stripe
```
VITE_STRIPE_PUBLIC_KEY=pk_test_... (ou pk_live_...)
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Supabase
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Aplicação
```
URL=https://seu-site.netlify.app
NODE_ENV=production
```

## Configuração do Build

### Configurações no Netlify
- **Build command**: `npm run build:prod`
- **Publish directory**: `dist`
- **Node version**: `18`

### Funções Serverless
As funções estão localizadas em `netlify/functions/` e incluem:
- `create-checkout-session.js` - Criação de sessões de checkout do Stripe
- `stripe-webhook.js` - Processamento de webhooks do Stripe

## Configuração do Webhook do Stripe

1. No painel do Stripe, vá para **Developers > Webhooks**
2. Adicione um novo endpoint: `https://seu-site.netlify.app/.netlify/functions/stripe-webhook`
3. Selecione os eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copie o webhook secret e adicione à variável `STRIPE_WEBHOOK_SECRET`

## Deploy

### Opção 1: Deploy Automático via Git
1. Conecte seu repositório GitHub ao Netlify
2. Selecione a branch `netlify-clean`
3. Configure as variáveis de ambiente
4. O deploy será automático a cada push

### Opção 2: Deploy Manual
1. Execute `npm run build:prod` localmente
2. Faça upload da pasta `dist` no Netlify
3. Configure as funções manualmente

## Verificação do Deploy

1. Acesse seu site no Netlify
2. Teste a funcionalidade do carrinho
3. Verifique se o checkout do Stripe funciona
4. Confirme que os webhooks estão sendo recebidos

## Troubleshooting

### Erro 404 nas rotas
- Verifique se o arquivo `public/_redirects` está presente
- Confirme as configurações de redirecionamento no `netlify.toml`

### Erro nas funções
- Verifique os logs das funções no painel do Netlify
- Confirme se as variáveis de ambiente estão configuradas
- Verifique se o `package.json` das funções está correto

### Problemas com Stripe
- Confirme se as chaves do Stripe estão corretas
- Verifique se o webhook endpoint está configurado
- Teste com chaves de teste primeiro

## Monitoramento

- Use os logs do Netlify para monitorar as funções
- Configure alertas no Stripe para pagamentos
- Monitore métricas de performance no Netlify Analytics
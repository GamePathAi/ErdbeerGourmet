# Guia de Troubleshooting para Deploy no Netlify

## ✅ Configurações Necessárias no Netlify

### 1. Variáveis de Ambiente
No painel do Netlify, vá em **Site settings > Environment variables** e configure:

**IMPORTANTE**: Use as mesmas configurações do ambiente de desenvolvimento (localhost:3000)

```
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
VITE_APP_URL=https://www.erdbeergourmet.ch
```

### 2. Configurações de Build
- **Build command**: `npm run build:prod`
- **Publish directory**: `dist`
- **Node version**: `18`

### 3. Configurações de Domínio
- Configure o domínio personalizado: `www.erdbeergourmet.ch`
- Configure SSL/TLS (deve ser automático)

## 🔧 Problemas Comuns e Soluções

### Problema 1: "Failed to load module script"
**Solução**: Verificar se as variáveis de ambiente estão configuradas corretamente no Netlify.

### Problema 2: Funções Netlify não funcionam
**Solução**: 
1. Verificar se as funções estão na pasta `netlify/functions/`
2. Verificar se o `netlify.toml` está configurado corretamente
3. Verificar se as variáveis de ambiente das funções estão configuradas

### Problema 3: Erro 404 em rotas
**Solução**: O arquivo `_redirects` deve estar na pasta `dist/` (já configurado).

### Problema 4: Erro de CORS
**Solução**: Verificar se os headers estão configurados no `netlify.toml` (já configurado).

## 📋 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Build command: `npm run build:prod`
- [ ] Publish directory: `dist`
- [ ] Node version: 18
- [ ] Domínio personalizado configurado
- [ ] SSL ativo
- [ ] Funções Netlify deployadas
- [ ] Webhooks do Stripe configurados

## 🚀 Como Fazer o Deploy

1. **Via Git**: Conecte o repositório GitHub ao Netlify
2. **Via CLI**: Use `netlify deploy --prod`
3. **Via Interface**: Faça upload manual da pasta `dist/`

## 📞 Suporte

Se o problema persistir:
1. Verifique os logs de build no Netlify
2. Verifique os logs das funções no Netlify
3. Teste localmente com `npm run build:prod` e `npm run preview`
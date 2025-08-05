# 🚀 Guia de Deploy para Produção - ErdbeerGourmet

## ✅ Pré-requisitos Verificados

- [x] Sistema 100% funcional em desenvolvimento
- [x] Sincronização Stripe → Database funcionando
- [x] Sistema de e-book operacional
- [x] Webhooks configurados e testados
- [x] RLS configurado corretamente

## 📋 Checklist de Deploy

### 1. 🔒 Configuração de Segurança

#### Reabilitar RLS no Supabase
```sql
-- Execute no Supabase SQL Editor:
-- Copie e cole o conteúdo do arquivo re-enable-rls.sql
```

#### Verificar Variáveis de Ambiente
- [ ] Todas as chaves do Stripe (produção)
- [ ] URLs do Supabase (produção)
- [ ] Configurações SMTP
- [ ] Webhook endpoints

### 2. 🌐 Deploy no Netlify

#### 🎯 Fluxo Recomendado (Seus Scripts Configurados)
```bash
# 1. Desenvolvimento
npm run dev

# 2. Teste Local
npm run test:build:prod

# 3. Deploy de Teste
npm run deploy:test

# 4. Deploy Final
npm run deploy:prod
```

#### Detalhes dos Scripts
- `test:build:prod`: Executa `build:prod` + `preview:prod`
- `deploy:test`: Executa `test:build:prod` + `netlify deploy --dir=dist`
- `deploy:prod`: Executa `build:prod` + `netlify deploy --prod --dir=dist`

#### Configuração no Netlify
1. **Site Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18.x`

2. **Environment Variables**
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_APP_URL=https://your-domain.netlify.app
   VITE_ENVIRONMENT=production
   
   # Para as funções Netlify
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   ```

3. **Functions**
   - As funções em `netlify/functions/` serão automaticamente deployadas

### 3. 🔗 Configuração do Stripe (Produção)

#### Webhook Configuration
1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Clique em "Add endpoint"
3. URL: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`
4. Eventos para escutar:
   ```
   checkout.session.completed
   payment_intent.succeeded
   payment_intent.payment_failed
   invoice.payment_succeeded
   customer.created
   ```
5. Copie o **Webhook Secret** para as variáveis de ambiente

#### Produtos no Stripe
```bash
# Sincronizar produtos (desenvolvimento)
npm run sync:stripe:dev

# Ou sincronizar direto (produção)
npm run sync:stripe
```

### 4. 🗄️ Configuração do Supabase (Produção)

#### Database Setup
1. Execute o schema completo:
   ```sql
   -- Execute supabase-schema.sql no SQL Editor
   ```

2. Configure RLS:
   ```sql
   -- Execute re-enable-rls.sql
   ```

3. Verifique as tabelas:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### 5. 🧪 Testes de Produção

#### Teste End-to-End
1. **Acesso ao site**: Verificar se carrega corretamente
2. **Compra de produto**: Testar checkout completo
3. **Compra de e-book**: Testar fluxo do e-book
4. **Webhook**: Verificar se eventos são processados
5. **Email**: Testar envio de confirmações

#### Comandos de Teste Disponíveis
```bash
# Testar variáveis de ambiente
npm run test:env

# Verificar conexão com database
npm run check:db

# Testar build completo
npm run test:build:prod
```

### 6. 📊 Monitoramento

#### Logs para Monitorar
- **Netlify Functions**: Logs de execução
- **Stripe Dashboard**: Eventos de webhook
- **Supabase**: Logs de database
- **Browser Console**: Erros de frontend

#### Métricas Importantes
- Taxa de sucesso de checkout
- Tempo de resposta das funções
- Erros de webhook
- Acessos ao e-book

### 7. 🔧 Troubleshooting

#### Problemas Comuns

**Webhook não funciona**
```bash
# Verificar URL do webhook
curl -X POST https://your-domain.netlify.app/.netlify/functions/stripe-webhook
```

**RLS bloqueando operações**
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'products';
```

**Erro de CORS**
- Verificar `_headers` em `public/`
- Confirmar configuração CSP

### 8. 🎯 Próximos Passos

#### Pós-Deploy
- [ ] Configurar domínio customizado
- [ ] Configurar SSL/TLS
- [ ] Configurar analytics
- [ ] Configurar backup automático
- [ ] Documentar processo de rollback

#### Melhorias Futuras
- [ ] CDN para imagens
- [ ] Cache de produtos
- [ ] Notificações push
- [ ] Dashboard administrativo

## 🚨 Comandos de Emergência

```bash
# Rollback rápido
git revert HEAD
npm run deploy:prod

# Teste rápido antes de deploy
npm run test:build:prod

# Deploy de teste para verificar
npm run deploy:test

# Verificar ambiente
npm run test:env

# Verificar database
npm run check:db

# Desabilitar RLS temporariamente
# Execute temp-disable-rls.sql no Supabase

# Sincronizar produtos após problemas
npm run sync:stripe:dev
```

## 📞 Suporte

- **Netlify**: [Status Page](https://www.netlifystatus.com/)
- **Stripe**: [Status Page](https://status.stripe.com/)
- **Supabase**: [Status Page](https://status.supabase.com/)

---

**✅ Sistema pronto para produção!**

Todos os componentes foram testados e estão funcionando:
- ✅ Frontend (React + Vite)
- ✅ Backend (Netlify Functions)
- ✅ Database (Supabase)
- ✅ Pagamentos (Stripe)
- ✅ E-book System
- ✅ Webhooks
- ✅ Email System

**🎉 Bom deploy!**
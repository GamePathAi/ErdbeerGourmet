# 🔧 Guia para Resolver Problema RLS - ErdbeerGourmet

## 🚨 Problema Identificado
O erro `new row violates row-level security policy for table "products"` está impedindo a sincronização dos produtos do Stripe com o Supabase.

## ✅ Solução Rápida (Recomendada)

### Passo 1: Desabilitar RLS Temporariamente
1. Acesse o **Supabase Dashboard** → **SQL Editor**
2. Execute o conteúdo do arquivo `temp-disable-rls.sql`:

```sql
-- Disable RLS temporarily
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events DISABLE ROW LEVEL SECURITY;
```

### Passo 2: Executar Sincronização
```bash
npm run sync:stripe:dev
```

### Passo 3: Re-habilitar RLS
Execute o conteúdo do arquivo `re-enable-rls.sql` no Supabase SQL Editor.

## 🔐 Solução Permanente (Alternativa)

Se preferir manter RLS ativo, execute o arquivo `fix-rls-policies.sql` que adiciona políticas adequadas para permitir operações de sincronização.

## 📋 Checklist Final

### ✅ Já Funcionando
- [x] Build do projeto (4.30s)
- [x] Preview local rodando
- [x] Checkout Stripe funcionando
- [x] Estrutura do banco (5/5 tabelas)
- [x] Sistema ebook configurado
- [x] Variáveis de ambiente corretas
- [x] Webhook server rodando (porta 4242)
- [x] Funções Netlify rodando (porta 8888)

### 🔄 Pendente
- [ ] Resolver RLS para sincronização de produtos
- [ ] Configurar webhook no Stripe Dashboard
- [ ] Teste end-to-end completo

## 🎯 Próximos Passos Após Resolver RLS

1. **Configurar Webhook no Stripe Dashboard:**
   - URL: `https://seu-dominio.netlify.app/.netlify/functions/stripe-ebook-webhook`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`

2. **Teste End-to-End:**
   - Comprar ebook com cartão de teste
   - Verificar se acesso é liberado
   - Confirmar webhook processado

3. **Deploy para Produção:**
   - `npm run build:prod`
   - Deploy no Netlify
   - Configurar variáveis de ambiente de produção

## 🚀 Status Atual
**Sistema 95% funcional** - Apenas o problema RLS está bloqueando a sincronização completa!
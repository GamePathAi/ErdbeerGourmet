# Configuração do Sistema de Ebook

Este documento explica como configurar o sistema completo de venda de ebook integrado com Stripe e Supabase.

## Arquivos Criados

### Funções Netlify

1. **`netlify/functions/create-ebook-checkout.js`**
   - Cria sessões de checkout do Stripe para o ebook
   - Gerencia clientes no Supabase
   - Preço: R$ 47,00

2. **`netlify/functions/stripe-ebook-webhook.js`**
   - Processa webhooks do Stripe
   - Gera tokens de acesso após pagamento confirmado
   - Atualiza status das compras

3. **`netlify/functions/verify-ebook-access.js`**
   - Verifica se um token de acesso é válido
   - Retorna informações do cliente

4. **`netlify/functions/get-ebook-access.js`**
   - Converte session_id do Stripe em token de acesso
   - Usado na página de sucesso

### Banco de Dados

5. **`supabase/migrations/20241201000000_create_ebook_purchases.sql`**
   - Cria tabela `ebook_purchases`
   - Armazena compras, tokens de acesso e status

### Frontend

6. **Atualizado: `src/components/MorangoGourmetLanding.jsx`**
   - Formulário de email/nome antes da compra
   - Integração com Stripe Checkout
   - Estados de loading e erro

7. **Atualizado: `public/ebook-acesso.html`**
   - Verificação de acesso via API
   - Suporte a session_id e token
   - Mensagens personalizadas

8. **Atualizado: `public/sucesso.html`**
   - Página pós-pagamento
   - Obtém token de acesso automaticamente
   - Redirecionamento para o ebook

## Configuração Necessária

### 1. Variáveis de Ambiente

No arquivo `.env.development`, configure:

```env
# Stripe (substitua pelas suas chaves reais)
VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui

# Supabase (já configurado)
VITE_SUPABASE_URL=https://ckwnxnzadsxmalcptkle.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# URLs
URL=https://seu-dominio.netlify.app  # Para produção
```

### 2. Configuração do Stripe

1. **Obter Chaves da API:**
   - Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
   - Vá em "Developers" > "API keys"
   - Copie a "Publishable key" (pk_test_...) para `VITE_STRIPE_PUBLIC_KEY`
   - Copie a "Secret key" (sk_test_...) para `STRIPE_SECRET_KEY`

2. **Configurar Webhook:**
   - Vá em "Developers" > "Webhooks"
   - Clique "Add endpoint"
   - URL: `https://seu-dominio.netlify.app/.netlify/functions/stripe-ebook-webhook`
   - Eventos: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
   - Copie o "Signing secret" para `STRIPE_WEBHOOK_SECRET`

### 3. Configuração do Supabase

1. **Executar Migration:**
   ```bash
   # Se usando Supabase CLI
   supabase db push
   
   # Ou execute manualmente no SQL Editor do Supabase
   ```

2. **Verificar Permissões:**
   - A tabela `ebook_purchases` deve ter RLS habilitado
   - Service role deve ter acesso completo

## Fluxo de Funcionamento

### 1. Compra
1. Cliente preenche nome e email na landing page
2. Sistema cria/encontra cliente no Supabase
3. Cria sessão de checkout no Stripe
4. Redireciona para pagamento

### 2. Pós-Pagamento
1. Stripe redireciona para `/sucesso.html?session_id=xxx`
2. Página de sucesso chama `get-ebook-access` com session_id
3. Sistema retorna token de acesso
4. Cliente é redirecionado para `/ebook-acesso?token=xxx`

### 3. Acesso ao Ebook
1. Página de acesso chama `verify-ebook-access` com token
2. Sistema valida token e retorna permissão
3. Ebook é exibido em iframe

### 4. Webhook (Automático)
1. Stripe envia webhook quando pagamento é confirmado
2. Sistema gera token de acesso único
3. Atualiza status da compra para "completed"

## Testando o Sistema

### 1. Teste Local
```bash
# Iniciar Netlify Dev
netlify dev

# Acessar
http://localhost:8888
```

### 2. Cartões de Teste do Stripe
- **Sucesso:** 4242 4242 4242 4242
- **Falha:** 4000 0000 0000 0002
- **3D Secure:** 4000 0000 0000 3220

### 3. Verificar Logs
- Netlify Functions: Dashboard do Netlify
- Stripe: Dashboard > Logs
- Supabase: Dashboard > Logs

## Estrutura da Tabela ebook_purchases

```sql
CREATE TABLE ebook_purchases (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  access_token TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
  amount_cents INTEGER,
  currency TEXT DEFAULT 'BRL',
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Próximos Passos

1. **Configurar chaves reais do Stripe**
2. **Executar migration do banco**
3. **Testar fluxo completo**
4. **Configurar webhook em produção**
5. **Adicionar email de confirmação (opcional)**
6. **Implementar analytics de conversão**

## Troubleshooting

### Erro "Token inválido"
- Verificar se webhook está funcionando
- Verificar se migration foi executada
- Verificar logs do Stripe

### Erro "Session not found"
- Verificar se session_id está na URL
- Verificar se pagamento foi confirmado
- Verificar configuração do Stripe

### Erro "Access denied"
- Verificar permissões do Supabase
- Verificar se service role key está correta
- Verificar RLS policies
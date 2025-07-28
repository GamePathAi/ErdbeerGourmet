# Configuração do Banco de Dados e Pagamentos - ErdbeerGourmet

Este guia explica como configurar o Supabase (banco de dados) e Stripe (pagamentos) para o ErdbeerGourmet.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Conta no [Stripe](https://stripe.com)
- Node.js instalado
- Projeto ErdbeerGourmet clonado

## 🗄️ Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha sua organização
4. Defina:
   - **Name**: `erdbeergourmet-db`
   - **Database Password**: Crie uma senha forte
   - **Region**: Europe (mais próximo da Suíça)
5. Clique em "Create new project"

### 2. Configurar o Schema do Banco

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Verifique se todas as tabelas foram criadas em **Table Editor**

### 3. Obter Chaves de API

1. Vá para **Settings** > **API**
2. Copie:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **anon public** key
   - **service_role** key (mantenha secreta!)

### 4. Configurar Row Level Security (RLS)

As políticas de segurança já estão incluídas no schema. Verifique em **Authentication** > **Policies**.

## 💳 Configuração do Stripe

### 1. Criar Conta Stripe

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Complete a verificação da conta
3. Ative o modo de teste para desenvolvimento

### 2. Obter Chaves de API

1. No painel do Stripe, vá para **Developers** > **API keys**
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 3. Configurar Produtos

#### Opção A: Criar via Dashboard
1. Vá para **Products** > **Add product**
2. Crie os produtos:
   - **Morango Gourmet Premium** - CHF 25.00
   - **Morango Orgânico** - CHF 20.00
   - **Cesta de Morangos** - CHF 45.00

#### Opção B: Usar API (Recomendado)
Os produtos serão criados automaticamente via API quando necessário.

### 4. Configurar Webhooks

1. Vá para **Developers** > **Webhooks**
2. Clique em "Add endpoint"
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.com/api/stripe-webhook`
   - **Events**: Selecione:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.created`
     - `invoice.payment_succeeded`
4. Copie o **Signing secret** (whsec_...)

## ⚙️ Configuração das Variáveis de Ambiente

### 1. Configurar arquivo .env

Edite o arquivo `.env` na raiz do projeto:

```env
# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui

# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Application Configuration
VITE_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Verificar Configuração

Execute o projeto e verifique se não há erros de conexão:

```bash
npm run dev
```

## 🧪 Testando a Integração

### 1. Teste do Banco de Dados

1. Abra o console do navegador
2. Execute:
```javascript
import { db } from './src/lib/supabase'
db.products.getAll().then(console.log)
```

### 2. Teste do Stripe

1. Adicione produtos ao carrinho
2. Clique em "Finalizar Compra"
3. Use cartão de teste: `4242 4242 4242 4242`
4. Verifique se o pedido aparece no Supabase

### Cartões de Teste Stripe

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## 🚀 Deploy em Produção

### 1. Supabase

- O projeto já está em produção
- Atualize as variáveis de ambiente com URLs de produção

### 2. Stripe

1. Ative sua conta Stripe
2. Substitua chaves de teste por chaves de produção
3. Configure webhook para URL de produção
4. Teste com cartões reais (pequenos valores)

### 3. Variáveis de Ambiente Produção

```env
# Stripe Production
STRIPE_PUBLIC_KEY=pk_live_sua_chave_publica_producao
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_producao
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_producao

# Supabase Production
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_producao
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_producao

# Application Production
VITE_APP_URL=https://seu-dominio.com
NODE_ENV=production
```

## 📊 Monitoramento

### Supabase
- **Dashboard**: Monitore uso e performance
- **Logs**: Verifique erros em tempo real
- **Auth**: Gerencie usuários (se implementado)

### Stripe
- **Dashboard**: Acompanhe vendas e métricas
- **Logs**: Monitore webhooks e erros
- **Disputes**: Gerencie contestações

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**:
   - Verifique URLs nas variáveis de ambiente
   - Configure CORS no Supabase se necessário

2. **Webhook não funciona**:
   - Verifique se a URL está acessível
   - Confirme o signing secret
   - Teste com ngrok em desenvolvimento

3. **Produtos não aparecem**:
   - Execute o schema SQL novamente
   - Verifique se os produtos estão ativos
   - Confirme conexão com Supabase

### Logs Úteis

```bash
# Ver logs do servidor
npm run dev

# Verificar conexão Supabase
console.log(supabase.supabaseUrl)

# Verificar produtos
db.products.getAll().then(console.log)
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação oficial:
   - [Supabase Docs](https://supabase.com/docs)
   - [Stripe Docs](https://stripe.com/docs)

2. Verifique os logs de erro no console

3. Teste com dados de exemplo primeiro

---

✅ **Checklist de Configuração**

- [ ] Projeto Supabase criado
- [ ] Schema do banco executado
- [ ] Chaves Supabase copiadas
- [ ] Conta Stripe criada
- [ ] Chaves Stripe copiadas
- [ ] Webhook Stripe configurado
- [ ] Arquivo .env configurado
- [ ] Teste de conexão realizado
- [ ] Teste de compra realizado
- [ ] Produtos aparecem no banco

Com essa configuração, seu ErdbeerGourmet estará pronto para processar pedidos e gerenciar clientes! 🍓
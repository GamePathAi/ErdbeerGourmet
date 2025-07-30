# 🚀 Configuração Rápida do Banco Supabase

## ⚠️ Problema Detectado
O script de sincronização falhou porque as tabelas do banco de dados ainda não foram criadas no Supabase.

## 📋 Solução Rápida

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: `ckwnxnzadsxmalcptkle`

### 2. Execute o Schema SQL
- No dashboard, vá para **SQL Editor** (ícone de código no menu lateral)
- Clique em **New Query**
- Copie todo o conteúdo do arquivo `supabase-schema.sql`
- Cole no editor SQL
- Clique em **Run** para executar

### 3. Verificar Tabelas Criadas
Após executar o SQL, você deve ver estas tabelas criadas:
- ✅ `customers`
- ✅ `products`
- ✅ `orders`
- ✅ `order_items`
- ✅ `payment_events`

### 4. Testar Sincronização
Após criar as tabelas, execute:
```bash
npm run sync:stripe:dev
```

## 🔗 Links Úteis
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ckwnxnzadsxmalcptkle
- **SQL Editor**: https://supabase.com/dashboard/project/ckwnxnzadsxmalcptkle/sql
- **Tabelas**: https://supabase.com/dashboard/project/ckwnxnzadsxmalcptkle/editor

## 📝 Próximos Passos
1. ✅ Configurar chaves Stripe (já feito)
2. 🔄 Criar tabelas no Supabase (pendente)
3. 🚀 Executar sincronização de produtos
4. 🛒 Testar checkout

---
**Nota**: Este é um passo único. Após criar as tabelas, a sincronização funcionará normalmente.
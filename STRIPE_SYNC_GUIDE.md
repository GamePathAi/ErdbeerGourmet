# 🔄 Guia de Sincronização de Produtos Stripe

Este guia explica como sincronizar os produtos do Stripe com o banco de dados Supabase do ErdbeerGourmet.

## 📋 Pré-requisitos

1. **Chaves do Stripe configuradas**:
   - Acesse [Stripe Dashboard - API Keys](https://dashboard.stripe.com/test/apikeys)
   - Copie a **Secret key** (começa com `sk_test_...`)
   - Copie a **Publishable key** (começa com `pk_test_...`)

2. **Variáveis de ambiente configuradas** no `.env.development`:
   ```
   STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
   VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

3. **Dependências instaladas**:
   ```bash
   npm install tsx dotenv-cli
   ```

4. **Verificar configuração**:
   ```bash
   npm run test:env
   ```

## 🚀 Como Executar a Sincronização

### Opção 1: Ambiente de Desenvolvimento
```bash
npm run sync:stripe:dev
```
Este comando usa as variáveis do arquivo `.env.development`

### Opção 2: Ambiente de Produção
```bash
npm run sync:stripe
```
Este comando usa as variáveis de ambiente do sistema

## 📊 O que o Script Faz

1. **Busca Produtos do Stripe:**
   - Lista todos os produtos ativos
   - Obtém informações de preço de cada produto
   - Coleta metadados como categoria e peso

2. **Sincroniza com Supabase:**
   - Verifica se o produto já existe no banco
   - Atualiza produtos existentes
   - Cria novos produtos
   - Mantém referências `stripe_product_id` e `stripe_price_id`

3. **Relatório de Sincronização:**
   - Mostra quantos produtos foram sincronizados
   - Lista erros se houver
   - Exibe todos os produtos no banco após sincronização

## 🛍️ Produto Atual do Stripe

Baseado na sua consulta `stripe products list`, você tem:

- **ID:** `prod_SloxXvKoy10Zqn`
- **Nome:** "1 unidade de morango"
- **Preço ID:** `price_1RqHJS4EgllpJRjmdSv8psj9`
- **Status:** Ativo
- **Tipo:** Serviço

## 🔧 Configurações Adicionais

### Metadados Recomendados no Stripe

Para melhor integração, adicione estes metadados aos seus produtos no Stripe:

```bash
# Exemplo de como adicionar metadados via CLI
stripe products update prod_SloxXvKoy10Zqn \
  --metadata category="premium" \
  --metadata weight_grams="100"
```

### Campos Suportados

O script sincroniza os seguintes campos:

| Campo Stripe | Campo Supabase | Descrição |
|--------------|----------------|------------|
| `id` | `stripe_product_id` | ID do produto no Stripe |
| `default_price.id` | `stripe_price_id` | ID do preço no Stripe |
| `name` | `name` | Nome do produto |
| `description` | `description` | Descrição do produto |
| `default_price.unit_amount` | `price_cents` | Preço em centavos |
| `default_price.currency` | `currency` | Moeda (CHF, EUR, etc.) |
| `images[0]` | `image_url` | URL da primeira imagem |
| `metadata.category` | `category` | Categoria do produto |
| `metadata.weight_grams` | `weight_grams` | Peso em gramas |
| `active` | `is_active` | Se o produto está ativo |

## 🐛 Solução de Problemas

### Erro: "Missing Supabase environment variables"
- Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão definidas
- Confirme que o arquivo `.env.development` existe e está no diretório raiz
- Execute `npm run test:env` para verificar o status das variáveis

### Erro: "Invalid API key provided" (401 Unauthorized)
- **Problema mais comum**: Chaves ainda estão como placeholder
- Verifique se `STRIPE_SECRET_KEY` está correta e começa com `sk_test_` ou `sk_live_`
- Confirme que a chave não tem espaços extras no início ou fim
- Execute `npm run test:env` para verificar se as chaves estão configuradas

### Erro: "require is not defined in ES module scope"
- Este erro foi corrigido na versão atual do script
- Se ainda ocorrer, verifique se está usando a versão mais recente

### Produtos não aparecem
- Verifique se os produtos estão ativos no Stripe Dashboard
- Confirme que os produtos têm preços associados
- Execute o script com chaves válidas do Stripe

### Variáveis de ambiente não carregam
- Confirme que o arquivo `.env.development` existe
- Verifique se não há espaços ou caracteres especiais nos nomes das variáveis
- Execute `npm run test:env` para diagnóstico completo

### Produto sem preço
- Certifique-se de que o produto tem um `default_price` definido no Stripe
- Use: `stripe products update prod_XXXXX --default-price price_XXXXX`

## 📝 Logs de Exemplo

```
🔄 Iniciando sincronização de produtos do Stripe...
📦 Encontrados 1 produtos no Stripe
🆕 Produto criado: 1 unidade de morango

📊 Resumo da sincronização:
✅ Produtos sincronizados: 1
❌ Erros: 0
📦 Total de produtos no Stripe: 1

🛍️  Produtos no banco de dados:
- 1 unidade de morango: 25.00 CHF (prod_SloxXvKoy10Zqn)

🎉 Sincronização concluída com sucesso!
```

## 🔄 Automatização

Para automatizar a sincronização, você pode:

1. **Webhook do Stripe:** Configurar webhooks para sincronizar automaticamente quando produtos são atualizados
2. **Cron Job:** Executar o script periodicamente
3. **CI/CD:** Incluir no pipeline de deploy

## 📞 Próximos Passos

Após a sincronização:

1. Verifique os produtos no painel Supabase
2. Teste o checkout com os produtos sincronizados
3. Configure imagens e descrições adicionais se necessário
4. Ajuste categorias e metadados conforme sua necessidade
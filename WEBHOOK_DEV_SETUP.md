# Configuração do Webhook para Desenvolvimento

## Visão Geral

Este guia explica como configurar e usar o servidor webhook local para desenvolvimento, incluindo o sistema de envio automático de e-mails para o ebook.

## Pré-requisitos

1. **Variáveis de Ambiente**: Configure o arquivo `.env.development` com:
   ```env
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # SMTP para envio de e-mails
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-senha-de-app
   
   # URL da aplicação
   VITE_APP_URL=http://localhost:3001
   
   # Porta do webhook
   WEBHOOK_PORT=4242
   ```

2. **Dependências**: Certifique-se de que o Nodemailer está instalado:
   ```bash
   npm install nodemailer
   ```

## Como Usar

### 1. Iniciar o Servidor Webhook

```bash
node webhook-server.cjs
```

O servidor será iniciado na porta 4242 (ou a porta definida em `WEBHOOK_PORT`).

### 2. Configurar o Stripe CLI (Recomendado para Desenvolvimento)

```bash
# Instalar Stripe CLI
stripe login

# Escutar eventos e encaminhar para o webhook local
stripe listen --forward-to localhost:4242/webhook
```

O Stripe CLI fornecerá um webhook secret que deve ser adicionado ao `.env.development`.

### 3. Alternativa: Usar ngrok

Se preferir usar ngrok:

```bash
# Instalar ngrok
ngrok http 4242

# Usar a URL fornecida pelo ngrok no Stripe Dashboard
```

## Funcionalidades

### Sistema de E-mail Automático

Quando uma compra de ebook é concluída:

1. **Evento Capturado**: `checkout.session.completed` com `metadata.type = 'ebook'`
2. **Token Gerado**: Token único de 64 caracteres para acesso
3. **E-mail Enviado**: E-mail de agradecimento com link de acesso
4. **Template**: E-mail em português com branding ErdbeerGourmet

### Endpoints Disponíveis

- **POST `/webhook`**: Recebe eventos do Stripe
- **GET `/verify-ebook-access?token=TOKEN`**: Verifica acesso ao ebook
- **GET `/test`**: Endpoint de teste para verificar funcionamento

## Testando o Sistema

### 1. Teste do Servidor

```bash
curl http://localhost:4242/test
```

### 2. Teste de Verificação de Acesso

```bash
# Token de desenvolvimento
curl "http://localhost:4242/verify-ebook-access?token=dev_token_123"

# Token manual
curl "http://localhost:4242/verify-ebook-access?token=manual_token_abc"
```

### 3. Teste de Compra Completa

1. Inicie o servidor de desenvolvimento: `npm run dev`
2. Inicie o webhook: `node webhook-server.cjs`
3. Configure o Stripe CLI: `stripe listen --forward-to localhost:4242/webhook`
4. Faça uma compra de teste no site
5. Verifique os logs do webhook para confirmar o envio do e-mail

## Configuração SMTP

### Gmail

1. Ative a autenticação de 2 fatores
2. Gere uma "Senha de App" específica
3. Use as configurações:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-senha-de-app
   ```

### Outros Provedores

Ajuste `SMTP_HOST`, `SMTP_PORT` conforme seu provedor de e-mail.

## Logs e Debugging

O servidor webhook exibe logs detalhados:

- ✅ Eventos recebidos do Stripe
- 📧 E-mails enviados com sucesso
- ❌ Erros de envio de e-mail
- 🔑 Tokens de acesso gerados

## Segurança

- **Tokens**: Gerados com `crypto.randomBytes(32)` (64 caracteres hex)
- **Verificação**: Webhook signature verification do Stripe
- **Ambiente**: Variáveis sensíveis em `.env.development` (não commitado)

## Troubleshooting

### Erro: "nodemailer.createTransporter is not a function"

**Solução**: Use `nodemailer.createTransport` (sem 'r' no final)

### Erro: "SMTP Authentication failed"

**Soluções**:
1. Verifique se a senha de app está correta
2. Confirme se a autenticação de 2 fatores está ativa
3. Teste as credenciais SMTP manualmente

### Webhook não recebe eventos

**Soluções**:
1. Verifique se o Stripe CLI está rodando
2. Confirme se o `STRIPE_WEBHOOK_SECRET` está correto
3. Teste o endpoint `/test` para verificar se o servidor está ativo

## Produção

Para produção:

1. Configure um webhook endpoint real no Stripe Dashboard
2. Use variáveis de ambiente de produção
3. Implemente logging mais robusto
4. Considere usar um serviço de e-mail dedicado (SendGrid, Mailgun, etc.)
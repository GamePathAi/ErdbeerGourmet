# 📧 Configuração do Sistema de E-mail Automático

## Visão Geral
O sistema envia automaticamente um e-mail de agradecimento com o link de acesso ao eBook após o pagamento ser confirmado via Stripe.

## Como Funciona

### 1. Fluxo Automático
1. Cliente completa o pagamento no Stripe
2. Stripe dispara o evento `checkout.session.completed`
3. Webhook recebe o evento e processa:
   - Atualiza o status da compra no Supabase
   - Gera token de acesso único
   - Envia e-mail automático com link de acesso

### 2. Conteúdo do E-mail
- **Remetente:** ErdbeerGourmet <contato@erdbeergourmet.com>
- **Assunto:** 🍓 ErdbeerGourmet agradece a sua compra!
- **Conteúdo:** HTML responsivo com link personalizado
- **Link de Acesso:** `https://erdbeergourmet.ch/ebook-acesso.html?token={ACCESS_TOKEN}`

## Configuração

### 1. Variáveis de Ambiente
Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@erdbeergourmet.com
SMTP_PASS=sua-senha-de-app
```

### 2. Configuração do Gmail (Recomendado)

#### Passo 1: Ativar Autenticação de 2 Fatores
1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em "Segurança" → "Verificação em duas etapas"
3. Ative a verificação em duas etapas

#### Passo 2: Gerar Senha de App
1. Ainda em "Segurança", procure por "Senhas de app"
2. Selecione "E-mail" como aplicativo
3. Copie a senha gerada (16 caracteres)
4. Use esta senha na variável `SMTP_PASS`

### 3. Configuração Alternativa (Outros Provedores)

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=sua-api-key-sendgrid
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASS=sua-senha-mailgun
```

## Instalação de Dependências

As dependências já foram adicionadas ao `package.json`. Para instalar:

```bash
cd netlify/functions
npm install
```

## Teste do Sistema

### 1. Teste Local
1. Configure as variáveis de ambiente
2. Faça um pagamento de teste no Stripe
3. Verifique os logs do webhook
4. Confirme o recebimento do e-mail

### 2. Logs de Monitoramento
O sistema registra:
- ✅ E-mail enviado com sucesso
- ❌ Erros de envio
- 📧 Endereço de e-mail do cliente
- 🔗 Token de acesso gerado

## Personalização do E-mail

### Template HTML
O template está em `stripe-ebook-webhook.js` na função `sendThankYouEmail()`. Você pode personalizar:

- **Cores:** Altere `#e53e3e` para sua cor de marca
- **Logo:** Adicione `<img>` com sua logo
- **Texto:** Modifique as mensagens
- **Estilo:** Ajuste o CSS inline

### Exemplo de Personalização
```javascript
html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <img src="https://erdbeergourmet.ch/logo.png" alt="Logo" style="width: 200px;">
    <h2>Obrigado pela sua compra!</h2>
    // ... resto do template
  </div>
`
```

## Solução de Problemas

### E-mail não está sendo enviado
1. ✅ Verifique as variáveis de ambiente
2. ✅ Confirme a senha de app do Gmail
3. ✅ Verifique os logs do Netlify Functions
4. ✅ Teste a conexão SMTP

### E-mail vai para spam
1. Configure SPF, DKIM e DMARC no seu domínio
2. Use um provedor confiável (SendGrid, Mailgun)
3. Evite palavras que ativam filtros de spam

### Webhook não está funcionando
1. Verifique o endpoint no Stripe Dashboard
2. Confirme o `STRIPE_WEBHOOK_SECRET`
3. Teste com Stripe CLI: `stripe listen --forward-to localhost:8888/.netlify/functions/stripe-ebook-webhook`

## Monitoramento

### Logs do Netlify
- Acesse: [app.netlify.com](https://app.netlify.com)
- Vá em "Functions" → "stripe-ebook-webhook"
- Monitore execuções e erros

### Métricas Importantes
- Taxa de entrega de e-mail
- Tempo de processamento do webhook
- Erros de autenticação SMTP

## Segurança

### Boas Práticas
1. 🔒 Use senhas de app, não senhas principais
2. 🔒 Mantenha as credenciais SMTP seguras
3. 🔒 Monitore tentativas de acesso suspeitas
4. 🔒 Use HTTPS para todos os links

### Backup
- Configure um provedor SMTP secundário
- Implemente retry logic para falhas temporárias
- Mantenha logs de todos os e-mails enviados

---

**✨ Sistema configurado com sucesso!** Os clientes agora receberão automaticamente o e-mail de agradecimento com acesso ao eBook após o pagamento.
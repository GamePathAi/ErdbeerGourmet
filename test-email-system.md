# 🧪 Teste do Sistema de E-mail Automático

## Pré-requisitos para Teste

### 1. Configuração das Variáveis de Ambiente
Antes de testar, configure as variáveis SMTP no Netlify:

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Vá em "Site settings" → "Environment variables"
3. Adicione as seguintes variáveis:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@erdbeergourmet.com
SMTP_PASS=sua-senha-de-app-gmail
```

### 2. Configuração do Gmail

#### Gerar Senha de App:
1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em "Segurança" → "Verificação em duas etapas" (ative se não estiver)
3. Procure por "Senhas de app"
4. Selecione "E-mail" → "Outro" → Digite "ErdbeerGourmet"
5. Copie a senha de 16 caracteres gerada
6. Use esta senha na variável `SMTP_PASS`

## Métodos de Teste

### 1. Teste com Pagamento Real (Recomendado)

#### Passo a Passo:
1. Acesse: `https://erdbeergourmet.ch`
2. Clique em "Comprar eBook"
3. Use um cartão de teste do Stripe:
   - **Número:** 4242 4242 4242 4242
   - **Data:** Qualquer data futura
   - **CVC:** Qualquer 3 dígitos
   - **E-mail:** Seu e-mail real para receber o teste

#### O que Esperar:
1. ✅ Redirecionamento para página de sucesso
2. ✅ E-mail de agradecimento em até 2 minutos
3. ✅ Link funcional no e-mail
4. ✅ Acesso ao eBook pelo link

### 2. Teste com Stripe CLI (Desenvolvimento)

#### Instalação do Stripe CLI:
```bash
# Windows (via Chocolatey)
choco install stripe-cli

# Ou baixe direto: https://github.com/stripe/stripe-cli/releases
```

#### Configuração:
```bash
# Login no Stripe
stripe login

# Escutar webhooks localmente
stripe listen --forward-to https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook

# Em outro terminal, simular evento
stripe trigger checkout.session.completed
```

### 3. Monitoramento em Tempo Real

#### Logs do Netlify:
1. Acesse: [app.netlify.com](https://app.netlify.com/projects/erdbeergourmet/logs/functions)
2. Filtre por "stripe-ebook-webhook"
3. Monitore execuções em tempo real

#### Logs Esperados:
```
✅ Webhook signature verified
✅ Ebook purchase updated in database
✅ Thank you email sent successfully to cliente@email.com
✅ Ebook access granted and email sent for session cs_test_...
```

## Verificação do E-mail

### Template Esperado:
- **Assunto:** 🍓 ErdbeerGourmet agradece a sua compra!
- **Remetente:** ErdbeerGourmet <contato@erdbeergourmet.com>
- **Conteúdo:** HTML responsivo com botão de acesso
- **Link:** `https://erdbeergourmet.ch/ebook-acesso.html?token=...`

### Checklist do E-mail:
- [ ] E-mail chegou na caixa de entrada (não spam)
- [ ] Design está correto e responsivo
- [ ] Link de acesso funciona
- [ ] Token é único e válido
- [ ] Redirecionamento para eBook funciona

## Solução de Problemas

### E-mail não chegou:

#### 1. Verificar Logs do Netlify:
```
❌ Error sending thank you email: Error: Invalid login
```
**Solução:** Verificar credenciais SMTP

#### 2. E-mail na Pasta Spam:
**Solução:** 
- Configurar SPF/DKIM no domínio
- Usar provedor confiável (SendGrid/Mailgun)

#### 3. Webhook não disparou:
```
❌ Webhook signature verification failed
```
**Solução:** Verificar `STRIPE_WEBHOOK_SECRET`

### Comandos de Debug:

#### Testar Conexão SMTP:
```javascript
// Adicione temporariamente ao webhook para testar
console.log('Testing SMTP connection...');
try {
  await transporter.verify();
  console.log('✅ SMTP connection successful');
} catch (error) {
  console.error('❌ SMTP connection failed:', error);
}
```

#### Verificar Variáveis de Ambiente:
```javascript
console.log('SMTP Config:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER ? '✅ Set' : '❌ Missing',
  pass: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing'
});
```

## Teste de Carga

### Simular Múltiplos Pagamentos:
```bash
# Simular 10 pagamentos
for i in {1..10}; do
  stripe trigger checkout.session.completed
  sleep 2
done
```

### Métricas a Monitorar:
- Taxa de entrega: > 95%
- Tempo de processamento: < 5 segundos
- Erros de SMTP: < 1%

## Configuração de Produção

### Variáveis Obrigatórias no Netlify:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@erdbeergourmet.com
SMTP_PASS=abcd-efgh-ijkl-mnop  # Senha de app de 16 caracteres
```

### Webhook do Stripe:
1. Acesse [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Adicione endpoint: `https://erdbeergourmet.ch/.netlify/functions/stripe-ebook-webhook`
3. Selecione eventos: `checkout.session.completed`
4. Copie o signing secret para `STRIPE_WEBHOOK_SECRET`

## Resultado Esperado

### Fluxo Completo:
1. 🛒 Cliente compra eBook
2. 💳 Pagamento processado pelo Stripe
3. 🔔 Webhook dispara automaticamente
4. 📧 E-mail enviado em segundos
5. 🔗 Cliente acessa eBook pelo link
6. ✨ Experiência perfeita!

---

**🎯 Sistema pronto para produção!** O e-mail automático será enviado para todos os novos clientes após o pagamento.
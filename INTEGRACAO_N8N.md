# 📱 Guia de Integração: PWA Vendas Alert + n8n

## 🚀 Quick Start

### 1. Deploy na Netlify

```bash
# Renomear o arquivo HTML para index.html
mv pwa-vendas.html index.html

# Estrutura esperada:
project/
├── index.html
├── service-worker.js
├── manifest.json
└── netlify.toml (opcional)
```

**Via Netlify UI:**
1. Conecte seu repositório GitHub no https://app.netlify.com
2. Deploy automático ao fazer push

**Via CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

Seu URL será: `https://seu-site.netlify.app`

---

## 📡 Integração com n8n

### Opção 1: Webhook Simples (Recomendado)

#### No n8n:

1. **Criar novo workflow**
2. **Adicionar trigger**: Webhook
   - Method: `POST`
   - Path: `/webhook/vendas` (customize conforme quiser)
   - Copy a URL completa

3. **Estrutura do payload esperado:**
```json
{
  "cliente": "João Silva",
  "produto": "Plano Premium",
  "valor": "2.999,99",
  "imageUrl": "https://via.placeholder.com/100",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

4. **Adicionar nó**: HTTP Request (para notificação via Web Push)
   - Method: POST
   - URL: `{{ $json.webhookUrl }}`
   - Body:
   ```json
   {
     "title": "Venda de {{$json.cliente}}",
     "body": "{{$json.produto}} - R$ {{$json.valor}}",
     "cliente": "{{$json.cliente}}",
     "produto": "{{$json.produto}}",
     "valor": "{{$json.valor}}",
     "imageUrl": "{{$json.imageUrl}}"
   }
   ```

#### Na PWA:

Na página da PWA, cole sua URL do webhook n8n:
```
https://seu-n8n.com/webhook/sua-chave-webhook/vendas
```

---

### Opção 2: Push Notification com Firebase (Avançado)

Se você quer notificações mesmo com a aba fechada:

1. **Criar Firebase Project**
   - https://console.firebase.google.com
   - Cloud Messaging (FCM)

2. **No n8n:**
   - Usar nó `HTTP Request` para Firebase
   - Enviar para: `https://fcm.googleapis.com/fcm/send`

```json
{
  "to": "{{$json.deviceToken}}",
  "notification": {
    "title": "Venda!",
    "body": "R$ {{$json.valor}}",
    "image": "{{$json.imageUrl}}"
  },
  "data": {
    "cliente": "{{$json.cliente}}",
    "produto": "{{$json.produto}}"
  }
}
```

**⚠️ Limitação:** Firebase no iOS precisa de app nativo. Melhor manter com Web Push simples.

---

## 🔔 Testando a Integração

### Test 1: Teste Local na PWA
1. Abra a PWA em http://localhost:3000
2. Clique em "Ativar Notificações"
3. Use a seção "Simular Venda"

### Test 2: Webhook do n8n via cURL
```bash
curl -X POST https://seu-n8n.com/webhook/sua-chave/vendas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "João Silva",
    "produto": "Plano Premium",
    "valor": "2.999,99",
    "imageUrl": "https://via.placeholder.com/100"
  }'
```

### Test 3: Teste Completo
1. Configure a URL do webhook na PWA
2. Dispare um evento no n8n
3. Verifique se a notificação aparece

---

## 🛠️ Workflow n8n Completo

```
📊 Trigger (Webhook) 
    ↓
🔄 Transform (Formatar dados)
    ↓
📤 Send Notification (HTTP POST)
    ↓
💾 Log Success (Debug)
```

**Exemplo de Transform Node:**
```javascript
return {
  cliente: $input.first().json.customer_name,
  produto: $input.first().json.product_name,
  valor: $input.first().json.price.toFixed(2),
  imageUrl: $input.first().json.product_image,
  timestamp: new Date().toISOString()
}
```

---

## 📱 Suporte iOS/Android

### iPhone (iOS 16.4+)
✅ Notificações funcionam quando Safari está aberto
⚠️ Vibração/som dependem das configurações do dispositivo
❌ Push quando app está fechado (limitação do iOS)

**Workaround iOS:**
- Instale como PWA (Add to Home Screen)
- Safari continuará entregando notificações em background por até 5 minutos

### Android
✅ Suporte completo a Web Push
✅ Notificações com som e vibração
✅ Background push delivery

---

## 🔐 Segurança

### 1. Proteger Webhook n8n
```json
{
  "headers": {
    "Authorization": "Bearer seu-token-secreto"
  }
}
```

### 2. Validar Origem (CORS)
No n8n, adicione validação:
```javascript
if ($request.headers['origin'] !== 'https://seu-site.netlify.app') {
  throw new Error('Origin não autorizada');
}
```

### 3. Rate Limiting
Adicione nó de delay entre requisições:
```
Execute → Wait 1 segundo → Send Notification
```

---

## 🚨 Troubleshooting

### "Notificações não funcionam no iPhone"
- ✅ Abre a PWA como Web App (Add to Home Screen)
- ✅ Verifica se Safari está com permissão ativada
- ✅ Aguarde até 5 minutos com Safari aberto

### "Webhook não dispara notificação"
```bash
# Verificar URL do webhook
curl -i https://seu-n8n.com/webhook/sua-chave/vendas

# Checar logs no n8n
# Dashboard → Executions → Ver detalhes
```

### "Imagem não aparece na notificação"
- Validar CORS da URL da imagem
- Usar apenas HTTPS
- Tamanho máximo recomendado: 256KB

### "Som não toca"
- No Android: Verificar volume do dispositivo
- No iPhone: Notificações aparecem silenciosamente (limitação iOS)
- Workaround: Usar vibração (`vibrate: [200, 100, 200]`)

---

## 📊 Monitorando Notificações

### Via n8n
Dashboard → Executions → Filtrar por sucesso/erro

### Via PWA
Histórico fica armazenado localmente (últimas 50)

### Via Console do Navegador
```javascript
// Ver todas as notificações armazenadas
JSON.parse(localStorage.getItem('notifications'))

// Limpar histórico
localStorage.removeItem('notifications')
```

---

## 🎯 Próximos Passos

### Melhorias Futuras
- [ ] Integrar com Stripe/MercadoPago para vendas reais
- [ ] Dashboard com gráficos de vendas
- [ ] Notificações categorizadas (por valor, produto)
- [ ] Histórico com banco de dados (Firebase, Supabase)
- [ ] Sync com CRM (HubSpot, Salesforce)

### Recursos Avançados
```javascript
// Analytics
amplitude.logEvent('notification_received', {
  cliente,
  valor,
  timestamp
});

// Segmentação
if (valor > 5000) {
  // Notificação com som extra
  playImportantSale();
}
```

---

## 🆘 Suporte

**Erro no n8n?**
- Documentação: https://docs.n8n.io
- Community: https://community.n8n.io

**Erro na PWA?**
- Console do navegador: F12 → Console
- Service Worker: DevTools → Application → Service Workers

**Erro de deploy Netlify?**
- Build logs: https://app.netlify.com/sites/seu-site/deploys
- Verifique netlify.toml se existir

---

## ✨ Exemplo Real Completo

**Seu fluxo:**
```
Produto vendido em seu sistema
           ↓
n8n detecta via webhook/banco
           ↓
Dispara POST para seu PWA
           ↓
Service Worker recebe notificação
           ↓
🔔 Notificação no iPhone/Android
           ↓
Som + Imagem + Histórico atualizado
```

---

**Pronto para ir ao ar!** 🚀

Qualquer dúvida: configure primeiro localmente, depois faça deploy na Netlify.

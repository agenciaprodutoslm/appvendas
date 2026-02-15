# 📚 Exemplos Práticos - Integração PWA + Plataformas

## 🏪 Exemplo 1: Shopify + n8n + PWA

### Setup:

1. **n8n Webhook** para Shopify:
```json
{
  "event": "orders/create",
  "topic": "order"
}
```

2. **Transform Node** em n8n:
```javascript
return {
  cliente: $input.first().json.customer.first_name + ' ' + $input.first().json.customer.last_name,
  produto: $input.first().json.line_items[0].title,
  valor: $input.first().json.total_price,
  imageUrl: $input.first().json.line_items[0].image?.src || 'https://via.placeholder.com/100',
  timestamp: new Date().toISOString()
}
```

3. **HTTP Request** para PWA:
```
Method: POST
URL: https://seu-pwa.netlify.app/webhook-api
Body: Resultado do Transform
```

### Resultado:
```
🛍️ Novo Pedido em Shopify
           ↓
n8n dispara webhook
           ↓
PWA recebe notificação
           ↓
🔔 Você vê no seu iPhone/Android
```

---

## 💳 Exemplo 2: Stripe + n8n + PWA

### Configurar Stripe Webhook:

1. Dashboard Stripe → Webhooks → Add endpoint
2. URL: `https://seu-n8n.com/webhook/seu-token/stripe`
3. Eventos: `charge.succeeded`, `payment_intent.succeeded`

### n8n Configuration:

```json
{
  "data": {
    "object": {
      "amount": 50000,  // em centavos
      "currency": "usd",
      "customer": "cus_12345",
      "metadata": {
        "product_name": "Premium Plan"
      }
    }
  }
}
```

### Transform para PWA:
```javascript
const data = $input.first().json.data.object;
return {
  cliente: data.billing_details?.name || 'Cliente Stripe',
  produto: data.metadata?.product_name || 'Pagamento',
  valor: (data.amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: data.currency.toUpperCase()
  }),
  imageUrl: 'https://via.placeholder.com/100?text=Stripe',
  timestamp: new Date().toISOString()
}
```

---

## 🎫 Exemplo 3: Eventbrite + n8n + PWA

### Setup Eventbrite:

1. App → Webhooks
2. Selecione eventos: `order.placed`, `ticket.created`
3. URL: `https://seu-n8n.com/webhook/seu-token/eventbrite`

### n8n Transform:
```javascript
const event = $input.first().json.api_object;
return {
  cliente: event.attendees[0].profile.first_name,
  produto: event.event.name,
  valor: event.cost?.display || 'Evento',
  imageUrl: event.event.logo?.url || 'https://via.placeholder.com/100',
  timestamp: event.created.substring(0, 19).replace('T', ' ')
}
```

---

## 📊 Exemplo 4: Google Sheets + n8n + PWA

### Usar Google Sheets como "banco de vendas":

```javascript
// Trigger: A cada 5 minutos, verificar nova linha em Sheets
// Se nova venda detectada, enviar para PWA

const lastRow = $input.first().json;
return {
  cliente: lastRow.Cliente,
  produto: lastRow.Produto,
  valor: lastRow.Valor,
  imageUrl: lastRow.ImagemURL,
  timestamp: new Date().toISOString()
}
```

**Workflow:**
```
⏰ Schedule Trigger (5min)
    ↓
📊 Read Google Sheets
    ↓
🔍 Filter (nova linha?)
    ↓
📤 Send to PWA
```

---

## 🤖 Exemplo 5: WhatsApp Business + n8n + PWA

### Receber vendas via WhatsApp:

```
Seu cliente envia:
"Vendi 1 iPhone 15 por R$ 4.999,99 para João"
    ↓
n8n processa mensagem
    ↓
Extrai: cliente, produto, valor
    ↓
Manda para PWA
```

### n8n Configuration:

```javascript
// Usar node "OpenAI" ou "Webhook" para processar WhatsApp
const message = $input.first().json.message;

// OpenAI extrai informações
const info = await openai.parseMessage(message);

return {
  cliente: info.cliente,
  produto: info.produto,
  valor: info.valor,
  imageUrl: 'https://via.placeholder.com/100?text=WhatsApp',
  timestamp: new Date().toISOString()
}
```

---

## 🏦 Exemplo 6: Banco + n8n + PWA

### Notificar quando pagamento é recebido:

```
Pagamento entra na conta bancária
    ↓
API do banco envia webhook
    ↓
n8n processa transferência
    ↓
PWA notifica você
    ↓
"Recebeu R$ 5.000 de João Silva"
```

### Setup (Exemplo com Open Banking):

```json
{
  "type": "payment_received",
  "amount": 5000,
  "from": "João Silva",
  "timestamp": "2024-02-15T10:30:00Z"
}
```

---

## 📦 Exemplo 7: WooCommerce + n8n + PWA

### Setup WooCommerce Webhook:

1. Dashboard → Settings → Advanced → Webhooks
2. Add webhook:
   - Event: `Order Created`
   - Delivery URL: `https://seu-n8n.com/webhook/seu-token/woo`

### n8n Transform:
```javascript
const order = $input.first().json;
return {
  cliente: order.billing.first_name + ' ' + order.billing.last_name,
  produto: order.line_items[0].name,
  valor: order.total,
  imageUrl: order.line_items[0].image?.src || 'https://via.placeholder.com/100',
  timestamp: order.date_created
}
```

---

## 📱 Exemplo 8: Instagram + n8n + PWA

### Notificar quando comentário é recebido em post:

```
Cliente comenta no post
    ↓
Instagram Webhook dispara
    ↓
n8n lê comentário
    ↓
Extrai interesse de produto
    ↓
PWA notifica "Lead: João"
```

### Setup:

```json
{
  "messaging": [
    {
      "sender": {
        "id": "123"
      },
      "message": {
        "text": "Quero comprar o Plano Pro"
      }
    }
  ]
}
```

---

## 💰 Exemplo 9: Mercado Pago + n8n + PWA

### Configurar Webhooks:

1. Mercado Pago Dashboard → Webhooks
2. URL: `https://seu-n8n.com/webhook/seu-token/mp`
3. Eventos: `payment.created`, `payment.updated`

### n8n Transform:
```javascript
const payment = $input.first().json.data;
return {
  cliente: payment.payer?.email?.split('@')[0] || 'Cliente MP',
  produto: payment.description || 'Pagamento',
  valor: payment.transaction_amount?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }),
  imageUrl: 'https://via.placeholder.com/100?text=MercadoPago',
  timestamp: payment.date_created
}
```

---

## 🎯 Exemplo 10: Leadpages + n8n + PWA

### Notificar quando novo lead é capturado:

```
Visitante preenche formulário
    ↓
Leadpages envia webhook
    ↓
n8n captura dados
    ↓
PWA notifica "Novo Lead: João - João@email.com"
```

### Payload Esperado:
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "email": "joao@email.com",
  "plan_interest": "Premium"
}
```

---

## 🔧 Configuração Genérica (Template)

Para ANY webhook/API:

```javascript
// 1. Receber dados
const data = $input.first().json;

// 2. Transformar
return {
  cliente: data.customer_name || data.sender || data.buyer,
  produto: data.product_name || data.item || data.service,
  valor: data.amount || data.price || data.value,
  imageUrl: data.image || data.photo || 'https://via.placeholder.com/100',
  timestamp: data.created_at || data.timestamp || new Date().toISOString()
}

// 3. Enviar para PWA via HTTP Request
```

---

## 📊 Fluxo Universal

Qualquer plataforma pode seguir este padrão:

```
┌─────────────────────┐
│  Plataforma A-Z     │
│  (Shopify, Stripe)  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   n8n Webhook       │
│  (Recebe dados)     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Transform Node     │
│  (Processa dados)   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   HTTP Request      │
│  (Envia para PWA)   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   PWA Netlify       │
│  (Notificação!)     │
└─────────────────────┘
```

---

## ✨ Dicas Extras

### 1. Testar Webhook
```bash
# Simular webhook da plataforma
curl -X POST https://seu-n8n.com/webhook/token/caminho \
  -H "Content-Type: application/json" \
  -d '{"cliente": "Teste", "produto": "Teste", "valor": "100"}'
```

### 2. Debugar no n8n
- Adicione node "Log" para ver dados em cada etapa
- Execute e clique em "View Output"

### 3. Filtrar Dados
```javascript
// Só notificar se valor > R$ 1000
if (parseFloat($input.first().json.amount) < 1000) {
  return null; // Não enviar
}
return {...}
```

### 4. Condicional
```javascript
// Diferentes notificações por tipo
const type = $input.first().json.type;

if (type === 'venda') {
  return { cliente, produto, valor, tipo: 'Venda' };
} else if (type === 'devolucao') {
  return { cliente, produto, valor: '-' + valor, tipo: 'Devolução' };
}
```

---

## 🚀 Deploy Rápido

Para qualquer webhook, siga este padrão:

1. **Copie a URL do webhook** da plataforma
2. **Cole em n8n** como base
3. **Use Transform** para formatar dados
4. **HTTP Request** para sua PWA
5. **Teste** com cURL
6. **Done!** ✅

---

**Precisa de outro exemplo?** Siga o padrão genérico acima!

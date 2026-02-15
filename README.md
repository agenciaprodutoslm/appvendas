# 💰 Vendas Alert PWA - Notificações em Tempo Real

Uma Progressive Web App (PWA) para receber notificações de vendas no iPhone e Android com som, imagem personalizada e integração com n8n.

## ✨ Recursos

- ✅ **Notificações Push** - Receba alertas em tempo real
- 🔊 **Som Personalizado** - Áudio web gerado dinamicamente
- 🖼️ **Imagens Customizadas** - Mostra foto do produto/cliente
- 📱 **Instalável** - Funciona como app nativo (iOS, Android)
- 🔗 **Integração n8n** - Conecte com seu workflow
- 📊 **Histórico** - Guarde últimas 50 vendas
- 🌐 **Offline Ready** - Funciona mesmo sem internet
- 🎨 **Design Moderno** - Interface limpa e profissional

## 🚀 Deployment Rápido

### 1. Preparar Arquivos

Clone ou baixe estes 4 arquivos:
```
vendas-alert/
├── index.html          (rename de pwa-vendas.html)
├── service-worker.js
├── manifest.json
└── netlify.toml       (opcional, mas recomendado)
```

### 2. Deploy na Netlify (Método 1: Git)

```bash
# Criar repo no GitHub
git init
git add .
git commit -m "Initial PWA commit"
git branch -M main
git remote add origin https://github.com/SEU-USER/vendas-alert.git
git push -u origin main
```

**No Netlify:**
1. Acesse https://app.netlify.com
2. Clique "New site from Git"
3. Selecione seu repositório
4. Deploy automático! 🎉

### 3. Deploy na Netlify (Método 2: CLI)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer deploy
netlify deploy --prod --dir=.
```

Seu site estará em: **https://seu-site.netlify.app**

### 4. Deploy na Netlify (Método 3: Drag & Drop)

1. Acesse https://app.netlify.com/drop
2. Arraste os 4 arquivos
3. Pronto! 🎉

## 📱 Instalação no Celular

### iPhone (iOS 16.4+)

1. Abra em Safari: `https://seu-site.netlify.app`
2. Toque no ícone compartilhar (canto inferior)
3. Selecione "Add to Home Screen"
4. Toque "Add"

### Android

1. Abra em Chrome: `https://seu-site.netlify.app`
2. Toque nos 3 pontinhos (menu)
3. Selecione "Install app" ou "Adicionar à tela inicial"
4. Confirme

## 🔔 Ativar Notificações

**Dentro da PWA:**

1. Clique no botão **"🔔 Ativar Notificações"**
2. Permita notificações no popup
3. Clique em **"📢 Teste"** para verificar
4. Deve receber uma notificação! ✅

## 🔗 Conectar com n8n

### Configurar n8n

1. **Crie um novo workflow**
2. **Adicione um Webhook trigger:**
   - Method: POST
   - Path: /webhook/vendas
   - Copie a URL completa

3. **Adicione um HTTP Request node:**
   - Method: POST
   - URL: http://localhost:3000 (seu PWA)
   - Body (JSON):
   ```json
   {
     "cliente": "João Silva",
     "produto": "Plano Premium",
     "valor": "2.999,99",
     "imageUrl": "https://link-da-imagem.com/img.jpg"
   }
   ```

4. **Teste disparando o webhook:**
   ```bash
   curl -X POST https://seu-n8n.com/webhook/sua-chave-aleatoria/vendas \
     -H "Content-Type: application/json" \
     -d '{
       "cliente": "Teste",
       "produto": "Teste",
       "valor": "100,00",
       "imageUrl": "https://via.placeholder.com/100"
     }'
   ```

## 💻 Desenvolvimento Local

### Opção 1: Python

```bash
python3 -m http.server 3000
# Acesse http://localhost:3000
```

### Opção 2: Node.js

```bash
npm install -g http-server
http-server -p 3000
# Acesse http://localhost:3000
```

### Opção 3: VS Code

Instale a extensão "Live Server" e clique "Go Live"

## 🧪 Testando

### Teste Local

1. Abra http://localhost:3000
2. Clique "🔔 Ativar Notificações"
3. Use "📢 Teste" para testar notificação
4. Use "Simular Venda" para teste completo

### Teste Webhook

```bash
# Simular venda via webhook
curl -X POST http://localhost:3000/webhook/vendas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "Teste",
    "produto": "Produto Teste",
    "valor": "500,00",
    "imageUrl": "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"><rect fill=\"%2300d4ff\" width=\"200\" height=\"200\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-size=\"80\" fill=\"white\" font-weight=\"bold\" font-family=\"system-ui\">$</text></svg>"
  }'
```

## 🔐 Segurança

### HTTPS (Obrigatório para Notificações)

- ✅ Netlify fornece HTTPS automático
- ✅ Domínio customizado também tem HTTPS grátis
- ⚠️ Localhost é exceção (funciona em desenvolvimento)

### Validar Webhook

Na sua PWA, configure a URL com um token:
```
https://seu-n8n.com/webhook/SEU-TOKEN-SECRETO/vendas
```

## 🛠️ Estrutura de Arquivos

```
project/
├── index.html              # Interface principal
├── service-worker.js       # Background service
├── manifest.json          # Metadados PWA
├── netlify.toml          # Configuração Netlify
├── INTEGRACAO_N8N.md     # Guia detalhado n8n
└── README.md             # Este arquivo
```

## 📊 Dados Armazenados

As notificações são salvas em:
- **localStorage** (até 50 últimas)
- **IndexedDB** (se disponível, mais espaço)

Para verificar no console:
```javascript
JSON.parse(localStorage.getItem('notifications'))
```

Para limpar:
```javascript
localStorage.removeItem('notifications')
```

## 🐛 Troubleshooting

### "Notificação não aparece no iPhone"

**Solução:**
- ✅ Instale como PWA (Add to Home Screen)
- ✅ Ative notificações nas permissões
- ✅ Mantenha Safari aberto (ou 5 min em background)
- ✅ Verifique som/vibração nas configurações do iPhone

### "Service Worker não registra"

**Solução:**
```javascript
// Console do navegador (F12)
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log('Service Workers:', regs))
```

### "Webhook não dispara"

**Solução:**
1. Verificar URL no console do navegador
2. Testar com cURL (ver comando acima)
3. Checar logs no n8n

### "Imagem não aparece na notificação"

**Solução:**
- Use HTTPS (não HTTP)
- Tamanho máximo: 256KB
- Formato: PNG/JPG recomendado
- Testar CORS: `curl -i https://imagem.com/img.jpg`

## 📈 Próximas Melhorias

- [ ] Dashboard com gráficos
- [ ] Integração com Stripe/Mercado Pago
- [ ] Notificações com som customizado
- [ ] Firebase para dados na nuvem
- [ ] Sincronização entre dispositivos
- [ ] Categorias/filtros de vendas

## 📚 Documentação

- [MDN Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [n8n Webhooks](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base-webhook/)
- [Netlify Docs](https://docs.netlify.com/)

## 💬 Suporte

**Erro de código?**
- Abra o console (F12) e procure mensagens vermelhas
- Service Worker: DevTools → Application → Service Workers

**Erro de deployment?**
- Verifique build logs no Netlify
- Todos os 4 arquivos precisam estar na raiz

**Erro de notificação?**
- Permissões do navegador
- HTTPS ativado
- Service Worker registrado

## 📄 Licença

Livre para usar, modificar e distribuir. Créditos são apreciados! 

---

**Desenvolvido com ❤️ para vendedores**

Precisa de customizações? Entre em contato!

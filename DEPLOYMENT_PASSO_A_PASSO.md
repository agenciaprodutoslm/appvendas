# 🚀 Deployment Passo a Passo - PWA Vendas Alert

## Pré-requisitos

- [ ] Conta GitHub (gratuita em https://github.com)
- [ ] Conta Netlify (gratuita em https://netlify.com)

## ⏱️ Tempo Total: ~5 minutos

---

## PASSO 1: Preparar Arquivos

### 1.1 Renomear arquivo HTML
Renomeie `pwa-vendas.html` para **`index.html`**

### 1.2 Estrutura Final

```
seu-projeto/
├── index.html              ← (renomeado de pwa-vendas.html)
├── service-worker.js
├── manifest.json
├── netlify.toml           ← (opcional, mas recomendado)
├── README.md
└── INTEGRACAO_N8N.md
```

---

## PASSO 2: Criar Repositório GitHub

### 2.1 Criar novo repositório

1. Acesse https://github.com/new
2. Nome: `vendas-alert-pwa` (ou seu nome preferido)
3. Descrição: `Progressive Web App para notificações de vendas`
4. Deixe PUBLIC (mais fácil para Netlify)
5. Clique "Create repository"

### 2.2 Upload dos arquivos

**Opção A - Via GitHub Web Interface (Mais Fácil):**

1. Na página do repositório, clique "Add file" → "Upload files"
2. Arraste os 6 arquivos para a caixa
3. Clique "Commit changes"

**Opção B - Via Git CLI (Terminal):**

```bash
# Na pasta do projeto
git init
git add .
git commit -m "Initial commit: PWA Vendas Alert"
git branch -M main
git remote add origin https://github.com/SEU-USERNAME/vendas-alert-pwa.git
git push -u origin main
```

✅ **Status:** Repositório pronto!

---

## PASSO 3: Deploy na Netlify

### 3.1 Conectar GitHub

1. Acesse https://app.netlify.com
2. Clique "New site from Git"
3. Clique "GitHub"
4. Selecione seu repositório `vendas-alert-pwa`

### 3.2 Configurar Deploy

Na próxima tela:
- **Build command:** Deixe em branco (ou `echo 'PWA pronta!'`)
- **Publish directory:** `.` (ponto)
- Clique "Deploy site"

⏳ **Aguarde ~1 minuto** enquanto Netlify faz o deploy

### 3.3 Obter URL

Quando terminar, você verá:
```
https://random-name-12345.netlify.app
```

Esta é sua **URL pública**! 

(Opcional: customize o nome em Site Settings → General → Change site name)

✅ **Status:** PWA está online!

---

## PASSO 4: Testar a PWA

### 4.1 Testar no Navegador

1. Abra https://seu-site.netlify.app
2. Veja a interface carregando
3. Clique "🔔 Ativar Notificações"
4. Permita notificações no popup
5. Clique "📢 Teste"
6. Deve receber uma notificação! ✅

### 4.2 Testar "Simular Venda"

1. Na seção "Simular Venda", preencha:
   - Valor: `2.999,99`
   - Cliente: `Seu Nome`
   - Produto: `Teste`
   - Imagem: deixe como está

2. Clique "🎯 Simular Venda"
3. Verifique o histórico abaixo
4. Deve aparecer na lista! ✅

### 4.3 Instalar no Celular

#### iPhone:
1. Abra em Safari: `https://seu-site.netlify.app`
2. Toque compartilhar (parte inferior)
3. "Add to Home Screen"
4. Confirme

#### Android:
1. Abra em Chrome: `https://seu-site.netlify.app`
2. Menu (3 pontinhos)
3. "Install app"
4. Confirme

✅ **Status:** App instalado!

---

## PASSO 5: Integrar com n8n

### 5.1 Copiar URL da PWA

Sua URL: `https://seu-site.netlify.app`

### 5.2 Colar na PWA

1. Abra sua PWA em `https://seu-site.netlify.app`
2. Na seção "Configuração", no campo "URL do Webhook n8n:"
3. Cole: `https://seu-n8n.com/webhook/sua-chave-aleatoria/vendas`

(Se não tiver n8n configurado ainda, veja seção "Como Configurar n8n" abaixo)

### 5.3 Testar Webhook

```bash
curl -X POST https://seu-n8n.com/webhook/sua-chave-aleatoria/vendas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "Teste Webhook",
    "produto": "Produto Teste",
    "valor": "1.000,00",
    "imageUrl": "https://via.placeholder.com/100"
  }'
```

✅ **Status:** Webhook conectado!

---

## Como Configurar n8n

### Se ainda não tiver n8n rodando:

1. **Docker (mais fácil):**
   ```bash
   docker run -it --rm -p 5678:5678 n8nio/n8n
   ```
   Acesse: http://localhost:5678

2. **Ou instalação local:**
   ```bash
   npm install -g n8n
   n8n start
   ```

### Criar Workflow:

1. Novo Workflow
2. Adicionar nó **Webhook**
3. Method: POST
4. Path: `/webhook/vendas`
5. Copie a URL completa (ex: `https://seu-n8n.com/webhook/abc123def/vendas`)
6. **Salve** no seu PWA na configuração

Documentação completa: Ver `INTEGRACAO_N8N.md`

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] 6 arquivos no repositório (index.html, service-worker.js, etc)
- [ ] Deploy na Netlify concluído
- [ ] URL pública acessível
- [ ] Notificações ativadas no navegador
- [ ] Teste local funcionando
- [ ] App instalado no celular
- [ ] Webhook n8n configurado (opcional)

---

## 🎯 Próximos Passos

### Após tudo funcionando:

1. **Customizar:**
   - Alterar cores em `index.html` (variáveis CSS)
   - Adicionar seu logo em `manifest.json`

2. **Integrar com n8n:**
   - Criar workflow para seu CRM/ecommerce
   - Dispara notificação quando venda é feita

3. **Melhorias:**
   - Adicionar filtros/categorias
   - Dashboard com gráficos
   - Notificação som customizado

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Cannot GET /" | Verifique se `index.html` está na raiz |
| Notificações não aparecem | Clique "Ativar Notificações" primeiro |
| Service Worker não funciona | Deve estar em HTTPS (Netlify fornece) |
| Webhook não funciona | Verifique URL em "Configuração" |
| Erro de CORS | Imagens devem estar em HTTPS |

---

## 📞 Suporte

**Dúvidas sobre Netlify?**
- Docs: https://docs.netlify.com

**Dúvidas sobre n8n?**
- Docs: https://docs.n8n.io
- Community: https://community.n8n.io

**Erros no console?**
- Pressione F12
- Abra aba "Console"
- Procure mensagens em vermelho

---

## 🎉 Parabéns!

Sua PWA está online e recebendo notificações em tempo real! 

**Próximo:** Configure o webhook n8n para começar a receber vendas reais.

---

**Versão:** 1.0  
**Data:** Feb 2026  
**Tempo de Setup:** ~5-10 minutos

// .netlify/functions/webhook.js
// Copie este arquivo para .netlify/functions/webhook.js no seu projeto

exports.handler = async (event, context) => {
  // Headers CORS para aceitar requisições de qualquer origem
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Aceitar requisições OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  // GET (para teste)
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Webhook está funcionando! Use POST para enviar notificações.',
        endpoint: '/.netlify/functions/webhook',
        method: 'POST',
      }),
    };
  }

  // Se não for POST, retorna erro
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed. Use POST.' 
      }),
    };
  }

  try {
    // Parser do body JSON
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Body inválido. Deve ser JSON válido.',
          received: event.body,
        }),
      };
    }

    console.log('📬 Webhook recebido:', JSON.stringify(data, null, 2));

    // Validar campos obrigatórios
    const requiredFields = ['cliente', 'produto', 'valor'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Faltam campos obrigatórios',
          required: requiredFields,
          missing: missingFields,
          received: Object.keys(data),
        }),
      };
    }

    // ===== AQUI VOCÊ PODE ADICIONAR LÓGICA =====
    // Exemplos:
    
    // 1. Registrar em log
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Nova venda: ${data.cliente} - R$ ${data.valor}`);

    // 2. Validar valor (exemplo)
    const valor = parseFloat(String(data.valor).replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Valor inválido. Deve ser um número positivo.',
          received: data.valor,
        }),
      };
    }

    // 3. Preparar resposta com dados processados
    const responseData = {
      success: true,
      message: 'Notificação recebida e processada com sucesso',
      data: {
        cliente: data.cliente,
        produto: data.produto,
        valor: valor,
        imageUrl: data.imageUrl || null,
        timestamp: timestamp,
        processed: true,
      },
    };

    // ===== FUTURO: Integrar com banco de dados =====
    // Você pode adicionar:
    // - Salvar em Supabase
    // - Salvar em Firebase
    // - Enviar email
    // - Registrar em planilha Google
    // etc...

    console.log('✅ Webhook processado com sucesso');

    // Retornar sucesso com dados processados
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Erro ao processar webhook',
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

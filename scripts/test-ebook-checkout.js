// Usando fetch nativo do Node.js 18+

async function testEbookCheckout() {
  try {
    console.log('🧪 Testando função create-ebook-checkout...');
    
    const response = await fetch('http://localhost:8888/.netlify/functions/create-ebook-checkout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        customerEmail: 'teste@exemplo.com',
        customerName: 'João Teste'
      })
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers da resposta:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('📄 Resposta bruta:', responseText);
    
    if (responseText) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ JSON válido:', data);
      } catch (jsonError) {
        console.error('❌ Erro ao parsear JSON:', jsonError.message);
        console.log('🔍 Primeiros 200 caracteres:', responseText.substring(0, 200));
      }
    } else {
      console.error('❌ Resposta vazia!');
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testEbookCheckout();
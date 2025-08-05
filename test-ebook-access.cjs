const https = require('https');
const http = require('http');

async function testEbookAccess() {
  console.log('🔍 TESTE DE ACESSO AO EBOOK');
  console.log('============================\n');

  const sessionId = 'cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM';
  
  // Test 1: Test production function
  console.log('1. 🌐 Testando function de produção...');
  await testFunction('https://erdbeergourmet.ch/.netlify/functions/get-ebook-access', sessionId, 'PRODUÇÃO');
  
  // Test 2: Test local function (if running)
  console.log('\n2. 🏠 Testando function local...');
  await testFunction('http://localhost:8888/.netlify/functions/get-ebook-access', sessionId, 'LOCAL');
  
  // Test 3: Test with different methods
  console.log('\n3. 🔄 Testando diferentes métodos...');
  await testWithDifferentMethods(sessionId);
}

function testFunction(url, sessionId, environment) {
  return new Promise((resolve) => {
    const fullUrl = `${url}?session_id=${sessionId}`;
    console.log(`   🎯 Testando ${environment}: ${fullUrl}`);
    
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   📊 Status: ${res.statusCode}`);
        console.log(`   📋 Headers:`, res.headers);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`   📄 Response:`, JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log(`   📄 Response (raw):`, data);
        }
        
        if (res.statusCode === 200) {
          console.log(`   ✅ ${environment}: SUCCESS!`);
        } else if (res.statusCode === 400) {
          console.log(`   ❌ ${environment}: Access not yet granted (400)`);
        } else if (res.statusCode === 404) {
          console.log(`   ❌ ${environment}: Purchase not found (404)`);
        } else {
          console.log(`   ⚠️  ${environment}: Unexpected status ${res.statusCode}`);
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ${environment}: Connection error - ${error.message}`);
      resolve();
    });
    
    req.setTimeout(10000, () => {
      console.log(`   ⏰ ${environment}: Timeout after 10s`);
      req.destroy();
      resolve();
    });
  });
}

async function testWithDifferentMethods(sessionId) {
  const baseUrl = 'https://erdbeergourmet.ch/.netlify/functions/get-ebook-access';
  
  // Test POST method
  console.log('   🔄 Testando método POST...');
  await testPostMethod(baseUrl, sessionId);
  
  // Test with token parameter
  console.log('   🔄 Testando com parâmetro token...');
  await testFunction(`${baseUrl}?token=${sessionId}`, '', 'TOKEN_PARAM');
}

function testPostMethod(url, sessionId) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ session_id: sessionId });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   📊 POST Status: ${res.statusCode}`);
        try {
          const jsonData = JSON.parse(data);
          console.log(`   📄 POST Response:`, JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log(`   📄 POST Response (raw):`, data);
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ POST Error: ${error.message}`);
      resolve();
    });
    
    req.write(postData);
    req.end();
  });
}

// Run the test
testEbookAccess().catch(console.error);
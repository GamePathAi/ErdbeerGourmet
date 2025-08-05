const { execSync } = require('child_process');

// Get environment variables from Netlify
function getNetlifyEnv(varName) {
  try {
    const result = execSync(`netlify env:get ${varName}`, { encoding: 'utf8' }).trim();
    return result;
  } catch (error) {
    console.error(`❌ Erro ao obter ${varName}:`, error.message);
    return null;
  }
}

console.log('🔍 VERIFICANDO TABELA CUSTOMERS');
console.log('==============================');

const SUPABASE_URL = getNetlifyEnv('VITE_SUPABASE_URL');
const SUPABASE_SERVICE_KEY = getNetlifyEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis do Supabase não configuradas');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkCustomersTable() {
  try {
    console.log('\n1. 🔍 Verificando tabela customers...');
    
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5);
    
    if (customersError) {
      console.error('❌ Erro ao consultar tabela customers:', customersError);
    } else {
      console.log('✅ Tabela customers encontrada');
      console.log('📊 Número de customers:', customers.length);
      
      if (customers.length > 0) {
        console.log('📋 Exemplo de customer:', customers[0]);
        
        // Usar o primeiro customer para teste
        const testCustomerId = customers[0].id;
        console.log('\n2. 🧪 Testando inserção com customer existente...');
        
        const testData = {
          stripe_session_id: 'test_' + Date.now(),
          customer_id: testCustomerId,
          amount_cents: 2900,
          currency: 'EUR',
          status: 'pending',
          created_at: new Date().toISOString()
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('ebook_purchases')
          .insert(testData)
          .select();
        
        if (insertError) {
          console.error('❌ Erro ao inserir com customer existente:', insertError);
        } else {
          console.log('✅ Inserção funcionou com customer existente:', insertData[0]);
          
          // Limpar o registro de teste
          await supabase
            .from('ebook_purchases')
            .delete()
            .eq('id', insertData[0].id);
          
          console.log('🧹 Registro de teste removido');
        }
      } else {
        console.log('⚠️ Nenhum customer encontrado na tabela');
        
        console.log('\n2. 🆕 Criando customer de teste...');
        
        const newCustomer = {
          email: 'test@erdbeergourmet.com',
          name: 'Test Customer',
          created_at: new Date().toISOString()
        };
        
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert(newCustomer)
          .select();
        
        if (customerError) {
          console.error('❌ Erro ao criar customer:', customerError);
        } else {
          console.log('✅ Customer criado:', customerData[0]);
          
          // Testar inserção com o novo customer
          const testData = {
            stripe_session_id: 'test_' + Date.now(),
            customer_id: customerData[0].id,
            amount_cents: 2900,
            currency: 'EUR',
            status: 'pending',
            created_at: new Date().toISOString()
          };
          
          const { data: insertData, error: insertError } = await supabase
            .from('ebook_purchases')
            .insert(testData)
            .select();
          
          if (insertError) {
            console.error('❌ Erro ao inserir com novo customer:', insertError);
          } else {
            console.log('✅ Inserção funcionou com novo customer:', insertData[0]);
            
            // Limpar os registros de teste
            await supabase
              .from('ebook_purchases')
              .delete()
              .eq('id', insertData[0].id);
            
            await supabase
              .from('customers')
              .delete()
              .eq('id', customerData[0].id);
            
            console.log('🧹 Registros de teste removidos');
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message);
  }
}

checkCustomersTable();
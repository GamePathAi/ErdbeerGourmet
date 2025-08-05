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

console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA');
console.log('=================================');

const SUPABASE_URL = getNetlifyEnv('VITE_SUPABASE_URL');
const SUPABASE_SERVICE_KEY = getNetlifyEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis do Supabase não configuradas');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkTableStructure() {
  try {
    console.log('\n1. 🔍 Verificando estrutura da tabela ebook_purchases...');
    
    // Tentar fazer uma consulta simples para ver a estrutura
    const { data, error } = await supabase
      .from('ebook_purchases')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao consultar tabela:', error);
      
      // Tentar verificar se a tabela existe
      console.log('\n2. 🔍 Verificando se a tabela existe...');
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_table_info', { table_name: 'ebook_purchases' })
        .catch(() => null);
      
      if (tablesError) {
        console.log('⚠️ Não foi possível verificar a estrutura da tabela');
      }
    } else {
      console.log('✅ Tabela ebook_purchases encontrada');
      console.log('📊 Dados de exemplo:', data);
    }
    
    console.log('\n3. 🔍 Tentando inserir um registro de teste simples...');
    
    // Tentar inserir com campos básicos
    const testData = {
      stripe_session_id: 'test_' + Date.now(),
      customer_email: 'test@example.com',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('ebook_purchases')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir registro de teste:', insertError);
      console.log('\n📋 Campos que podem estar faltando:');
      console.log('   - amount (decimal)');
      console.log('   - currency (text)');
      console.log('   - ebook_id (text)');
      
      // Tentar inserir apenas com campos obrigatórios
      console.log('\n4. 🔍 Tentando inserir apenas com campos básicos...');
      
      const basicData = {
        stripe_session_id: 'test_basic_' + Date.now(),
        customer_email: 'test@example.com',
        status: 'pending'
      };
      
      const { data: basicInsert, error: basicError } = await supabase
        .from('ebook_purchases')
        .insert(basicData)
        .select();
      
      if (basicError) {
        console.error('❌ Erro mesmo com campos básicos:', basicError);
      } else {
        console.log('✅ Inserção básica funcionou:', basicInsert[0]);
        
        // Limpar o registro de teste
        await supabase
          .from('ebook_purchases')
          .delete()
          .eq('id', basicInsert[0].id);
        
        console.log('🧹 Registro de teste removido');
      }
    } else {
      console.log('✅ Inserção de teste funcionou:', insertData[0]);
      
      // Limpar o registro de teste
      await supabase
        .from('ebook_purchases')
        .delete()
        .eq('id', insertData[0].id);
      
      console.log('🧹 Registro de teste removido');
    }
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message);
  }
}

checkTableStructure();
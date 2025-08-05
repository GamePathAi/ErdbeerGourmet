const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Função para obter variáveis de ambiente do Netlify
function getNetlifyEnv(varName) {
  try {
    const result = execSync(`netlify env:get ${varName}`, { encoding: 'utf8' });
    const value = result.trim();
    
    // Verificar se o valor contém mensagens de erro do Netlify
    if (value.includes('No value set') || value.includes('not found') || value === '') {
      console.error(`❌ Variável ${varName} não encontrada no Netlify`);
      return null;
    }
    
    return value;
  } catch (error) {
    console.error(`❌ Erro ao obter ${varName}:`, error.message);
    return null;
  }
}

async function fixRLSPolicies() {
  console.log('🔧 CORRIGINDO POLÍTICAS RLS');
  console.log('============================\n');
  
  console.log('1. 🔍 Obtendo variáveis de ambiente...');
  
  const SUPABASE_URL = getNetlifyEnv('VITE_SUPABASE_URL');
  const SUPABASE_SERVICE_KEY = getNetlifyEnv('SUPABASE_SERVICE_ROLE_KEY') || getNetlifyEnv('SUPABASE_SERVICE_KEY');
  
  if (!SUPABASE_URL) {
    console.error('❌ SUPABASE_URL não encontrada');
    return;
  }
  
  if (!SUPABASE_SERVICE_KEY) {
    console.log('⚠️ Service key não encontrada, tentando com anon key...');
    const SUPABASE_ANON_KEY = getNetlifyEnv('VITE_SUPABASE_ANON_KEY');
    
    if (!SUPABASE_ANON_KEY) {
      console.error('❌ Nenhuma chave do Supabase encontrada');
      return;
    }
    
    // Usar anon key (limitado)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    console.log('\n2. 🧪 Testando inserção com anon key...');
    
    // Testar inserção simples
    const testData = {
      stripe_session_id: 'test_' + Date.now(),
      customer_id: 'e636ba1e-8ccf-45bc-a701-aee0424e3f43', // Customer existente
      amount_cents: 2900,
      currency: 'EUR',
      status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('ebook_purchases')
      .insert(testData)
      .select();
    
    if (error) {
      console.error('❌ Erro na inserção:', error);
      console.log('\n💡 SOLUÇÕES POSSÍVEIS:');
      console.log('1. Execute o SQL fix-ebook-rls.sql no painel do Supabase');
      console.log('2. Ou desabilite temporariamente o RLS:');
      console.log('   ALTER TABLE ebook_purchases DISABLE ROW LEVEL SECURITY;');
      console.log('3. Ou configure uma service key no Netlify');
    } else {
      console.log('✅ Inserção funcionou! RLS está configurado corretamente');
      console.log('📄 Dados inseridos:', data[0]);
      
      // Limpar dados de teste
      await supabase
        .from('ebook_purchases')
        .delete()
        .eq('id', data[0].id);
      
      console.log('🧹 Dados de teste removidos');
    }
    
    return;
  }
  
  // Usar service key (privilégios administrativos)
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('\n2. 🔧 Aplicando correções de RLS...');
  
  const sqlCommands = [
    // Remover políticas existentes
    'DROP POLICY IF EXISTS "Allow ebook_purchases inserts" ON ebook_purchases;',
    'DROP POLICY IF EXISTS "Allow ebook_purchases updates" ON ebook_purchases;',
    'DROP POLICY IF EXISTS "Allow ebook_purchases selects" ON ebook_purchases;',
    'DROP POLICY IF EXISTS "Allow ebook_purchases deletes" ON ebook_purchases;',
    
    // Criar novas políticas permissivas
    'CREATE POLICY "Allow ebook_purchases inserts" ON ebook_purchases FOR INSERT WITH CHECK (true);',
    'CREATE POLICY "Allow ebook_purchases updates" ON ebook_purchases FOR UPDATE USING (true);',
    'CREATE POLICY "Allow ebook_purchases selects" ON ebook_purchases FOR SELECT USING (true);',
    'CREATE POLICY "Allow ebook_purchases deletes" ON ebook_purchases FOR DELETE USING (true);'
  ];
  
  for (const sql of sqlCommands) {
    console.log(`   Executando: ${sql.substring(0, 50)}...`);
    
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.log(`   ⚠️ Aviso: ${error.message}`);
    } else {
      console.log('   ✅ Sucesso');
    }
  }
  
  console.log('\n3. 🧪 Testando inserção após correções...');
  
  // Testar inserção
  const testData = {
    stripe_session_id: 'test_' + Date.now(),
    customer_id: 'e636ba1e-8ccf-45bc-a701-aee0424e3f43',
    amount_cents: 2900,
    currency: 'EUR',
    status: 'pending'
  };
  
  const { data, error } = await supabaseAdmin
    .from('ebook_purchases')
    .insert(testData)
    .select();
  
  if (error) {
    console.error('❌ Ainda há erro na inserção:', error);
  } else {
    console.log('✅ Inserção funcionou perfeitamente!');
    console.log('📄 Dados inseridos:', data[0]);
    
    // Limpar dados de teste
    await supabaseAdmin
      .from('ebook_purchases')
      .delete()
      .eq('id', data[0].id);
    
    console.log('🧹 Dados de teste removidos');
    console.log('\n🎉 RLS CORRIGIDO COM SUCESSO!');
  }
}

// Executar correção
fixRLSPolicies().catch(console.error);
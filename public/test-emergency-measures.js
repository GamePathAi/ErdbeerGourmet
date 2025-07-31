// 🔍 SCRIPT DE TESTE FINAL - VERIFICAÇÃO COMPLETA DAS MEDIDAS DE EMERGÊNCIA
// Execute este script no console do navegador para verificar se tudo está funcionando

console.log('🚀 INICIANDO VERIFICAÇÃO FINAL DAS MEDIDAS DE EMERGÊNCIA...');
console.log('=' .repeat(60));

// ✅ TESTE 1: Verificar se script de emergência está ativo
console.log('\n📋 TESTE 1: Script de Emergência');
if (typeof window.emergencyCleanupActive !== 'undefined') {
    console.log('✅ Script de emergência carregado:', window.emergencyCleanupActive);
} else {
    console.log('❌ Script de emergência NÃO encontrado');
}

// ✅ TESTE 2: Verificar se conteúdo problemático ainda existe
console.log('\n📋 TESTE 2: Busca por Conteúdo Problemático');
const problematicPhrases = [
    'Pronto para provar',
    'desejado da Suíça',
    'CHF',
    'Erdbeere'
];

let foundProblematic = false;
document.querySelectorAll('*').forEach(el => {
    problematicPhrases.forEach(phrase => {
        if (el.textContent && el.textContent.includes(phrase)) {
            console.error('❌ CONTEÚDO PROBLEMÁTICO ENCONTRADO:', phrase, el);
            foundProblematic = true;
        }
    });
});

if (!foundProblematic) {
    console.log('✅ Nenhum conteúdo problemático encontrado');
}

// ✅ TESTE 3: Verificar se classes problemáticas foram removidas
console.log('\n📋 TESTE 3: Classes Problemáticas');
const productCards = document.querySelectorAll('.product-card');
const productGrids = document.querySelectorAll('.product-grid');
const pricingSections = document.querySelectorAll('.pricing-section');

console.log('Product cards encontrados:', productCards.length);
console.log('Product grids encontrados:', productGrids.length);
console.log('Pricing sections encontrados:', pricingSections.length);

if (productCards.length === 0 && productGrids.length === 0 && pricingSections.length === 0) {
    console.log('✅ Todas as classes problemáticas foram removidas');
} else {
    console.log('❌ Algumas classes problemáticas ainda existem');
}

// ✅ TESTE 4: Verificar estrutura do DOM
console.log('\n📋 TESTE 4: Estrutura do DOM');
const sections = document.querySelectorAll('section');
console.log('Total de seções encontradas:', sections.length);
sections.forEach((section, index) => {
    const id = section.id || 'sem-id';
    const classes = section.className || 'sem-classes';
    console.log(`Seção ${index + 1}: ID="${id}", Classes="${classes}"`);
});

// ✅ TESTE 5: Verificar se PricingSection foi desabilitado
console.log('\n📋 TESTE 5: PricingSection');
const pricingSection = document.querySelector('#precos');
if (!pricingSection) {
    console.log('✅ PricingSection foi completamente removido (retorna null)');
} else {
    console.log('❌ PricingSection ainda existe:', pricingSection);
}

// ✅ TESTE 6: Verificar CSS de emergência
console.log('\n📋 TESTE 6: CSS de Emergência');
const testElement = document.createElement('div');
testElement.textContent = 'Pronto para provar';
testElement.className = 'product-card';
document.body.appendChild(testElement);

const computedStyle = window.getComputedStyle(testElement);
const isHidden = computedStyle.display === 'none' || computedStyle.visibility === 'hidden';

if (isHidden) {
    console.log('✅ CSS de emergência está funcionando');
} else {
    console.log('❌ CSS de emergência NÃO está funcionando');
}

// Remover elemento de teste
document.body.removeChild(testElement);

// 📊 RESUMO FINAL
console.log('\n' + '=' .repeat(60));
console.log('📊 RESUMO FINAL DA VERIFICAÇÃO');
console.log('=' .repeat(60));

const allTestsPassed = 
    typeof window.emergencyCleanupActive !== 'undefined' &&
    !foundProblematic &&
    productCards.length === 0 &&
    productGrids.length === 0 &&
    pricingSections.length === 0 &&
    !pricingSection &&
    isHidden;

if (allTestsPassed) {
    console.log('🎉 TODOS OS TESTES PASSARAM! MEDIDAS DE EMERGÊNCIA FUNCIONANDO PERFEITAMENTE!');
    console.log('✅ Site está protegido contra conteúdo problemático');
    console.log('✅ Pronto para deploy em produção');
} else {
    console.log('⚠️ ALGUNS TESTES FALHARAM - REVISAR IMPLEMENTAÇÃO');
}

console.log('\n🔗 Para mais testes, execute:');
console.log('- Teste em modo incógnito');
console.log('- Teste em diferentes navegadores');
console.log('- Teste com cache limpo');
console.log('- Teste em dispositivos móveis');

console.log('\n✅ VERIFICAÇÃO CONCLUÍDA!');
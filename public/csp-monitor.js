/**
 * CSP Violation Monitor
 * Monitora violações de Content Security Policy e reporta para análise
 */

// Monitor de violações CSP
document.addEventListener('securitypolicyviolation', (event) => {
  const violation = {
    timestamp: new Date().toISOString(),
    violatedDirective: event.violatedDirective,
    blockedURI: event.blockedURI,
    originalPolicy: event.originalPolicy,
    sourceFile: event.sourceFile,
    lineNumber: event.lineNumber,
    columnNumber: event.columnNumber,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log no console para desenvolvimento
  console.warn('🚨 CSP Violation Detected:', {
    directive: violation.violatedDirective,
    blocked: violation.blockedURI,
    source: violation.sourceFile,
    line: violation.lineNumber
  });

  // Armazenar localmente para análise
  const violations = JSON.parse(localStorage.getItem('csp-violations') || '[]');
  violations.push(violation);
  
  // Manter apenas as últimas 50 violações
  if (violations.length > 50) {
    violations.splice(0, violations.length - 50);
  }
  
  localStorage.setItem('csp-violations', JSON.stringify(violations));

  // Opcional: Enviar para serviço de analytics
  // sendToAnalytics(violation);
});

// Função para visualizar violações no console
window.showCSPViolations = () => {
  const violations = JSON.parse(localStorage.getItem('csp-violations') || '[]');
  console.table(violations);
  return violations;
};

// Função para limpar histórico de violações
window.clearCSPViolations = () => {
  localStorage.removeItem('csp-violations');
  console.log('✅ CSP violations history cleared');
};

// Função para exportar violações
window.exportCSPViolations = () => {
  const violations = JSON.parse(localStorage.getItem('csp-violations') || '[]');
  const blob = new Blob([JSON.stringify(violations, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `csp-violations-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Opcional: Função para enviar para analytics
function sendToAnalytics(violation) {
  // Implementar integração com Google Analytics, Sentry, etc.
  // Exemplo com fetch:
  /*
  fetch('/api/csp-violation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(violation)
  }).catch(err => console.error('Failed to report CSP violation:', err));
  */
}

// Log de inicialização
console.log('🛡️ CSP Monitor initialized. Use showCSPViolations() to view violations.');
import React from 'react';

export default function TestEbook() {
  console.log('TestEbook component rendering...');
  
  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ color: '#28a745', marginBottom: '20px' }}>🍓 Teste E-book</h1>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>Se você está vendo esta mensagem, o React Router está funcionando!</p>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2>Diagnóstico da Rota /ebook</h2>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>✅ React Router funcionando</li>
          <li>✅ Componente renderizando</li>
          <li>✅ Estilos aplicados</li>
          <li>✅ JavaScript executando</li>
        </ul>
      </div>
    </div>
  );
}
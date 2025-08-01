import React from 'react';

function SimpleTest() {
  console.log('SimpleTest component rendered');
  
  return React.createElement('div', {
    style: { 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      margin: '20px',
      border: '2px solid #333'
    }
  }, [
    React.createElement('h1', { key: 'title' }, '🚀 TESTE SIMPLES FUNCIONANDO!'),
    React.createElement('p', { key: 'desc' }, 'Este é um teste básico sem JSX complexo.'),
    React.createElement('p', { key: 'url' }, `URL: ${window.location.href}`),
    React.createElement('button', {
      key: 'btn',
      onClick: () => alert('Botão funcionando!'),
      style: { padding: '10px', margin: '10px', fontSize: '16px' }
    }, 'Clique aqui para testar')
  ]);
}

export default SimpleTest;
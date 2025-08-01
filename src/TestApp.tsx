import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🍓 Test App Funcionando!</h1>
      <p>Se você está vendo isso, o React está carregando corretamente.</p>
      <p>URL atual: {window.location.pathname}</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h2>Informações de Debug:</h2>
        <ul>
          <li>React: ✅ Funcionando</li>
          <li>TypeScript: ✅ Funcionando</li>
          <li>Vite: ✅ Funcionando</li>
        </ul>
      </div>
    </div>
  );
}

export default TestApp;
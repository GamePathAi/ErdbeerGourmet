import React from 'react';
import MorangoGourmetLanding from './components/MorangoGourmetLanding.jsx';

function SimpleApp() {
  console.log('SimpleApp rendering...');
  
  return (
    <div className="App">
      <div style={{ padding: '20px', background: '#f0f0f0', margin: '10px' }}>
        <h1>🍓 App Simplificado Carregado</h1>
        <p>Testando sem React Router...</p>
      </div>
      <MorangoGourmetLanding />
    </div>
  );
}

export default SimpleApp;
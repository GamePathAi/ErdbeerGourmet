import React, { useState, useEffect } from 'react';

const EbookWrapper: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [MorangoComponent, setMorangoComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    console.log('EbookWrapper: Iniciando carregamento do componente...');
    
    const loadComponent = async () => {
      try {
        console.log('EbookWrapper: Tentando importar MorangoGourmetLanding...');
        
        // Importação dinâmica para capturar erros
        const module = await import('./MorangoGourmetLanding.jsx');
        console.log('EbookWrapper: Componente importado com sucesso:', module);
        
        setMorangoComponent(() => module.default);
        setIsLoading(false);
        console.log('EbookWrapper: Componente carregado e pronto para renderizar');
        
      } catch (error) {
        console.error('EbookWrapper: Erro ao carregar componente:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadComponent();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#f8f9fa',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h2>🍓 Carregando E-book...</h2>
          <p>Aguarde enquanto preparamos o conteúdo para você.</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#856404' }}>⚠️ Erro ao Carregar E-book</h2>
        <p>Ocorreu um problema ao carregar o componente. Verifique o console para mais detalhes.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!MorangoComponent) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#721c24' }}>❌ Componente Não Encontrado</h2>
        <p>O componente MorangoGourmetLanding não pôde ser carregado.</p>
      </div>
    );
  }

  console.log('EbookWrapper: Renderizando componente MorangoGourmetLanding');
  
  try {
    return <MorangoComponent />;
  } catch (renderError) {
    console.error('EbookWrapper: Erro durante renderização:', renderError);
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#721c24' }}>❌ Erro de Renderização</h2>
        <p>Erro ao renderizar o componente: {renderError instanceof Error ? renderError.message : 'Erro desconhecido'}</p>
        <details style={{ marginTop: '20px', textAlign: 'left' }}>
          <summary>Detalhes do Erro</summary>
          <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {renderError instanceof Error ? renderError.stack : JSON.stringify(renderError, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
};

export default EbookWrapper;
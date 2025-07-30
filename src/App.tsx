import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import HeroSection3D from './components/HeroSection3D';
import AboutSection from './components/AboutSection';
import ProductGallery from './components/ProductGallery';
import PricingSection from './components/PricingSection';
import CareSection from './components/CareSection';
import ContactSection from './components/ContactSection';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { CheckoutCancel } from './components/CheckoutCancel';
import CartPage from './components/CartPage';
import Footer from './components/Footer';
import './styles.css';

// Error Boundary para debugging
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Algo deu errado: {this.state.error?.message}</h1>
          <p>Verifique o console para mais detalhes.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const HomePage: React.FC = () => {
  return (
    <>
      <ErrorBoundary>
        <Navigation />
      </ErrorBoundary>
      <main>
        <ErrorBoundary>
          <HeroSection3D />
        </ErrorBoundary>
        <ErrorBoundary>
          <AboutSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <ProductGallery />
        </ErrorBoundary>
        <ErrorBoundary>
          <PricingSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <CareSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <ContactSection />
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </>
  );
};

// Teste 1: App mínimo
const AppMinimal: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>App funcionando!</h1>
      <p>Se você vê esta mensagem, o React está renderizando corretamente.</p>
    </div>
  );
};

// Teste 2: Com Router
const AppWithRouter: React.FC = () => {
  return (
    <Router>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Router funcionando!</h1>
        <p>React Router está funcionando.</p>
      </div>
    </Router>
  );
};

// Teste 3: Com LanguageProvider
const AppWithContext: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Context funcionando!</h1>
            <p>LanguageProvider está funcionando.</p>
          </div>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

// App completo (comentado para teste)
const AppComplete: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route 
                path="/success" 
                element={
                  <CheckoutSuccess 
                    sessionId={new URLSearchParams(window.location.search).get('session_id') || undefined}
                  />
                } 
              />
              <Route path="/cancel" element={<CheckoutCancel />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

// Use este para testar:
const App: React.FC = () => {
  // Descomente uma linha por vez para testar:
  // return <AppMinimal />; // Teste 1
  // return <AppWithRouter />; // Teste 2
  // return <AppWithContext />; // Teste 3
  return <AppComplete />; // App completo
};

export default App;
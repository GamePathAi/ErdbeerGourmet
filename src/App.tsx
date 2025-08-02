import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SimplePricingSection from './components/SimplePricingSection';
import ProductGallery from './components/ProductGallery';
import EbookSection from './components/EbookSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CartPage from './components/CartPage';
import CheckoutSuccess from './components/CheckoutSuccess';
import CheckoutCancel from './components/CheckoutCancel';
import MorangoGourmetLanding from './components/MorangoGourmetLanding.jsx';
import TestEbook from './components/TestEbook';
import EbookWrapper from './components/EbookWrapper';

function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SimplePricingSection />
      <ProductGallery />
      <EbookSection />
      <ContactSection />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ebook" element={<EbookWrapper />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
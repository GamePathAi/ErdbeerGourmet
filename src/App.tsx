import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import HeroSection3D from './components/HeroSection3D';
import AboutSection from './components/AboutSection';
import ProductGallery from './components/ProductGallery';
import PricingSection from './components/PricingSection';
import CareSection from './components/CareSection';
import ContactSection from './components/ContactSection';
import OrderSection from './components/OrderSection';
import Footer from './components/Footer';
import './styles.css';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="App">
        <Navigation />
        <main>
          <HeroSection3D />
          <AboutSection />
          <ProductGallery />
          <PricingSection />
          <CareSection />
          <ContactSection />
          <OrderSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;
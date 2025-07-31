import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SimplePricingSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="precos" className="py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ErdbeerGourmet
            </h3>
            <p className="text-gray-600 mb-6">
              Doce artesanal premium da Suíça
            </p>
            <div className="text-3xl font-bold text-pink-600 mb-6">
              A partir de CHF 12.00
            </div>
            <button className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors">
              {t('pricing.contact')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimplePricingSection;
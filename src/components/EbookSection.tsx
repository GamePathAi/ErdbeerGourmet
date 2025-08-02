import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const EbookSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('ebook_section.title').split(' ').slice(0, -2).join(' ')}
            <span className="text-red-600 block">{t('ebook_section.title').split(' ').slice(-2).join(' ')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('ebook_section.subtitle')}. {t('ebook_section.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Lado esquerdo - Imagem/Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🍓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('ebook.course')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('ebook_section.description')}
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-sm">{t('ebook_section.features.technique')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-sm">{t('ebook_section.features.recipe')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-sm">{t('ebook_section.features.temperature')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-sm">{t('ebook_section.features.presentation')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - CTA */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('ebook_section.subtitle')}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {t('ebook_section.description')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎯</span>
                <span className="font-semibold text-gray-900">{t('ebook.guarantee_title')}</span>
              </div>
              <p className="text-gray-600 text-sm">
                {t('ebook_section.guarantee')}
              </p>
            </div>

            <Link 
              to="/ebook" 
              className="inline-block w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-center text-lg hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              🍓 {t('ebook_section.cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookSection;
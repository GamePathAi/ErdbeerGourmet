import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="sobre" className="about-section">
      <div className="container">
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="about-content">
          <p className="about-description">
            {t('about.description')}
          </p>
          <div className="ingredients">
            <div className="ingredient">
              <span className="ingredient-icon">🍓</span>
              <span className="ingredient-text">{t('about.strawberry')}</span>
            </div>
            <div className="ingredient">
              <span className="ingredient-icon">🍬</span>
              <span className="ingredient-text">{t('about.brigadeiro')}</span>
            </div>
            <div className="ingredient">
              <span className="ingredient-icon">💎</span>
              <span className="ingredient-text">{t('about.caramel')}</span>
            </div>
          </div>
          <p className="guarantee">{t('about.guarantee')}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

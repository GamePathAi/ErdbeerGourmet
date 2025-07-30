import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import StrawberryIcon from './StrawberryIcon';

const HeroSectionSimple: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="hero-section-3d">
      <div className="hero-container">
        {/* Simple background instead of Three.js */}
        <div className="hero-canvas" style={{
          background: 'linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="hero-content-overlay">
            <div className="hero-text">
              {/* Large Strawberry Icon */}
              <div className="hero-strawberry">
                <StrawberryIcon width={120} height={120} className="strawberry-icon-svg" />
              </div>
              <h1 className="hero-title">{t('hero.tagline')}</h1>
              <div className="hero-highlights">
                <p className="hero-highlight">{t('hero.highlight')}</p>
                <p className="hero-quality">{t('hero.quality')}</p>
              </div>
              <div className="hero-actions">
                <a 
                  href="https://wa.me/41788936517" 
                  className="btn btn-primary hero-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('hero.order')}
                </a>
                <a 
                  href="#sobre" 
                  className="btn btn-secondary hero-learn"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector('#sobre');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {t('hero.learn')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionSimple;

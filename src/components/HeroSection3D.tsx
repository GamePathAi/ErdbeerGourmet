import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ThreeScene from './ThreeScene';
import StrawberryIcon from './StrawberryIcon';

const HeroSection3D: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="hero-section-3d">
      <div className="hero-container">
        {/* Three.js Canvas */}
        <div className="hero-canvas">
          <ThreeScene className="hero-three-scene" />
        </div>
        
        {/* Content Overlay */}
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
    </section>
  );
};

export default HeroSection3D;

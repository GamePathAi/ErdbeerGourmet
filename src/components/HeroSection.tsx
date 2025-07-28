import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="hero" className="hero-section-strawberry">
      <div className="strawberry-background">
        <div className="floating-strawberry strawberry-1">🍓</div>
        <div className="floating-strawberry strawberry-2">🍓</div>
        <div className="floating-strawberry strawberry-3">🍓</div>
        <div className="floating-strawberry strawberry-4">🍓</div>
        <div className="floating-strawberry strawberry-5">🍓</div>
        <div className="floating-strawberry strawberry-6">🍓</div>
      </div>
      
      <div className="container">
        <div className="hero-content-strawberry">
          <div className="hero-visual">
            <div className="main-strawberry">
              <div className="strawberry-glow">🍓</div>
            </div>
            <div className="sparkles">
              <div className="sparkle sparkle-1">✨</div>
              <div className="sparkle sparkle-2">✨</div>
              <div className="sparkle sparkle-3">✨</div>
              <div className="sparkle sparkle-4">✨</div>
              <div className="sparkle sparkle-5">✨</div>
            </div>
          </div>
          
          <div className="hero-text-strawberry">
            <h1 className="hero-title">
              <span className="title-line-1">ErdbeerGourmet</span>
              <span className="title-line-2">{t('hero.tagline')}</span>
            </h1>
            
            <div className="hero-description">
              <div className="feature-item">
                <span className="feature-icon">🍓</span>
                <span className="feature-text">{t('hero.highlight')}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <span className="feature-text">{t('hero.quality')}</span>
              </div>
            </div>
            
            <div className="hero-buttons-strawberry">
              <a href="https://wa.me/41788936517" className="btn-strawberry btn-primary-strawberry" target="_blank" rel="noopener noreferrer">
                <span className="btn-icon">🛒</span>
                {t('hero.order')}
              </a>
              <a href="#sobre" className="btn-strawberry btn-secondary-strawberry">
                <span className="btn-icon">📖</span>
                {t('hero.learn')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
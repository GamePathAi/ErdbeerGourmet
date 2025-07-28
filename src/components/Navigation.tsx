import React, { useState, useEffect } from 'react';
import StrawberryLogo from './StrawberryLogo';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../hooks/useLanguage';
import { CartIcon, Cart } from './Cart';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '#hero', label: t('nav.home') },
    { href: '#sobre', label: t('nav.product') },
    { href: '#precos', label: t('nav.pricing') },
    { href: '#conservar', label: t('nav.care') },
    { href: '#sobre-nos', label: t('nav.about') },
    { href: '#pedido', label: t('nav.order') }
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <StrawberryLogo width={50} height={50} className="nav-logo" />
          <span className="brand-text">ErdbeerGourmet</span>
        </div>
        
        <div className="nav-links">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
        
        <div className="nav-right">
          <CartIcon onClick={() => setIsCartOpen(true)} />
          <LanguageSelector />
          <a 
            href="https://wa.me/41788936517" 
            className="nav-cta btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('nav.order')}
          </a>
        </div>
        
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
          <div className="mobile-nav-footer">
            <CartIcon onClick={() => setIsCartOpen(true)} />
            <LanguageSelector />
            <a 
              href="https://wa.me/41788936517" 
              className="mobile-cta btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('nav.contact')}
            </a>
          </div>
        </div>

        <button 
          className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navigation;
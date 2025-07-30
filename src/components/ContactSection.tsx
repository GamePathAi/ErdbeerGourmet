import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  
  const contactInfo = [
    {
      icon: '📱',
      label: t('contact.instagram'),
      text: '@erdbeergourmet'
    },
    {
      icon: '📞',
      label: t('contact.whatsapp'),
      text: '+41 78 893 6517'
    },
    {
      icon: '✉️',
      label: t('contact.email'),
      text: 'info@erdbeergourmet.ch'
    }
  ];

  return (
    <section id="sobre-nos" className="company-section">
      <div className="container">
        <div className="company-content">
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="company-description">
            {t('contact.description')}
          </p>
          <div className="contact-info">
            {contactInfo.map((contact, index) => (
              <div key={index} className="contact-item">
                <span className="contact-icon">{contact.icon}</span>
                <div className="contact-details">
                  <span className="contact-label">{contact.label}:</span>
                  <span className="contact-text">{contact.text}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="conclusion">
            {t('contact.conclusion')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

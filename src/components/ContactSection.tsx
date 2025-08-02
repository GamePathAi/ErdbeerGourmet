import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import emailjs from '@emailjs/browser';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const sendContactForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      'service_tf8dxp9',         // Service ID
      'template_fetauun',        // Template ID
      e.target as HTMLFormElement, // O formulário HTML
      'MeWX-tvV_mz0BuDw0'        // Public Key
    ).then(
      (result) => {
        console.log('Email sent:', result.text);
        alert('Mensagem enviada com sucesso!');
        // Reset form
        (e.target as HTMLFormElement).reset();
      },
      (error) => {
        console.error('EmailJS Error:', error);
        alert('Erro ao enviar mensagem.');
      }
    ).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <section id="sobre-nos" className="company-section">
      <div className="container">
        <div className="company-content">
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="company-description">
            {t('contact.description')}
          </p>
          
          {/* Contact Info */}
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

          {/* Contact Form */}
          <div className="contact-form-container" style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto 0' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#e53e3e' }}>Envie-nos uma mensagem</h3>
            <form onSubmit={sendContactForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="user_name" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Nome:</label>
                <input 
                  type="text" 
                  name="user_name" 
                  id="user_name"
                  required 
                  style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  required 
                  style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="title" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Assunto:</label>
                <input 
                  type="text" 
                  name="title" 
                  id="title"
                  required 
                  style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="message" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Mensagem:</label>
                <textarea 
                  name="message" 
                  id="message"
                  rows={5}
                  required 
                  style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: isSubmitting ? '#ccc' : '#e53e3e', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
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

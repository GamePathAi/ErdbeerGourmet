import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const CareSection: React.FC = () => {
  const { t } = useLanguage();
  
  const careInstructions = [
    {
      icon: '🌡️',
      title: t('care.refrigerate'),
      text: t('care.refrigerate.desc')
    },
    {
      icon: '⏰',
      title: t('care.consume'),
      text: t('care.consume.desc')
    },
    {
      icon: '❄️',
      title: t('care.transport'),
      text: t('care.transport.desc')
    }
  ];

  return (
    <section id="care" className="care-section">
      <div className="container">
        <h2 className="section-title">{t('care.title')}</h2>
        <div className="care-card">
          <div className="care-instructions">
            {careInstructions.map((instruction, index) => (
              <div key={index} className="care-item">
                <span className="care-icon">{instruction.icon}</span>
                <div className="care-content">
                  <h4 className="care-title">{instruction.title}</h4>
                  <p className="care-description">{instruction.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareSection;
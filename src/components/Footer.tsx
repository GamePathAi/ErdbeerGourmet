import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} {t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
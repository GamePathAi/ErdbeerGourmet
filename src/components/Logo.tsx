import React from 'react';
import ImageLogo from './ImageLogo';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  inline?: boolean;
  useCustomImage?: boolean;
  customImagePath?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  width = 300, 
  height = 300, 
  className = "strawberry-svg", 
  inline = false,
  useCustomImage = false,
  customImagePath = "/logo.png"
}) => {
  
  // Se useCustomImage for true, renderiza o componente ImageLogo
  if (useCustomImage) {
    if (inline) {
      // Layout inline: morango personalizado ao lado do texto
      return (
         <div className={`logo-container ${className}`} style={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'flex-start',
           gap: '8px'
         }}>
           <ImageLogo 
             width={width * 0.5}
             height={height * 0.5}
             imagePath={customImagePath}
             alt="Logo personalizado"
           />
           
           {/* Logo Text */}
           <div style={{ 
             fontFamily: 'Playfair Display, serif', 
             fontWeight: 'bold',
             fontSize: `${width * 0.12}px`,
             lineHeight: '1.2'
           }}>
             <span style={{ color: '#c92a2a' }}>Erdbeer</span>
             <span style={{ color: '#8b4513' }}>Gourmet</span>
           </div>
         </div>
       );
    } else {
      // Layout padrão: apenas a imagem personalizada
      return (
        <div className={`logo-container ${className}`} style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '10px'
        }}>
          <ImageLogo 
            width={width * 0.6}
            height={height * 0.6}
            imagePath={customImagePath}
            alt="Logo personalizado"
          />
        </div>
      );
    }
  }
  if (inline) {
    // Layout inline: morango ao lado do texto
    return (
      <div className={`logo-container ${className}`} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        gap: '8px'
      }}>
        {/* Morango SVG */}
        <svg width={width * 0.5} height={height * 0.5} viewBox="0 0 300 300">
          <defs>
            <radialGradient id="strawberryGradientInline" cx="50%" cy="30%" r="70%">
              <stop offset="0%" style={{stopColor: '#ff6b6b', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#c92a2a', stopOpacity: 1}} />
            </radialGradient>
            <radialGradient id="caramelGradientInline" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{stopColor: '#ffd43b', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#fab005', stopOpacity: 0.7}} />
            </radialGradient>
          </defs>
          {/* Morango */}
          <ellipse cx="150" cy="180" rx="80" ry="100" fill="url(#strawberryGradientInline)"/>
          {/* Folhas */}
          <path d="M120 80 Q130 60 140 80 Q150 60 160 80 Q170 60 180 80" fill="#51cf66" stroke="#37b24d" strokeWidth="2"/>
          {/* Sementes */}
          <circle cx="130" cy="150" r="3" fill="#495057"/>
          <circle cx="170" cy="160" r="3" fill="#495057"/>
          <circle cx="140" cy="190" r="3" fill="#495057"/>
          <circle cx="160" cy="210" r="3" fill="#495057"/>
          {/* Caramelo brilhante */}
          <ellipse cx="150" cy="180" rx="85" ry="105" fill="url(#caramelGradientInline)" opacity="0.6"/>
          {/* Brilho */}
          <ellipse cx="130" cy="140" rx="15" ry="25" fill="white" opacity="0.8"/>
        </svg>
        
        {/* Logo Text */}
        <div style={{ 
          fontFamily: 'Playfair Display, serif', 
          fontWeight: 'bold',
          fontSize: `${width * 0.12}px`,
          lineHeight: '1.2'
        }}>
          <span style={{ color: '#c92a2a' }}>Erdbeer</span>
          <span style={{ color: '#8b4513' }}>Gourmet</span>
        </div>
      </div>
    );
  }
  
  // Layout padrão: morango em cima do texto
  return (
    <div className={`logo-container ${className}`} style={{ width, height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Morango SVG */}
      <svg width={width * 0.6} height={height * 0.6} viewBox="0 0 300 300" style={{ marginBottom: '10px' }}>
        <defs>
          <radialGradient id="strawberryGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style={{stopColor: '#ff6b6b', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#c92a2a', stopOpacity: 1}} />
          </radialGradient>
          <radialGradient id="caramelGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#ffd43b', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#fab005', stopOpacity: 0.7}} />
          </radialGradient>
        </defs>
        {/* Morango */}
        <ellipse cx="150" cy="180" rx="80" ry="100" fill="url(#strawberryGradient)"/>
        {/* Folhas */}
        <path d="M120 80 Q130 60 140 80 Q150 60 160 80 Q170 60 180 80" fill="#51cf66" stroke="#37b24d" strokeWidth="2"/>
        {/* Sementes */}
        <circle cx="130" cy="150" r="3" fill="#495057"/>
        <circle cx="170" cy="160" r="3" fill="#495057"/>
        <circle cx="140" cy="190" r="3" fill="#495057"/>
        <circle cx="160" cy="210" r="3" fill="#495057"/>
        {/* Caramelo brilhante */}
        <ellipse cx="150" cy="180" rx="85" ry="105" fill="url(#caramelGradient)" opacity="0.6"/>
        {/* Brilho */}
        <ellipse cx="130" cy="140" rx="15" ry="25" fill="white" opacity="0.8"/>
      </svg>
      
      {/* Logo Text */}
      <div style={{ 
        fontFamily: 'Playfair Display, serif', 
        fontWeight: 'bold',
        fontSize: `${width * 0.08}px`,
        textAlign: 'center',
        lineHeight: '1.2'
      }}>
        <span style={{ color: '#c92a2a' }}>Erdbeer</span>
        <span style={{ color: '#8b4513' }}>Gourmet</span>
      </div>
    </div>
  );
};

export default Logo;

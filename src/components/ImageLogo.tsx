import React from 'react';

interface ImageLogoProps {
  width?: number;
  height?: number;
  className?: string;
  imagePath?: string;
  alt?: string;
}

const ImageLogo: React.FC<ImageLogoProps> = ({ 
  width = 120, 
  height = 120, 
  className = "image-logo",
  imagePath = "/logo.png",
  alt = "Logo personalizado"
}) => {
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))',
        animation: 'float 6s ease-in-out infinite',
        display: 'inline-block',
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <img 
        src={imagePath}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          background: 'transparent'
        }}
        onError={(e) => {
          // Fallback para quando a imagem não for encontrada
          console.warn('Imagem não encontrada:', imagePath);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default ImageLogo;
import React from 'react';

interface StrawberryIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const StrawberryIcon: React.FC<StrawberryIconProps> = ({ width = 120, height = 120, className = "strawberry-icon-svg" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 300 300" 
      className={className}
      style={{
        filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))',
        animation: 'float 6s ease-in-out infinite'
      }}
    >
      <defs>
        <radialGradient id="strawberryGradientHero" cx="40%" cy="25%" r="80%">
          <stop offset="0%" style={{stopColor: '#ff4757', stopOpacity: 1}} />
          <stop offset="70%" style={{stopColor: '#ff3838', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#c44569', stopOpacity: 1}} />
        </radialGradient>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#2ed573', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#1e7e34', stopOpacity: 1}} />
        </linearGradient>
        <radialGradient id="highlightGradient" cx="30%" cy="20%" r="40%">
          <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.9}} />
          <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
        </radialGradient>
      </defs>
      {/* Corpo do morango - formato de coração invertido */}
      <path d="M150 100 C120 100 90 130 90 170 C90 210 120 250 150 270 C180 250 210 210 210 170 C210 130 180 100 150 100 Z" fill="url(#strawberryGradientHero)"/>
      
      {/* Folhas do morango */}
      <g transform="translate(150, 100)">
        <path d="M-40 -20 Q-35 -35 -25 -25 Q-15 -40 -5 -25 Q5 -40 15 -25 Q25 -35 40 -20 Q35 -10 25 -15 Q15 -5 5 -15 Q-5 -5 -15 -15 Q-25 -10 -40 -20 Z" fill="url(#leafGradient)" stroke="#1e7e34" strokeWidth="1"/>
        <path d="M-30 -15 L-25 -30 M-10 -20 L-5 -35 M10 -20 L15 -35 M30 -15 L25 -30" stroke="#1e7e34" strokeWidth="1.5" fill="none"/>
      </g>
      
      {/* Sementes do morango */}
      <ellipse cx="125" cy="140" rx="2" ry="4" fill="#2c3e50" transform="rotate(15 125 140)"/>
      <ellipse cx="175" cy="145" rx="2" ry="4" fill="#2c3e50" transform="rotate(-20 175 145)"/>
      <ellipse cx="135" cy="170" rx="2" ry="4" fill="#2c3e50" transform="rotate(25 135 170)"/>
      <ellipse cx="165" cy="175" rx="2" ry="4" fill="#2c3e50" transform="rotate(-15 165 175)"/>
      <ellipse cx="150" cy="200" rx="2" ry="4" fill="#2c3e50" transform="rotate(10 150 200)"/>
      <ellipse cx="120" cy="200" rx="2" ry="4" fill="#2c3e50" transform="rotate(-25 120 200)"/>
      <ellipse cx="180" cy="205" rx="2" ry="4" fill="#2c3e50" transform="rotate(20 180 205)"/>
      <ellipse cx="140" cy="230" rx="2" ry="4" fill="#2c3e50" transform="rotate(-10 140 230)"/>
      <ellipse cx="160" cy="235" rx="2" ry="4" fill="#2c3e50" transform="rotate(15 160 235)"/>
      
      {/* Brilho principal */}
      <ellipse cx="130" cy="130" rx="20" ry="30" fill="url(#highlightGradient)"/>
      
      {/* Brilho secundário */}
      <ellipse cx="170" cy="160" rx="8" ry="12" fill="white" opacity="0.4"/>
    </svg>
  );
};

export default StrawberryIcon;
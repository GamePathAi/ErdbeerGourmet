import React from 'react';

interface StrawberryLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const StrawberryLogo: React.FC<StrawberryLogoProps> = ({ 
  width = 50, 
  height = 50, 
  className = '' 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Strawberry body */}
      <path 
        d="M50 20 C35 20, 25 35, 25 50 C25 65, 30 75, 40 85 C45 90, 50 95, 50 95 C50 95, 55 90, 60 85 C70 75, 75 65, 75 50 C75 35, 65 20, 50 20 Z" 
        fill="#e74c3c" 
        stroke="#c0392b" 
        strokeWidth="1"
      />
      
      {/* Strawberry leaves */}
      <g transform="translate(50, 20)">
        <path 
          d="M-8 -5 C-10 -8, -8 -12, -5 -10 C-3 -12, 0 -15, 3 -12 C5 -15, 8 -12, 10 -10 C12 -12, 15 -8, 12 -5 C10 -3, 8 -1, 5 -2 C3 0, 0 -1, -3 -2 C-5 -1, -8 -3, -8 -5 Z" 
          fill="#27ae60"
          stroke="#229954"
          strokeWidth="0.5"
        />
      </g>
      
      {/* Seeds */}
      <circle cx="40" cy="35" r="1.5" fill="#f1c40f" />
      <circle cx="60" cy="40" r="1.5" fill="#f1c40f" />
      <circle cx="45" cy="45" r="1.5" fill="#f1c40f" />
      <circle cx="55" cy="50" r="1.5" fill="#f1c40f" />
      <circle cx="42" cy="55" r="1.5" fill="#f1c40f" />
      <circle cx="58" cy="60" r="1.5" fill="#f1c40f" />
      <circle cx="48" cy="65" r="1.5" fill="#f1c40f" />
      <circle cx="52" cy="70" r="1.5" fill="#f1c40f" />
      
      {/* Highlight */}
      <ellipse 
        cx="45" 
        cy="40" 
        rx="8" 
        ry="12" 
        fill="rgba(255,255,255,0.2)" 
        transform="rotate(-20 45 40)"
      />
    </svg>
  );
};

export default StrawberryLogo;
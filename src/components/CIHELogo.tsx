import React from 'react';

interface CIHELogoProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'crown' | 'badge' | 'transparent';
  rounded?: string;
}

export const CIHELogo: React.FC<CIHELogoProps> = ({
  className = '',
  size = 40,
  variant = 'full',
  rounded = 'rounded-xl'
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const isTransparent = variant === 'transparent';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none ${
        isTransparent ? '' : `${rounded} bg-[#144694] shadow-xs`
      } ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label="Crown Institute of Higher Education (CIHE) Logo"
    >
      <svg
        viewBox="0 0 128 128"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {!isTransparent && (
          <rect width="128" height="128" fill="#144694" />
        )}

        {/* Crown Top Points */}
        {/* Center Diamond */}
        <polygon points="64,17 71,25 64,33 57,25" fill="#ffffff" />

        {/* Left Triangle Peak */}
        <polygon points="25,17 33,28 25,28" fill="#ffffff" />

        {/* Right Triangle Peak */}
        <polygon points="103,17 103,28 95,28" fill="#ffffff" />

        {/* Crown Intersecting Ribbon & Struts */}
        <g stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Left Vertical Flank */}
          <line x1="25" y1="28" x2="25" y2="70" />

          {/* Right Vertical Flank */}
          <line x1="103" y1="28" x2="103" y2="70" />

          {/* Outer Diagonals from Side Peaks */}
          <line x1="25" y1="28" x2="45" y2="54" />
          <line x1="103" y1="28" x2="83" y2="54" />

          {/* Center Peak Diagonals */}
          <polyline points="45,54 64,32 83,54" />

          {/* Bottom Left Loop Upward */}
          <path d="M 25 70 C 25 64 35 57 45 54" />

          {/* Bottom Right Loop Upward */}
          <path d="M 103 70 C 103 64 93 57 83 54" />

          {/* Center Wave/Ribbon: sweeping smooth curve */}
          <path d="M 25 70 C 45 74 52 68 64 68 C 76 68 83 74 103 70" />

          {/* Center Saddle Ribbon */}
          <path d="M 45 54 C 52 65 76 65 83 54" />
        </g>

        {/* Typography: CIHE */}
        {variant !== 'crown' && (
          <text
            x="64"
            y="107"
            textAnchor="middle"
            fontFamily="'Inter', 'Geist', 'Arial Black', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="28.5"
            letterSpacing="1.8"
            fill="#ffffff"
          >
            CIHE
          </text>
        )}
      </svg>
    </div>
  );
};

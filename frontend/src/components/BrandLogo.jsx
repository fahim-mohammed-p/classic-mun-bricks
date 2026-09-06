import React from 'react';
import logoImg from '../assets/logo.png';

/**
 * Reusable BrandLogo component for Classic Mun Bricks
 * Single visual brand mark used across desktop navbar, mobile header, footer, and brand displays.
 */
const BrandLogo = ({ variant = 'navbar', className = '', showText = true }) => {
  // Height and font size presets per variant
  const logoStyles = {
    navbar: {
      imgHeight: '40px',
      fontSize: '1.05rem',
      gap: '0.65rem',
    },
    mobileHeader: {
      imgHeight: '32px',
      fontSize: 'clamp(0.82rem, 3.6vw, 0.95rem)',
      gap: '0.5rem',
      letterSpacing: '0.35px',
    },
    footer: {
      imgHeight: '46px',
      fontSize: '1.15rem',
      gap: '0.75rem',
    },
    standalone: {
      imgHeight: '52px',
      fontSize: '1.25rem',
      gap: '0.85rem',
    },
  };

  const style = logoStyles[variant] || logoStyles.navbar;

  return (
    <div className={`d-inline-flex align-items-center ${className}`} style={{ gap: style.gap }}>
      <img
        src={logoImg}
        alt="Classic Mun Bricks logo"
        style={{
          height: style.imgHeight,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
      {showText && (
        <span
          className="fw-bold tracking-tight text-nowrap"
          style={{
            fontFamily: 'var(--cmb-font-heading)',
            fontSize: style.fontSize,
            letterSpacing: style.letterSpacing || '0.5px',
            color: 'inherit',
          }}
        >
          CLASSIC MUN BRICKS
        </span>
      )}
    </div>
  );
};

export default BrandLogo;

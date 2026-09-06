import React from 'react';
import brickLock from '../assets/brick-lock.webp';
import brickGroove from '../assets/brick-groove.webp';
import '../styles/floating-bricks.css';

/**
 * FloatingBricks Component
 * Renders lightweight, GPU-accelerated floating brick product elements.
 * 
 * @param {Object} props
 * @param {'home' | 'visit'} props.variant - Sets the animation intensity and layout variant
 */
const FloatingBricks = ({ variant = 'home' }) => {
  if (variant === 'visit') {
    return (
      <div 
        className="floating-bricks-container floating-bricks-visit" 
        aria-hidden="true"
      >
        <img 
          src={brickLock} 
          alt="" 
          loading="lazy"
          className="floating-brick brick-visit-left" 
        />
        <img 
          src={brickGroove} 
          alt="" 
          loading="lazy"
          className="floating-brick brick-visit-right" 
        />
      </div>
    );
  }

  // Default 'home' variant
  return (
    <div 
      className="floating-bricks-container floating-bricks-home" 
      aria-hidden="true"
    >
      <img 
        src={brickLock} 
        alt="" 
        loading="eager"
        className="floating-brick brick-home-left" 
      />
      <img 
        src={brickGroove} 
        alt="" 
        loading="eager"
        className="floating-brick brick-home-right" 
      />
      <img 
        src={brickGroove} 
        alt="" 
        loading="lazy"
        className="floating-brick brick-home-depth" 
      />
    </div>
  );
};

export default FloatingBricks;

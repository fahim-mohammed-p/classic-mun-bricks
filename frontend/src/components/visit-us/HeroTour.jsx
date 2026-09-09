import React from 'react';
import heroImg from '../../assets/visit-us/01-material-processing.jpg';

/**
 * HeroTour Component
 * Cinematic full-width hero utilizing real factory footage visuals
 * and an inviting, authentic introduction for remote clients.
 */
const HeroTour = ({ onStartTour }) => {
  const handleScrollClick = (e) => {
    e.preventDefault();
    if (onStartTour) {
      onStartTour();
    } else {
      const firstSection = document.getElementById('tour-intro');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="tour-hero">
      {/* Real Factory Background Image */}
      <img
        src={heroImg}
        alt="Classic Mun Bricks factory floor and material handling operations in Kerala"
        className="tour-hero-bg"
        loading="eager"
      />

      {/* Deep Industrial Vignette & Gradient Overlay */}
      <div className="tour-hero-overlay" />

      <div className="container position-relative z-2 text-center">
        {/* Eyebrow Badge */}
        <div className="mb-3">
          <span className="tour-eyebrow">
            <i className="bi bi-geo-alt-fill"></i> Virtual Factory Tour
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="tour-hero-title">Step Inside Our Factory</h1>

        {/* Supporting Narrative */}
        <p className="tour-hero-lead">
          Experience our complete brick manufacturing journey. From raw mineral processing to precision-shaped structural units, see our Kerala manufacturing facility.
        </p>

        {/* Animated Scroll Prompt */}
        <div className="mt-4">
          <button
            type="button"
            className="scroll-indicator"
            onClick={handleScrollClick}
            aria-label="Scroll to begin the virtual factory tour"
          >
            <div className="scroll-indicator-mouse">
              <div className="scroll-indicator-wheel"></div>
            </div>
            <span>Scroll to begin the tour</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeroTour;

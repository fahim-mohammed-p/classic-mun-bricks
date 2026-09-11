import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import heroSlide1 from '../assets/hero-slides/hero-slide-1.webp';
import heroSlide2 from '../assets/hero-slides/hero-slide-2.webp';
import heroSlide3 from '../assets/hero-slides/hero-slide-3.webp';

/**
 * Slide Definitions:
 * Unified Headline across all 3: "Strong Beyond Any Bricks"
 * Short, clean, natural subtexts without artificial boxed labels
 * - Slide 1: High sloped-ceiling architectural space
 * - Slide 2: Modern interior hall with authentic brick wall & staircase
 * - Slide 3: Open courtyard patio with swing and solid laterite brickwork
 */
const SLIDES = [
  {
    id: 'slide-1',
    headingPrefix: 'Strong Beyond ',
    headingHighlight: 'Any Bricks',
    fullHeading: 'Strong Beyond Any Bricks',
    subtext: 'Crafted for lasting strength',
    image: heroSlide1,
    alt: 'Classic Mun Bricks authentic laterite brick architecture with sloped wooden ceiling',
  },
  {
    id: 'slide-2',
    headingPrefix: 'Strong Beyond ',
    headingHighlight: 'Any Bricks',
    fullHeading: 'Strong Beyond Any Bricks',
    subtext: 'Built for dependable construction',
    image: heroSlide2,
    alt: 'Spacious modern home interior with authentic laterite brick feature wall and staircase',
  },
  {
    id: 'slide-3',
    headingPrefix: 'Strong Beyond ',
    headingHighlight: 'Any Bricks',
    fullHeading: 'Strong Beyond Any Bricks',
    subtext: 'Designed for timeless durability',
    image: heroSlide3,
    alt: 'Contemporary courtyard patio with authentic laterite brickwork and wooden swing',
  },
];

const AUTO_SLIDE_DELAY = 5500; // 5.5s smooth auto-slide

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide effect with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, currentSlide]);

  // Touch Swipe Handlers for Mobile Devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Accessible Keyboard Navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  return (
    <section 
      className="hero-slider-section"
      aria-label="Classic Mun Bricks Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Slides Viewport */}
      <div className="hero-slides-viewport">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`hero-slide ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Slide Background Image with subtle Ken Burns zoom */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="hero-slide-img"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Subtle Dark Brown/Black Gradient Overlay for Text Readability without over-darkening */}
              <div className="hero-slide-overlay" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {/* Hero Content Layer - Clean, Elegant, No AI boxed callouts */}
      <div className="container position-relative hero-content-container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-8 col-md-10 col-12">
            <div className="hero-text-block">
              {/* Main Headline */}
              <h1 className="hero-main-heading">
                {SLIDES[currentSlide].headingPrefix}
                <span className="text-terracotta">
                  {SLIDES[currentSlide].headingHighlight}
                </span>
              </h1>

              {/* Minimal Clean Natural Subtext */}
              <p className="hero-subtext">
                {SLIDES[currentSlide].subtext}
              </p>

              {/* CTA Action Buttons */}
              <div className="hero-cta-actions">
                <Link to="/visit-us" className="btn-cmb-primary hero-btn-cta">
                  <span>Explore Our Factory</span>
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
                <Link to="/contact" className="btn-cmb-secondary hero-btn-cta">
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <button
        type="button"
        className="hero-arrow-btn prev-arrow"
        onClick={prevSlide}
        aria-label="Previous slide"
        title="Previous slide"
      >
        <i className="bi bi-chevron-left" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="hero-arrow-btn next-arrow"
        onClick={nextSlide}
        aria-label="Next slide"
        title="Next slide"
      >
        <i className="bi bi-chevron-right" aria-hidden="true" />
      </button>

      {/* Bottom Dot Indicators */}
      <div className="hero-slider-pagination" role="tablist" aria-label="Slide Navigation">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}: ${slide.subtext}`}
              className={`hero-dot-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => goToSlide(idx)}
            >
              <span className="hero-dot-fill" />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Hero;

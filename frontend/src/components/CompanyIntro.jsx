import React, { useRef, useState, useEffect } from 'react';
import SoilToBrickAnimation from './SoilToBrickAnimation';
import brickGroove from '../assets/brick-groove.webp';
import '../styles/soil-to-brick.css';

/**
 * CompanyIntro Component - Manufacturing Excellence
 * 
 * Environmental "Soil → Brick" transformation story:
 * A full-section particle canvas lets raw soil and clay grains sweep across the
 * entire white section and converge directly into the authentic Classic Mun Bricks
 * product displayed at its verified, constant size.
 */
const CompanyIntro = () => {
  const sectionRef = useRef(null);
  const desktopBrickRef = useRef(null);
  const mobileBrickRef = useRef(null);
  const [sectionScrollProgress, setSectionScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Viewport detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 992);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Native Scroll-Driven Progress Tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (window.innerWidth >= 992) {
              // DESKTOP: Track section scroll as sticky right column holds the brick stage
              // Entry starts as top of section enters upper 65% of viewport
              // Section ends when bottom of section reaches bottom of viewport
              const entryOffset = windowHeight * 0.65;
              const totalScrollDistance = rect.height - windowHeight * 0.35;
              const currentOffset = entryOffset - rect.top;

              if (totalScrollDistance > 0) {
                const progress = Math.min(1, Math.max(0, currentOffset / totalScrollDistance));
                setSectionScrollProgress(progress);
              }
            } else {
              // MOBILE: Track section travel in natural mobile viewport flow
              const entryOffset = windowHeight * 0.70;
              const totalScrollDistance = rect.height * 0.90;
              const currentOffset = entryOffset - rect.top;

              if (totalScrollDistance > 0) {
                const progress = Math.min(1, Math.max(0, currentOffset / totalScrollDistance));
                setSectionScrollProgress(progress);
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // =========================================================================
  // SCROLL PROGRESS MAPPING & TIMELINE SPECIFICATION
  // =========================================================================
  // 1. Map section scroll progress to complete at 75% of section distance
  //    (Section 0.0 -> 0.75 maps to Animation 0.0 -> 1.0; 0.75 -> 1.0 holds finished brick)
  const ANIMATION_COMPLETION_THRESHOLD = 0.75;
  const animationProgress = Math.min(1, Math.max(0, sectionScrollProgress / ANIMATION_COMPLETION_THRESHOLD));

  // 2. Vertical Formation Movement (formationY):
  //    Moves visual progressively lower inside the white section with scroll.
  //    Desktop: up to 75px controlled travel (settles beside lower feature cards)
  //    Mobile: up to 32px controlled travel
  const maxFormationDistance = isMobile ? 32 : 75;
  const formationY = prefersReducedMotion ? 0 : animationProgress * maxFormationDistance;

  // 3. Transformation Timing:
  //    82%–90% of animationProgress: exact authentic brick reveals/fades in
  //    90%+: finished brick fully visible, solid, and stable
  const brickOpacity = prefersReducedMotion 
    ? 1 
    : Math.min(1, Math.max(0, (animationProgress - 0.82) / 0.08));

  const brickScale = prefersReducedMotion 
    ? 1 
    : 0.95 + Math.min(1, Math.max(0, (animationProgress - 0.82) / 0.08)) * 0.05;

  return (
    <section 
      ref={sectionRef} 
      className="manufacturing-section position-relative overflow-hidden"
      style={{
        minHeight: isMobile ? 'auto' : '130vh',
      }}
    >
      {/* 1. Full-Section Environmental Particle Canvas Layer */}
      <SoilToBrickAnimation 
        sectionRef={sectionRef}
        brickTargetRef={isMobile ? mobileBrickRef : desktopBrickRef}
        animationProgress={animationProgress}
        formationY={formationY}
        isMobile={isMobile}
      />

      {/* 2. Normal Foreground Text & Content Layer */}
      <div className="container manufacturing-content-layer">
        {/* =========================================================================
            DESKTOP TWO-COLUMN COMPOSITION (Screens >= 992px)
            ========================================================================= */}
        <div className="d-none d-lg-block">
          <div className="row align-items-start g-5">
            {/* Left Narrative Column */}
            <div className="col-lg-6">
              <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1">
                Manufacturing Excellence
              </span>
              <h2 className="display-6 fw-bold mt-2 mb-4">
                Mastering the Art of High-Density Brick Manufacturing
              </h2>

              <p className="text-muted mb-4 fs-6 leading-relaxed">
                Classic Mun Bricks is a premier manufacturer specializing in high-grade red clay bricks, structural solid bricks, and facing masonry. Founded on principles of raw material purity and continuous technological upgrade, we supply essential building materials to leading architectural and construction firms.
              </p>

              {/* Manufacturing Narrative Steps */}
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                    <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                      <i className="bi bi-layers-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">01. Pure Clay Sourcing</h6>
                      <p className="small text-muted mb-0">Refined raw soil with zero synthetic binders, harvested from rich mineral deposits in Kerala.</p>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                    <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                      <i className="bi bi-arrows-collapse"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">02. High-Density Extrusion</h6>
                      <p className="small text-muted mb-0">Heavy vacuum de-airing and computerized hydraulic extrusion to compress soil particles into dense units.</p>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                    <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                      <i className="bi bi-thermometer-sun"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">03. Controlled Thermal Firing</h6>
                      <p className="small text-muted mb-0">Precision tunnel kilns exceeding 1,000°C fuse clay crystals into load-bearing masonry units.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engineering Quote */}
              <div className="p-3 rounded-3 bg-sand-muted border border-secondary border-opacity-10 d-flex align-items-center gap-3">
                <i className="bi bi-quote fs-2 text-terracotta"></i>
                <div className="small fw-semibold text-dark">
                  "Our bricks are engineered to withstand extreme moisture, freeze-thaw cycles, and heavy structural load limits."
                </div>
              </div>
            </div>

            {/* Right Sticky Brick Column (3. Final Brick Visual Layer) */}
            <div className="col-lg-6">
              <div className="manufacturing-sticky-column">
                <div 
                  ref={desktopBrickRef} 
                  className="manufacturing-brick-stage"
                  aria-label="Classic Mun Bricks finished high-density brick"
                >
                  <div 
                    className="manufacturing-brick-wrapper"
                    style={{
                      transform: `translate3d(0, ${formationY.toFixed(1)}px, 0) scale(${brickScale})`,
                    }}
                  >
                    <img
                      src={brickGroove}
                      alt="Classic Mun Bricks authentic high-density clay brick with center groove profile"
                      className="manufacturing-brick-img"
                      style={{
                        opacity: brickOpacity,
                      }}
                      loading="eager"
                    />

                    {/* Subtle Ground Contact Shadow */}
                    <div 
                      className="manufacturing-brick-shadow"
                      style={{
                        opacity: brickOpacity * 0.85,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE IN-FLOW COMPOSITION (Screens < 992px)
            Order: Section heading/text -> Animation stage -> Remaining section content
            ========================================================================= */}
        <div className="d-lg-none">
          {/* 1. Section heading & text */}
          <div>
            <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1">
              Manufacturing Excellence
            </span>
            <h2 className="display-6 fw-bold mt-2 mb-3 fs-3">
              Mastering the Art of High-Density Brick Manufacturing
            </h2>
            <p className="text-muted mb-0">
              Classic Mun Bricks is a premier manufacturer specializing in high-grade red clay bricks, structural solid bricks, and facing masonry. Founded on principles of raw material purity and continuous technological upgrade.
            </p>
          </div>

          {/* 2. Final Brick Target in natural mobile flow */}
          <div className="my-4 d-flex justify-content-center">
            <div 
              ref={mobileBrickRef} 
              className="manufacturing-brick-stage"
              aria-label="Classic Mun Bricks finished high-density brick"
            >
              <div 
                className="manufacturing-brick-wrapper"
                style={{
                  transform: `translate3d(0, ${formationY.toFixed(1)}px, 0) scale(${brickScale})`,
                }}
              >
                <img
                  src={brickGroove}
                  alt="Classic Mun Bricks authentic high-density clay brick with center groove profile"
                  className="manufacturing-brick-img"
                  style={{
                    opacity: brickOpacity,
                  }}
                  loading="eager"
                />

                {/* Subtle Ground Contact Shadow */}
                <div 
                  className="manufacturing-brick-shadow"
                  style={{
                    opacity: brickOpacity * 0.85,
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* 3. Remaining section content */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                <div className="icon-box flex-shrink-0 mb-0" style={{ width: '42px', height: '42px', fontSize: '1.15rem' }}>
                  <i className="bi bi-layers-fill"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 fs-6">Pure Clay Sourcing</h6>
                  <p className="small text-muted mb-0">Refined raw soil with zero synthetic binders.</p>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                <div className="icon-box flex-shrink-0 mb-0" style={{ width: '42px', height: '42px', fontSize: '1.15rem' }}>
                  <i className="bi bi-thermometer-sun"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 fs-6">Controlled Thermal Firing</h6>
                  <p className="small text-muted mb-0">Computerized kilns reaching over 1,000°C.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Engineer Quote */}
          <div className="p-3 rounded-3 bg-sand-muted border border-secondary border-opacity-10 d-flex align-items-center gap-3">
            <i className="bi bi-quote fs-2 text-terracotta"></i>
            <div className="small fw-semibold text-dark">
              "Our bricks are engineered to withstand extreme moisture, freeze-thaw cycles, and heavy structural load limits."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;

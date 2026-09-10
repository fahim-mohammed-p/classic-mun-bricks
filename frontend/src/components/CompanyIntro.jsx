import React, { useRef, useState, useEffect } from 'react';
import SoilToBrickAnimation from './SoilToBrickAnimation';
import brickLock from '../assets/brick-lock-horizontal.webp';
import plainLateriteBrick from '../assets/plain-laterite-brick.png';
import '../styles/soil-to-brick.css';

/**
 * CompanyIntro Component - Manufacturing Excellence
 * 
 * Environmental "Soil → Brick" transformation story:
 * A full-section particle canvas lets raw laterite soil grains sweep across the
 * entire white section and converge into the authentic Classic Mun Bricks
 * product range: interlocking brick and plain laterite soil brick.
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

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Section Scroll Tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // Start as section enters viewport, reach full progress before exit
            const totalScrollDistance = rect.height + windowHeight * 0.2;
            const currentScrollDistance = windowHeight - rect.top;
            const progress = Math.min(1, Math.max(0, currentScrollDistance / totalScrollDistance));
            setSectionScrollProgress(progress);
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
  // 1. Map section scroll progress to animation progress
  //    Desktop: tuned to 0.80 for gradual, immersive progression and stable hold
  //    Mobile: preserved at approved 0.75 threshold
  const ANIMATION_COMPLETION_THRESHOLD = isMobile ? 0.75 : 0.80;
  const animationProgress = Math.min(1, Math.max(0, sectionScrollProgress / ANIMATION_COMPLETION_THRESHOLD));

  // 2. Vertical Formation Movement (formationY):
  //    Moves visual progressively lower inside the white section with scroll.
  //    Desktop: up to 85px controlled travel (settles beside lower feature cards)
  //    Mobile: up to 32px controlled travel
  const maxFormationDistance = isMobile ? 32 : 85;
  const formationY = prefersReducedMotion ? 0 : animationProgress * maxFormationDistance;

  // 3. Materialization & Dual-Brick Shaping:
  // Smoothstep interpolation helper
  const smoothstep = (min, max, val) => {
    const t = Math.min(1, Math.max(0, (val - min) / (max - min)));
    return t * t * (3 - 2 * t);
  };

  // Organic fade-in of finished brick pair:
  // Desktop: completes naturally (0.68 to 0.85) allowing particles/convergence to be experienced longer
  // Mobile: preserved exactly at approved (0.74 to 0.89)
  const brickOpacity = prefersReducedMotion 
    ? 1 
    : smoothstep(isMobile ? 0.74 : 0.68, isMobile ? 0.89 : 0.85, animationProgress);

  // Subtle settling scale (0.975 -> 1.0) without sudden jumps
  const brickScale = prefersReducedMotion 
    ? 1 
    : 0.975 + smoothstep(isMobile ? 0.74 : 0.68, isMobile ? 0.89 : 0.85, animationProgress) * 0.025;

  // Gentle separation factor into complementary interlocking pair
  const separationProgress = prefersReducedMotion
    ? 1
    : smoothstep(isMobile ? 0.75 : 0.70, isMobile ? 0.89 : 0.85, animationProgress);

  const separationPx = isMobile ? 6 : 10;
  const leftTranslateX = -separationPx * separationProgress;
  const rightTranslateX = separationPx * separationProgress;

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
              <h2 className="display-6 fw-bold mt-2 mb-3">
                Built on Strength.<br />Made for Generations.
              </h2>

              <p className="text-muted mb-4 fs-6 leading-relaxed">
                Precision interlocking bricks shaped from natural laterite soil, built for durability and ease of construction.
              </p>

              {/* Three Client Facts */}
              <div className="d-flex flex-column gap-3 mb-4">
                {/* 01: Laterite Soil Bricks */}
                <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                  <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                    <i className="bi bi-layers-fill"></i>
                  </div>
                  <div>
                    <div className="text-terracotta fw-bold small text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>01</div>
                    <h6 className="fw-bold mb-1">Laterite Soil Bricks</h6>
                    <p className="small text-muted mb-0">Compressed soil bricks made from laterite soil.</p>
                  </div>
                </div>

                {/* 02: Deep-Sourced Laterite Soil */}
                <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                  <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <div className="text-terracotta fw-bold small text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>02</div>
                    <h6 className="fw-bold mb-1">Deep-Sourced Laterite Soil</h6>
                    <p className="small text-muted mb-0">Laterite soil is sourced from approximately 10 feet below the earth's surface.</p>
                  </div>
                </div>

                {/* 03: Industry Experience */}
                <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
                  <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                    <i className="bi bi-award-fill"></i>
                  </div>
                  <div>
                    <div className="text-terracotta fw-bold small text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>03</div>
                    <h6 className="fw-bold mb-1">Industry Experience</h6>
                    <p className="small text-muted mb-0">10 years of experience in Mun Interlock Bricks and 20 years of experience in laterite bricks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sticky Brick Column (3. Final Brick Visual Layer) */}
            <div className="col-lg-6">
              <div className="manufacturing-sticky-column">
                <div 
                  ref={desktopBrickRef} 
                  className="manufacturing-brick-stage"
                  aria-label="Classic Mun Bricks finished product range: interlocking brick and plain laterite soil brick"
                >
                  <div 
                    className="manufacturing-brick-wrapper"
                    style={{
                      transform: `translate3d(0, ${formationY.toFixed(1)}px, 0) scale(${brickScale})`,
                    }}
                  >
                    <div className="manufacturing-floating-stack">
                      {/* 1. TOP GROOVED BRICK: Clean floating visual, NO product name, AVAILABLE SIZES below */}
                      <div className="floating-brick-unit unit-top-grooved" style={{ opacity: brickOpacity }}>
                        <div className="grooved-brick-body">
                          <img
                            src={brickLock}
                            alt="Interlocking grooved brick"
                            className="grooved-brick-img"
                            loading="eager"
                          />
                          <div 
                            className="manufacturing-brick-shadow"
                            style={{ opacity: brickOpacity * 0.85 }}
                            aria-hidden="true"
                          />
                        </div>

                        {/* Specifications below brick visual */}
                        <div className="product-spec-block">
                          <span className="spec-heading">AVAILABLE SIZES</span>
                          <div className="spec-size-group">
                            <div className="spec-size-row">
                              <span className="spec-size-label">6-inch</span>
                              <span className="spec-size-sep" aria-hidden="true">·</span>
                              <span className="spec-size-dim">12″ L × 6″ B × 5″ H</span>
                            </div>
                            <div className="spec-size-row">
                              <span className="spec-size-label">8-inch</span>
                              <span className="spec-size-sep" aria-hidden="true">·</span>
                              <span className="spec-size-dim">12″ L × 8″ B × 5″ H</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. BOTTOM PLAIN BRICK: Named "MUN BRICK", horizontal orientation */}
                      <div className="floating-brick-unit unit-bottom-plain" style={{ opacity: brickOpacity }}>
                        <div className="plain-brick-body">
                          <img
                            src={plainLateriteBrick}
                            alt="Classic Mun Bricks laterite brick"
                            className="plain-brick-horizontal-img"
                            loading="eager"
                          />
                          <div 
                            className="manufacturing-brick-shadow plain-horizontal-shadow"
                            style={{ opacity: brickOpacity * 0.85 }}
                            aria-hidden="true"
                          />
                        </div>

                        {/* Specifications below brick visual */}
                        <div className="product-spec-block">
                          <span className="spec-heading mun-brick-name">MUN BRICK</span>
                          <div className="spec-size-row">
                            <span className="spec-size-dim">12″ L × 4″ B × 8″ H</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
              Built on Strength.<br />Made for Generations.
            </h2>
            <p className="text-muted mb-0">
              Precision interlocking bricks shaped from natural laterite soil, built for durability and ease of construction.
            </p>
          </div>

          {/* 2. Final Brick Target in natural mobile flow */}
          <div className="my-4 d-flex justify-content-center">
            <div 
              ref={mobileBrickRef} 
              className="manufacturing-brick-stage"
              aria-label="Classic Mun Bricks finished product range: interlocking brick and plain laterite soil brick"
            >
              <div 
                className="manufacturing-brick-wrapper"
                style={{
                  transform: `translate3d(0, ${formationY.toFixed(1)}px, 0) scale(${brickScale})`,
                }}
              >
                <div className="manufacturing-floating-stack">
                  {/* 1. TOP GROOVED BRICK: Clean floating visual, NO product name, AVAILABLE SIZES below */}
                  <div className="floating-brick-unit unit-top-grooved" style={{ opacity: brickOpacity }}>
                    <div className="grooved-brick-body">
                      <img
                        src={brickLock}
                        alt="Interlocking grooved brick"
                        className="grooved-brick-img"
                        loading="eager"
                      />
                      <div 
                        className="manufacturing-brick-shadow"
                        style={{ opacity: brickOpacity * 0.85 }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Specifications below brick visual */}
                    <div className="product-spec-block">
                      <span className="spec-heading">AVAILABLE SIZES</span>
                      <div className="spec-size-group">
                        <div className="spec-size-row">
                          <span className="spec-size-label">6-inch</span>
                          <span className="spec-size-sep" aria-hidden="true">·</span>
                          <span className="spec-size-dim">12″ L × 6″ B × 5″ H</span>
                        </div>
                        <div className="spec-size-row">
                          <span className="spec-size-label">8-inch</span>
                          <span className="spec-size-sep" aria-hidden="true">·</span>
                          <span className="spec-size-dim">12″ L × 8″ B × 5″ H</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. BOTTOM PLAIN BRICK: Named "MUN BRICK", horizontal orientation */}
                  <div className="floating-brick-unit unit-bottom-plain" style={{ opacity: brickOpacity }}>
                    <div className="plain-brick-body">
                      <img
                        src={plainLateriteBrick}
                        alt="Classic Mun Bricks laterite brick"
                        className="plain-brick-horizontal-img"
                        loading="eager"
                      />
                      <div 
                        className="manufacturing-brick-shadow plain-horizontal-shadow"
                        style={{ opacity: brickOpacity * 0.85 }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Specifications below brick visual */}
                    <div className="product-spec-block">
                      <span className="spec-heading mun-brick-name">MUN BRICK</span>
                      <div className="spec-size-row">
                        <span className="spec-size-dim">12″ L × 4″ B × 8″ H</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. The 3 factual points stacked cleanly */}
          <div className="d-flex flex-column gap-3 mb-4">
            {/* 01: Laterite Soil Bricks */}
            <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
              <div className="icon-box flex-shrink-0 mb-0" style={{ width: '42px', height: '42px', fontSize: '1.15rem' }}>
                <i className="bi bi-layers-fill"></i>
              </div>
              <div>
                <div className="text-terracotta fw-bold small text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>01</div>
                <h6 className="fw-bold mb-1 fs-6">Laterite Soil Bricks</h6>
                <p className="small text-muted mb-0">Compressed soil bricks made from laterite soil.</p>
              </div>
            </div>

            {/* 02: Deep-Sourced Laterite Soil */}
            <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
              <div className="icon-box flex-shrink-0 mb-0" style={{ width: '42px', height: '42px', fontSize: '1.15rem' }}>
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <div className="text-terracotta fw-bold small text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>02</div>
                <h6 className="fw-bold mb-1 fs-6">Deep-Sourced Laterite Soil</h6>
                <p className="small text-muted mb-0">Laterite soil is sourced from approximately 10 feet below the earth's surface.</p>
              </div>
            </div>

            {/* 03: Industry Experience */}
            <div className="d-flex align-items-start gap-3 p-3 manufacturing-feature-card">
              <div className="icon-box flex-shrink-0 mb-0" style={{ width: '42px', height: '42px', fontSize: '1.15rem' }}>
                <i className="bi bi-award-fill"></i>
              </div>
              <div>
                <div className="text-terracotta fw-bold small text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>03</div>
                <h6 className="fw-bold mb-1 fs-6">Industry Experience</h6>
                <p className="small text-muted mb-0">10 years of experience in Mun Interlock Bricks and 20 years of experience in laterite bricks.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;

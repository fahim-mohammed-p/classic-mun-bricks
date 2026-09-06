import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COVERAGE_METRICS } from '../data/projectsCoverage';
import { CONTACT_CONFIG } from '../config/contact';
import brickLock from '../assets/brick-lock.webp';
import brickGroove from '../assets/brick-groove.webp';
import '../styles/projects.css';

const Projects = () => {
  // Region selection: 'all' | 'kerala' | 'tamil-nadu'
  const [selectedRegionId, setSelectedRegionId] = useState('all');
  const [hoveredRegionId, setHoveredRegionId] = useState(null);

  // Modal / placeholder loading states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState('idle'); // 'loading' | 'ready'
  const [activeModalRegion, setActiveModalRegion] = useState(null);

  // Derive active region details
  const activeRegion =
    COVERAGE_METRICS.regions.find((r) => r.id === selectedRegionId) || null;

  // Handler to select region from map, pill button, or mobile tab
  const handleSelectRegion = (regionId) => {
    setSelectedRegionId(regionId);
  };

  // Trigger the loading & placeholder experience
  const handleOpenStories = (region) => {
    const targetRegion = region || activeRegion || COVERAGE_METRICS.regions[0];
    setActiveModalRegion(targetRegion);
    setModalStage('loading');
    setIsModalOpen(true);

    // 800ms smooth simulated loading transition
    const timer = setTimeout(() => {
      setModalStage('ready');
    }, 800);

    return () => clearTimeout(timer);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalStage('idle');
    setActiveModalRegion(null);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // WhatsApp link preparation
  const encodedMessage = encodeURIComponent(
    'Hello Classic Mun Bricks, I would like to discuss requirements for an upcoming project.'
  );
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${encodedMessage}`;

  return (
    <main className="projects-page">
      {/* ========================================================
          01 — COMPACT HERO SECTION
          ======================================================== */}
      <section className="projects-hero text-center">
        <div className="projects-hero-ambient" aria-hidden="true"></div>
        <div className="container position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <div className="projects-eyebrow mb-2">
              <i className="bi bi-geo-alt-fill text-terracotta"></i>
              <span>PROJECTS</span>
            </div>

            <h1 className="projects-hero-title">
              Built Across Kerala &amp; Tamil Nadu.
            </h1>

            <p className="projects-hero-desc">
              A growing portfolio of projects shaped by experience across both states.
            </p>

            {/* Compact Typographic Stats (Typography-driven hierarchy, no heavy cards) */}
            <div className="projects-stats-strip">
              <div className="stat-primary-group">
                <span className="stat-num-compact text-accent">
                  {COVERAGE_METRICS.totalProjects}
                </span>
                <span className="stat-label-compact">
                  {COVERAGE_METRICS.totalLabel}
                </span>
              </div>

              <div className="stat-divider-vertical" aria-hidden="true"></div>

              <div className="stat-sub-group">
                <div className="stat-item-compact">
                  <span className="stat-num-compact">1.5K+</span>
                  <span className="stat-label-compact">Kerala</span>
                </div>

                <div className="stat-divider-sub" aria-hidden="true"></div>

                <div className="stat-item-compact">
                  <span className="stat-num-compact">1K+</span>
                  <span className="stat-label-compact">Tamil Nadu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          02 — INTERACTIVE MAP & REGION EXPLORER SECTION
          ======================================================== */}
      <section className="projects-map-section">
        <div className="container">
          {/* Top State Filter Controls */}
          <div className="d-flex justify-content-center mb-3 mb-md-4">
            <div className="region-toggle-bar" role="tablist" aria-label="Region Selectors">
              <button
                type="button"
                role="tab"
                aria-selected={selectedRegionId === 'all'}
                className={`region-toggle-btn ${selectedRegionId === 'all' ? 'is-active' : ''}`}
                onClick={() => handleSelectRegion('all')}
              >
                <span>All Regions</span>
                <span className="region-toggle-badge">{COVERAGE_METRICS.totalProjects}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={selectedRegionId === 'kerala'}
                className={`region-toggle-btn ${selectedRegionId === 'kerala' ? 'is-active' : ''}`}
                onClick={() => handleSelectRegion('kerala')}
              >
                <span>Kerala</span>
                <span className="region-toggle-badge">1.5K+</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={selectedRegionId === 'tamil-nadu'}
                className={`region-toggle-btn ${selectedRegionId === 'tamil-nadu' ? 'is-active' : ''}`}
                onClick={() => handleSelectRegion('tamil-nadu')}
              >
                <span>Tamil Nadu</span>
                <span className="region-toggle-badge">1K+</span>
              </button>
            </div>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* LEFT / TOP: Stylized Interactive Vector Map */}
            <div className="col-lg-7">
              <div className="map-canvas-wrapper">
                <div className="map-ambient-glow" aria-hidden="true"></div>

                <svg
                  viewBox="0 0 600 720"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="map-svg-element"
                  aria-label="Interactive Kerala and Tamil Nadu Project Coverage Map"
                  role="img"
                >
                  <defs>
                    {/* Gradients */}
                    <linearGradient id="keralaGradient" x1="120" y1="90" x2="300" y2="700" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#2E343A" />
                      <stop offset="100%" stopColor="#1E2226" />
                    </linearGradient>

                    <linearGradient id="keralaGradientActive" x1="120" y1="90" x2="300" y2="700" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3C251F" />
                      <stop offset="100%" stopColor="#241612" />
                    </linearGradient>

                    <linearGradient id="tnGradient" x1="175" y1="100" x2="520" y2="705" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#2A3036" />
                      <stop offset="100%" stopColor="#1B1E22" />
                    </linearGradient>

                    <linearGradient id="tnGradientActive" x1="175" y1="100" x2="520" y2="705" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3C251F" />
                      <stop offset="100%" stopColor="#241612" />
                    </linearGradient>

                    {/* Subtle Architectural Grid Pattern */}
                    <pattern id="archGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <rect width="24" height="24" fill="none" />
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.8" />
                    </pattern>
                  </defs>

                  {/* Background Grid Pattern */}
                  <rect width="600" height="720" fill="url(#archGrid)" />

                  {/* ====================================================
                      KERALA STATE REGION SHAPE
                      ==================================================== */}
                  <g
                    className={`map-region-group ${selectedRegionId === 'kerala' ? 'is-active' : ''}`}
                    onClick={() => handleSelectRegion('kerala')}
                    onMouseEnter={() => setHoveredRegionId('kerala')}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    tabIndex="0"
                    role="button"
                    aria-pressed={selectedRegionId === 'kerala'}
                    aria-label="Kerala Region: 1.5K+ projects"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectRegion('kerala');
                      }
                    }}
                  >
                    <path
                      d="M 130 90 C 120 140 135 190 155 240 C 170 285 170 335 185 385 C 200 435 215 485 230 535 C 245 585 260 635 280 675 C 290 690 295 700 300 705 C 290 665 280 615 272 565 C 265 515 250 465 260 420 C 275 405 285 400 270 360 C 255 315 235 265 220 215 C 205 165 185 125 175 120 Z"
                      fill={selectedRegionId === 'kerala' ? 'url(#keralaGradientActive)' : 'url(#keralaGradient)'}
                      stroke={
                        selectedRegionId === 'kerala'
                          ? '#D96A43'
                          : hoveredRegionId === 'kerala'
                          ? '#B84A28'
                          : 'rgba(255, 255, 255, 0.22)'
                      }
                      strokeWidth={selectedRegionId === 'kerala' ? '3' : '1.5'}
                      className={`map-region-shape ${
                        selectedRegionId === 'kerala'
                          ? 'is-selected'
                          : selectedRegionId === 'tamil-nadu'
                          ? 'is-dimmed'
                          : ''
                      }`}
                    />

                    {/* Regional Label & Count Badge - Enlarged for Mobile Clarity */}
                    <g transform="translate(195, 305)" pointerEvents="all">
                      <rect
                        x="-65"
                        y="-25"
                        width="130"
                        height="48"
                        rx="24"
                        fill={selectedRegionId === 'kerala' ? 'rgba(184, 74, 40, 0.96)' : 'rgba(26, 29, 32, 0.9)'}
                        stroke={selectedRegionId === 'kerala' ? '#D96A43' : 'rgba(255, 255, 255, 0.24)'}
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="13"
                        fontWeight="700"
                        letterSpacing="1px"
                        fontFamily="var(--cmb-font-body)"
                      >
                        KERALA
                      </text>
                      <text
                        x="0"
                        y="14"
                        textAnchor="middle"
                        fill={selectedRegionId === 'kerala' ? '#FFFFFF' : '#D96A43'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="var(--cmb-font-heading)"
                      >
                        1.5K+ Projects
                      </text>
                    </g>
                  </g>

                  {/* ====================================================
                      TAMIL NADU STATE REGION SHAPE
                      ==================================================== */}
                  <g
                    className={`map-region-group ${selectedRegionId === 'tamil-nadu' ? 'is-active' : ''}`}
                    onClick={() => handleSelectRegion('tamil-nadu')}
                    onMouseEnter={() => setHoveredRegionId('tamil-nadu')}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    tabIndex="0"
                    role="button"
                    aria-pressed={selectedRegionId === 'tamil-nadu'}
                    aria-label="Tamil Nadu Region: 1K+ projects"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectRegion('tamil-nadu');
                      }
                    }}
                  >
                    <path
                      d="M 175 120 C 220 115 280 105 350 100 C 420 110 480 130 520 160 C 515 210 505 270 490 320 C 480 370 465 420 485 475 C 455 530 435 580 405 630 C 360 670 335 695 320 705 C 310 705 305 705 300 705 C 290 665 280 615 272 565 C 265 515 250 465 260 420 C 275 405 285 400 270 360 C 255 315 235 265 220 215 C 205 165 185 125 175 120 Z"
                      fill={selectedRegionId === 'tamil-nadu' ? 'url(#tnGradientActive)' : 'url(#tnGradient)'}
                      stroke={
                        selectedRegionId === 'tamil-nadu'
                          ? '#D96A43'
                          : hoveredRegionId === 'tamil-nadu'
                          ? '#B84A28'
                          : 'rgba(255, 255, 255, 0.22)'
                      }
                      strokeWidth={selectedRegionId === 'tamil-nadu' ? '3' : '1.5'}
                      className={`map-region-shape ${
                        selectedRegionId === 'tamil-nadu'
                          ? 'is-selected'
                          : selectedRegionId === 'kerala'
                          ? 'is-dimmed'
                          : ''
                      }`}
                    />

                    {/* Regional Label & Count Badge - Enlarged for Mobile Clarity */}
                    <g transform="translate(390, 360)" pointerEvents="all">
                      <rect
                        x="-72"
                        y="-25"
                        width="144"
                        height="48"
                        rx="24"
                        fill={selectedRegionId === 'tamil-nadu' ? 'rgba(184, 74, 40, 0.96)' : 'rgba(26, 29, 32, 0.9)'}
                        stroke={selectedRegionId === 'tamil-nadu' ? '#D96A43' : 'rgba(255, 255, 255, 0.24)'}
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="13"
                        fontWeight="700"
                        letterSpacing="1px"
                        fontFamily="var(--cmb-font-body)"
                      >
                        TAMIL NADU
                      </text>
                      <text
                        x="0"
                        y="14"
                        textAnchor="middle"
                        fill={selectedRegionId === 'tamil-nadu' ? '#FFFFFF' : '#D96A43'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="var(--cmb-font-heading)"
                      >
                        1K+ Projects
                      </text>
                    </g>
                  </g>

                  {/* ====================================================
                      SUPPLY FLOW VECTORS & AMBIENT PROJECT DOTS
                      ==================================================== */}
                  {/* Connecting Supply Lines from Chappanangadi Plant (175, 340) */}
                  <g opacity="0.65" pointerEvents="none">
                    <path d="M 175 340 Q 160 260 145 170" className="supply-route-line" />
                    <path d="M 175 340 Q 200 480 240 560" className="supply-route-line" />
                    <path d="M 240 560 Q 260 620 280 660" className="supply-route-line" />
                    <path d="M 175 340 Q 260 360 330 380" className="supply-route-line" />
                    <path d="M 330 380 Q 400 320 460 240" className="supply-route-line" />
                    <path d="M 330 380 Q 370 480 380 570" className="supply-route-line" />
                  </g>

                  {/* Kerala Ambient Project Nodes */}
                  <g pointerEvents="none">
                    <circle cx="140" cy="150" r="4.5" fill="#D96A43" className="project-node-dot node-pulse" />
                    <circle cx="155" cy="220" r="4" fill="#D96A43" className="project-node-dot node-pulse-delayed" />
                    <circle cx="185" cy="270" r="4" fill="#D96A43" className="project-node-dot node-pulse-alt" />
                    <circle cx="195" cy="410" r="4.5" fill="#D96A43" className="project-node-dot node-pulse" />
                    <circle cx="215" cy="470" r="4" fill="#D96A43" className="project-node-dot node-pulse-delayed" />
                    <circle cx="235" cy="530" r="4.5" fill="#D96A43" className="project-node-dot node-pulse-alt" />
                    <circle cx="260" cy="610" r="4" fill="#D96A43" className="project-node-dot node-pulse" />
                    <circle cx="280" cy="660" r="4" fill="#D96A43" className="project-node-dot node-pulse-delayed" />
                  </g>

                  {/* Tamil Nadu Ambient Project Nodes */}
                  <g pointerEvents="none">
                    <circle cx="310" cy="320" r="4" fill="#E58A67" className="project-node-dot node-pulse-delayed" />
                    <circle cx="340" cy="240" r="4.5" fill="#E58A67" className="project-node-dot node-pulse" />
                    <circle cx="410" cy="210" r="4" fill="#E58A67" className="project-node-dot node-pulse-alt" />
                    <circle cx="480" cy="190" r="4.5" fill="#E58A67" className="project-node-dot node-pulse" />
                    <circle cx="460" cy="280" r="4" fill="#E58A67" className="project-node-dot node-pulse-delayed" />
                    <circle cx="390" cy="310" r="4.5" fill="#E58A67" className="project-node-dot node-pulse" />
                    <circle cx="430" cy="410" r="4" fill="#E58A67" className="project-node-dot node-pulse-alt" />
                    <circle cx="355" cy="460" r="4.5" fill="#E58A67" className="project-node-dot node-pulse" />
                    <circle cx="390" cy="520" r="4" fill="#E58A67" className="project-node-dot node-pulse-delayed" />
                    <circle cx="350" cy="600" r="4.5" fill="#E58A67" className="project-node-dot node-pulse-alt" />
                  </g>

                  {/* Manufacturing Plant Hub Marker (Chappanangadi, Malappuram) */}
                  <g transform="translate(175, 340)" className="plant-marker-icon" pointerEvents="none">
                    <circle cx="0" cy="0" r="10" fill="rgba(184, 74, 40, 0.25)" />
                    <circle cx="0" cy="0" r="6" fill="#B84A28" stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                  </g>

                  {/* Plant Label Badge */}
                  <g transform="translate(175, 360)" pointerEvents="none">
                    <rect
                      x="-60"
                      y="-10"
                      width="120"
                      height="20"
                      rx="10"
                      fill="rgba(18, 20, 23, 0.85)"
                      stroke="rgba(184, 74, 40, 0.45)"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="8.5"
                      fontWeight="600"
                      letterSpacing="0.4px"
                    >
                      Factory &bull; Chappanangadi
                    </text>
                  </g>
                </svg>

                <div className="map-canvas-hint">
                  <i className="bi bi-hand-index-thumb me-1"></i> Tap Kerala or Tamil Nadu to inspect
                </div>
              </div>
            </div>

            {/* RIGHT / BOTTOM: Region Detail & Mobile Flow */}
            <div className="col-lg-5">
              {/* Mobile Quick State Tabs (Visible on screens < 992px) */}
              <div className="mobile-state-tabs d-lg-none mb-3" role="tablist">
                <button
                  type="button"
                  className={`mobile-state-tab-btn ${selectedRegionId === 'kerala' ? 'is-active' : ''}`}
                  onClick={() => handleSelectRegion('kerala')}
                >
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span className="tab-state-name">Kerala</span>
                    <span className="tab-state-count">1.5K+ Projects</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`mobile-state-tab-btn ${selectedRegionId === 'tamil-nadu' ? 'is-active' : ''}`}
                  onClick={() => handleSelectRegion('tamil-nadu')}
                >
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span className="tab-state-name">Tamil Nadu</span>
                    <span className="tab-state-count">1K+ Projects</span>
                  </div>
                </button>
              </div>

              {/* Dynamic Region Information Card */}
              <div className="region-card-panel">
                <div>
                  <div className="panel-eyebrow">
                    <span className="panel-state-tag">
                      {activeRegion ? activeRegion.name : 'South India Coverage'}
                    </span>
                    <span className="panel-count-badge">
                      {activeRegion ? `${activeRegion.projectCount} Projects` : '2.5K+ Total'}
                    </span>
                  </div>

                  <h2 className="panel-state-name">
                    {activeRegion ? activeRegion.name : 'Explore Our Project Presence'}
                  </h2>

                  <p className="panel-state-subtitle">
                    {activeRegion
                      ? activeRegion.tagline
                      : 'Select Kerala or Tamil Nadu on the map to explore regional delivery.'}
                  </p>

                  <p className="panel-description">
                    {activeRegion
                      ? activeRegion.description
                      : 'Classic Mun Bricks has built an established supply footprint delivering premium red clay and engineered wire cut bricks directly to residential, institutional, and commercial sites across Kerala and Tamil Nadu.'}
                  </p>

                  {activeRegion ? (
                    <ul className="panel-highlights-list">
                      {activeRegion.highlights.map((item, idx) => (
                        <li key={idx} className="panel-highlight-item">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="d-flex gap-2 mb-4 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm flex-fill py-2"
                        onClick={() => handleSelectRegion('kerala')}
                      >
                        <i className="bi bi-geo-alt-fill text-terracotta me-1"></i> Kerala (1.5K+)
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm flex-fill py-2"
                        onClick={() => handleSelectRegion('tamil-nadu')}
                      >
                        <i className="bi bi-geo-alt-fill text-terracotta me-1"></i> Tamil Nadu (1K+)
                      </button>
                    </div>
                  )}
                </div>

                <div className="panel-footer-actions">
                  <button
                    type="button"
                    className="panel-action-btn"
                    onClick={() => handleOpenStories(activeRegion)}
                  >
                    <span>
                      {activeRegion ? `Explore ${activeRegion.name} Projects` : 'Explore Project Stories'}
                    </span>
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          03 — SIMULATED LOADING & PLACEHOLDER EXPERIENCE
          ======================================================== */}
      {isModalOpen && (
        <div
          className="project-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          onClick={handleCloseModal}
        >
          <div
            className="project-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              aria-label="Close modal"
              onClick={handleCloseModal}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {modalStage === 'loading' ? (
              /* Step 1: Authentic Brick Loading Animation */
              <div>
                <div className="brick-loader-stage" aria-hidden="true">
                  <img
                    src={brickLock}
                    alt=""
                    className="loading-brick-left"
                  />
                  <img
                    src={brickGroove}
                    alt=""
                    className="loading-brick-right"
                  />
                </div>
                <div className="loading-spinner-ring" aria-hidden="true"></div>
                <h3 className="h5 fw-bold text-charcoal mb-1">
                  Loading project stories...
                </h3>
                <p className="small text-muted mb-0">
                  Retrieving geographic delivery records
                </p>
              </div>
            ) : (
              /* Step 2: Clear, Polite Temporary State */
              <div>
                <div className="modal-status-badge">
                  <i className="bi bi-hourglass-split"></i>
                  <span>Region Portfolio in Preparation</span>
                </div>

                <h3 id="modalTitle" className="modal-title">
                  Project stories from this region are being prepared.
                </h3>

                <p className="modal-body-text">
                  We are currently documenting photography, architectural drawings, and site specifications for our completed projects across{' '}
                  <strong>{activeModalRegion?.name || 'this region'}</strong>.
                  <br />
                  <span className="d-block mt-2 text-muted">
                    Check back soon for completed works, photos and locations.
                  </span>
                </p>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-outline-secondary modal-btn-back"
                    onClick={handleCloseModal}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back to Map
                  </button>
                  <Link
                    to="/contact"
                    className="btn btn-cmb-primary modal-btn-enquire"
                    onClick={handleCloseModal}
                  >
                    Enquire for Your Project
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          04 — FINAL CALL TO ACTION
          ======================================================== */}
      <section className="projects-cta-section">
        <div className="container position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '640px' }}>
            <h2 className="projects-cta-title">
              Planning Your Next Project?
            </h2>
            <p className="projects-cta-copy">
              Talk to Classic Mun Bricks about your requirements.
            </p>

            <div className="projects-cta-buttons">
              <Link to="/contact" className="btn-cta-contact">
                <i className="bi bi-envelope-fill"></i>
                <span>Contact Us</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-whatsapp"
              >
                <i className="bi bi-whatsapp"></i>
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;

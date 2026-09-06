import React from 'react';
import { Link } from 'react-router-dom';
import FloatingBricks from './FloatingBricks';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <FloatingBricks variant="home" />
      <div className="container position-relative z-2">

        <div className="row align-items-center g-5">
          {/* Hero Content Column */}
          <div className="col-lg-6">
            <div className="badge-tag mb-3">
              <i className="bi bi-fire"></i> ESTABLISHED MANUFACTURING EXCELLENCE
            </div>
            
            <h1 className="display-4 fw-bold text-white mb-3">
              Built on Strength.<br />
              <span className="text-terracotta">Fired for Generations.</span>
            </h1>

            <p className="lead text-light opacity-90 mb-4" style={{ maxWidth: '540px', fontSize: '1.15rem' }}>
              Engineered clay bricks crafted with high-density soil compaction and precision computerized kiln firing for structural integrity and lasting architectural beauty.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <Link to="/visit-us" className="btn-cmb-primary">
                Explore Our Factory <i className="bi bi-arrow-right"></i>
              </Link>
              <Link to="/projects" className="btn-cmb-secondary">
                View Our Projects
              </Link>
            </div>

            <div className="d-flex align-items-center gap-4 pt-3 border-top border-secondary border-opacity-25 text-light-50 small">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-fill-check text-terracotta fs-5"></i>
                <span>Structural Grade Tested</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-truck text-terracotta fs-5"></i>
                <span>Reliable Bulk Supply</span>
              </div>
            </div>
          </div>

          {/* Visual Container Column (Factory Image/Video Placeholder) */}
          <div className="col-lg-6">
            <div className="visual-placeholder-box">
              <div className="placeholder-badge">
                <i className="bi bi-camera-reels me-1"></i> Factory Media Area (Video / Image Placeholder)
              </div>
              
              {/* High Quality Rendered SVG Placeholder Graphic */}
              <svg 
                viewBox="0 0 600 420" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-100 h-auto d-block"
                style={{ borderRadius: 'var(--cmb-radius-lg)', background: '#181A1D' }}
              >
                <defs>
                  <linearGradient id="kilnGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2A1B16" />
                    <stop offset="50%" stopColor="#8F3318" />
                    <stop offset="100%" stopColor="#1A1D20" />
                  </linearGradient>
                  <linearGradient id="brickFill" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B84A28" />
                    <stop offset="100%" stopColor="#91361B" />
                  </linearGradient>
                  <pattern id="brickPattern" width="40" height="20" patternUnits="userSpaceOnUse">
                    <rect width="38" height="18" fill="#B84A28" rx="2" opacity="0.8" />
                    <line x1="0" y1="19" x2="40" y2="19" stroke="#1A1D20" strokeWidth="2" />
                    <line x1="39" y1="0" x2="39" y2="20" stroke="#1A1D20" strokeWidth="2" />
                  </pattern>
                </defs>

                {/* Background Atmosphere */}
                <rect width="600" height="420" fill="url(#kilnGlow)" />
                
                {/* Structural Brick Silhouette Grid */}
                <g opacity="0.4">
                  <rect x="50" y="80" width="500" height="260" fill="url(#brickPattern)" rx="8" />
                </g>

                {/* Kiln Tunnel Architectural Arch Visual */}
                <path d="M150 340 V 220 A 150 150 0 0 1 450 220 V 340 Z" fill="#141618" stroke="#D96A43" strokeWidth="3" opacity="0.9" />
                <path d="M190 340 V 240 A 110 110 0 0 1 410 240 V 340 Z" fill="#241410" stroke="#C68A36" strokeWidth="2" />

                {/* Thermal Fire Glow inside Tunnel */}
                <ellipse cx="300" cy="300" rx="90" ry="40" fill="#E26D46" opacity="0.6" style={{ filter: 'blur(20px)' }} />
                
                {/* Overlay Text */}
                <text x="300" y="270" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontFamily="Cinzel" fontWeight="bold" letterSpacing="1.5">
                  AUTOMATED KILN & MANUFACTURING
                </text>
                <text x="300" y="295" textAnchor="middle" fill="#EFECE6" fontSize="12" fontFamily="Plus Jakarta Sans" opacity="0.8">
                  Client Video Footage Slot (Ready for Production Upload)
                </text>

                {/* Play Button Indicator */}
                <circle cx="300" cy="200" r="32" fill="#B84A28" opacity="0.9" />
                <polygon points="293,188 313,200 293,212" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

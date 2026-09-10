import React from 'react';
import { Link } from 'react-router-dom';
import FloatingBricks from './FloatingBricks';

const Hero = () => {
  return (
    <section className="hero-section">
      {/* Design-based Brick Masonry Background Visual Layer */}
      <div className="hero-bg-visual" aria-hidden="true">
        <div className="hero-pattern-bg"></div>
        <div className="hero-bg-gradient-overlay"></div>
        <div className="hero-bg-glow-overlay"></div>
      </div>
      <FloatingBricks variant="home" />
      <div className="container position-relative z-2">
        <div className="row align-items-center">
          {/* Hero Content Column */}
          <div className="col-lg-8 col-xl-7">
            <h1 className="display-4 fw-bold text-white mb-3">
              Strong Beyond<br />
              <span className="text-terracotta">Any Bricks</span>
            </h1>

            <p className="lead text-light opacity-90 mb-4" style={{ maxWidth: '560px', fontSize: '1.15rem' }}>
              Compressed soil bricks made from laterite soil, shaped through carefully prepared material and hydraulic pressing for consistent form and dependable construction use.
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
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { Link } from 'react-router-dom';
import FloatingBricks from './FloatingBricks';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <FloatingBricks variant="home" />
      <div className="container position-relative z-2">
        <div className="row align-items-center">
          {/* Hero Content Column */}
          <div className="col-lg-8 col-xl-7">
            <h1 className="display-4 fw-bold text-white mb-3">
              Built on Strength.<br />
              <span className="text-terracotta">Fired for Generations.</span>
            </h1>

            <p className="lead text-light opacity-90 mb-4" style={{ maxWidth: '560px', fontSize: '1.15rem' }}>
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
        </div>
      </div>
    </section>
  );
};

export default Hero;

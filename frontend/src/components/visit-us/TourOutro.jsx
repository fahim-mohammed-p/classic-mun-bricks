import React from 'react';
import { Link } from 'react-router-dom';
import FloatingBricks from '../FloatingBricks';

/**
 * TourOutro Component
 * Thoughtful end-of-tour transition acknowledging continued production phases
 * and guiding the visitor to real completed architectural projects.
 */
const TourOutro = () => {
  return (
    <section className="tour-outro-section text-center">
      <div className="tour-outro-overlay" />
      <FloatingBricks variant="visit" />
      <div className="container position-relative z-2">

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1 d-block mb-3">
              Beyond The Shaping Die
            </span>

            {/* Factual Transition Statement */}
            <p className="tour-outro-transition-text">
              “The journey continues beyond shaping, with each stage handled with the same focus on quality and consistency.”
            </p>

            {/* Outro Heading */}
            <h2 className="tour-outro-heading">See Where Our Products Take Shape</h2>

            <p className="text-light opacity-75 mb-5 mx-auto" style={{ maxWidth: '580px', fontSize: '1.05rem' }}>
              Explore how Classic Mun Bricks are applied across residential structures, commercial landmarks, and exposed masonry architecture.
            </p>

            {/* Direct Projects Navigation CTA */}
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/projects" className="btn-cmb-primary py-3 px-4 fs-6">
                Explore Our Projects <i className="bi bi-arrow-right ms-2"></i>
              </Link>

              <Link to="/contact" className="btn-cmb-secondary py-3 px-4 fs-6">
                Contact Sales & Dispatch <i className="bi bi-telephone ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourOutro;

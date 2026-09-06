import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="section-padding bg-terracotta text-white text-center position-relative overflow-hidden">
      <div className="container position-relative z-1">
        <div className="mx-auto" style={{ maxWidth: '680px' }}>
          <span className="badge bg-white text-terracotta fw-bold px-3 py-2 text-uppercase mb-3 rounded-pill">
            Get In Touch
          </span>
          <h2 className="display-5 fw-bold text-white mb-3">
            Building Something Strong?
          </h2>
          <p className="lead text-white opacity-90 mb-4">
            Partner with Classic Mun Bricks for high-density structural clay supply, custom batch runs, and technical engineering support for your upcoming build.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/contact" className="btn btn-dark btn-lg px-4 py-3 fw-bold rounded-2 shadow">
              Contact Our Sales Team <i className="bi bi-envelope-fill ms-2"></i>
            </Link>
            <Link to="/visit-us" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-2">
              Request Factory Tour
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

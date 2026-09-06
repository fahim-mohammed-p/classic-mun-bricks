import React from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
  return (
    <div className="placeholder-page bg-sand text-center">
      <div className="container">
        <div className="mx-auto p-5 bg-white rounded-3 border border-secondary border-opacity-10 shadow-sm" style={{ maxWidth: '560px' }}>
          <div className="icon-box mx-auto mb-3">
            <i className="bi bi-building"></i>
          </div>
          <span className="badge bg-terracotta text-white mb-2">Upcoming Feature</span>
          <h1 className="fw-bold h2 mb-3">Projects Showcase</h1>
          <p className="text-muted mb-4">
            Comprehensive architectural project portfolio and interactive supply map coming soon.
          </p>
          <Link to="/" className="btn-cmb-outline-dark">
            <i className="bi bi-arrow-left"></i> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;

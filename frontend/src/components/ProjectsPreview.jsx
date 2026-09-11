import React from 'react';
import { Link } from 'react-router-dom';

const ProjectsPreview = () => {
  const projects = [
    {
      title: 'Grand Plaza Commercial Complex',
      location: 'Metro Central District',
      category: 'Commercial Facing Bricks',
      accentColor: '#B84A28'
    },
    {
      title: 'Heritage Courtyard Estate',
      location: 'Oakridge Valley',
      category: 'Laterite Masonry & Interlock',
      accentColor: '#91361B'
    },
    {
      title: 'Civic Cultural & Exhibition Center',
      location: 'Riverside Bay Area',
      category: 'Structural Load-Bearing Bricks',
      accentColor: '#C68A36'
    }
  ];

  return (
    <section className="section-padding bg-sand">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
          <div>
            <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1">
              Architectural Portfolio
            </span>
            <h2 className="display-6 fw-bold mt-2 mb-0">
              Featured Client Projects
            </h2>
          </div>

          <Link to="/projects" className="btn-cmb-outline-dark">
            View All Projects <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="row g-4">
          {projects.map((proj, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <div className="project-card">
                {/* Visual Image Placeholder */}
                <div className="visual-placeholder-box" style={{ borderRadius: '0', border: 'none' }}>
                  <div className="placeholder-badge">
                    <i className="bi bi-building me-1"></i> Project Photo Placeholder
                  </div>
                  <svg 
                    viewBox="0 0 400 250" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-100 h-auto d-block"
                  >
                    <rect width="400" height="250" fill="#202428" />
                    
                    {/* Architectural Facade Line Drawings */}
                    <g opacity="0.25">
                      <rect x="50" y="40" width="300" height="210" fill={proj.accentColor} rx="2" />
                      {/* Window Grids */}
                      <rect x="80" y="70" width="60" height="40" fill="#FFFFFF" />
                      <rect x="170" y="70" width="60" height="40" fill="#FFFFFF" />
                      <rect x="260" y="70" width="60" height="40" fill="#FFFFFF" />

                      <rect x="80" y="130" width="60" height="40" fill="#FFFFFF" />
                      <rect x="170" y="130" width="60" height="40" fill="#FFFFFF" />
                      <rect x="260" y="130" width="60" height="40" fill="#FFFFFF" />

                      <rect x="80" y="190" width="60" height="60" fill="#FFFFFF" />
                      <rect x="260" y="190" width="60" height="60" fill="#FFFFFF" />
                    </g>

                    <rect x="70" y="105" width="260" height="40" rx="2" fill="#141618" stroke="rgba(255,255,255,0.2)" />
                    <text x="200" y="130" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontFamily="Source Sans 3, sans-serif" fontWeight="600">
                      Real Client Structure Photo Slot
                    </text>
                  </svg>
                </div>

                <div className="project-card-body">
                  <div className="project-location">
                    <i className="bi bi-geo-alt-fill me-1"></i> {proj.location}
                  </div>
                  <h5 className="fw-bold mb-2">{proj.title}</h5>
                  <p className="small text-muted mb-0">{proj.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;

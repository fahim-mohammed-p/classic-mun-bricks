import React from 'react';
import { Link } from 'react-router-dom';

const FactoryPreview = () => {
  return (
    <section className="section-padding bg-charcoal text-white position-relative overflow-hidden">
      <div className="container position-relative z-1">
        <div className="row align-items-center g-5">
          {/* Visual Interactive Preview Box */}
          <div className="col-lg-6 order-lg-1 order-2">
            <div className="visual-placeholder-box border-terracotta border-opacity-25">
              <div className="placeholder-badge">
                <i className="bi bi-play-circle me-1"></i> Virtual Tour / Manufacturing Process Interactive Placeholder
              </div>

              <svg 
                viewBox="0 0 560 360" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-100 h-auto d-block"
                style={{ background: '#121417' }}
              >
                <rect width="560" height="360" fill="#15181C" />
                
                {/* Conveyor Grid */}
                <g opacity="0.3">
                  <path d="M0 300 L560 300" stroke="#B84A28" strokeWidth="6" />
                  <circle cx="100" cy="315" r="10" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="200" cy="315" r="10" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="300" cy="315" r="10" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="400" cy="315" r="10" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="500" cy="315" r="10" stroke="#FFFFFF" strokeWidth="2" />
                </g>

                {/* Conveyor Bricks Moving */}
                <rect x="80" y="260" width="70" height="35" fill="#B84A28" rx="3" opacity="0.8" />
                <rect x="180" y="260" width="70" height="35" fill="#D96A43" rx="3" opacity="0.9" />
                <rect x="280" y="260" width="70" height="35" fill="#B84A28" rx="3" opacity="0.9" />
                <rect x="380" y="260" width="70" height="35" fill="#8F3318" rx="3" opacity="0.8" />

                {/* Sensor Lines */}
                <line x1="280" y1="120" x2="280" y2="260" stroke="#C68A36" strokeDasharray="4 4" strokeWidth="2" />
                
                {/* Center Badge */}
                <rect x="130" y="110" width="300" height="60" rx="2" fill="#1A1D20" stroke="#B84A28" strokeWidth="2" />
                <text x="280" y="138" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="Libre Baskerville, serif" fontWeight="bold">
                  MANUFACTURING PROCESS TOUR
                </text>
                <text x="280" y="156" textAnchor="middle" fill="#EFECE6" fontSize="11" fontFamily="Source Sans 3, sans-serif" opacity="0.75">
                  Soil Preparation → Material Refining → Hydraulic Pressing → QC
                </text>
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div className="col-lg-6 order-lg-2 order-1">
            <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1">
              Factory Experience
            </span>
            <h2 className="display-6 fw-bold text-white mt-2 mb-4">
              Step Inside Our Brick Manufacturing Plant
            </h2>

            <p className="text-light opacity-80 mb-4" style={{ fontSize: '1.05rem' }}>
              Transparency and technical precision define our operational philosophy. We invite engineers, architects, and bulk purchasers to explore our raw material processing and hydraulic-pressing facility online.
            </p>

            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-check-circle-fill text-terracotta fs-5"></i>
                <span className="text-light opacity-90">Interactive step-by-step manufacturing workflow overview</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-check-circle-fill text-terracotta fs-5"></i>
                <span className="text-light opacity-90">Detailed technical specifications for compressive strength & porosity</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-check-circle-fill text-terracotta fs-5"></i>
                <span className="text-light opacity-90">Facility tour request booking options for client site visits</span>
              </div>
            </div>

            <Link to="/visit-us" className="btn-cmb-primary">
              Take a Virtual Factory Visit <i className="bi bi-box-arrow-up-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FactoryPreview;

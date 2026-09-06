import React from 'react';

const CompanyIntro = () => {
  return (
    <section className="section-padding bg-sand">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Text Content Column */}
          <div className="col-lg-6">
            <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1">
              Manufacturing Excellence
            </span>
            <h2 className="display-6 fw-bold mt-2 mb-4">
              Mastering the Art of High-Density Brick Manufacturing
            </h2>

            <p className="text-muted mb-4">
              Classic Mun Bricks is a premier manufacturer specializing in high-grade red clay bricks, structural solid bricks, and facing masonry. Founded on principles of raw material purity and continuous technological upgrade, we supply essential building materials to leading architectural and construction firms.
            </p>

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                    <i className="bi bi-layers-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Pure Clay Sourcing</h6>
                    <p className="small text-muted mb-0">Refined raw soil with zero synthetic binders.</p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="icon-box flex-shrink-0 mb-0" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                    <i className="bi bi-thermometer-sun"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Controlled Thermal Firing</h6>
                    <p className="small text-muted mb-0">Computerized kilns reaching over 1,000°C.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-3 bg-sand-muted border border-secondary border-opacity-10 d-flex align-items-center gap-3">
              <i className="bi bi-quote fs-2 text-terracotta"></i>
              <div className="small fw-semibold text-dark">
                "Our bricks are engineered to withstand extreme moisture, freeze-thaw cycles, and heavy structural load limits."
              </div>
            </div>
          </div>

          {/* Image Placeholder Column */}
          <div className="col-lg-6">
            <div className="position-relative">
              <div className="visual-placeholder-box" style={{ background: '#2C3137' }}>
                <div className="placeholder-badge">
                  <i className="bi bi-image me-1"></i> Client Factory / Machinery Photo Area
                </div>
                <svg 
                  viewBox="0 0 540 400" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-100 h-auto d-block"
                >
                  <rect width="540" height="400" fill="#24282D" />
                  
                  {/* Stylized Factory Yard & Brick Stacks Graphic */}
                  <g opacity="0.15">
                    {/* Grid of stacked bricks */}
                    <rect x="40" y="240" width="460" height="120" fill="#B84A28" rx="4" />
                    <line x1="40" y1="280" x2="500" y2="280" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="40" y1="320" x2="500" y2="320" stroke="#FFFFFF" strokeWidth="2" />
                    
                    {/* Vertical dividers */}
                    <line x1="120" y1="240" x2="120" y2="360" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="200" y1="240" x2="200" y2="360" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="280" y1="240" x2="280" y2="360" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="360" y1="240" x2="360" y2="360" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="440" y1="240" x2="440" y2="360" stroke="#FFFFFF" strokeWidth="2" />
                  </g>

                  {/* Silos & Industrial Architecture Vector Lines */}
                  <path d="M120 240 V 100 A 30 30 0 0 1 180 100 V 240 Z" fill="#363C44" stroke="#4A525D" strokeWidth="2" />
                  <path d="M220 240 V 80 A 35 35 0 0 1 290 80 V 240 Z" fill="#363C44" stroke="#4A525D" strokeWidth="2" />
                  
                  <polygon points="330,240 400,140 470,240" fill="#B84A28" opacity="0.6" />

                  {/* Text Badge */}
                  <rect x="140" y="170" width="260" height="44" rx="22" fill="#1A1D20" stroke="#B84A28" strokeWidth="1.5" />
                  <text x="270" y="197" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="Plus Jakarta Sans" fontWeight="600">
                    Client Factory & Clay Pit Photo Slot
                  </text>
                </svg>
              </div>

              {/* Stat Badge Callout */}
              <div 
                className="position-absolute bottom-0 start-0 translate-middle-y ms-md-n4 ms-2 bg-terracotta text-white p-3 rounded-3 shadow-lg"
                style={{ maxWidth: '200px' }}
              >
                <div className="h3 fw-bold mb-0">100%</div>
                <div className="small opacity-90">Natural Refractory Clay Formula</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;

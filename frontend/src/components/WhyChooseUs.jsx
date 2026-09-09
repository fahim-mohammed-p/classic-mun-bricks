import React from 'react';

const WhyChooseUs = () => {
  const points = [
    {
      icon: 'bi-award-fill',
      title: 'Decades of Craft',
      description: 'Extensive experience in brick formulation, ensuring consistent color tone, sharp edges, and structural density.'
    },
    {
      icon: 'bi-boxes',
      title: 'Quality Manufacturing',
      description: 'Strict quality control at every stage from raw laterite soil screening to automated moisture testing and final product inspection.'
    },
    {
      icon: 'bi-shield-lock-fill',
      title: 'Trusted Products',
      description: 'Engineered for high compressive strength, weather resistance, and minimal water absorption.'
    },
    {
      icon: 'bi-truck-flatbed',
      title: 'Reliable Supply',
      description: 'High-capacity hydraulic pressing facilities capable of fulfilling commercial and large-scale residential contractor orders on time.'
    }
  ];

  return (
    <section className="section-padding bg-white border-top border-bottom border-secondary border-opacity-10">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '640px' }}>
          <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1">
            Why Contractors Choose Us
          </span>
          <h2 className="display-6 fw-bold mt-2">
            Engineered for Structural Confidence
          </h2>
          <p className="text-muted">
            We deliver uniform masonry units designed to meet rigorous architectural specifications and construction deadlines.
          </p>
        </div>

        <div className="row g-4">
          {points.map((item, idx) => (
            <div key={idx} className="col-lg-3 col-md-6">
              <div className="feature-card">
                <div className="icon-box">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h5 className="fw-bold mb-3">{item.title}</h5>
                <p className="text-muted small mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

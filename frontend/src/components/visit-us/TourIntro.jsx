import React from 'react';

/**
 * TourIntro Component
 * Establishes factory authenticity with concise, factual narrative
 * highlighting real on-site operational footage.
 */
const TourIntro = () => {
  return (
    <section id="tour-intro" className="tour-intro-section text-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span className="tour-intro-badge">Authentic Factory Operations</span>
            <h2 className="tour-intro-heading">From Raw Material to Form</h2>
            <p className="tour-intro-text">
              The following stages showcase real footage recorded directly inside our manufacturing facility in Kerala. Follow each sequential phase of production to observe how raw natural clay is processed, conditioned, and shaped into reliable structural bricks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourIntro;

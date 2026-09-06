import React, { useState, useEffect, useRef } from 'react';
import HeroTour from '../components/visit-us/HeroTour';
import TourIntro from '../components/visit-us/TourIntro';
import FactoryTimelineNav from '../components/visit-us/FactoryTimelineNav';
import ProcessSection from '../components/visit-us/ProcessSection';
import TourOutro from '../components/visit-us/TourOutro';
import { FACTORY_PROCESSES } from '../data/factoryProcesses';
import '../styles/visit-us.css';

/**
 * VisitUs Page - Complete Virtual Factory Tour Experience
 * 
 * Provides customers (including remote clients across Tamil Nadu and beyond)
 * with an authentic, step-by-step virtual journey through the Kerala manufacturing plant.
 */
const VisitUs = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const journeyRef = useRef(null);

  // Set document title for SEO & clarity
  useEffect(() => {
    document.title = 'Virtual Factory Tour | Classic Mun Bricks';
  }, []);

  // Update vertical timeline progress bar smoothly on scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (journeyRef.current) {
            const rect = journeyRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const totalHeight = rect.height;
            const visibleTop = windowHeight * 0.5 - rect.top;

            if (visibleTop > 0 && totalHeight > 0) {
              const progress = Math.min(100, Math.max(0, (visibleTop / totalHeight) * 100));
              setScrollProgress(progress);
            } else if (visibleTop <= 0) {
              setScrollProgress(0);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleStartTour = () => {
    const firstProcess = document.getElementById('process-01');
    if (firstProcess) {
      firstProcess.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="visit-us-page bg-sand">
      {/* 1. Full-Width Cinematic Hero */}
      <HeroTour onStartTour={handleStartTour} />

      {/* 2. Short Factual Introduction Establishing Authenticity */}
      <TourIntro />

      {/* 3. Main Factory Journey Container */}
      <div ref={journeyRef} className="tour-journey-wrapper position-relative">
        {/* Connected Vertical Timeline Rail */}
        <div className="timeline-track-rail">
          <div
            className="timeline-track-progress"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        <div className="container position-relative z-2">
          <div className="row">
            {/* Desktop Sticky Stage Navigator (Large screens only) */}
            <div className="col-xl-3 col-lg-3 d-none d-lg-block">
              <FactoryTimelineNav
                processes={FACTORY_PROCESSES}
                activeStep={activeStep}
                onSelectStep={setActiveStep}
              />
            </div>

            {/* Continuous Alternating Process Sections */}
            <div className="col-xl-9 col-lg-9 col-12">
              <div className="processes-list">
                {FACTORY_PROCESSES.map((process) => (
                  <ProcessSection
                    key={process.id}
                    process={process}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    activeVideoId={activeVideoId}
                    setActiveVideoId={setActiveVideoId}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. End-of-Tour Transition & Projects CTA */}
      <TourOutro />
    </div>
  );
};

export default VisitUs;

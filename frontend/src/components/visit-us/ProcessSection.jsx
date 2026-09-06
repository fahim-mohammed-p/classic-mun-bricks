import React, { useRef, useEffect, useState } from 'react';
import ProcessMedia from './ProcessMedia';

/**
 * ProcessSection Component
 * Renders a single manufacturing stage with alternating grid layout on desktop,
 * stacked layout on mobile, and scroll observation for timeline sync.
 */
const ProcessSection = ({
  process,
  activeStep,
  setActiveStep,
  activeVideoId,
  setActiveVideoId,
}) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    id,
    stepNumber,
    formattedNumber,
    stageLabel,
    title,
    shortDescription,
    image,
    video,
    altText,
    badgeText,
    layout,
  } = process;

  const isCurrentActive = activeStep === stepNumber;
  const isPayoff = layout === 'cinematic';

  // IntersectionObserver to detect when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (setActiveStep) {
            setActiveStep(stepNumber);
          }
        }
      },
      {
        rootMargin: '-20% 0px -30% 0px',
        threshold: 0.2,
      }
    );

    const currentElem = sectionRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [stepNumber, setActiveStep]);

  // Determine column ordering based on layout
  const isMediaFirst = layout === 'text-right' || isPayoff;

  return (
    <section
      ref={sectionRef}
      id={`process-${formattedNumber}`}
      className={`process-section ${isCurrentActive ? 'is-active' : ''} ${
        isPayoff ? 'payoff-section' : ''
      }`}
      aria-label={`Process Step ${formattedNumber}: ${title}`}
    >
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          {/* Content Column */}
          <div
            className={`col-lg-6 process-content-col ${
              isMediaFirst ? 'order-lg-2' : 'order-lg-1'
            } order-1`}
          >
            <div className={`animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
              {/* Process Step Node & Stage Pill */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="process-node-number" title={`Process Step ${formattedNumber}`}>
                  {formattedNumber}
                </div>
                <div>
                  <span className="process-stage-pill">{stageLabel}</span>
                </div>
              </div>

              {/* Payoff Highlight Badge for Process 06 */}
              {isPayoff && (
                <div>
                  <span className="payoff-badge">
                    <i className="bi bi-award-fill me-1"></i> Formed Structural Payoff
                  </span>
                </div>
              )}

              {/* Process Title */}
              <h2 className="process-heading">{title}</h2>

              {/* Process Short Copy */}
              <p className="process-description">{shortDescription}</p>

              {/* Process Tags */}
              <div className="process-tag-list">
                <span className="process-tag-item">
                  <i className="bi bi-camera-video-fill"></i> Authentic Kerala Plant Footage
                </span>
                <span className="process-tag-item">
                  <i className="bi bi-shield-check"></i> Standardized Quality Control
                </span>
              </div>
            </div>
          </div>

          {/* Media Column */}
          <div
            className={`col-lg-6 process-media-col ${
              isMediaFirst ? 'order-lg-1' : 'order-lg-2'
            } order-2`}
          >
            <div className={`animate-media-scale ${isVisible ? 'is-visible' : ''}`}>
              <ProcessMedia
                stepNumber={stepNumber}
                image={image}
                video={video}
                altText={altText}
                badgeText={badgeText}
                activeVideoId={activeVideoId}
                setActiveVideoId={setActiveVideoId}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

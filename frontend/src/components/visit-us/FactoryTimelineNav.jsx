import React from 'react';

/**
 * FactoryTimelineNav Component
 * Secondary sticky stage navigator for desktop screens.
 * Allows direct smooth scrolling to any manufacturing stage.
 */
const FactoryTimelineNav = ({ processes, activeStep, onSelectStep }) => {
  const handleNavClick = (formattedNumber, stepNumber) => {
    if (onSelectStep) {
      onSelectStep(stepNumber);
    }
    const targetElement = document.getElementById(`process-${formattedNumber}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="sticky-tour-nav" aria-label="Virtual Factory Tour Navigation">
      <div className="sticky-nav-header">
        <i className="bi bi-compass me-1"></i> Factory Tour
      </div>
      <div className="d-flex flex-column gap-1">
        {processes.map((proc) => {
          const isActive = activeStep === proc.stepNumber;
          return (
            <button
              key={proc.id}
              type="button"
              className={`sticky-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(proc.formattedNumber, proc.stepNumber)}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="sticky-nav-num">{proc.formattedNumber}</span>
              <span className="text-truncate">{proc.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default FactoryTimelineNav;

import React, { useState, useEffect, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import { DISTRICT_NODES } from '../../data/districtMapConfig';
import { CONTACT_CONFIG } from '../../config/contact';

const BATCH_SIZE_DESKTOP = 12;
const BATCH_SIZE_MOBILE = 8;

/**
 * Helper to compute initial batch based on viewport width
 */
const getInitialBatchSize = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return BATCH_SIZE_MOBILE;
  }
  return BATCH_SIZE_DESKTOP;
};

/**
 * DistrictProjects Component
 * 
 * Scalable, image-only photo gallery for the active location.
 * Features incremental rendering (Load More), native lazy loading,
 * mobile-first responsive grid, and a lightweight zero-dependency lightbox viewer.
 */
const DistrictProjects = ({
  activeDistrictId,
  districtNodes = null,
  activeDistrictNode = null,
  projects = [],
  onSelectDistrict,
  resultsRef,
}) => {
  const activeDistrict =
    activeDistrictNode ||
    (districtNodes && activeDistrictId && districtNodes[activeDistrictId]) ||
    (activeDistrictId && activeDistrictId !== 'all' ? DISTRICT_NODES[activeDistrictId] : null);

  const districtDisplayName = activeDistrict ? activeDistrict.name : 'All Regions';

  // Incremental pagination state
  const [visibleCount, setVisibleCount] = useState(getInitialBatchSize);

  // Reset pagination whenever the active district changes
  useEffect(() => {
    setVisibleCount(getInitialBatchSize());
  }, [activeDistrictId]);

  const handleLoadMore = () => {
    const increment = (typeof window !== 'undefined' && window.innerWidth < 768)
      ? BATCH_SIZE_MOBILE
      : BATCH_SIZE_DESKTOP;
    setVisibleCount((prev) => prev + increment);
  };

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  // Lightbox Image Viewer State
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const handleOpenLightbox = (index) => {
    setActiveImageIndex(index);
  };

  const handleCloseLightbox = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  }, [projects.length]);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  }, [projects.length]);

  // Keyboard navigation & body scroll lock for lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeImageIndex, handleCloseLightbox, handlePrevImage, handleNextImage]);

  // Safe image attribute extractors for the lightbox
  const getImageSrc = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.image || item.src || item.url || '';
  };

  const getImageAlt = (item, idx) => {
    if (item && item.alt) return item.alt;
    return `${districtDisplayName} project photo ${idx + 1}`;
  };

  // WhatsApp inquiry URL for the active district
  const enquiryMessage = encodeURIComponent(
    `Hello Classic Mun Bricks, I am looking to procure bricks for a project in ${districtDisplayName}. Please share technical specifications, transport logistics & pricing.`
  );
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${enquiryMessage}`;

  return (
    <section className="district-projects-section" ref={resultsRef} id="project-results">
      <div className="container">
        {/* District Results Header */}
        <div className="district-header-card">
          <div className="row align-items-center justify-content-between g-3">
            <div className="col-md-8">
              <div className="district-eyebrow">
                <span className="badge-state-indicator">
                  {activeDistrict ? `${activeDistrict.state} Corridor` : 'South India Coverage'}
                </span>
                {activeDistrict?.isFactoryHub && (
                  <span className="badge-factory-indicator">
                    <i className="bi bi-star-fill me-1"></i> Manufacturing Plant &amp; HQ
                  </span>
                )}
              </div>

              <h2 className="district-section-title">
                {activeDistrict ? activeDistrict.name : 'All Projects'}
              </h2>

              {activeDistrict?.regionDesc && (
                <p className="district-section-subtitle">
                  {activeDistrict.regionDesc}
                </p>
              )}
            </div>

            <div className="col-md-4 text-md-end">
              <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                {activeDistrictId && activeDistrictId !== 'all' && (
                  <button
                    type="button"
                    className="btn-view-all-districts"
                    onClick={() => onSelectDistrict('all')}
                  >
                    <i className="bi bi-grid me-1"></i> View All Districts
                  </button>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-district-enquire"
                >
                  <i className="bi bi-whatsapp me-1"></i> Supply in {districtDisplayName}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            IMAGE-ONLY GALLERY OR MINIMAL EMPTY STATE
            ======================================================== */}
        {projects.length > 0 ? (
          <div className="location-gallery-wrapper">
            <div
              className="location-image-gallery"
              role="region"
              aria-label={`${districtDisplayName} Project Image Gallery`}
            >
              {visibleProjects.map((item, index) => (
                <ProjectCard
                  key={item.id || index}
                  project={item}
                  index={index}
                  onClick={() => handleOpenLightbox(index)}
                />
              ))}
            </div>

            {/* Incremental Display / Load More Button */}
            {hasMore && (
              <div className="gallery-load-more-wrap">
                <button
                  type="button"
                  className="btn-gallery-load-more"
                  onClick={handleLoadMore}
                >
                  <span>Load More</span>
                  <i className="bi bi-chevron-down ms-1"></i>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Clean, small, professional empty state per requirements */
          <div className="district-empty-state-compact">
            <i className="bi bi-images empty-state-compact-icon" aria-hidden="true"></i>
            <p className="empty-state-compact-text">
              {activeDistrict
                ? 'No project images added for this location yet.'
                : 'Project locations are being updated.'}
            </p>
          </div>
        )}
      </div>

      {/* ========================================================
          LIGHTWEIGHT IMAGE VIEWER / LIGHTBOX MODAL
          ======================================================== */}
      {activeImageIndex !== null && projects[activeImageIndex] && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={handleCloseLightbox}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={handleCloseLightbox}
              aria-label="Close image viewer"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Previous navigation button */}
            {projects.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn lightbox-prev-btn"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            )}

            {/* Large image frame */}
            <div className="lightbox-img-wrapper">
              <img
                src={getImageSrc(projects[activeImageIndex])}
                alt={getImageAlt(projects[activeImageIndex], activeImageIndex)}
                className="lightbox-img"
              />
            </div>

            {/* Next navigation button */}
            {projects.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn lightbox-next-btn"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            )}

            {/* Counter indicator */}
            {projects.length > 1 && (
              <div className="lightbox-counter" aria-live="polite">
                {activeImageIndex + 1} / {projects.length}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default DistrictProjects;

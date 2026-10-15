import React from 'react';

/**
 * ProjectCard Component
 * 
 * Scalable image-only gallery item.
 * Displays a single project photo with native lazy loading,
 * clean aspect ratio crop, and subtle hover interactions.
 */
const ProjectCard = ({ project, index = 0, onClick }) => {
  const src = project?.image || project?.src || project?.url || (typeof project === 'string' ? project : '');
  const alt = project?.alt || `Project photo ${index + 1}`;

  if (!src) {
    return null;
  }

  return (
    <button
      type="button"
      className="gallery-thumb-item"
      onClick={onClick}
      aria-label={`View enlarged image ${index + 1}`}
    >
      <img
        src={src}
        alt={alt}
        className="gallery-thumb-img"
        loading="lazy"
      />
      <span className="gallery-thumb-hover-overlay" aria-hidden="true">
        <i className="bi bi-arrows-fullscreen"></i>
      </span>
    </button>
  );
};

export default ProjectCard;

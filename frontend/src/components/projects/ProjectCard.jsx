import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';

/**
 * ProjectCard Component
 * 
 * Displays an individual completed architectural project.
 * Preserves the site's design system with sharp borders,
 * terracotta accents, and direct inquiry integration.
 */
const ProjectCard = ({ project }) => {
  const {
    title,
    location,
    state,
    category,
    productUsed,
    specs,
    year,
    image,
    description,
  } = project;

  // Prefilled WhatsApp message tailored to this specific project
  const whatsappText = encodeURIComponent(
    `Hello Classic Mun Bricks, I am inquiring about project style: "${title}" located in ${location} (${productUsed}). Please share technical details & supply availability for my site.`
  );
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${whatsappText}`;

  return (
    <article className="project-portfolio-card">
      {/* Image / Visual Showcase Container */}
      <div className="card-visual-frame">
        <img
          src={image}
          alt={`${title} - ${category} in ${location} built with ${productUsed}`}
          className="card-visual-img"
          loading="lazy"
        />
        <div className="card-visual-overlay" aria-hidden="true"></div>

        {/* Category Badge Top Left */}
        <span className="card-badge-category">
          {category}
        </span>

        {/* Year / State Badge Top Right */}
        <span className="card-badge-meta">
          <i className="bi bi-calendar-check me-1"></i>
          {year}
        </span>
      </div>

      {/* Card Body */}
      <div className="card-content-body">
        {/* District & Exact Location Tag */}
        <div className="card-location-meta">
          <i className="bi bi-geo-alt-fill text-terracotta me-1"></i>
          <span>{location}</span>
          <span className="location-state-tag">({state})</span>
        </div>

        {/* Project Title */}
        <h3 className="card-project-title">
          {title}
        </h3>

        {/* Product Spec Badge */}
        <div className="card-product-pill">
          <i className="bi bi-bricks me-1"></i>
          <span>{productUsed}</span>
        </div>

        {/* Project Description */}
        <p className="card-project-description">
          {description}
        </p>

        {/* Architectural Specs Strip */}
        {specs && (
          <div className="card-specs-strip">
            <i className="bi bi-rulers me-1 text-terracotta"></i>
            <span>{specs}</span>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="card-action-footer">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card-enquire"
            aria-label={`Inquire about ${title} on WhatsApp`}
          >
            <i className="bi bi-whatsapp me-1"></i>
            <span>Inquire for Similar Project</span>
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;

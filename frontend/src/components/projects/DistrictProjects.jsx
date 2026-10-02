import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { DISTRICT_NODES } from '../../data/districtMapConfig';
import { CONTACT_CONFIG } from '../../config/contact';
import { Link } from 'react-router-dom';

/**
 * DistrictProjects Component
 * 
 * Displays the filtered project cards for the active district or all regions.
 * Features animated transitions, district context headers, and enquiry fallbacks.
 */
const DistrictProjects = ({
  activeDistrictId,
  projects = [],
  onSelectDistrict,
  resultsRef,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeDistrict = activeDistrictId ? DISTRICT_NODES[activeDistrictId] : null;

  // Extract unique categories for secondary filter chips
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.category) {
        // Group into high-level tags
        if (p.category.toLowerCase().includes('residential') || p.category.toLowerCase().includes('villa')) {
          set.add('Residential');
        } else if (p.category.toLowerCase().includes('commercial') || p.category.toLowerCase().includes('office') || p.category.toLowerCase().includes('workspace')) {
          set.add('Commercial');
        } else if (p.category.toLowerCase().includes('institutional') || p.category.toLowerCase().includes('campus')) {
          set.add('Institutional');
        } else if (p.category.toLowerCase().includes('hospitality') || p.category.toLowerCase().includes('resort') || p.category.toLowerCase().includes('wellness')) {
          set.add('Hospitality');
        }
      }
    });
    return Array.from(set);
  }, [projects]);

  // Filter projects by category chip if selected
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => {
      const cat = p.category.toLowerCase();
      if (selectedCategory === 'Residential') return cat.includes('residential') || cat.includes('villa') || cat.includes('homestead');
      if (selectedCategory === 'Commercial') return cat.includes('commercial') || cat.includes('office') || cat.includes('workspace') || cat.includes('facade');
      if (selectedCategory === 'Institutional') return cat.includes('institutional') || cat.includes('campus');
      if (selectedCategory === 'Hospitality') return cat.includes('hospitality') || cat.includes('resort') || cat.includes('wellness');
      return true;
    });
  }, [projects, selectedCategory]);

  // WhatsApp enquiry for the active district
  const districtName = activeDistrict ? activeDistrict.name : 'Kerala & Tamil Nadu';
  const enquiryMessage = encodeURIComponent(
    `Hello Classic Mun Bricks, I am looking to procure bricks for a project in ${districtName}. Please share technical specifications, transport logistics & pricing.`
  );
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${enquiryMessage}`;

  return (
    <section className="district-projects-section" ref={resultsRef} id="project-results">
      <div className="container">
        {/* District Results Header */}
        <div className="district-header-card">
          <div className="row align-items-center justify-content-between g-3">
            <div className="col-lg-8">
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
                {activeDistrict
                  ? `Projects in ${activeDistrict.name}`
                  : 'Projects Across Kerala & Tamil Nadu'}
              </h2>

              <p className="district-section-subtitle">
                {activeDistrict
                  ? `${activeDistrict.tagline} — ${activeDistrict.regionDesc}`
                  : 'Showing verified client structures, residences, and institutions delivered across both states.'}
              </p>
            </div>

            {/* Quick District Action Buttons */}
            <div className="col-lg-4 text-lg-end">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
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
                  <i className="bi bi-whatsapp me-1"></i> Supply in {districtName}
                </a>
              </div>
            </div>
          </div>

          {/* Secondary Category Filter Chips */}
          {categories.length > 1 && (
            <div className="category-chips-bar">
              <span className="chips-label">Filter Category:</span>
              <button
                type="button"
                className={`category-chip-btn ${selectedCategory === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Typologies ({projects.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip-btn ${selectedCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="row g-4 project-cards-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="col-lg-4 col-md-6">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty / Additional Stories In Preparation State */
          <div className="district-empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-bricks"></i>
            </div>
            <h3 className="empty-state-title">
              Additional Project Stories Being Prepared for {districtName}
            </h3>
            <p className="empty-state-desc">
              We have supplied over {activeDistrict?.stateId === 'kerala' ? '1,500+' : '1,000+'} orders across this regional corridor.
              High-resolution photography and structural case studies are actively being documented.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cmb-primary"
              >
                <i className="bi bi-whatsapp me-1"></i> Request Supply &amp; Spec Sheet
              </a>
              <Link to="/contact" className="btn btn-outline-secondary">
                Contact Project Desk
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DistrictProjects;

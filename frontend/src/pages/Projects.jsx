import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { COVERAGE_METRICS } from '../data/projectsCoverage';
import {
  ALL_PROJECTS,
  getDistrictProjectCounts,
  getProjectsByDistrict,
  getProjectsByState,
} from '../data/projectsData';
import { DISTRICT_NODES } from '../data/districtMapConfig';
import { CONTACT_CONFIG } from '../config/contact';
import CountUp from '../components/CountUp';
import ProjectRouteMap from '../components/projects/ProjectRouteMap';
import DistrictProjects from '../components/projects/DistrictProjects';
import '../styles/projects.css';
import '../styles/project-route.css';

const Projects = () => {
  // Region selection: 'all' | 'kerala' | 'tamil-nadu'
  const [selectedStateId, setSelectedStateId] = useState('all');

  // Active district selection: 'malappuram' (default home base) | any districtId | 'all'
  const [activeDistrictId, setActiveDistrictId] = useState('malappuram');

  // Ref to project cards results section for smooth scroll
  const resultsRef = useRef(null);

  // Dynamic project counts per district calculated from verified projects data
  const projectCounts = useMemo(() => getDistrictProjectCounts(), []);

  // Filter projects depending on active district / state selection
  const displayedProjects = useMemo(() => {
    if (activeDistrictId && activeDistrictId !== 'all') {
      return getProjectsByDistrict(activeDistrictId);
    }
    if (selectedStateId && selectedStateId !== 'all') {
      return getProjectsByState(selectedStateId);
    }
    return ALL_PROJECTS;
  }, [activeDistrictId, selectedStateId]);

  // Smooth scroll helper
  const handleScrollToResults = () => {
    if (resultsRef.current) {
      const yOffset = -70; // Header clearance
      const element = resultsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handler for state toggle
  const handleSelectState = (stateId) => {
    setSelectedStateId(stateId);
  };

  // Handler for district selection
  const handleSelectDistrict = (districtId) => {
    setActiveDistrictId(districtId);
    if (districtId !== 'all') {
      const node = DISTRICT_NODES[districtId];
      if (node && node.stateId) {
        setSelectedStateId(node.stateId);
      }
    }
  };

  // WhatsApp link preparation
  const encodedMessage = encodeURIComponent(
    'Hello Classic Mun Bricks, I would like to discuss brick requirements for an upcoming project.'
  );
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${encodedMessage}`;

  return (
    <main className="projects-page">
      {/* ========================================================
          01 — COMPACT HERO SECTION
          ======================================================== */}
      <section className="projects-hero text-center">
        <div className="projects-hero-ambient" aria-hidden="true"></div>
        <div className="container position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <div className="projects-eyebrow mb-2">
              <i className="bi bi-geo-alt-fill text-terracotta"></i>
              <span>PROJECT FOOTPRINT</span>
            </div>

            <h1 className="projects-hero-title">
              Built Across Kerala &amp; Tamil Nadu.
            </h1>

            <p className="projects-hero-desc">
              A continuous delivery journey connecting our automated manufacturing plant at Kodur to architectural projects across both states.
            </p>

            {/* Compact Typographic Stats */}
            <div className="projects-stats-strip">
              <div className="stat-primary-group">
                <span className="stat-num-compact text-accent">
                  <CountUp value={COVERAGE_METRICS.totalProjects} />
                </span>
                <span className="stat-label-compact">
                  {COVERAGE_METRICS.totalLabel}
                </span>
              </div>

              <div className="stat-divider-vertical" aria-hidden="true"></div>

              <div className="stat-sub-group">
                <div className="stat-item-compact">
                  <span className="stat-num-compact">
                    <CountUp value="1.5K+" />
                  </span>
                  <span className="stat-label-compact">Kerala</span>
                </div>

                <div className="stat-divider-sub" aria-hidden="true"></div>

                <div className="stat-item-compact">
                  <span className="stat-num-compact">
                    <CountUp value="1K+" />
                  </span>
                  <span className="stat-label-compact">Tamil Nadu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          02 — GEOGRAPHIC ROUTE MAP SECTION
          ======================================================== */}
      <section className="projects-map-section">
        <div className="container">
          <ProjectRouteMap
            activeDistrictId={activeDistrictId}
            selectedStateId={selectedStateId}
            projectCounts={projectCounts}
            onSelectDistrict={handleSelectDistrict}
            onSelectState={handleSelectState}
            onScrollToResults={handleScrollToResults}
          />
        </div>
      </section>

      {/* ========================================================
          03 — DISTRICT PROJECTS SECTION & PORTFOLIO CARDS
          ======================================================== */}
      <DistrictProjects
        activeDistrictId={activeDistrictId}
        projects={displayedProjects}
        onSelectDistrict={handleSelectDistrict}
        resultsRef={resultsRef}
      />

      {/* ========================================================
          04 — FINAL CALL TO ACTION
          ======================================================== */}
      <section className="projects-cta-section">
        <div className="container position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '640px' }}>
            <h2 className="projects-cta-title">
              Planning Your Next Project?
            </h2>
            <p className="projects-cta-copy">
              Talk to Classic Mun Bricks about your architectural requirements, interlock specifications, and site logistics.
            </p>

            <div className="projects-cta-buttons">
              <Link to="/contact" className="btn-cta-contact">
                <i className="bi bi-envelope-fill"></i>
                <span>Contact Us</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-whatsapp"
              >
                <i className="bi bi-whatsapp"></i>
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;

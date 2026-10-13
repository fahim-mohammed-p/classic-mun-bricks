import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { COVERAGE_METRICS } from '../data/projectsCoverage';
import { ALL_PROJECTS } from '../data/projectsData';
import {
  DEFAULT_ACTIVE_LOCATIONS,
  buildDynamicProjectMap,
  slugify,
} from '../data/districtMapConfig';
import { API_ENDPOINTS } from '../config/api';
import { CONTACT_CONFIG } from '../config/contact';
import CountUp from '../components/CountUp';
import ProjectRouteMap from '../components/projects/ProjectRouteMap';
import DistrictProjects from '../components/projects/DistrictProjects';
import '../styles/projects.css';
import '../styles/project-route.css';

const Projects = () => {
  // Active locations fetched dynamically from backend (defaults to seed operational locations)
  const [locations, setLocations] = useState(DEFAULT_ACTIVE_LOCATIONS);

  // Region selection: 'all' | stateId
  const [selectedStateId, setSelectedStateId] = useState('all');

  // Active district selection: 'malappuram' (default home base) | any districtId | 'all'
  const [activeDistrictId, setActiveDistrictId] = useState('malappuram');

  // Ref to project gallery results section for smooth scroll
  const resultsRef = useRef(null);

  // Fetch active project locations from backend
  useEffect(() => {
    let isMounted = true;
    const fetchLocations = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PROJECT_LOCATIONS);
        if (response.ok) {
          const data = await response.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setLocations(data);
          }
        }
      } catch (err) {
        // Network/offline fallback: keeps DEFAULT_ACTIVE_LOCATIONS gracefully
        console.info('[Classic Mun Bricks] Using pre-compiled district route dataset.');
      }
    };

    fetchLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute dynamic coordinate projection and bezier routes
  const mapData = useMemo(() => {
    return buildDynamicProjectMap(locations);
  }, [locations]);

  // Synchronize active district if loaded locations don't contain current selection
  useEffect(() => {
    if (mapData.districtOrder && mapData.districtOrder.length > 0) {
      if (activeDistrictId !== 'all' && !mapData.districtNodes[activeDistrictId]) {
        const hubId = mapData.districtOrder.find((id) => mapData.districtNodes[id]?.isFactoryHub);
        setActiveDistrictId(hubId || mapData.districtOrder[0]);
      }
    }
  }, [mapData, activeDistrictId]);

  // Extract images associated with project locations in the backend
  const backendProjects = useMemo(() => {
    const list = [];
    locations.forEach((loc) => {
      const dSlug = loc.district_slug || slugify(loc.district);
      const plainSlug = slugify(loc.district);
      if (Array.isArray(loc.images)) {
        loc.images.forEach((img) => {
          let imageUrl = img.image || '';
          if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
            imageUrl = `${API_BASE_URL}${cleanPath}`;
          }
          list.push({
            id: `loc-img-${img.id}`,
            districtId: dSlug,
            districtSlug: dSlug,
            plainSlug: plainSlug,
            district: loc.district,
            state: loc.state,
            stateId: slugify(loc.state),
            image: imageUrl,
            caption: img.caption,
            alt: img.caption || `${loc.district} project photo`,
            order: img.order || 0,
          });
        });
      }
    });
    return list;
  }, [locations]);

  // Combined project items
  const allProjectItems = useMemo(() => {
    return [...backendProjects, ...ALL_PROJECTS];
  }, [backendProjects]);

  // Filter projects depending on active district / state selection
  const displayedProjects = useMemo(() => {
    if (activeDistrictId && activeDistrictId !== 'all') {
      const target = slugify(activeDistrictId);
      return allProjectItems.filter((p) => {
        const dId = slugify(p.districtId);
        const dSlug = slugify(p.districtSlug);
        const dName = slugify(p.plainSlug || p.district);
        return (
          dId === target ||
          dSlug === target ||
          dName === target ||
          (dId && dId.startsWith(target)) ||
          (target && target.startsWith(dName)) ||
          (dSlug && dSlug.startsWith(target))
        );
      });
    }
    if (selectedStateId && selectedStateId !== 'all') {
      const targetState = slugify(selectedStateId);
      return allProjectItems.filter((p) => {
        const pState = slugify(p.stateId || p.state);
        return pState === targetState;
      });
    }
    return allProjectItems;
  }, [activeDistrictId, selectedStateId, allProjectItems]);

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
    if (stateId === 'all') {
      setActiveDistrictId('all');
    } else {
      const stateNode = mapData.districtOrder
        .map((id) => mapData.districtNodes[id])
        .find((n) => n && n.stateId === stateId);
      if (stateNode) {
        setActiveDistrictId(stateNode.id);
      }
    }
  };

  // Handler for district selection
  const handleSelectDistrict = (districtId) => {
    setActiveDistrictId(districtId);
    if (districtId !== 'all') {
      const node = mapData.districtNodes[districtId];
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
            onSelectDistrict={handleSelectDistrict}
            onSelectState={handleSelectState}
            onScrollToResults={handleScrollToResults}
            mapData={mapData}
          />
        </div>
      </section>

      {/* ========================================================
          03 — DISTRICT PROJECTS SECTION & IMAGE-ONLY GALLERY
          ======================================================== */}
      <DistrictProjects
        activeDistrictId={activeDistrictId}
        districtNodes={mapData.districtNodes}
        activeDistrictNode={mapData.districtNodes[activeDistrictId]}
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

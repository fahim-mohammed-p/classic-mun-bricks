import React, { useState } from 'react';
import {
  MAP_DIMENSIONS,
  DISTRICT_NODES,
  DISTRICT_ORDER,
  MOBILE_MAP_DIMENSIONS,
  MOBILE_DISTRICT_NODES,
  MOBILE_ROUTE_SEGMENTS,
} from '../../data/districtMapConfig';
import RouteConnections from './RouteConnections';
import DistrictNode from './DistrictNode';

/**
 * ProjectRouteMap Component
 * 
 * Interactive geographic route visualization across Kerala and Tamil Nadu.
 * Features SVG bezier curves, responsive coordinate scaling, travelling light animations,
 * and seamless synchronization with district project results.
 */
const ProjectRouteMap = ({
  activeDistrictId,
  selectedStateId = 'all',
  projectCounts = {},
  onSelectDistrict,
  onSelectState,
  onScrollToResults,
}) => {
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);

  // Active district object
  const activeNode = activeDistrictId ? DISTRICT_NODES[activeDistrictId] : null;

  const handleDistrictClick = (districtId) => {
    onSelectDistrict(districtId);
    if (onScrollToResults) {
      // Small timeout to allow DOM to update before smooth scrolling
      setTimeout(() => {
        onScrollToResults();
      }, 120);
    }
  };

  return (
    <div className="project-route-map-container">
      {/* ========================================================
          01 — TOP ROUTE CONTROLS & CORRIDOR SELECTOR
          ======================================================== */}
      <div className="route-header-controls">
        <div className="route-filter-pills" role="tablist" aria-label="Geographic Corridors">
          <button
            type="button"
            role="tab"
            aria-selected={selectedStateId === 'all'}
            className={`route-pill-btn ${selectedStateId === 'all' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectState('all');
              onSelectDistrict('all');
            }}
          >
            <i className="bi bi-compass-fill me-1"></i>
            <span>Entire Journey (All Hubs)</span>
            <span className="pill-badge">2.5K+</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedStateId === 'kerala'}
            className={`route-pill-btn ${selectedStateId === 'kerala' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectState('kerala');
              onSelectDistrict('malappuram'); // Default to home base hub
            }}
          >
            <span className="dot-indicator dot-kerala"></span>
            <span>Kerala (Western Corridor)</span>
            <span className="pill-badge">1.5K+</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedStateId === 'tamil-nadu'}
            className={`route-pill-btn ${selectedStateId === 'tamil-nadu' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectState('tamil-nadu');
              onSelectDistrict('coimbatore'); // Default to TN gateway hub
            }}
          >
            <span className="dot-indicator dot-tn"></span>
            <span>Tamil Nadu (Eastern Corridor)</span>
            <span className="pill-badge">1K+</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          02 — MAIN SVG ROUTE VISUALIZATION CANVAS
          ======================================================== */}
      <div className="route-canvas-card">
        {/* Ambient Warm Gradient Glow Behind Map */}
        <div className="route-ambient-glow" aria-hidden="true"></div>

        {/* Legend / Info Strip */}
        <div className="route-legend-strip">
          <div className="legend-item">
            <span className="legend-beacon-factory"></span>
            <span>Kodur Automated Plant (HQ)</span>
          </div>
          <div className="legend-item">
            <span className="legend-route-line"></span>
            <span>Primary Supply Corridor</span>
          </div>
          <div className="legend-item">
            <span className="legend-node-dot"></span>
            <span>District Distribution Hub</span>
          </div>
        </div>

        {/* DESKTOP SVG Route Map (>= 768px) */}
        <div className="svg-canvas-wrapper d-none d-md-flex">
          <svg
            viewBox={MAP_DIMENSIONS.viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="route-svg-element"
            aria-label="Geographic Project Footprint Journey across Kerala and Tamil Nadu"
            role="img"
          >
            <defs>
              {/* Subtle Architectural Grid */}
              <pattern id="archGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <rect width="30" height="30" fill="none" />
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.028)"
                  strokeWidth="0.8"
                />
              </pattern>

              {/* State Zone Shading Gradients */}
              <linearGradient id="keralaZoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B94F2E" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#43281F" stopOpacity="0.02" />
              </linearGradient>

              <linearGradient id="tnZoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C68A36" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#43281F" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Background Grid Pattern */}
            <rect width="1000" height="580" fill="url(#archGrid)" />

            {/* Regional Zone Demarcations */}
            <g className="corridor-background-zones" pointerEvents="none">
              {/* Kerala Western Region Ambient Area */}
              <path
                d="M 60 40 C 220 30, 360 80, 420 280 C 440 370, 320 520, 100 540 Z"
                fill="url(#keralaZoneGrad)"
              />
              <text
                x="150"
                y="545"
                fill="rgba(255, 255, 255, 0.16)"
                fontSize="18"
                fontWeight="800"
                letterSpacing="0.15em"
                fontFamily="var(--cmb-font-body)"
              >
                KERALA CORRIDOR
              </text>

              {/* Tamil Nadu Eastern Region Ambient Area */}
              <path
                d="M 500 50 C 750 40, 940 70, 960 220 C 970 380, 850 540, 520 530 Z"
                fill="url(#tnZoneGrad)"
              />
              <text
                x="680"
                y="545"
                fill="rgba(255, 255, 255, 0.16)"
                fontSize="18"
                fontWeight="800"
                letterSpacing="0.15em"
                fontFamily="var(--cmb-font-body)"
              >
                TAMIL NADU CORRIDOR
              </text>

              {/* Trans-State Border Meridian (Subtle dashed divider between West and East) */}
              <line
                x1="465"
                y1="60"
                x2="465"
                y2="500"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <text
                x="465"
                y="45"
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.35)"
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.1em"
                fontFamily="var(--cmb-font-body)"
              >
                STATE BORDER
              </text>
            </g>

            {/* SVG Bezier Route Connections Layer */}
            <RouteConnections activeDistrictId={activeDistrictId} />

            {/* Interactive District Nodes */}
            <g className="district-nodes-layer">
              {DISTRICT_ORDER.map((districtId) => {
                const node = DISTRICT_NODES[districtId];
                if (!node) return null;
                const count = projectCounts[districtId] || 0;
                const isActive = activeDistrictId === districtId;
                const isHovered = hoveredDistrictId === districtId;

                return (
                  <DistrictNode
                    key={districtId}
                    node={node}
                    projectCount={count}
                    isActive={isActive}
                    isHovered={isHovered}
                    onSelect={handleDistrictClick}
                    onMouseEnter={() => setHoveredDistrictId(districtId)}
                    onMouseLeave={() => setHoveredDistrictId(null)}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* MOBILE DEDICATED SVG Route Map (< 768px: large touch targets, zero overlap, portrait flow) */}
        <div className="svg-canvas-wrapper d-md-none mobile-route-canvas-wrap">
          <svg
            viewBox={MOBILE_MAP_DIMENSIONS.viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="route-svg-element mobile-route-svg"
            aria-label="Geographic Project Footprint Journey across Kerala and Tamil Nadu"
            role="img"
          >
            <defs>
              <pattern id="archGridMobile" width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill="none" />
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.035)"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>

            <rect width="380" height="740" fill="url(#archGridMobile)" />

            {/* Corridor Demarcations & Labels */}
            <g className="mobile-corridor-zones" pointerEvents="none">
              {/* Kerala Zone Label */}
              <text
                x="28"
                y="38"
                fill="rgba(255, 255, 255, 0.22)"
                fontSize="11"
                fontWeight="800"
                letterSpacing="0.12em"
                fontFamily="var(--cmb-font-body)"
              >
                KERALA CORRIDOR
              </text>

              {/* Trans-State Border (Palakkad Gap Divider) */}
              <line
                x1="24"
                y1="290"
                x2="356"
                y2="290"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <text
                x="190"
                y="285"
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.45)"
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.1em"
                fontFamily="var(--cmb-font-body)"
              >
                INTERSTATE TRANSIT (PALAKKAD GAP)
              </text>

              {/* Tamil Nadu Zone Label */}
              <text
                x="28"
                y="315"
                fill="rgba(255, 255, 255, 0.22)"
                fontSize="11"
                fontWeight="800"
                letterSpacing="0.12em"
                fontFamily="var(--cmb-font-body)"
              >
                TAMIL NADU CORRIDOR
              </text>
            </g>

            {/* Mobile Bezier Route Connections */}
            <RouteConnections
              activeDistrictId={activeDistrictId}
              segments={MOBILE_ROUTE_SEGMENTS}
              isMobile={true}
            />

            {/* Mobile District Nodes with generous hit areas & clear positioning */}
            <g className="district-nodes-layer">
              {DISTRICT_ORDER.map((districtId) => {
                const node = MOBILE_DISTRICT_NODES[districtId];
                if (!node) return null;
                const count = projectCounts[districtId] || 0;
                const isActive = activeDistrictId === districtId;
                const isHovered = hoveredDistrictId === districtId;

                return (
                  <DistrictNode
                    key={`m-${districtId}`}
                    node={node}
                    projectCount={count}
                    isActive={isActive}
                    isHovered={isHovered}
                    onSelect={handleDistrictClick}
                    onMouseEnter={() => setHoveredDistrictId(districtId)}
                    onMouseLeave={() => setHoveredDistrictId(null)}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Bottom Interactive Touch Hint */}
        <div className="canvas-interactive-hint">
          <i className="bi bi-hand-index-thumb me-1"></i>
          <span>Tap any node along the route to inspect projects</span>
        </div>
      </div>

      {/* ========================================================
          03 — MOBILE & QUICK DISTRICT JOURNEY SELECTOR BAR
          ======================================================== */}
      <div className="mobile-journey-track-wrapper">
        <div className="journey-track-header">
          <span className="track-eyebrow">
            <i className="bi bi-signpost-2-fill text-terracotta me-1"></i>
            Quick Route Jump
          </span>
          <span className="track-note">Swipe along the supply path</span>
        </div>

        <div className="mobile-journey-scroll" role="tablist" aria-label="District Route Steps">
          {DISTRICT_ORDER.map((districtId, idx) => {
            const node = DISTRICT_NODES[districtId];
            const count = projectCounts[districtId] || 0;
            const isActive = activeDistrictId === districtId;

            return (
              <React.Fragment key={districtId}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`journey-step-chip ${isActive ? 'is-active' : ''} ${
                    node.isFactoryHub ? 'is-hub' : ''
                  }`}
                  onClick={() => handleDistrictClick(districtId)}
                >
                  <span className="chip-indicator">
                    {node.isFactoryHub ? '★' : idx + 1}
                  </span>
                  <span className="chip-name">{node.name}</span>
                  <span className="chip-count">{count}</span>
                </button>

                {idx < DISTRICT_ORDER.length - 1 && (
                  <span className="journey-step-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          04 — ACTIVE DISTRICT SUMMARY STRIP
          ======================================================== */}
      {activeNode && (
        <div className="active-district-banner">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="banner-pin-icon">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <div className="banner-eyebrow">
                  <span>Selected Hub • {activeNode.state}</span>
                  {activeNode.isFactoryHub && (
                    <span className="banner-hub-badge">Automated Plant</span>
                  )}
                </div>
                <h3 className="banner-title mb-0">{activeNode.name}</h3>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn-banner-scroll"
                onClick={onScrollToResults}
              >
                <span>View {projectCounts[activeDistrictId] || ''} Projects</span>
                <i className="bi bi-arrow-down-short ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRouteMap;

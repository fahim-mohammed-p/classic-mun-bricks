import React, { useState } from 'react';
import {
  MAP_DIMENSIONS,
  DISTRICT_NODES as DEFAULT_DISTRICT_NODES,
  DISTRICT_ORDER as DEFAULT_DISTRICT_ORDER,
  ROUTE_SEGMENTS as DEFAULT_ROUTE_SEGMENTS,
  MOBILE_MAP_DIMENSIONS,
  MOBILE_DISTRICT_NODES as DEFAULT_MOBILE_DISTRICT_NODES,
  MOBILE_ROUTE_SEGMENTS as DEFAULT_MOBILE_ROUTE_SEGMENTS,
} from '../../data/districtMapConfig';
import RouteConnections from './RouteConnections';
import DistrictNode from './DistrictNode';

/**
 * ProjectRouteMap Component
 * 
 * Interactive geographic route visualization across active Classic Mun Bricks districts.
 * Built with dynamic coordinate normalization, responsive SVG bezier tracks,
 * travelling light animations, and zero hardcoded states.
 */
const ProjectRouteMap = ({
  activeDistrictId,
  selectedStateId = 'all',
  onSelectDistrict,
  onSelectState,
  onScrollToResults,
  mapData = null,
}) => {
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);

  // Extract dynamic map data or fall back to pre-compiled default
  const districtNodes = mapData?.districtNodes || DEFAULT_DISTRICT_NODES;
  const districtOrder = mapData?.districtOrder || DEFAULT_DISTRICT_ORDER;
  const routeSegments = mapData?.routeSegments || DEFAULT_ROUTE_SEGMENTS;
  const beaconPathForward = mapData?.beaconPathForward;
  const beaconPathReverse = mapData?.beaconPathReverse;

  const mobileDistrictNodes = mapData?.mobileDistrictNodes || DEFAULT_MOBILE_DISTRICT_NODES;
  const mobileRouteSegments = mapData?.mobileRouteSegments || DEFAULT_MOBILE_ROUTE_SEGMENTS;
  const mobileBeaconPathForward = mapData?.mobileBeaconPathForward;
  const mobileBeaconPathReverse = mapData?.mobileBeaconPathReverse;

  const stateTabs = mapData?.stateTabs || [
    { id: 'all', name: 'Entire Journey (All Hubs)', isAll: true, color: '#FFAE68' },
    { id: 'kerala', name: 'Kerala Corridor', stateName: 'Kerala', firstDistrictId: 'malappuram', color: '#B94F2E' },
    { id: 'tamil-nadu', name: 'Tamil Nadu Corridor', stateName: 'Tamil Nadu', firstDistrictId: 'coimbatore', color: '#C68A36' },
  ];

  // Active district object
  const activeNode = activeDistrictId && activeDistrictId !== 'all' ? districtNodes[activeDistrictId] : null;

  const handleDistrictClick = (districtId) => {
    onSelectDistrict(districtId);
    if (onScrollToResults) {
      setTimeout(() => {
        onScrollToResults();
      }, 120);
    }
  };

  const hasLocations = districtOrder && districtOrder.length > 0;

  return (
    <div className="project-route-map-container">
      {/* ========================================================
          MAIN SVG ROUTE VISUALIZATION CANVAS
          ======================================================== */}
      <div className="route-canvas-card">
        {/* Ambient Warm Gradient Glow Behind Map */}
        <div className="route-ambient-glow" aria-hidden="true"></div>

        {!hasLocations ? (
          /* Professional empty state card when zero project locations exist */
          <div className="route-empty-state-card text-center">
            <div className="route-empty-icon">
              <i className="bi bi-geo-alt-fill text-terracotta" style={{ fontSize: '1.75rem' }}></i>
            </div>
            <h3 className="route-empty-title">
              Project locations are being updated.
            </h3>
            <p className="route-empty-text">
              Our active supply corridors and project network are currently being updated in the system. Real-time project locations will appear here once published.
            </p>
          </div>
        ) : (
          <>
            {/* Legend / Info Strip */}
            <div className="route-legend-strip">
              <div className="legend-item">
                <span className="legend-beacon-factory"></span>
                <span>Automated Plant (HQ)</span>
              </div>
              <div className="legend-item">
                <span className="legend-route-line"></span>
                <span>Supply Route</span>
              </div>
              <div className="legend-item">
                <span className="legend-node-dot"></span>
                <span>District Hub</span>
              </div>
            </div>

        {/* DESKTOP SVG Route Map (>= 768px) */}
        <div className="svg-canvas-wrapper d-none d-md-flex">
          <svg
            viewBox={MAP_DIMENSIONS.viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="route-svg-element"
            aria-label="Geographic Project Footprint Journey across active districts"
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
            </defs>

            {/* Background Grid Pattern */}
            <rect width="1000" height="580" fill="url(#archGrid)" />

            {/* Dynamic Regional Corridor Watermarks */}
            <g className="corridor-background-zones" pointerEvents="none">
              {stateTabs
                .filter((t) => !t.isAll)
                .map((tab) => {
                  const stateNodes = districtOrder
                    .map((id) => districtNodes[id])
                    .filter((n) => n && n.stateId === tab.id);
                  if (stateNodes.length === 0) return null;

                  const avgX = Math.round(
                    stateNodes.reduce((sum, n) => sum + n.x, 0) / stateNodes.length
                  );

                  return (
                    <text
                      key={tab.id}
                      x={avgX}
                      y="545"
                      textAnchor="middle"
                      fill="rgba(255, 255, 255, 0.14)"
                      fontSize="18"
                      fontWeight="800"
                      letterSpacing="0.15em"
                      fontFamily="var(--cmb-font-body)"
                    >
                      {tab.stateName ? tab.stateName.toUpperCase() : ''} CORRIDOR
                    </text>
                  );
                })}
            </g>

            {/* SVG Bezier Route Connections Layer */}
            <RouteConnections
              activeDistrictId={activeDistrictId}
              segments={routeSegments}
              beaconPathForward={beaconPathForward}
              beaconPathReverse={beaconPathReverse}
            />

            {/* Interactive District Nodes */}
            <g className="district-nodes-layer">
              {districtOrder.map((districtId) => {
                const node = districtNodes[districtId];
                if (!node) return null;
                const isActive = activeDistrictId === districtId;
                const isHovered = hoveredDistrictId === districtId;

                return (
                  <DistrictNode
                    key={districtId}
                    node={node}
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
            aria-label="Geographic Project Footprint Journey across active districts"
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

            <rect width={MOBILE_MAP_DIMENSIONS.width} height={MOBILE_MAP_DIMENSIONS.height} fill="url(#archGridMobile)" />

            {/* Mobile Bezier Route Connections */}
            <RouteConnections
              activeDistrictId={activeDistrictId}
              segments={mobileRouteSegments}
              beaconPathForward={mobileBeaconPathForward}
              beaconPathReverse={mobileBeaconPathReverse}
              isMobile={true}
            />

            {/* Mobile District Nodes with generous hit areas & clear positioning */}
            <g className="district-nodes-layer">
              {districtOrder.map((districtId) => {
                const node = mobileDistrictNodes[districtId];
                if (!node) return null;
                const isActive = activeDistrictId === districtId;
                const isHovered = hoveredDistrictId === districtId;

                return (
                  <DistrictNode
                    key={`m-${districtId}`}
                    node={node}
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
          <span>Tap any district along the route to inspect projects</span>
        </div>
      </>
    )}
  </div>

  {/* ========================================================
      03 — MOBILE & QUICK DISTRICT JOURNEY SELECTOR BAR
      ======================================================== */}
  {hasLocations && (
    <div className="mobile-journey-track-wrapper">
      <div className="journey-track-header">
        <span className="track-eyebrow">
          <i className="bi bi-signpost-2-fill text-terracotta me-1"></i>
          Quick Route Jump
        </span>
        <span className="track-note">Swipe along the supply path</span>
      </div>

      <div className="mobile-journey-scroll" role="tablist" aria-label="District Route Steps">
        {districtOrder.map((districtId, idx) => {
          const node = districtNodes[districtId];
          if (!node) return null;
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
              </button>

              {idx < districtOrder.length - 1 && (
                <span className="journey-step-arrow" aria-hidden="true">
                  &rarr;
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  )}

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
                <span>View Gallery</span>
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

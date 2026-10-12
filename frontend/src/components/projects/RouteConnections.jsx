import React from 'react';
import { ROUTE_SEGMENTS } from '../../data/districtMapConfig';

/**
 * RouteConnections Component
 * 
 * Renders dynamic SVG bezier trajectories, architectural gradient tracks,
 * subtle travelling light particles, and animated pulses connecting district nodes.
 */
const RouteConnections = ({
  activeDistrictId,
  segments = ROUTE_SEGMENTS,
  beaconPathForward,
  beaconPathReverse,
  isMobile = false,
}) => {
  // Check if an interstate transition exists in current segments (e.g. Palakkad Gap)
  const interstateSegment = segments.find((s) => s.isInterstateBorder);
  const hasPalakkadGap = segments.some(
    (s) =>
      (s.from === 'palakkad' && s.to === 'coimbatore') ||
      (s.from === 'coimbatore' && s.to === 'palakkad')
  );

  // Dynamic fallback for travelling light paths if not explicitly provided
  const fallbackForward = segments.map((s) => s.path).join(' ');
  const forwardPath = beaconPathForward || fallbackForward;
  const reversePath = beaconPathReverse || forwardPath;

  return (
    <g className="route-connections-layer" pointerEvents="none">
      <defs>
        {/* Route Line Gradients */}
        <linearGradient id="routeBaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B94F2E" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#C68A36" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#D96A43" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="routeActiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A50" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FFAE68" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF7A50" stopOpacity="0.95" />
        </linearGradient>

        {/* Travelling Light Glow Filter */}
        <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="activeNodeGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Interstate Mountain Pass (Palakkad Gap) Subtle Graphic Accent (Desktop only; rendered if route traverses it) */}
      {!isMobile && hasPalakkadGap && (
        <g className="interstate-gap-marker" opacity="0.45" transform="translate(470, 280)">
          <path
            d="M -25 25 L 0 0 L 25 25"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <path
            d="M -15 35 L 0 15 L 15 35"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
          <text
            x="0"
            y="48"
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.45)"
            fontSize="9"
            fontWeight="600"
            letterSpacing="0.08em"
            fontFamily="var(--cmb-font-body)"
          >
            PALAKKAD GAP
          </text>
        </g>
      )}

      {/* Render All Dynamic Route Tracks */}
      {segments.map((segment) => {
        const isConnectedToActive =
          activeDistrictId &&
          (segment.from === activeDistrictId || segment.to === activeDistrictId);

        return (
          <g key={segment.id} className="route-segment-group">
            {/* Ambient Background Track (Wider soft glow) */}
            <path
              d={segment.path}
              fill="none"
              stroke={isConnectedToActive ? 'rgba(217, 106, 67, 0.25)' : 'rgba(255, 255, 255, 0.05)'}
              strokeWidth={segment.type === 'main' ? '7' : '5'}
              strokeLinecap="round"
              className="route-path-backdrop"
            />

            {/* Core Route Line */}
            <path
              d={segment.path}
              fill="none"
              stroke={
                isConnectedToActive
                  ? 'url(#routeActiveGradient)'
                  : segment.type === 'main'
                  ? 'url(#routeBaseGradient)'
                  : 'rgba(255, 255, 255, 0.18)'
              }
              strokeWidth={isConnectedToActive ? '2.8' : segment.type === 'main' ? '2' : '1.4'}
              strokeDasharray={segment.type === 'branch' ? '5 5' : 'none'}
              strokeLinecap="round"
              className={`route-path-core ${isConnectedToActive ? 'is-active-route' : ''}`}
            />

            {/* Animated Subtle Travelling Pulse (Dotted travelling highlight) */}
            <path
              d={segment.path}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={isConnectedToActive ? '2.5' : '1.8'}
              strokeDasharray="8 45"
              strokeLinecap="round"
              opacity={isConnectedToActive ? '0.9' : '0.45'}
              className="route-travelling-pulse"
              filter="url(#routeGlow)"
            />
          </g>
        );
      })}

      {/* Travelling Light Beacons along the primary trunk line */}
      {forwardPath && (
        <g className="travelling-beacons">
          {/* Main continuous animated dot */}
          <circle r="3.5" fill="#FFB787" className="travelling-beacon-primary" filter="url(#routeGlow)">
            <animateMotion
              path={forwardPath}
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Counter-flow returning travelling beacon */}
          <circle r="2.8" fill="#FF9060" className="travelling-beacon-secondary" filter="url(#routeGlow)" opacity="0.8">
            <animateMotion
              path={reversePath}
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}
    </g>
  );
};

export default RouteConnections;

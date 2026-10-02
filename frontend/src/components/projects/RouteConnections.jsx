import React from 'react';
import { ROUTE_SEGMENTS } from '../../data/districtMapConfig';

/**
 * RouteConnections Component
 * 
 * Renders the SVG curved paths, architectural gradient tracks,
 * subtle travelling light particles, and animated pulses connecting district nodes.
 */
const RouteConnections = ({
  activeDistrictId,
  segments = ROUTE_SEGMENTS,
  isMobile = false,
}) => {
  const gapTransform = 'translate(470, 280)';
  const beaconPathForward = isMobile
    ? 'M 95 65 C 95 95, 95 125, 95 155 C 95 195, 195 210, 290 225 C 285 260, 280 295, 280 335 C 220 360, 155 385, 95 415 C 155 445, 220 470, 280 500 C 220 530, 155 555, 95 585'
    : 'M 140 110 C 145 170, 175 220, 230 220 C 275 245, 335 270, 390 290 C 440 305, 500 280, 550 270 C 595 255, 645 235, 690 220 C 730 205, 770 185, 810 160 C 845 135, 875 110, 910 90';
  const beaconPathReverse = isMobile
    ? 'M 95 585 C 155 555, 220 530, 280 500 C 220 470, 155 445, 95 415 C 155 385, 220 360, 280 335 C 280 295, 285 260, 290 225 C 195 210, 95 195, 95 155 C 95 125, 95 95, 95 65'
    : 'M 910 90 C 875 110, 845 135, 810 160 C 770 185, 730 205, 690 220 C 645 235, 595 255, 550 270 C 500 280, 440 305, 390 290 C 335 270, 275 245, 230 220 C 175 220, 145 170, 140 110';

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

      {/* Interstate Mountain Pass (Palakkad Gap) Subtle Graphic Accent (Desktop only; Mobile has dedicated divider) */}
      {!isMobile && (
        <g className="interstate-gap-marker" opacity="0.45" transform={gapTransform}>
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

      {/* Render All Base Route Tracks */}
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
      <g className="travelling-beacons">
        {/* Main continuous animated dot */}
        <circle r="3.5" fill="#FFB787" className="travelling-beacon-primary" filter="url(#routeGlow)">
          <animateMotion
            path={beaconPathForward}
            dur="9s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Counter-flow returning travelling beacon */}
        <circle r="2.8" fill="#FF9060" className="travelling-beacon-secondary" filter="url(#routeGlow)" opacity="0.8">
          <animateMotion
            path={beaconPathReverse}
            dur="12s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </g>
  );
};

export default RouteConnections;

import React from 'react';

/**
 * DistrictNode Component
 * 
 * Interactive SVG location node for a district on the geographic route.
 * Features concentric pulse rings, factory hub indicators, project counts,
 * and accessible touch/keyboard controls.
 */
const DistrictNode = ({
  node,
  projectCount = 0,
  isActive = false,
  isHovered = false,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { id, name, state, x, y, labelPos, isFactoryHub, hubLabel } = node;

  // Determine label offset relative to node coordinates (x, y)
  let labelTransform = '';
  let badgeWidth = 110;
  let badgeHeight = isFactoryHub ? 44 : 38;
  let textYOffset = isFactoryHub ? -5 : -3;
  let countYOffset = isFactoryHub ? 11 : 12;

  switch (labelPos) {
    case 'top':
      labelTransform = `translate(${x}, ${y - 32})`;
      break;
    case 'left':
      labelTransform = `translate(${x - 65}, ${y})`;
      break;
    case 'right':
      labelTransform = `translate(${x + 65}, ${y})`;
      break;
    case 'bottom':
    default:
      labelTransform = `translate(${x}, ${y + 32})`;
      break;
  }

  // Adjust badge width for longer labels or factory hub
  if (isFactoryHub) {
    badgeWidth = 126;
  } else if (name.length > 9) {
    badgeWidth = 118;
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <g
      className={`district-node-group ${isActive ? 'is-active' : ''} ${
        isHovered ? 'is-hovered' : ''
      } ${isFactoryHub ? 'is-factory-hub' : ''}`}
      onClick={() => onSelect(id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex="0"
      role="button"
      aria-pressed={isActive}
      aria-label={`${name}, ${state}. ${projectCount} Projects. Click to inspect projects.`}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      {/* ========================================================
          0. GENEROUS INVISIBLE TOUCH TARGET (Min 48px touch target)
          ======================================================== */}
      <circle cx={x} cy={y} r="26" fill="transparent" pointerEvents="all" />

      {/* ========================================================
          1. NODE MARKER & CONCENTRIC PULSE RINGS
          ======================================================== */}
      <g transform={`translate(${x}, ${y})`} className="node-marker-visual">
        {/* Ambient Outer Halo for Active / Factory Node */}
        {(isActive || isFactoryHub) && (
          <circle
            cx="0"
            cy="0"
            r={isActive ? '22' : '18'}
            fill={isActive ? 'rgba(217, 106, 67, 0.28)' : 'rgba(185, 79, 46, 0.2)'}
            className="node-pulse-outer"
          />
        )}

        {/* Outer Ring */}
        <circle
          cx="0"
          cy="0"
          r={isActive ? '13' : isHovered ? '11' : isFactoryHub ? '11' : '8.5'}
          fill={isActive ? '#B94F2E' : isHovered ? '#3D221A' : '#1F2327'}
          stroke={
            isActive
              ? '#FFAE68'
              : isHovered
              ? '#FF7A50'
              : isFactoryHub
              ? '#B94F2E'
              : 'rgba(255, 255, 255, 0.35)'
          }
          strokeWidth={isActive ? '2.5' : isFactoryHub ? '2' : '1.5'}
          className="node-ring-middle"
          filter={isActive ? 'url(#activeNodeGlow)' : 'none'}
        />

        {/* Center Core Pin */}
        <circle
          cx="0"
          cy="0"
          r={isActive ? '6' : isFactoryHub ? '5' : '4'}
          fill={isActive ? '#FFFFFF' : isFactoryHub ? '#FFAE68' : '#D96A43'}
          className="node-core-dot"
        />

        {/* Factory Hub Distinct Chimney Icon Accent */}
        {isFactoryHub && !isActive && (
          <circle
            cx="0"
            cy="0"
            r="1.8"
            fill="#FFFFFF"
          />
        )}
      </g>

      {/* ========================================================
          2. FLOATING DISTRICT LABEL & PROJECT COUNT BADGE (Clickable & Accessible)
          ======================================================== */}
      <g transform={labelTransform} className="node-label-group" pointerEvents="all">
        {/* Background Card Pill */}
        <rect
          x={-badgeWidth / 2}
          y={-badgeHeight / 2}
          width={badgeWidth}
          height={badgeHeight}
          rx={isFactoryHub ? '4' : '3'}
          fill={
            isActive
              ? 'rgba(185, 79, 46, 0.96)'
              : isHovered
              ? 'rgba(35, 38, 42, 0.95)'
              : 'rgba(22, 24, 27, 0.9)'
          }
          stroke={
            isActive
              ? '#FFAE68'
              : isHovered
              ? 'rgba(217, 106, 67, 0.65)'
              : isFactoryHub
              ? 'rgba(185, 79, 46, 0.5)'
              : 'rgba(255, 255, 255, 0.16)'
          }
          strokeWidth={isActive ? '1.5' : '1'}
          className="node-badge-rect"
          filter="drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))"
        />

        {/* Factory Hub Tag (if applicable) */}
        {isFactoryHub && (
          <text
            x="0"
            y="-10"
            textAnchor="middle"
            fill="#FFD2B0"
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.06em"
            fontFamily="var(--cmb-font-body)"
            className="node-tag-factory"
          >
            ★ {hubLabel || 'PLANT & HQ'}
          </text>
        )}

        {/* District Name */}
        <text
          x="0"
          y={textYOffset}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={isActive ? '12' : '11'}
          fontWeight={isActive ? '700' : '600'}
          letterSpacing="0.02em"
          fontFamily="var(--cmb-font-body)"
          className="node-text-name"
        >
          {name}
        </text>

        {/* Project Count */}
        <text
          x="0"
          y={countYOffset}
          textAnchor="middle"
          fill={isActive ? '#FFE3D1' : '#FFAE68'}
          fontSize="9.5"
          fontWeight="600"
          fontFamily="var(--cmb-font-body)"
          className="node-text-count"
        >
          {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
        </text>
      </g>
    </g>
  );
};

export default DistrictNode;

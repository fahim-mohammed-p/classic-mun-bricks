/**
 * Geographic Route & District Configuration for Classic Mun Bricks
 *
 * Fully dynamic coordinate projection and bezier supply route architecture.
 * Normalizes latitude and longitude dynamically across all active Indian districts.
 * Supports expansion to any state or district in India without manual x/y editing.
 */

export const MAP_DIMENSIONS = {
  width: 1000,
  height: 580,
  viewBox: '0 0 1000 580',
};

export const MOBILE_MAP_DIMENSIONS = {
  width: 380,
  height: 440,
  viewBox: '0 0 380 440',
};

/**
 * Standard slug generator for district and state IDs
 */
export const slugify = (str) =>
  str
    ? String(str)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : '';

/**
 * Curated color palette for state corridor indicators
 */
const CORRIDOR_COLORS = [
  { accent: '#B94F2E', glow: 'rgba(185, 79, 46, 0.25)' },
  { accent: '#C68A36', glow: 'rgba(198, 138, 54, 0.25)' },
  { accent: '#4E8A72', glow: 'rgba(78, 138, 114, 0.25)' },
  { accent: '#5E72E4', glow: 'rgba(94, 114, 228, 0.25)' },
  { accent: '#E07A5F', glow: 'rgba(224, 122, 95, 0.25)' },
];

export const getCorridorColor = (indexOrName) => {
  if (typeof indexOrName === 'number') {
    return CORRIDOR_COLORS[indexOrName % CORRIDOR_COLORS.length];
  }
  let hash = 0;
  const str = String(indexOrName || '');
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i)) % CORRIDOR_COLORS.length;
  }
  return CORRIDOR_COLORS[hash];
};

/**
 * Classic Mun Bricks active district locations.
 * Sourced dynamically from Django Admin backend API.
 */
export const DEFAULT_ACTIVE_LOCATIONS = [];

/**
 * Generic Sublinear Gap-Compression Coordinate Projection
 *
 * Preserves relative geographic direction (monotonicity) and local cluster proportions,
 * while sublinearly compressing massive inter-cluster distance chasms (e.g. South India -> Ladakh).
 *
 * @param {number[]} values Array of raw coordinates (latitudes or longitudes)
 * @param {number} targetRange Total canvas size along this axis (e.g. 1000 for width, 580 for height)
 * @param {number} padStart Safe margin at the start (min coordinate side)
 * @param {number} padEnd Safe margin at the end (max coordinate side)
 * @param {boolean} invert True for latitude (since higher lat = North = smaller SVG y)
 * @returns {Map<number, number>} Map from raw coordinate value to projected pixel coordinate
 */
export function compressDimension(values, targetRange, padStart, padEnd, invert = false) {
  if (!Array.isArray(values) || values.length === 0) {
    return new Map();
  }

  // Deduplicate and sort values ascending
  const sorted = Array.from(
    new Set(values.map((v) => Number(v)).filter((v) => Number.isFinite(v)))
  ).sort((a, b) => a - b);

  const available = Math.max(1, targetRange - padStart - padEnd);

  if (sorted.length === 0) {
    return new Map();
  }

  // If single value, place centered in the safe area
  if (sorted.length === 1) {
    const mid = padStart + available / 2;
    return new Map([[sorted[0], Math.round(mid)]]);
  }

  // Calculate gaps between consecutive sorted values
  const gaps = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    gaps.push(sorted[i + 1] - sorted[i]);
  }

  const sumGaps = gaps.reduce((a, b) => a + b, 0);
  if (sumGaps <= 0.00001) {
    const mid = padStart + available / 2;
    const lookup = new Map();
    sorted.forEach((val) => lookup.set(val, Math.round(mid)));
    return lookup;
  }

  // Analyze gap distribution
  const sortedGaps = [...gaps].sort((a, b) => a - b);
  const q75Gap = sortedGaps[Math.floor(sortedGaps.length * 0.75)] || 0.25;
  // Local cluster threshold: gaps smaller than this are kept strictly proportional
  const baseScale = Math.max(0.15, q75Gap * 1.4);
  const maxGap = Math.max(...gaps);
  const otherGapsSum = sumGaps - maxGap;

  // Sublinearly compress outlier gaps while leaving intra-cluster gaps linear
  const compressedGaps = gaps.map((g) => {
    if (g <= baseScale) return g;
    const excess = g - baseScale;
    let comp = baseScale + baseScale * Math.pow(excess / baseScale, 0.35);
    // If there is an existing cluster, cap the single outlier transit gap
    // so it doesn't dominate more than ~85% of the total cluster span
    if (otherGapsSum > 0) {
      const maxAllowed = Math.max(baseScale, otherGapsSum * 0.85);
      if (comp > maxAllowed) {
        comp = maxAllowed;
      }
    }
    return comp;
  });

  // Calculate cumulative compressed positions
  const compPos = [0];
  for (let i = 0; i < compressedGaps.length; i++) {
    compPos.push(compPos[i] + compressedGaps[i]);
  }
  const totalComp = compPos[compPos.length - 1] || 1;

  // Map each sorted coordinate to pixel position
  const lookup = new Map();
  sorted.forEach((val, idx) => {
    const norm = compPos[idx] / totalComp;
    const pixel = invert
      ? padStart + (1 - norm) * available
      : padStart + norm * available;
    lookup.set(val, Math.round(pixel));
  });

  return lookup;
}

/**
 * Calculates dynamic geographic projection and bezier supply routes
 * from any list of active Indian district records.
 *
 * @param {Array} locations Array of project location records from API or fallback
 * @returns {Object} Complete responsive map model with nodes, segments, and order
 */
export const buildDynamicProjectMap = (locations = []) => {
  const emptyMapResult = {
    districtNodes: {},
    districtOrder: [],
    routeSegments: [],
    beaconPathForward: '',
    beaconPathReverse: '',
    mobileDistrictNodes: {},
    mobileRouteSegments: [],
    mobileBeaconPathForward: '',
    mobileBeaconPathReverse: '',
    stateTabs: [{ id: 'all', name: 'All Locations', isAll: true }],
  };

  if (!Array.isArray(locations) || locations.length === 0) {
    return emptyMapResult;
  }

  // Filter valid coordinates
  const validLocations = locations.filter((loc) => {
    const lat = parseFloat(loc.latitude);
    const lng = parseFloat(loc.longitude);
    const valid = Number.isFinite(lat) && Number.isFinite(lng);
    if (!valid && typeof console !== 'undefined') {
      console.warn(
        `[Classic Mun Bricks] Location "${loc.district || loc.name}" missing valid coordinates: lat=${loc.latitude}, lng=${loc.longitude}`
      );
    }
    return valid;
  });

  if (validLocations.length === 0) {
    return emptyMapResult;
  }

  // 1. Extract Valid Coordinates
  const lats = validLocations.map((l) => parseFloat(l.latitude));
  const lngs = validLocations.map((l) => parseFloat(l.longitude));

  // 2. Normalization Bounds with Safe Margins for Desktop
  const dPadX = 110;
  const dPadY = 80;

  // Generate cluster-aware sublinear projections for Desktop
  const xLookup = compressDimension(lngs, MAP_DIMENSIONS.width, dPadX, dPadX, false);
  const yLookup = compressDimension(lats, MAP_DIMENSIONS.height, dPadY, dPadY, true);

  // 3. Normalized Desktop Node Map
  const nodes = [];
  validLocations.forEach((loc, idx) => {
    const id = loc.district_slug || slugify(loc.district || loc.name);
    const name = loc.district || loc.name;
    const state = loc.state || 'India';
    const stateId = slugify(state);
    const lat = parseFloat(loc.latitude);
    const lng = parseFloat(loc.longitude);

    // Desktop coordinates (Cluster-compressed, North = top = smaller Y)
    const x = xLookup.get(lng) ?? Math.round(MAP_DIMENSIONS.width / 2);
    const y = yLookup.get(lat) ?? Math.round(MAP_DIMENSIONS.height / 2);

    // Accessible smart label positioning for desktop
    let labelPos = 'bottom';
    if (y > 470) labelPos = 'top';
    else if (y < 120) labelPos = 'bottom';
    else if (x > 800) labelPos = 'left';
    else if (x < 220) labelPos = 'right';
    else labelPos = idx % 2 === 0 ? 'top' : 'bottom';

    nodes.push({
      id,
      name,
      state,
      stateId,
      stateCode: loc.state_code || '',
      lat,
      lng,
      x,
      y,
      xPct: Math.round((x / 1000) * 100),
      yPct: Math.round((y / 580) * 100),
      labelPos,
      mobile: {
        x: 190,
        y: 220,
        labelPos: 'left',
      },
      isFactoryHub: Boolean(loc.is_factory_hub),
      hubLabel: loc.hub_label || (loc.is_factory_hub ? 'Plant & HQ (Kodur)' : ''),
      order: typeof loc.order === 'number' ? loc.order : idx + 1,
      images: loc.images || [],
      imageCount: loc.image_count || (loc.images ? loc.images.length : 0),
    });
  });

  // 4. Determine Visual Supply Chain Ordering
  const hasDistinctOrder = new Set(nodes.map((n) => n.order)).size > 1;
  let orderedNodes = [];

  if (hasDistinctOrder) {
    orderedNodes = [...nodes].sort((a, b) => a.order - b.order);
  } else {
    // Greedy nearest-neighbor traversal from hub or westernmost node
    const unvisited = [...nodes];
    const hubIndex = unvisited.findIndex((n) => n.isFactoryHub);
    const startIndex = hubIndex >= 0 ? hubIndex : 0;
    let current = unvisited.splice(startIndex, 1)[0];
    orderedNodes.push(current);

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dLat = unvisited[i].lat - current.lat;
        const dLng = unvisited[i].lng - current.lng;
        const dist = dLat * dLat + dLng * dLng;
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      current = unvisited.splice(nearestIdx, 1)[0];
      orderedNodes.push(current);
    }
  }

  // 4b. Dedicated Mobile Route Layout Strategy:
  // Compact, intuitive portrait journey layout (viewBox 380 x 440)
  // Replaces jagged EKG/CPR spikes with a smooth, continuous transit flow.
  // Western districts flank the left corridor, Eastern districts flank the right corridor,
  // with labels comfortably contained and completely non-overlapping.
  const N = orderedNodes.length;
  const orderedLngs = orderedNodes.map((n) => n.lng);
  const minLng = Math.min(...orderedLngs);
  const maxLng = Math.max(...orderedLngs);
  const spanLng = maxLng - minLng > 0.05 ? maxLng - minLng : 1.0;

  const mPadTop = 46;
  const mPadBottom = 46;
  const availableY = MOBILE_MAP_DIMENSIONS.height - mPadTop - mPadBottom;

  orderedNodes.forEach((node, idx) => {
    // Vertical progression: strictly increasing down the journey
    const my = N <= 1
      ? Math.round(MOBILE_MAP_DIMENSIONS.height / 2)
      : Math.round(mPadTop + (idx / (N - 1)) * availableY);

    // Horizontal placement: authentic West vs East corridor lanes
    const normLng = (node.lng - minLng) / spanLng;
    let mx;
    let mLabelPos;

    if (normLng < 0.45) {
      // Western Corridor (e.g. Kerala): X in [130, 156]
      const subNorm = normLng / 0.45;
      mx = Math.round(130 + subNorm * 26);
      mLabelPos = 'left';
    } else {
      // Eastern Corridor (e.g. Tamil Nadu): X in [226, 256]
      const subNorm = (normLng - 0.45) / 0.55;
      mx = Math.round(226 + subNorm * 30);
      mLabelPos = 'right';
    }

    node.mobile = {
      x: mx,
      y: my,
      labelPos: mLabelPos,
    };
  });

  const districtOrder = orderedNodes.map((n) => n.id);

  // 5. Build Desktop & Mobile Bezier Route Segments
  const routeSegments = [];
  const mobileRouteSegments = [];
  const forwardPathParts = [];
  const mobileForwardParts = [];

  for (let i = 0; i < orderedNodes.length - 1; i++) {
    const from = orderedNodes[i];
    const to = orderedNodes[i + 1];

    // Desktop Bezier Path
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const cx1 = Math.round(from.x + dx * 0.45);
    const cy1 = Math.round(from.y + dy * 0.15);
    const cx2 = Math.round(from.x + dx * 0.55);
    const cy2 = Math.round(to.y - dy * 0.15);
    const dPath = `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;

    routeSegments.push({
      id: `route-${from.id}-${to.id}`,
      from: from.id,
      to: to.id,
      path: dPath,
      type: 'main',
      isInterstateBorder: from.state !== to.state,
    });

    if (i === 0) {
      forwardPathParts.push(`M ${from.x} ${from.y}`);
    }
    forwardPathParts.push(`C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`);

    // Mobile Bezier Path (Smooth fluid curves without sharp jagged kinks)
    const mFrom = from.mobile;
    const mTo = to.mobile;
    const mdx = mTo.x - mFrom.x;
    const mdy = mTo.y - mFrom.y;
    const mcx1 = Math.round(mFrom.x + mdx * 0.45);
    const mcy1 = Math.round(mFrom.y + mdy * 0.25);
    const mcx2 = Math.round(mFrom.x + mdx * 0.55);
    const mcy2 = Math.round(mTo.y - mdy * 0.25);
    const mPath = `M ${mFrom.x} ${mFrom.y} C ${mcx1} ${mcy1}, ${mcx2} ${mcy2}, ${mTo.x} ${mTo.y}`;

    mobileRouteSegments.push({
      id: `m-route-${from.id}-${to.id}`,
      from: from.id,
      to: to.id,
      path: mPath,
      type: 'main',
      isInterstateBorder: from.state !== to.state,
    });

    if (i === 0) {
      mobileForwardParts.push(`M ${mFrom.x} ${mFrom.y}`);
    }
    mobileForwardParts.push(`C ${mcx1} ${mcy1}, ${mcx2} ${mcy2}, ${mTo.x} ${mTo.y}`);
  }

  // Travelling beacon motion paths
  const beaconPathForward = forwardPathParts.join(' ');
  const mobileBeaconPathForward = mobileForwardParts.join(' ');

  // Reverse paths for counter-flow pulse
  const reverseParts = [];
  const mobileReverseParts = [];
  for (let i = orderedNodes.length - 1; i > 0; i--) {
    const from = orderedNodes[i];
    const to = orderedNodes[i - 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const cx1 = Math.round(from.x + dx * 0.45);
    const cy1 = Math.round(from.y + dy * 0.15);
    const cx2 = Math.round(from.x + dx * 0.55);
    const cy2 = Math.round(to.y - dy * 0.15);

    if (i === orderedNodes.length - 1) {
      reverseParts.push(`M ${from.x} ${from.y}`);
    }
    reverseParts.push(`C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`);

    const mFrom = from.mobile;
    const mTo = to.mobile;
    const mdx = mTo.x - mFrom.x;
    const mdy = mTo.y - mFrom.y;
    const mcx1 = Math.round(mFrom.x + mdx * 0.45);
    const mcy1 = Math.round(mFrom.y + mdy * 0.25);
    const mcx2 = Math.round(mFrom.x + mdx * 0.55);
    const mcy2 = Math.round(mTo.y - mdy * 0.25);

    if (i === orderedNodes.length - 1) {
      mobileReverseParts.push(`M ${mFrom.x} ${mFrom.y}`);
    }
    mobileReverseParts.push(`C ${mcx1} ${mcy1}, ${mcx2} ${mcy2}, ${mTo.x} ${mTo.y}`);
  }

  const beaconPathReverse = reverseParts.join(' ');
  const mobileBeaconPathReverse = mobileReverseParts.join(' ');

  // 6. District Nodes Lookup Maps (Dual indexed by canonical id and plain district slug)
  const districtNodes = {};
  const mobileDistrictNodes = {};
  nodes.forEach((n) => {
    districtNodes[n.id] = n;
    const plainNameSlug = slugify(n.name);
    if (plainNameSlug && !districtNodes[plainNameSlug]) {
      districtNodes[plainNameSlug] = n;
    }

    const mNode = {
      ...n,
      x: n.mobile.x,
      y: n.mobile.y,
      labelPos: n.mobile.labelPos,
    };
    mobileDistrictNodes[n.id] = mNode;
    if (plainNameSlug && !mobileDistrictNodes[plainNameSlug]) {
      mobileDistrictNodes[plainNameSlug] = mNode;
    }
  });

  // 7. Dynamic State Corridor Tabs
  const stateMap = new Map();
  nodes.forEach((n) => {
    if (n.state && !stateMap.has(n.stateId)) {
      stateMap.set(n.stateId, {
        id: n.stateId,
        stateName: n.state,
        firstDistrictId: n.id,
      });
    }
  });

  const stateTabs = [];
  if (stateMap.size > 1) {
    stateTabs.push({
      id: 'all',
      name: 'All Locations',
      isAll: true,
      color: '#FFAE68',
    });
    let stateIdx = 0;
    stateMap.forEach((val) => {
      const colorInfo = getCorridorColor(stateIdx++);
      stateTabs.push({
        id: val.id,
        name: `${val.stateName} Projects`,
        stateName: val.stateName,
        firstDistrictId: val.firstDistrictId,
        color: colorInfo.accent,
      });
    });
  } else if (stateMap.size === 1) {
    const singleState = Array.from(stateMap.values())[0];
    const colorInfo = getCorridorColor(0);
    stateTabs.push({
      id: singleState.id,
      name: `${singleState.stateName} Projects`,
      stateName: singleState.stateName,
      firstDistrictId: singleState.firstDistrictId,
      color: colorInfo.accent,
    });
  }

  return {
    districtNodes,
    districtOrder,
    routeSegments,
    beaconPathForward,
    beaconPathReverse,
    mobileDistrictNodes,
    mobileRouteSegments,
    mobileBeaconPathForward,
    mobileBeaconPathReverse,
    stateTabs,
  };
};

/**
 * Pre-compiled default map state for immediate rendering
 */
const initialDefaultMap = buildDynamicProjectMap(DEFAULT_ACTIVE_LOCATIONS);

export const DISTRICT_NODES = initialDefaultMap.districtNodes;
export const DISTRICT_ORDER = initialDefaultMap.districtOrder;
export const ROUTE_SEGMENTS = initialDefaultMap.routeSegments;
export const MOBILE_DISTRICT_NODES = initialDefaultMap.mobileDistrictNodes;
export const MOBILE_ROUTE_SEGMENTS = initialDefaultMap.mobileRouteSegments;

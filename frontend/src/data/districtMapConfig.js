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
  height: 740,
  viewBox: '0 0 380 740',
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
 * Genuine Classic Mun Bricks active district locations (Fallback / Seed data).
 * Coordinates represent authentic district centroids.
 */
export const DEFAULT_ACTIVE_LOCATIONS = [
  {
    id: 1,
    district: 'Malappuram',
    district_slug: 'malappuram',
    state: 'Kerala',
    state_code: 'KL',
    latitude: 11.0510,
    longitude: 76.0711,
    is_factory_hub: true,
    hub_label: 'Plant & HQ (Kodur)',
    order: 1,
  },
  {
    id: 2,
    district: 'Kozhikode',
    district_slug: 'kozhikode',
    state: 'Kerala',
    state_code: 'KL',
    latitude: 11.2588,
    longitude: 75.7804,
    is_factory_hub: false,
    order: 2,
  },
  {
    id: 3,
    district: 'Thrissur',
    district_slug: 'thrissur',
    state: 'Kerala',
    state_code: 'KL',
    latitude: 10.5276,
    longitude: 76.2144,
    is_factory_hub: false,
    order: 3,
  },
  {
    id: 4,
    district: 'Palakkad',
    district_slug: 'palakkad',
    state: 'Kerala',
    state_code: 'KL',
    latitude: 10.7867,
    longitude: 76.6548,
    is_factory_hub: false,
    order: 4,
  },
  {
    id: 5,
    district: 'Coimbatore',
    district_slug: 'coimbatore',
    state: 'Tamil Nadu',
    state_code: 'TN',
    latitude: 11.0168,
    longitude: 76.9558,
    is_factory_hub: false,
    order: 5,
  },
  {
    id: 6,
    district: 'Tiruppur',
    district_slug: 'tiruppur',
    state: 'Tamil Nadu',
    state_code: 'TN',
    latitude: 11.1085,
    longitude: 77.3411,
    is_factory_hub: false,
    order: 6,
  },
  {
    id: 7,
    district: 'Erode',
    district_slug: 'erode',
    state: 'Tamil Nadu',
    state_code: 'TN',
    latitude: 11.3410,
    longitude: 77.7172,
    is_factory_hub: false,
    order: 7,
  },
  {
    id: 8,
    district: 'Salem',
    district_slug: 'salem',
    state: 'Tamil Nadu',
    state_code: 'TN',
    latitude: 11.6643,
    longitude: 78.1460,
    is_factory_hub: false,
    order: 8,
  },
  {
    id: 9,
    district: 'Dindigul',
    district_slug: 'dindigul',
    state: 'Tamil Nadu',
    state_code: 'TN',
    latitude: 10.3673,
    longitude: 77.9803,
    is_factory_hub: false,
    order: 9,
  },
];

/**
 * Calculates dynamic geographic projection and bezier supply routes
 * from any list of active Indian district records.
 *
 * @param {Array} locations Array of project location records from API or fallback
 * @returns {Object} Complete responsive map model with nodes, segments, and order
 */
export const buildDynamicProjectMap = (locations = DEFAULT_ACTIVE_LOCATIONS) => {
  if (!Array.isArray(locations) || locations.length === 0) {
    return {
      districtNodes: {},
      districtOrder: [],
      routeSegments: [],
      beaconPathForward: '',
      beaconPathReverse: '',
      mobileDistrictNodes: {},
      mobileRouteSegments: [],
      mobileBeaconPathForward: '',
      mobileBeaconPathReverse: '',
      stateTabs: [{ id: 'all', name: 'Entire Journey (All Hubs)', isAll: true }],
    };
  }

  // Filter valid coordinates (Requirement 17: flag and handle gracefully)
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
    return buildDynamicProjectMap(DEFAULT_ACTIVE_LOCATIONS);
  }

  // 1. Calculate Geographic Bounding Box
  const lats = validLocations.map((l) => parseFloat(l.latitude));
  const lngs = validLocations.map((l) => parseFloat(l.longitude));

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const spanLat = maxLat - minLat > 0.05 ? maxLat - minLat : 1.0;
  const spanLng = maxLng - minLng > 0.05 ? maxLng - minLng : 1.0;

  // 2. Normalization Bounds
  // Desktop canvas: 1000 x 580
  const dPadX = 110;
  const dPadY = 80;
  const dRangeX = 1000 - 2 * dPadX;
  const dRangeY = 580 - 2 * dPadY;

  // Mobile canvas: 380 x 740
  const mPadX = 60;
  const mPadY = 70;
  const mRangeX = 380 - 2 * mPadX;
  const mRangeY = 740 - 2 * mPadY;

  // 3. Normalized Node Map
  const nodes = [];
  validLocations.forEach((loc, idx) => {
    const id = loc.district_slug || slugify(loc.district || loc.name);
    const name = loc.district || loc.name;
    const state = loc.state || 'India';
    const stateId = slugify(state);
    const lat = parseFloat(loc.latitude);
    const lng = parseFloat(loc.longitude);

    // Desktop coordinates (Invert lat: North is top = smaller Y)
    const normX = (lng - minLng) / spanLng;
    const normY = (maxLat - lat) / spanLat;
    const x = Math.round(dPadX + normX * dRangeX);
    const y = Math.round(dPadY + normY * dRangeY);

    // Mobile coordinates
    const mx = Math.round(mPadX + normX * mRangeX);
    const my = Math.round(mPadY + normY * mRangeY);

    // Accessible smart label positioning
    let labelPos = 'bottom';
    if (y > 470) labelPos = 'top';
    else if (y < 120) labelPos = 'bottom';
    else if (x > 800) labelPos = 'left';
    else if (x < 220) labelPos = 'right';
    else labelPos = idx % 2 === 0 ? 'top' : 'bottom';

    let mLabelPos = mx > 190 ? 'left' : 'right';

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
        x: mx,
        y: my,
        labelPos: mLabelPos,
      },
      isFactoryHub: Boolean(loc.is_factory_hub),
      hubLabel: loc.hub_label || (loc.is_factory_hub ? 'Plant & HQ (Kodur)' : ''),
      order: typeof loc.order === 'number' ? loc.order : idx + 1,
      images: loc.images || [],
      imageCount: loc.image_count || (loc.images ? loc.images.length : 0),
    });
  });

  // 4. Determine Visual Supply Chain Ordering (Requirement 12)
  // If order is explicitly sequenced (different values), preserve order;
  // Otherwise, calculate greedy nearest-neighbor chain starting from factory hub or westernmost node.
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

    // Mobile Bezier Path
    const mFrom = from.mobile;
    const mTo = to.mobile;
    const mdx = mTo.x - mFrom.x;
    const mdy = mTo.y - mFrom.y;
    const mcx1 = Math.round(mFrom.x + mdx * 0.45);
    const mcy1 = Math.round(mFrom.y + mdy * 0.15);
    const mcx2 = Math.round(mFrom.x + mdx * 0.55);
    const mcy2 = Math.round(mTo.y - mdy * 0.15);
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
    const mcy1 = Math.round(mFrom.y + mdy * 0.15);
    const mcx2 = Math.round(mFrom.x + mdx * 0.55);
    const mcy2 = Math.round(mTo.y - mdy * 0.15);

    if (i === orderedNodes.length - 1) {
      mobileReverseParts.push(`M ${mFrom.x} ${mFrom.y}`);
    }
    mobileReverseParts.push(`C ${mcx1} ${mcy1}, ${mcx2} ${mcy2}, ${mTo.x} ${mTo.y}`);
  }

  const beaconPathReverse = reverseParts.join(' ');
  const mobileBeaconPathReverse = mobileReverseParts.join(' ');

  // 6. District Nodes Lookup Maps
  const districtNodes = {};
  const mobileDistrictNodes = {};
  nodes.forEach((n) => {
    districtNodes[n.id] = n;
    mobileDistrictNodes[n.id] = {
      ...n,
      x: n.mobile.x,
      y: n.mobile.y,
      labelPos: n.mobile.labelPos,
    };
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

  const stateTabs = [
    {
      id: 'all',
      name: 'Entire Journey (All Hubs)',
      isAll: true,
      color: '#FFAE68',
    },
  ];

  let stateIdx = 0;
  stateMap.forEach((val) => {
    const colorInfo = getCorridorColor(stateIdx++);
    stateTabs.push({
      id: val.id,
      name: `${val.stateName} Corridor`,
      stateName: val.stateName,
      firstDistrictId: val.firstDistrictId,
      color: colorInfo.accent,
    });
  });

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

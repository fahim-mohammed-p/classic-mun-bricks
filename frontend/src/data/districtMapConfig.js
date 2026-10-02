/**
 * Geographic Route & District Configuration for Classic Mun Bricks
 * 
 * Accurately models the real geographic footprint and primary supply routes
 * connecting Kerala (Western Corridor) and Tamil Nadu (Eastern Corridor).
 * 
 * Coordinates are mapped to a responsive 1000 x 580 SVG canvas with percentage backups.
 */

export const MAP_DIMENSIONS = {
  width: 1000,
  height: 580,
  viewBox: '0 0 1000 580',
};

export const STATE_REGIONS = {
  kerala: {
    id: 'kerala',
    name: 'Kerala',
    corridorName: 'Western Coastal & Midland Corridor',
    shortTag: 'Kerala Projects',
    accentColor: '#B94F2E',
    totalEstimated: '1.5K+',
  },
  'tamil-nadu': {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    corridorName: 'Eastern Industrial & Highland Corridor',
    shortTag: 'Tamil Nadu Projects',
    accentColor: '#C68A36',
    totalEstimated: '1K+',
  },
};

export const DISTRICT_NODES = {
  kozhikode: {
    id: 'kozhikode',
    name: 'Kozhikode',
    state: 'Kerala',
    stateId: 'kerala',
    x: 140,
    y: 110,
    xPct: 14,
    yPct: 19,
    labelPos: 'top', // 'top' | 'bottom' | 'left' | 'right'
    isFactoryHub: false,
    tagline: 'Coastal & Urban Architecture',
    regionDesc: 'Extensive supply across Calicut city, coastal estates, and institutional facades.',
  },
  malappuram: {
    id: 'malappuram',
    name: 'Malappuram',
    state: 'Kerala',
    stateId: 'kerala',
    x: 230,
    y: 220,
    xPct: 23,
    yPct: 38,
    labelPos: 'bottom',
    isFactoryHub: true,
    hubLabel: 'Plant & HQ (Kodur)',
    tagline: 'Primary Manufacturing & Home Base',
    regionDesc: 'Home of the Classic Mun Bricks automated hydraulic plant at Kodur. Deepest project density.',
  },
  thrissur: {
    id: 'thrissur',
    name: 'Thrissur',
    state: 'Kerala',
    stateId: 'kerala',
    x: 190,
    y: 440,
    xPct: 19,
    yPct: 76,
    labelPos: 'bottom',
    isFactoryHub: false,
    tagline: 'Cultural Capital & Heritage Builds',
    regionDesc: 'Traditional courtyard revivals, residential villas, and temple town commercial projects.',
  },
  palakkad: {
    id: 'palakkad',
    name: 'Palakkad',
    state: 'Kerala',
    stateId: 'kerala',
    x: 390,
    y: 290,
    xPct: 39,
    yPct: 50,
    labelPos: 'bottom',
    isFactoryHub: false,
    isGateway: true,
    gatewayLabel: 'The Palakkad Gap',
    tagline: 'Gateway to Tamil Nadu',
    regionDesc: 'Strategic interstate hub connecting the Western Ghats corridor to Tamil Nadu industrial belts.',
  },
  coimbatore: {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    x: 550,
    y: 270,
    xPct: 55,
    yPct: 47,
    labelPos: 'top',
    isFactoryHub: false,
    tagline: 'Textile Capital & Modern Campuses',
    regionDesc: 'Major recipient of Mun Interlock Bricks for tech campuses, executive villas, and gated estates.',
  },
  tiruppur: {
    id: 'tiruppur',
    name: 'Tiruppur',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    x: 690,
    y: 220,
    xPct: 69,
    yPct: 38,
    labelPos: 'bottom',
    isFactoryHub: false,
    tagline: 'Industrial & Eco-Commercial Hub',
    regionDesc: 'Sustainable factory headquarters, eco-residences, and farmhouse courtyard homes.',
  },
  erode: {
    id: 'erode',
    name: 'Erode',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    x: 810,
    y: 160,
    xPct: 81,
    yPct: 28,
    labelPos: 'bottom',
    isFactoryHub: false,
    tagline: 'Kaveri Basin Developments',
    regionDesc: 'Riverside residences, agri-processing hubs, and exposed brick facades.',
  },
  salem: {
    id: 'salem',
    name: 'Salem',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    x: 910,
    y: 90,
    xPct: 91,
    yPct: 16,
    labelPos: 'top',
    isFactoryHub: false,
    tagline: 'Steel City & Foothill Estates',
    regionDesc: 'Contemporary hill-facing villas, educational campuses, and structural load-bearing projects.',
  },
  dindigul: {
    id: 'dindigul',
    name: 'Dindigul',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    x: 710,
    y: 460,
    xPct: 71,
    yPct: 79,
    labelPos: 'right',
    isFactoryHub: false,
    tagline: 'Foothills & Highland Retreats',
    regionDesc: 'Eco-resorts, farmsteads, and institutional buildings across the Kodaikanal foothills corridor.',
  },
};

/**
 * Route connections defining the smooth curved SVG travel paths.
 * Connecting districts with intentional, elegant bezier trajectories.
 */
export const ROUTE_SEGMENTS = [
  // 1. Kozhikode -> Malappuram (Factory Hub)
  {
    id: 'route-kozhikode-malappuram',
    from: 'kozhikode',
    to: 'malappuram',
    path: 'M 140 110 C 165 150, 195 185, 230 220',
    type: 'main',
  },
  // 2. Malappuram -> Palakkad
  {
    id: 'route-malappuram-palakkad',
    from: 'malappuram',
    to: 'palakkad',
    path: 'M 230 220 C 275 245, 335 270, 390 290',
    type: 'main',
  },
  // 3. Palakkad -> Coimbatore (Inter-State Palakkad Gap Transit)
  {
    id: 'route-palakkad-coimbatore',
    from: 'palakkad',
    to: 'coimbatore',
    path: 'M 390 290 C 440 305, 500 280, 550 270',
    type: 'main',
    isInterstateBorder: true,
  },
  // 4. Coimbatore -> Tiruppur
  {
    id: 'route-coimbatore-tiruppur',
    from: 'coimbatore',
    to: 'tiruppur',
    path: 'M 550 270 C 595 255, 645 235, 690 220',
    type: 'main',
  },
  // 5. Tiruppur -> Erode
  {
    id: 'route-tiruppur-erode',
    from: 'tiruppur',
    to: 'erode',
    path: 'M 690 220 C 730 205, 770 185, 810 160',
    type: 'main',
  },
  // 6. Erode -> Salem
  {
    id: 'route-erode-salem',
    from: 'erode',
    to: 'salem',
    path: 'M 810 160 C 845 135, 875 110, 910 90',
    type: 'main',
  },
  // 7. Malappuram -> Thrissur (Southward Kerala Branch)
  {
    id: 'route-malappuram-thrissur',
    from: 'malappuram',
    to: 'thrissur',
    path: 'M 230 220 C 235 300, 205 380, 190 440',
    type: 'branch',
  },
  // 8. Palakkad / Coimbatore -> Dindigul (Southward Tamil Nadu Branch)
  {
    id: 'route-palakkad-dindigul',
    from: 'palakkad',
    to: 'dindigul',
    path: 'M 390 290 C 480 370, 610 430, 710 460',
    type: 'branch',
  },
];

/**
 * Ordered list of district IDs for journey sequence and tab filtering
 */
export const DISTRICT_ORDER = [
  'kozhikode',
  'malappuram',
  'palakkad',
  'thrissur',
  'coimbatore',
  'tiruppur',
  'erode',
  'salem',
  'dindigul',
];

/**
 * Mobile-specific portrait configuration (380 x 740)
 * Designed for portrait screens (< 768px) with large touch targets,
 * zero badge overlap, crystal-clear labels, and connected bezier routes.
 */
export const MOBILE_MAP_DIMENSIONS = {
  width: 380,
  height: 740,
  viewBox: '0 0 380 740',
};

export const MOBILE_DISTRICT_NODES = {
  kozhikode: {
    ...DISTRICT_NODES.kozhikode,
    x: 95,
    y: 65,
    labelPos: 'right',
  },
  malappuram: {
    ...DISTRICT_NODES.malappuram,
    x: 105,
    y: 155,
    labelPos: 'right',
  },
  palakkad: {
    ...DISTRICT_NODES.palakkad,
    x: 275,
    y: 215,
    labelPos: 'bottom',
  },
  thrissur: {
    ...DISTRICT_NODES.thrissur,
    x: 85,
    y: 250,
    labelPos: 'right',
  },
  coimbatore: {
    ...DISTRICT_NODES.coimbatore,
    x: 280,
    y: 335,
    labelPos: 'left',
  },
  tiruppur: {
    ...DISTRICT_NODES.tiruppur,
    x: 95,
    y: 415,
    labelPos: 'right',
  },
  erode: {
    ...DISTRICT_NODES.erode,
    x: 280,
    y: 500,
    labelPos: 'left',
  },
  salem: {
    ...DISTRICT_NODES.salem,
    x: 95,
    y: 585,
    labelPos: 'right',
  },
  dindigul: {
    ...DISTRICT_NODES.dindigul,
    x: 280,
    y: 670,
    labelPos: 'left',
  },
};

export const MOBILE_ROUTE_SEGMENTS = [
  {
    id: 'm-route-kozhikode-malappuram',
    from: 'kozhikode',
    to: 'malappuram',
    path: 'M 95 65 C 100 100, 105 125, 105 155',
    type: 'main',
  },
  {
    id: 'm-route-malappuram-palakkad',
    from: 'malappuram',
    to: 'palakkad',
    path: 'M 105 155 C 155 170, 220 190, 275 215',
    type: 'main',
  },
  {
    id: 'm-route-malappuram-thrissur',
    from: 'malappuram',
    to: 'thrissur',
    path: 'M 105 155 C 95 190, 90 215, 85 250',
    type: 'branch',
  },
  {
    id: 'm-route-palakkad-coimbatore',
    from: 'palakkad',
    to: 'coimbatore',
    path: 'M 275 215 C 280 255, 280 295, 280 335',
    type: 'main',
    isInterstateBorder: true,
  },
  {
    id: 'm-route-coimbatore-tiruppur',
    from: 'coimbatore',
    to: 'tiruppur',
    path: 'M 280 335 C 220 360, 155 385, 95 415',
    type: 'main',
  },
  {
    id: 'm-route-tiruppur-erode',
    from: 'tiruppur',
    to: 'erode',
    path: 'M 95 415 C 155 445, 220 470, 280 500',
    type: 'main',
  },
  {
    id: 'm-route-erode-salem',
    from: 'erode',
    to: 'salem',
    path: 'M 280 500 C 220 530, 155 555, 95 585',
    type: 'main',
  },
  {
    id: 'm-route-coimbatore-dindigul',
    from: 'coimbatore',
    to: 'dindigul',
    path: 'M 280 335 C 320 440, 320 565, 280 670',
    type: 'branch',
  },
];


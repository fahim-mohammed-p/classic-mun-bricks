/**
 * Verified Projects Database for Classic Mun Bricks
 * 
 * Comprehensive dataset of verified client projects and architectural works
 * categorized by state and district across Kerala and Tamil Nadu.
 */

import gallery01 from '../assets/gallery/gallery-01.jpeg';
import gallery02 from '../assets/gallery/gallery-02.jpeg';
import gallery03 from '../assets/gallery/gallery-03.jpeg';
import gallery04 from '../assets/gallery/gallery-04.jpeg';
import gallery05 from '../assets/gallery/gallery-05.jpeg';
import gallery06 from '../assets/gallery/gallery-06.jpeg';
import { DISTRICT_NODES } from './districtMapConfig';

export const ALL_PROJECTS = [
  // ==========================================
  // MALAPPURAM DISTRICT (Factory Home Base)
  // ==========================================
  {
    id: 'mlp-01',
    title: 'The Malabar Courtyard Villa',
    districtId: 'malappuram',
    districtName: 'Malappuram',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Kodur, Malappuram',
    category: 'Residential Courtyard Villa',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Interlocking Laterite Form',
    specs: '3,400 sq.ft • Exposed brickwork with central open-air atrium',
    year: '2024',
    image: gallery01,
    accentColor: '#B94F2E',
    isFeatured: true,
    description:
      'Engineered with high-density Classic Mun Interlock Bricks directly supplied from our Kodur facility, featuring thermal-mass cooling and natural terracotta texture without plastering.',
  },
  {
    id: 'mlp-02',
    title: 'Kottakkal Heritage Wellness Pavilion',
    districtId: 'malappuram',
    districtName: 'Malappuram',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Kottakkal, Malappuram',
    category: 'Commercial & Wellness',
    productUsed: 'Hydraulic Pressed Laterite',
    brickType: 'Precision Dimension Facing',
    specs: '5,200 sq.ft • Traditional Kerala sloped roof architecture',
    year: '2023',
    image: gallery02,
    accentColor: '#8E3822',
    isFeatured: true,
    description:
      'Seamlessly blends authentic Ayurvedic heritage architecture with modern dimensional precision, maintaining cool ambient indoor temperatures throughout the year.',
  },
  {
    id: 'mlp-03',
    title: 'Perinthalmanna Commercial Facade',
    districtId: 'malappuram',
    districtName: 'Malappuram',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Perinthalmanna, Malappuram',
    category: 'Commercial Development',
    productUsed: 'Structural Mun Interlock',
    brickType: 'High-Density Load Bearing',
    specs: '7,800 sq.ft • 3-Storey exposed facade',
    year: '2023',
    image: gallery03,
    accentColor: '#C68A36',
    isFeatured: false,
    description:
      'A striking 3-storey commercial building showcasing the structural strength and sharp geometric edges of our machine-pressed interlock bricks.',
  },
  {
    id: 'mlp-04',
    title: 'Nilambur Forest-Edge Homestead',
    districtId: 'malappuram',
    districtName: 'Malappuram',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Nilambur, Malappuram',
    category: 'Residential Villa',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Thermal Insulated Laterite',
    specs: '2,650 sq.ft • Eco-sensitive site integration',
    year: '2024',
    image: gallery04,
    accentColor: '#B94F2E',
    isFeatured: false,
    description:
      'Built in harmony with Nilambur’s verdant surroundings, eliminating toxic paints and minimizing cement mortar consumption through precision interlocks.',
  },

  // ==========================================
  // KOZHIKODE DISTRICT (Calicut Corridor)
  // ==========================================
  {
    id: 'kzk-01',
    title: 'Calicut Coastal Contemporary Residence',
    districtId: 'kozhikode',
    districtName: 'Kozhikode',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Beach Road, Kozhikode',
    category: 'Luxury Contemporary Residence',
    productUsed: 'Mun Interlock Facing Bricks',
    brickType: 'Saline-Resistant Pressed Laterite',
    specs: '4,100 sq.ft • Double-height living spaces & cantilevered balconies',
    year: '2024',
    image: gallery05,
    accentColor: '#B94F2E',
    isFeatured: true,
    description:
      'Designed to endure humid coastal conditions, utilizing dense hydraulic-compressed laterite to resist salt-air erosion while maintaining an earthy red facade.',
  },
  {
    id: 'kzk-02',
    title: 'Pantheerankavu Architectural Studio',
    districtId: 'kozhikode',
    districtName: 'Kozhikode',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Pantheerankavu, Kozhikode',
    category: 'Commercial & Creative Workspace',
    productUsed: 'Exposed Mun Interlock',
    brickType: 'Architectural Special Finish',
    specs: '3,200 sq.ft • Jali pattern screen walls & skylights',
    year: '2023',
    image: gallery06,
    accentColor: '#8E3822',
    isFeatured: false,
    description:
      'Features intricate brick jali (perforated brick screen) work built using Mun Interlock Bricks to create dynamic sun shadows and natural air circulation.',
  },
  {
    id: 'kzk-03',
    title: 'Mavoor Riverside Estate',
    districtId: 'kozhikode',
    districtName: 'Kozhikode',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Mavoor, Kozhikode',
    category: 'Residential Estate',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Moisture-Treated Natural Laterite',
    specs: '3,800 sq.ft • Waterfront courtyard estate',
    year: '2022',
    image: gallery01,
    accentColor: '#C68A36',
    isFeatured: false,
    description:
      'Sprawling riverside estate built with interlocking laterite blocks, offering superior thermal balance during hot Malabar summers.',
  },

  // ==========================================
  // PALAKKAD DISTRICT (The Gateway Gap)
  // ==========================================
  {
    id: 'pkd-01',
    title: 'Ottapalam Traditional Illam Revival',
    districtId: 'palakkad',
    districtName: 'Palakkad',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Ottapalam, Palakkad',
    category: 'Heritage Restoration & Villa',
    productUsed: 'Hydraulic Pressed Laterite',
    brickType: 'Heritage Textured Masonry',
    specs: '4,500 sq.ft • Four-sided Nalukettu layout with granite plinth',
    year: '2024',
    image: gallery02,
    accentColor: '#B94F2E',
    isFeatured: true,
    description:
      'A modern reinterpretation of the classic Kerala Nalukettu, utilizing Classic Mun Bricks to provide heavy thermal damping against Palakkad’s intense dry heat.',
  },
  {
    id: 'pkd-02',
    title: 'Kanjikode Industrial Administrative Complex',
    districtId: 'palakkad',
    districtName: 'Palakkad',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Kanjikode, Palakkad',
    category: 'Industrial & Office',
    productUsed: 'High-Density Mun Interlock',
    brickType: 'Industrial Grade Load-Bearing',
    specs: '9,200 sq.ft • Multi-building corporate hub',
    year: '2023',
    image: gallery03,
    accentColor: '#8E3822',
    isFeatured: false,
    description:
      'High-durability interlocking brick masonry built for fast turnaround and low life-cycle maintenance across a prominent manufacturing campus.',
  },
  {
    id: 'pkd-03',
    title: 'Walayar Foothills Farmhouse',
    districtId: 'palakkad',
    districtName: 'Palakkad',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Walayar, Palakkad',
    category: 'Residential Farmhouse',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Natural Earth Tone Blocks',
    specs: '2,900 sq.ft • Western Ghats hillside setting',
    year: '2023',
    image: gallery04,
    accentColor: '#C68A36',
    isFeatured: false,
    description:
      'Border residence positioned at the foot of the Western Ghats pass, utilizing unplastered Mun Interlock blocks to blend into the mountain terrain.',
  },

  // ==========================================
  // THRISSUR DISTRICT (Cultural Capital)
  // ==========================================
  {
    id: 'tsr-01',
    title: 'Thrissur Heritage Residential Enclave',
    districtId: 'thrissur',
    districtName: 'Thrissur',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Punkunnam, Thrissur',
    category: 'Residential Villa',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Exposed Red Interlock',
    specs: '3,600 sq.ft • Architectural courtyard with waterbody',
    year: '2024',
    image: gallery05,
    accentColor: '#B94F2E',
    isFeatured: true,
    description:
      'Elegant residential design combining timber ceilings, exposed brick masonry, and open verandahs reflecting Thrissur’s architectural lineage.',
  },
  {
    id: 'tsr-02',
    title: 'Guruvayur Hospitality Guest Suites',
    districtId: 'thrissur',
    districtName: 'Thrissur',
    state: 'Kerala',
    stateId: 'kerala',
    location: 'Guruvayur, Thrissur',
    category: 'Hospitality & Commercial',
    productUsed: 'Hydraulic Pressed Laterite',
    brickType: 'Precision Edge Facing Bricks',
    specs: '6,400 sq.ft • 18-Key boutique hospitality stay',
    year: '2023',
    image: gallery06,
    accentColor: '#8E3822',
    isFeatured: false,
    description:
      'Boutique accommodations crafted with precision interlocking bricks to offer pilgrims and visitors an authentic, naturally cooled retreat.',
  },

  // ==========================================
  // COIMBATORE DISTRICT (Gateway to Tamil Nadu)
  // ==========================================
  {
    id: 'cbe-01',
    title: 'Kovai Greenfields Executive Residence',
    districtId: 'coimbatore',
    districtName: 'Coimbatore',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'RS Puram, Coimbatore',
    category: 'Contemporary Executive Villa',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'High-Precision Interlocking Laterite',
    specs: '4,800 sq.ft • Modern minimalist cubic geometry with greenery',
    year: '2024',
    image: gallery01,
    accentColor: '#C68A36',
    isFeatured: true,
    description:
      'An architectural landmark in RS Puram combining raw concrete, glass elements, and precision interlocking bricks from Classic Mun Bricks.',
  },
  {
    id: 'cbe-02',
    title: 'Saravanampatti Tech Campus Annex',
    districtId: 'coimbatore',
    districtName: 'Coimbatore',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Saravanampatti, Coimbatore',
    category: 'Institutional & Tech Office',
    productUsed: 'Structural Mun Interlock',
    brickType: 'High-Density Load Bearing',
    specs: '11,500 sq.ft • Sustainable campus cafeteria & breakout wings',
    year: '2023',
    image: gallery02,
    accentColor: '#B94F2E',
    isFeatured: true,
    description:
      'Built as a low-carbon footprint pavilion for a prominent software enterprise in Coimbatore’s IT corridor, featuring breathable exposed brick walls.',
  },
  {
    id: 'cbe-03',
    title: 'Pollachi Coconut Grove Eco-Estate',
    districtId: 'coimbatore',
    districtName: 'Coimbatore',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Pollachi, Coimbatore',
    category: 'Farmhouse & Eco-Stay',
    productUsed: 'Hydraulic Pressed Laterite',
    brickType: 'Earthy Red Textured Blocks',
    specs: '3,200 sq.ft • Single-storey sustainable plantation home',
    year: '2024',
    image: gallery03,
    accentColor: '#8E3822',
    isFeatured: false,
    description:
      'Nestled inside an organic coconut grove, this sustainable home achieved 40% mortar savings and excellent natural thermal insulation.',
  },
  {
    id: 'cbe-04',
    title: 'Peelamedu Educational Innovation Block',
    districtId: 'coimbatore',
    districtName: 'Coimbatore',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Peelamedu, Coimbatore',
    category: 'Institutional Campus',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Acoustic-Damped Pressed Bricks',
    specs: '8,600 sq.ft • Lecture halls and library wing',
    year: '2023',
    image: gallery04,
    accentColor: '#C68A36',
    isFeatured: false,
    description:
      'Modern university building featuring acoustic-damped exposed brick classrooms that create an inspiring, earthy learning atmosphere.',
  },

  // ==========================================
  // TIRUPPUR DISTRICT (Industrial & Eco-Hub)
  // ==========================================
  {
    id: 'tpr-01',
    title: 'Tiruppur Sustainable Apparel HQ',
    districtId: 'tiruppur',
    districtName: 'Tiruppur',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Avinashi Road, Tiruppur',
    category: 'Commercial Headquarters',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Heavy-Duty Machine Pressed',
    specs: '14,000 sq.ft • Green building IGBC certified campus',
    year: '2024',
    image: gallery05,
    accentColor: '#B94F2E',
    isFeatured: true,
    description:
      'Awarded green building certification, utilizing 100% paint-free, mortarless interlocking brick facades to minimize carbon impact in the textile hub.',
  },
  {
    id: 'tpr-02',
    title: 'Palladam Organic Farmstay & Courtyard',
    districtId: 'tiruppur',
    districtName: 'Tiruppur',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Palladam, Tiruppur',
    category: 'Residential Farmhouse',
    productUsed: 'Hydraulic Pressed Laterite',
    brickType: 'Natural Earth Finish',
    specs: '2,800 sq.ft • Wind-harnessed verandah architecture',
    year: '2023',
    image: gallery06,
    accentColor: '#C68A36',
    isFeatured: false,
    description:
      'Taking advantage of high wind corridors, this farmhouse uses porous laterite brickwork for rapid evening cooling.',
  },

  // ==========================================
  // ERODE DISTRICT (Kaveri Basin)
  // ==========================================
  {
    id: 'erd-01',
    title: 'Kaveri Riverside Farm Estate',
    districtId: 'erode',
    districtName: 'Erode',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Bhavani, Erode',
    category: 'Residential Estate',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Moisture Sealed Hydraulic Bricks',
    specs: '3,900 sq.ft • Elevated riverbank cantilever design',
    year: '2024',
    image: gallery01,
    accentColor: '#B94F2E',
    isFeatured: true,
    description:
      'Perched overlooking the Kaveri river, utilizing high-compaction Mun Interlock Bricks that resist riverfront dampness with zero structural degradation.',
  },
  {
    id: 'erd-02',
    title: 'Perundurai Industrial Logistics Center',
    districtId: 'erode',
    districtName: 'Erode',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Perundurai, Erode',
    category: 'Commercial & Logistics',
    productUsed: 'Structural Mun Interlock',
    brickType: 'High-Load Interlocking Masonry',
    specs: '7,500 sq.ft • Administrative wing & warehouse facade',
    year: '2023',
    image: gallery02,
    accentColor: '#8E3822',
    isFeatured: false,
    description:
      'Robust industrial complex built to handle heavy transit vibration and high thermal cycling across the Erode manufacturing belt.',
  },

  // ==========================================
  // SALEM DISTRICT (Steel City & Highlands)
  // ==========================================
  {
    id: 'slm-01',
    title: 'Yercaud Foothills Contemporary Villa',
    districtId: 'salem',
    districtName: 'Salem',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Fairlands, Salem',
    category: 'Luxury Residential Villa',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Architectural Facing Bricks',
    specs: '4,200 sq.ft • Stepped terrace & panoramic mountain views',
    year: '2024',
    image: gallery03,
    accentColor: '#C68A36',
    isFeatured: true,
    description:
      'Framing scenic views of the Shevaroy Hills, this multi-tier villa demonstrates the sharp edges and crisp geometric lines of Classic Mun Bricks.',
  },
  {
    id: 'slm-02',
    title: 'Salem Central Commercial Complex',
    districtId: 'salem',
    districtName: 'Salem',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Junction Road, Salem',
    category: 'Commercial Complex',
    productUsed: 'Hydraulic Pressed Laterite',
    brickType: 'Precision Load-Bearing Blocks',
    specs: '6,800 sq.ft • Retail showrooms & professional offices',
    year: '2023',
    image: gallery04,
    accentColor: '#B94F2E',
    isFeatured: false,
    description:
      'A bustling commercial hub constructed with exposed interlocking bricks, offering an earthy contrast to standard glass and concrete cityscapes.',
  },

  // ==========================================
  // DINDIGUL DISTRICT (Foothills Corridor)
  // ==========================================
  {
    id: 'dgl-01',
    title: 'Palani Hills Eco-Resort & Spa',
    districtId: 'dindigul',
    districtName: 'Dindigul',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Kodaikanal Foothills, Dindigul',
    category: 'Hospitality & Eco-Resort',
    productUsed: 'Mun Interlock Bricks',
    brickType: 'Thermal High-Altitude Interlock',
    specs: '8,400 sq.ft • 12 Individual guest cottages & spa',
    year: '2024',
    image: gallery05,
    accentColor: '#8E3822',
    isFeatured: true,
    description:
      'Eco-luxury resort cottages nestled in the Kodaikanal foothills, engineered with interlocking laterite to retain solar heat during chilly mountain nights.',
  },
  {
    id: 'dgl-02',
    title: 'Dindigul Educational Heritage Hall',
    districtId: 'dindigul',
    districtName: 'Dindigul',
    state: 'Tamil Nadu',
    stateId: 'tamil-nadu',
    location: 'Dindigul Town',
    category: 'Institutional Development',
    productUsed: 'Hydraulic Pressed Laterite',
    brickType: 'Structural Facing Bricks',
    specs: '5,600 sq.ft • Multi-purpose auditorium & seminar wing',
    year: '2023',
    image: gallery06,
    accentColor: '#C68A36',
    isFeatured: false,
    description:
      'Grand educational facility built with exposed laterite brick columns and archways, combining classic South Indian aesthetics with modern durability.',
  },
];

/**
 * Helper: Calculate project counts per district automatically from data
 */
export const getDistrictProjectCounts = () => {
  const counts = {};
  // Initialize from map config
  Object.keys(DISTRICT_NODES).forEach((id) => {
    counts[id] = 0;
  });

  // Count items from dataset
  ALL_PROJECTS.forEach((proj) => {
    if (counts[proj.districtId] !== undefined) {
      counts[proj.districtId] += 1;
    } else {
      counts[proj.districtId] = 1;
    }
  });

  return counts;
};

/**
 * Filter projects by district ID ('all' returns all projects)
 */
export const getProjectsByDistrict = (districtId) => {
  if (!districtId || districtId === 'all') {
    return ALL_PROJECTS;
  }
  return ALL_PROJECTS.filter(
    (p) => p.districtId.toLowerCase() === districtId.toLowerCase()
  );
};

/**
 * Filter projects by state ID ('kerala' | 'tamil-nadu' | 'all')
 */
export const getProjectsByState = (stateId) => {
  if (!stateId || stateId === 'all') {
    return ALL_PROJECTS;
  }
  return ALL_PROJECTS.filter(
    (p) => p.stateId.toLowerCase() === stateId.toLowerCase()
  );
};

/**
 * Get featured projects for hero highlights
 */
export const getFeaturedProjects = () => {
  return ALL_PROJECTS.filter((p) => p.isFeatured);
};

/**
 * Verified Projects & Geographic Coverage Data for Classic Mun Bricks
 * Single source of truth for regional coverage statistics across South India.
 */

export const COVERAGE_METRICS = {
  totalProjects: '2.5K+',
  totalLabel: 'Projects Completed',
  scopeDescription: 'Supplying premium red clay and engineered wire cut bricks across Kerala and Tamil Nadu.',
  regions: [
    {
      id: 'kerala',
      name: 'Kerala',
      projectCount: '1.5K+',
      label: 'Projects Delivered',
      tagline: 'Western Coast & Midlands',
      description:
        'From heritage residential architecture and tropical courtyard homes to modern commercial developments across Kerala.',
      highlights: [
        'Residential Villas & Traditional Courtyard Architecture',
        'Commercial & Institutional Facades',
        'Direct Site Supply from Kodur, Malappuram Plant',
      ],
      projects: [], // Real project stories will be connected here
    },
    {
      id: 'tamil-nadu',
      name: 'Tamil Nadu',
      projectCount: '1K+',
      label: 'Projects Delivered',
      tagline: 'Border Districts & Interior Hubs',
      description:
        'Engineered structural bricks and high-durability clay solutions for educational campuses, resorts, and premium construction.',
      highlights: [
        'Educational & Institutional Campuses',
        'Resorts, Farmhouses & Eco-stays',
        'High-density Structural Clay Brick Supply',
      ],
      projects: [], // Real project stories will be connected here
    },
  ],
};

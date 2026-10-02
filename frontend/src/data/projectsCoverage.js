/**
 * Verified Projects & Geographic Coverage Data for Classic Mun Bricks
 * Single source of truth for regional coverage statistics across South India.
 */
import { ALL_PROJECTS } from './projectsData';

export const COVERAGE_METRICS = {
  totalProjects: '2.5K+',
  totalLabel: 'Projects Completed',
  scopeDescription:
    'Supplying premium laterite bricks and Mun Interlock Bricks across Kerala and Tamil Nadu.',
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
      projects: ALL_PROJECTS.filter((p) => p.stateId === 'kerala'),
    },
    {
      id: 'tamil-nadu',
      name: 'Tamil Nadu',
      projectCount: '1K+',
      label: 'Projects Delivered',
      tagline: 'Border Districts & Interior Hubs',
      description:
        'Engineered laterite bricks and high-durability solutions for educational campuses, resorts, and premium construction.',
      highlights: [
        'Educational & Institutional Campuses',
        'Resorts, Farmhouses & Eco-stays',
        'High-density Mun Interlock Brick Supply',
      ],
      projects: ALL_PROJECTS.filter((p) => p.stateId === 'tamil-nadu'),
    },
  ],
};

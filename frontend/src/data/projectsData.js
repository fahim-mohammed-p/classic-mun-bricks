/**
 * Projects / Location Gallery Image Repository for Classic Mun Bricks
 *
 * Designed for scalability: genuine project images are added here with location tagging.
 * When real project images are added, they will automatically appear under their respective
 * location in the route gallery.
 *
 * Expected structure for each project image entry:
 * {
 *   id: string | number,
 *   district: 'Malappuram', // or districtId: 'malappuram'
 *   image: string,          // Image URL or imported asset
 *   alt?: string            // Optional descriptive alt text
 * }
 */

import { DISTRICT_NODES } from './districtMapConfig';

/**
 * All mock, sample, and placeholder project entries have been removed.
 * Genuine project images added here will automatically populate the location gallery.
 */
export const ALL_PROJECTS = [];

/**
 * Helper: Normalize district/state string for safe matching
 */
const normalizeKey = (str) => (str ? String(str).toLowerCase().replace(/[^a-z0-9]/g, '') : '');

/**
 * Filter projects by district ID or name ('all' returns all projects)
 */
export const getProjectsByDistrict = (districtId) => {
  if (!districtId || districtId === 'all') {
    return ALL_PROJECTS;
  }
  const target = normalizeKey(districtId);
  return ALL_PROJECTS.filter((p) => {
    const pDistrictId = normalizeKey(p.districtId || p.district);
    return pDistrictId === target;
  });
};

/**
 * Filter projects by state ID ('kerala' | 'tamil-nadu' | 'all')
 */
export const getProjectsByState = (stateId) => {
  if (!stateId || stateId === 'all') {
    return ALL_PROJECTS;
  }
  const target = normalizeKey(stateId);
  return ALL_PROJECTS.filter((p) => {
    // Direct state matching
    const pState = normalizeKey(p.stateId || p.state);
    if (pState === target) return true;

    // District-based lookup in DISTRICT_NODES
    const pDistrict = normalizeKey(p.districtId || p.district);
    const node = DISTRICT_NODES[pDistrict];
    if (node && normalizeKey(node.stateId) === target) return true;

    return false;
  });
};

/**
 * Helper: Calculate project counts per district automatically from data
 */
export const getDistrictProjectCounts = () => {
  const counts = {};
  Object.keys(DISTRICT_NODES).forEach((id) => {
    counts[id] = 0;
  });

  ALL_PROJECTS.forEach((proj) => {
    const key = normalizeKey(proj.districtId || proj.district);
    if (counts[key] !== undefined) {
      counts[key] += 1;
    } else if (key) {
      counts[key] = 1;
    }
  });

  return counts;
};

/**
 * Get featured projects for highlights if any exist
 */
export const getFeaturedProjects = () => {
  return ALL_PROJECTS.filter((p) => p.isFeatured);
};

/**
 * Centralized API configuration for Classic Mun Bricks
 *
 * In development (npm run dev): defaults to local Django backend (http://localhost:8000).
 * In production (npm run build): defaults to production Render API URL.
 */
const defaultBaseUrl = import.meta.env.DEV
  ? 'http://localhost:8000'
  : 'https://classic-mun-bricks.onrender.com';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || defaultBaseUrl).replace(/\/+$/, '');

export const API_ENDPOINTS = {
  CONTACT_ENQUIRIES: `${API_BASE_URL}/api/contact/enquiries/`,
  HEALTH_CHECK: `${API_BASE_URL}/api/health/`,
  BLOG_POSTS: `${API_BASE_URL}/api/blog/posts/`,
  BLOG_POST_DETAIL: (slug) => `${API_BASE_URL}/api/blog/posts/${slug}/`,
  PROJECT_LOCATIONS: `${API_BASE_URL}/api/projects/locations/`,
};

/**
 * Normalizes media URLs: returns absolute URLs unchanged,
 * or prefixes relative paths with API_BASE_URL exactly once.
 */
export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${cleanPath}`;
};

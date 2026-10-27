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
  SEO_BUNDLE: `${API_BASE_URL}/api/seo/bundle/`,
  SEO_PAGE: (path) => `${API_BASE_URL}/api/seo/page/?path=${encodeURIComponent(path)}`,
  SEO_SITE_SETTINGS: `${API_BASE_URL}/api/seo/site-settings/`,
  SEO_REDIRECTS: `${API_BASE_URL}/api/seo/redirects/`,
};

/**
 * Normalizes media URLs: returns absolute URLs unchanged,
 * guards against localhost leakage in production,
 * and prefixes relative paths with API_BASE_URL exactly once.
 */
export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    // In production, prevent localhost / 127.0.0.1 leakage
    if (!import.meta.env.DEV && (trimmed.includes('localhost') || trimmed.includes('127.0.0.1'))) {
      const pathOnly = trimmed.replace(/^https?:\/\/[^/]+/i, '');
      return `${API_BASE_URL}${pathOnly.startsWith('/') ? '' : '/'}${pathOnly}`;
    }
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${cleanPath}`;
};

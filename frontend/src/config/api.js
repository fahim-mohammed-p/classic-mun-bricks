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

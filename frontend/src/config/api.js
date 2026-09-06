/**
 * Centralized API configuration for Classic Mun Bricks
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  CONTACT_ENQUIRIES: `${API_BASE_URL}/api/contact/enquiries/`,
  HEALTH_CHECK: `${API_BASE_URL}/api/health/`,
};

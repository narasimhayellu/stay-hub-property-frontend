// API configuration
// Automatically use localhost for development and production URL for deployed app
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// For development, use relative URLs to leverage Vite proxy
// For production, use the full backend URL
export const API_BASE_URL = isDevelopment 
  ? ''  // Empty string for relative URLs in development
  : 'https://to-let-property-backend.onrender.com'; // Production backend

export const PROPERTY_API = `${API_BASE_URL}/api/properties`;
export const AUTH_API = `${API_BASE_URL}/users`;
export const BLOG_API = `${API_BASE_URL}/api/blogs`;
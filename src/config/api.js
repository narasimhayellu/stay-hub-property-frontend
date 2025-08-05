// API configuration
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'https://to-let-property-backend.onrender.com' 
  : '';

export const AUTH_API_BASE_URL = isDevelopment 
  ? 'https://to-let-authentication-backend.onrender.com' 
  : '';

export const PROPERTY_API = `${API_BASE_URL}/api/properties`;
export const AUTH_API = `${AUTH_API_BASE_URL}/users`;
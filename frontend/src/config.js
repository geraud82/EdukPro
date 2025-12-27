// ===============================
// API CONFIGURATION – EDUCKPRO
// ===============================

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// ✅ SINGLE SOURCE OF TRUTH
// In DEVELOPMENT: Use empty string so requests go through vite's proxy
// This prevents the /api/api/api... recursive loop issue
// In PRODUCTION: Use the configured VITE_API_URL
const API_URL = isDevelopment 
  ? ''  // Empty string = relative URLs, handled by vite proxy
  : (import.meta.env.VITE_API_URL || '');

if (!API_URL && isProduction) {
  console.warn(
    '⚠️ VITE_API_URL is not set in production. API calls will use relative URLs.'
  );
}

export { API_URL, isDevelopment, isProduction };

// Centralized API endpoints
export const API_ENDPOINTS = {
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  profile: `${API_URL}/api/profile`,
  vapidPublicKey: `${API_URL}/api/push/vapid-public-key`,
  pushSubscribe: `${API_URL}/api/push/subscribe`,
  pushUnsubscribe: `${API_URL}/api/push/unsubscribe`,
  schools: `${API_URL}/api/schools`,
  students: `${API_URL}/api/students`,
  classes: `${API_URL}/api/classes`,
  messages: `${API_URL}/api/messages`,
  payments: `${API_URL}/api/payments`,
  users: `${API_URL}/api/users`,
};

// Debug dev only
if (isDevelopment) {
  console.log('🔧 API_URL:', API_URL);
}

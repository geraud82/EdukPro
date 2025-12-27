// ===============================
// API CONFIGURATION – EDUCKPRO
// ===============================

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// ✅ SINGLE SOURCE OF TRUTH
const API_URL = import.meta.env.VITE_API_URL || (
  isDevelopment ? 'http://localhost:4000' : ''
);

if (!API_URL && isProduction) {
  console.error(
    '❌ VITE_API_URL is missing in production build'
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

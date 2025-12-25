// ===============================
// API CONFIGURATION – EDUCKPRO
// ===============================

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Get API URL from environment variable with smart fallbacks
const getApiUrl = () => {
  // 1. Check for explicit environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // 2. In development, default to local backend
  if (isDevelopment) {
    return 'http://localhost:4000';
  }
  
  // 3. In production, try to infer from current location (for VPS single-domain setup)
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // If we're on a subdomain structure, use api subdomain
    if (!hostname.startsWith('api.')) {
      return `${protocol}//api.${hostname}`;
    }
    return `${protocol}//${hostname}`;
  }
  
  // 4. Final fallback
  return 'http://localhost:4000';
};

export const API_URL = getApiUrl();

// Centralized API endpoints
export const API_ENDPOINTS = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  profile: `${API_URL}/api/profile`,
  
  // Push notifications
  vapidPublicKey: `${API_URL}/api/push/vapid-public-key`,
  pushSubscribe: `${API_URL}/api/push/subscribe`,
  pushUnsubscribe: `${API_URL}/api/push/unsubscribe`,
  
  // Schools
  schools: `${API_URL}/api/schools`,
  
  // Students
  students: `${API_URL}/api/students`,
  
  // Classes
  classes: `${API_URL}/api/classes`,
  
  // Messages
  messages: `${API_URL}/api/messages`,
  
  // Payments
  payments: `${API_URL}/api/payments`,
  
  // Users
  users: `${API_URL}/api/users`,
};

// Debug logging (only in development)
if (isDevelopment) {
  console.log('🔧 EduckPro API Configuration:');
  console.log('   API_URL:', API_URL);
  console.log('   Environment:', isDevelopment ? 'development' : 'production');
}

// Export environment flags
export { isDevelopment, isProduction };

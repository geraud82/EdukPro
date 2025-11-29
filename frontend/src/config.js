// API Configuration
export const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  profile: `${API_URL}/api/profile`,
  
  // Push notifications
  vapidPublicKey: `${API_URL}/api/push/vapid-public-key`,
  pushSubscribe: `${API_URL}/api/push/subscribe`,
  pushUnsubscribe: `${API_URL}/api/push/unsubscribe`,
  
  // Add other endpoints as needed
};

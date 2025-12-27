// Authentication Utilities
import { API_URL } from '../config';

/**
 * Check if user is authenticated (has token)
 */
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user;
  } catch {
    return null;
  }
}

/**
 * Get auth token
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Clear auth data and redirect to login
 */
export function logout(redirect = true) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (redirect && typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Handle API response - checks for 401 and handles accordingly
 */
export function handleApiResponse(response, options = {}) {
  const { silentFail = false, redirectOnUnauth = false } = options;
  
  if (response.status === 401) {
    if (redirectOnUnauth) {
      // Token invalid/expired - logout and redirect
      logout(true);
    } else if (!silentFail) {
      console.log('API: Authentication required');
    }
    return false;
  }
  
  return true;
}

/**
 * Make an authenticated API request with automatic 401 handling
 */
export async function authFetch(url, options = {}) {
  const token = getToken();
  
  if (!token) {
    return { ok: false, status: 401, error: 'No token' };
  }

  const defaultHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Handle 401 silently by default
    if (response.status === 401) {
      console.log('API request unauthorized - token may be expired');
      return { ok: false, status: 401, error: 'Unauthorized' };
    }

    return response;
  } catch (error) {
    console.log('API request failed:', error.message);
    return { ok: false, status: 0, error: error.message };
  }
}

/**
 * Validate token by making a test request to the profile endpoint
 */
export async function validateToken() {
  const token = getToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

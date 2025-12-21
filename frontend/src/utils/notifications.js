// Push Notification Utilities
import { API_URL } from '../config';

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Subscribe user to push notifications
 */
export async function subscribeToPushNotifications() {
  try {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return null;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return null;
    }

    // Request notification permission
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.log('Notification permission denied');
      return null;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
    // Fetch VAPID public key from backend
      let vapidPublicKey;
      try {
        const response = await fetch(`${API_URL}/api/push/vapid-public-key`);
        if (!response.ok) {
          console.log('Push notifications not enabled on server (endpoint unavailable)');
          return null;
        }
        const data = await response.json();
        vapidPublicKey = data.publicKey;
      } catch (error) {
        // Silently fail - push notifications not configured
        console.log('Push notifications not available');
        return null;
      }
      
      if (!vapidPublicKey) {
        console.log('Push notifications not enabled (no VAPID key configured on server)');
        return null;
      }
      
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        return null;
      }
    }

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
}

/**
 * Send subscription to backend
 */
export async function sendSubscriptionToBackend(subscription) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token found');
      return false;
    }

    const response = await fetch(`${API_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }

    console.log('Push subscription sent to server successfully');
    return true;
  } catch (error) {
    console.error('Error sending subscription to backend:', error);
    return false;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('Unsubscribed from push notifications');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

/**
 * Check if notifications are enabled
 */
export function areNotificationsEnabled() {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Show a local notification (for testing)
 */
export async function showLocalNotification(title, options = {}) {
  if (!areNotificationsEnabled()) {
    console.warn('Notifications are not enabled');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body: options.body || '',
      icon: options.icon || '/images/icon-192.png',
      badge: options.badge || '/images/icon-192.png',
      tag: options.tag || 'local-notification',
      vibrate: options.vibrate || [200, 100, 200],
      data: options.data || {}
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

/**
 * Initialize push notifications for logged-in user
 */
export async function initializePushNotifications() {
  try {
    // Request permission
    const permissionGranted = await requestNotificationPermission();
    
    if (permissionGranted) {
      // Subscribe to push notifications
      const subscription = await subscribeToPushNotifications();
      
      if (subscription) {
        // Send subscription to backend
        await sendSubscriptionToBackend(subscription);
        console.log('Push notifications initialized successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

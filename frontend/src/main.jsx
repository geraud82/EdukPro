import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializePushNotifications } from './utils/notifications';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => {
        console.log('Service worker registered:', reg.scope);
        
        // Initialize push notifications if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          // Delay to give service worker time to activate
          setTimeout(() => {
            initializePushNotifications().then(success => {
              if (success) {
                console.log('✅ Push notifications enabled');
              }
              // Silently fail if not enabled - user may need to re-login
            }).catch(() => {
              // Silently fail for any errors
              console.log('Push notifications: initialization skipped');
            });
          }, 1000);
        }
      })
      .catch(err => {
        // Silently log service worker registration issues
        console.log('Service worker registration skipped:', err.message);
      });
  });
}

// Listen for login events to initialize notifications
window.addEventListener('storage', (e) => {
  if (e.key === 'token' && e.newValue) {
    // User just logged in
    setTimeout(() => {
      initializePushNotifications();
    }, 1000);
  }
});

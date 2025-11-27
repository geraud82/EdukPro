# Push Notifications Setup Guide

This guide explains how the push notifications feature works in EduckPro.

## Overview

EduckPro uses Web Push API to send real-time notifications to users when they're not actively using the app. This is perfect for notifying parents about new invoices, messages, or enrollment updates.

## Architecture

### Components

1. **Service Worker** (`frontend/public/service-worker.js`)
   - Runs in the background
   - Handles push notifications when app is closed
   - Displays notifications and handles user interactions

2. **Notification Utils** (`frontend/src/utils/notifications.js`)
   - Helper functions for requesting permission
   - Subscribing/unsubscribing to push notifications
   - Sending subscription to backend

3. **Push Service** (`backend/services/pushService.js`)
   - Manages push subscriptions (in-memory storage)
   - Sends push notifications using web-push library
   - Helper functions for common notification types

4. **Backend Endpoints** (`backend/server.js`)
   - `GET /api/push/vapid-public-key` - Get public VAPID key
   - `POST /api/push/subscribe` - Save user's push subscription
   - `POST /api/push/unsubscribe` - Remove user's subscription
   - `POST /api/push/test` - Send test notification

## Setup Instructions

### 1. Generate VAPID Keys

VAPID keys were already generated and added to your `.env` file:

```bash
cd backend
node generate-vapid-keys.js
```

The keys are stored in `backend/.env`:
```
VAPID_PUBLIC_KEY=BAZk0w6oryEJlQm999by0RqKqZhjWlC4hvSID1xuEEfoCnv1EFPwh0yON4x-eV0j0qgO-KKvj0INNGG8Mu7Yt5w
VAPID_PRIVATE_KEY=AsxWfkiVt8rooCiTlSieavQewSwkTfUXb_3WJFkzA8M
VAPID_SUBJECT=mailto:admin@educkpro.com
```

### 2. Install Dependencies

Already installed:
```bash
cd backend
npm install web-push
```

### 3. Start the Application

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

### 4. Test Push Notifications

1. **Login to the application**
2. **Grant notification permission** when prompted
3. **Test notifications:**
   - Send a message to another user
   - Create an invoice (as admin)
   - Check browser notifications

You can also test manually by calling:
```javascript
// In browser console
await fetch('http://localhost:4000/api/push/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    title: 'Test Notification',
    body: 'This is a test!'
  })
})
```

## Notification Types

### 1. New Message Notification
Sent when a user receives a chat message:
```javascript
{
  title: "New message from John Doe",
  body: "Message preview...",
  data: { url: '/messages', type: 'message' }
}
```

### 2. New Invoice Notification
Sent when an invoice is created for a parent:
```javascript
{
  title: "💰 New Invoice Created",
  body: "Tuition Fee: 50000 XOF",
  data: { url: '/fees', type: 'invoice', invoiceId: 123 }
}
```

### 3. Enrollment Notification
Sent when enrollment is approved:
```javascript
{
  title: "✅ Enrollment Approved!",
  body: "Student Name has been enrolled in Class Name",
  data: { url: '/children', type: 'enrollment' }
}
```

### 4. Payment Confirmation
Sent when payment is received:
```javascript
{
  title: "✅ Payment Received",
  body: "Payment of 50000 XOF confirmed",
  data: { url: '/fees', type: 'payment' }
}
```

## How It Works

### User Flow

1. **User logs in** → Permission request shown
2. **User grants permission** → Service worker subscribes to push notifications
3. **Subscription sent to backend** → Stored in memory (associated with user ID)
4. **Events occur** (message sent, invoice created, etc.)
5. **Backend sends push notification** → Using web-push library
6. **Service worker receives notification** → Displays it to user
7. **User clicks notification** → App opens to relevant page

### Backend Flow

```javascript
// 1. Event occurs (e.g., new message)
const message = await prisma.message.create({ ... });

// 2. Get user's push subscription
const subscription = pushService.getSubscription(userId);

// 3. Send push notification
await pushService.sendNewMessageNotification(
  receiverId,
  senderName,
  messagePreview
);

// 4. web-push sends notification to browser
// 5. Service worker displays notification
```

## Important Notes

### Production Considerations

1. **Subscription Storage**
   - Currently uses in-memory storage (lost on server restart)
   - For production, store subscriptions in database
   - Add a `PushSubscription` model to Prisma schema

2. **VAPID Keys**
   - Keep private key secret
   - Never commit to version control
   - Use environment variables

3. **Error Handling**
   - Invalid subscriptions are automatically removed
   - Errors are logged but don't fail requests

4. **HTTPS Required**
   - Service workers and push notifications require HTTPS
   - localhost works for development
   - Use HTTPS in production

### Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: iOS 16.4+ only
- Mobile browsers: Varies by platform

### Permissions

- Users must grant notification permission
- Permission can be revoked anytime
- Gracefully handle denied permissions

## Troubleshooting

### Notifications not working?

1. **Check permission**
   ```javascript
   console.log(Notification.permission); // Should be 'granted'
   ```

2. **Check service worker**
   ```javascript
   navigator.serviceWorker.getRegistration()
     .then(reg => console.log('SW registered:', !!reg));
   ```

3. **Check subscription**
   ```javascript
   navigator.serviceWorker.ready.then(reg => 
     reg.pushManager.getSubscription()
       .then(sub => console.log('Subscribed:', !!sub))
   );
   ```

4. **Check backend logs**
   - Look for push subscription saves
   - Check for notification send attempts

5. **Check browser console**
   - Service worker errors
   - Network errors

### Common Issues

**"No push subscription found"**
- User hasn't granted permission
- Subscription not sent to backend
- Backend restarted (in-memory storage cleared)

**"Failed to subscribe"**
- Invalid VAPID keys
- Service worker not registered
- Browser doesn't support push

**Notifications not showing**
- User has "Do Not Disturb" enabled
- Browser notifications blocked
- Service worker not handling push event

## API Reference

### Frontend Functions

```javascript
import { 
  initializePushNotifications,
  areNotificationsEnabled,
  showLocalNotification 
} from './utils/notifications';

// Initialize on login
await initializePushNotifications();

// Check if enabled
if (areNotificationsEnabled()) {
  console.log('Notifications enabled');
}

// Show local notification (testing)
await showLocalNotification('Test', { body: 'Hello!' });
```

### Backend Functions

```javascript
const pushService = require('./services/pushService');

// Save subscription
pushService.saveSubscription(userId, subscription);

// Send notification
await pushService.sendPushNotification(userId, {
  title: 'Title',
  body: 'Body',
  icon: '/images/icon-192.png'
});

// Send specific notification types
await pushService.sendNewMessageNotification(userId, senderName, preview);
await pushService.sendNewInvoiceNotification(userId, invoiceData);
await pushService.sendEnrollmentNotification(userId, enrollmentData);
await pushService.sendPaymentConfirmation(userId, paymentData);
```

## Future Enhancements

1. **Database Storage**
   - Store subscriptions in PostgreSQL
   - Support multiple devices per user
   - Track subscription history

2. **Notification Preferences**
   - Let users choose notification types
   - Quiet hours support
   - Email fallback option

3. **Rich Notifications**
   - Images in notifications
   - Action buttons (Reply, Mark as Read, etc.)
   - Progress indicators

4. **Analytics**
   - Track notification delivery
   - Click-through rates
   - User engagement metrics

## Resources

- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push library](https://github.com/web-push-libs/web-push)
- [VAPID specification](https://datatracker.ietf.org/doc/html/draft-ietf-webpush-vapid)

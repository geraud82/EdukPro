const webpush = require('web-push');

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@educkpro.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// In-memory storage for push subscriptions (in production, use database)
const subscriptions = new Map();

/**
 * Store a push subscription for a user
 */
function saveSubscription(userId, subscription) {
  subscriptions.set(userId, subscription);
  console.log(`Push subscription saved for user ${userId}`);
}

/**
 * Get subscription for a user
 */
function getSubscription(userId) {
  return subscriptions.get(userId);
}

/**
 * Remove subscription for a user
 */
function removeSubscription(userId) {
  subscriptions.delete(userId);
  console.log(`Push subscription removed for user ${userId}`);
}

/**
 * Send a push notification to a specific user
 */
async function sendPushNotification(userId, payload) {
  const subscription = getSubscription(userId);
  
  if (!subscription) {
    console.log(`No push subscription found for user ${userId}`);
    return false;
  }

  try {
    const notificationPayload = JSON.stringify(payload);
    
    await webpush.sendNotification(subscription, notificationPayload);
    console.log(`Push notification sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error sending push notification to user ${userId}:`, error);
    
    // If subscription is invalid, remove it
    if (error.statusCode === 404 || error.statusCode === 410) {
      removeSubscription(userId);
    }
    
    return false;
  }
}

/**
 * Send push notification to multiple users
 */
async function sendPushNotificationToMultiple(userIds, payload) {
  const promises = userIds.map(userId => sendPushNotification(userId, payload));
  const results = await Promise.allSettled(promises);
  
  const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
  console.log(`Push notifications sent: ${successCount}/${userIds.length}`);
  
  return successCount;
}

/**
 * Send notification for new message
 */
async function sendNewMessageNotification(receiverId, senderName, messagePreview) {
  const payload = {
    title: `New message from ${senderName}`,
    body: messagePreview || 'You have a new message',
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: 'new-message',
    data: {
      url: '/messages',
      type: 'message'
    },
    actions: [
      { action: 'view', title: 'View Message' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  return await sendPushNotification(receiverId, payload);
}

/**
 * Send notification for new invoice
 */
async function sendNewInvoiceNotification(userId, invoiceData) {
  const payload = {
    title: '💰 New Invoice Created',
    body: `${invoiceData.feeName}: ${invoiceData.amount} ${invoiceData.currency}`,
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: 'new-invoice',
    requireInteraction: true,
    data: {
      url: '/fees',
      type: 'invoice',
      invoiceId: invoiceData.id
    },
    actions: [
      { action: 'view', title: 'View Invoice' },
      { action: 'close', title: 'Later' }
    ]
  };

  return await sendPushNotification(userId, payload);
}

/**
 * Send notification for enrollment approval
 */
async function sendEnrollmentNotification(userId, enrollmentData) {
  const payload = {
    title: '✅ Enrollment Approved!',
    body: `${enrollmentData.studentName} has been enrolled in ${enrollmentData.className}`,
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: 'enrollment-approved',
    data: {
      url: '/children',
      type: 'enrollment'
    }
  };

  return await sendPushNotification(userId, payload);
}

/**
 * Send notification for payment confirmation
 */
async function sendPaymentConfirmation(userId, paymentData) {
  const payload = {
    title: '✅ Payment Received',
    body: `Payment of ${paymentData.amount} ${paymentData.currency} confirmed`,
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: 'payment-confirmed',
    data: {
      url: '/fees',
      type: 'payment'
    }
  };

  return await sendPushNotification(userId, payload);
}

/**
 * Get VAPID public key
 */
function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY;
}

module.exports = {
  saveSubscription,
  getSubscription,
  removeSubscription,
  sendPushNotification,
  sendPushNotificationToMultiple,
  sendNewMessageNotification,
  sendNewInvoiceNotification,
  sendEnrollmentNotification,
  sendPaymentConfirmation,
  getVapidPublicKey
};

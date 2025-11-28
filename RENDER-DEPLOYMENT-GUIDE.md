# Render Deployment Guide

## Fixing the VAPID Keys Error

You're seeing this error because the push notification VAPID keys are missing from your Render environment variables.

### Solution: Add VAPID Keys to Render

1. **Generate VAPID Keys (if you haven't already)**
   ```bash
   cd backend
   node generate-vapid-keys.js
   ```
   
   This will output something like:
   ```
   VAPID_PUBLIC_KEY=BAZk0w6oryEJlQm999by0RqKqZhjWlC4hvSID1xuEEfoCnv1EFPwh0yON4x-eV0j0qgO-KKvj0INNGG8Mu7Yt5w
   VAPID_PRIVATE_KEY=AsxWfkiVt8rooCiTlSieavQewSwkTfUXb_3WJFkzA8M
   ```

2. **Add Environment Variables to Render**
   
   a. Go to your Render dashboard: https://dashboard.render.com
   
   b. Select your EduckPro backend service
   
   c. Go to the "Environment" tab
   
   d. Click "Add Environment Variable"
   
   e. Add these three variables:
   
   ```
   Key: VAPID_PUBLIC_KEY
   Value: [Your public key from step 1]
   
   Key: VAPID_PRIVATE_KEY
   Value: [Your private key from step 1]
   
   Key: VAPID_SUBJECT
   Value: mailto:admin@educkpro.com
   ```
   
   f. Click "Save Changes"

3. **Redeploy Your Service**
   
   After adding the environment variables, Render will automatically redeploy your service.
   
   Alternatively, you can manually trigger a deploy by clicking "Manual Deploy" > "Deploy latest commit"

### Important Notes

- **Push notifications are now optional**: If VAPID keys are missing, the app will still work but push notifications will be disabled
- The app will log warnings about missing VAPID keys, which is normal
- Once you add the keys, push notifications will work automatically

### Other Required Environment Variables

Make sure you also have these environment variables set in Render:

```
PORT=4000
JWT_SECRET=[Your secret key - generate a strong random string]
DATABASE_URL=[Your PostgreSQL connection string from Render]
```

Optional (for email features):
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=[Your email]
EMAIL_PASS=[Your app password]
EMAIL_FROM=EduckPro <noreply@educkpro.com>
```

### Testing After Deployment

1. Check the deployment logs in Render
2. You should see: `✅ Push notifications configured successfully`
3. If you see warnings about missing VAPID keys, double-check that you added them correctly

### Troubleshooting

**Still seeing errors after adding VAPID keys?**
- Verify the keys were copied correctly (no extra spaces)
- Make sure you clicked "Save Changes" in Render
- Check that the deployment completed successfully
- View the logs to see if there are any other error messages

**App works but push notifications don't work?**
- This is expected behavior if VAPID keys are not configured
- The app will function normally, just without push notifications
- Add the VAPID keys as described above to enable push notifications

### Need Help?

If you continue to experience issues:
1. Check the Render logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure your database connection string is correct

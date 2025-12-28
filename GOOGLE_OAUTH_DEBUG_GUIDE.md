# Google OAuth Redirect URI Debug Guide

## Quick Fix Steps

### Step 1: Check What Redirect URI Your App Is Using

1. Open your browser's Developer Console (F12)
2. Click "Connect Google Calendar" button
3. Look for console logs that show:
   ```
   🔗 Redirect URI that will be used: [YOUR_REDIRECT_URI]
   ```
4. **Copy this EXACT redirect URI**

### Step 2: Add to Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project
3. Click on your **OAuth 2.0 Client ID**
4. Scroll to **"Authorized redirect URIs"**
5. Click **"+ ADD URI"**
6. **Paste the EXACT redirect URI** from Step 1
7. Click **"SAVE"**
8. **Wait 2-3 minutes** for changes to propagate

### Step 3: Try Again

Click "Connect Google Calendar" again. It should work now.

## Common Redirect URIs

### For Web Development (Local)
- `http://localhost:3000/google-callback` (if running on port 3000)
- `http://localhost:8081/google-callback` (if running on port 8081)
- `http://127.0.0.1:3000/google-callback` (alternative localhost format)

### For Web Production
- `https://your-domain.com/google-callback`
- `https://www.your-domain.com/google-callback` (if using www)

### For Expo/Mobile
- `http://localhost:8081/google-callback`

## How to Find Your Current Redirect URI

### Method 1: Browser Console (Recommended)
1. Open Developer Tools (F12)
2. Go to Console tab
3. Click "Connect Google Calendar"
4. Look for log: `🔗 Redirect URI that will be used:`

### Method 2: Check Current URL
- If you're on `http://localhost:3000`, your redirect URI is `http://localhost:3000/google-callback`
- If you're on `http://localhost:8081`, your redirect URI is `http://localhost:8081/google-callback`
- Check the address bar to see your current origin

### Method 3: Supabase Edge Function Logs
1. Go to Supabase Dashboard → Edge Functions → Logs
2. Look for `google-oauth-initiate` function logs
3. Find the log: `Using redirect URI:`

## Troubleshooting

### Error: redirect_uri_mismatch

**Cause:** The redirect URI sent to Google doesn't match any URI in Google Cloud Console.

**Solution:**
1. Check console logs to see what redirect URI is being used
2. Add that EXACT URI to Google Cloud Console
3. Make sure there are NO differences:
   - Protocol: `http://` vs `https://`
   - Domain: `localhost` vs `127.0.0.1`
   - Port: `:3000` vs `:8081` vs no port
   - Path: `/google-callback` (no trailing slash)
   - Case sensitivity (though URLs are usually case-insensitive)

### Still Getting Error After Adding URI?

1. **Wait longer**: Google can take 2-5 minutes to propagate changes
2. **Check for typos**: Copy-paste the exact URI from console logs
3. **Clear browser cache**: Sometimes cached OAuth errors persist
4. **Try incognito mode**: To rule out browser extensions
5. **Check multiple URIs**: Add both `http://localhost:3000/google-callback` AND `http://localhost:8081/google-callback` if unsure

### Port Mismatch

If your app runs on port 3000 but you added port 8081 to Google Cloud Console:
- **Option 1**: Add the correct port URI to Google Cloud Console
- **Option 2**: Change your app to run on port 8081
- **Option 3**: Set `EXPO_PUBLIC_GOOGLE_REDIRECT_URI` environment variable

## Setting Custom Redirect URI (Advanced)

If you need a specific redirect URI, you can set it via environment variable:

1. Create/update `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/google-callback
   ```

2. Restart your development server

3. The app will use this URI instead of auto-detecting

## Verification Checklist

- [ ] Console shows the redirect URI being used
- [ ] That EXACT URI is added to Google Cloud Console
- [ ] No trailing slash in the URI
- [ ] Protocol matches (http vs https)
- [ ] Port matches (if specified)
- [ ] Waited 2-3 minutes after saving
- [ ] Cleared browser cache/used incognito
- [ ] Checked Supabase Edge Function logs

## Still Having Issues?

1. Check Supabase Edge Function logs for `google-oauth-initiate`
2. Check browser Network tab to see the actual OAuth request
3. Verify `GOOGLE_OAUTH_CLIENT_ID` is set in Supabase secrets
4. Make sure you're using the correct Google Cloud project


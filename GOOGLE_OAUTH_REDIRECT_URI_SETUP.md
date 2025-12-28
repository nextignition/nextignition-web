# Google OAuth Redirect URI Configuration Guide

## Problem: redirect_uri_mismatch Error

If you're seeing "Error 400: redirect_uri_mismatch", it means the redirect URI being sent to Google doesn't match what's configured in your Google Cloud Console.

## Solution: Configure Redirect URI in Google Cloud Console

### Step 1: Find Your Application's Redirect URI

The redirect URI format depends on your platform:

**For Web:**
```
https://your-domain.com/google-callback
```

**For Local Development (Web):**
```
http://localhost:8081/google-callback
```

**For Expo/Mobile (Local Development):**
```
http://localhost:8081/google-callback
```

**Important:** Google Cloud Console does NOT accept custom URL schemes like `exp://`. You must use HTTP/HTTPS URLs.

### Step 2: Add Redirect URI to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID** (or create one if you don't have it)
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Add **ALL** the redirect URIs you'll use:
   - `https://your-production-domain.com/google-callback` (production web)
   - `http://localhost:8081/google-callback` (for local web dev AND Expo/mobile)
   - `http://localhost:3000/google-callback` (if using different port)
   - Any other domains/ports you use
   
   **Note:** Google only accepts HTTP/HTTPS URLs. Custom schemes like `exp://` are NOT accepted.

### Step 3: Important Notes

- **Exact Match Required**: The redirect URI must match EXACTLY, including:
  - Protocol (http vs https)
  - Domain/subdomain
  - Path (`/google-callback`)
  - Port (if specified)
  - No trailing slashes (unless configured with one)

- **Multiple URIs**: You can add multiple redirect URIs in Google Cloud Console, so add all environments you'll use.

- **Common Mistakes**:
  - ❌ `https://your-domain.com/google-callback/` (trailing slash)
  - ✅ `https://your-domain.com/google-callback` (no trailing slash)
  - ❌ `http://localhost/google-callback` (missing port)
  - ✅ `http://localhost:8081/google-callback` (with port)

### Step 4: Verify Configuration

After adding the redirect URI:
1. Wait a few minutes for changes to propagate
2. Try connecting Google Calendar again
3. Check the browser console/logs to see what redirect URI is being used
4. Ensure it matches exactly what you configured

## Debugging

To see what redirect URI is being used, check:
1. Browser console logs (for web)
2. Supabase Edge Function logs (for `google-oauth-initiate`)
3. The error message from Google will show what redirect URI was received

## Current Implementation

The application uses:
- **Web**: `${window.location.origin}/google-callback`
- **Mobile/Expo**: `http://localhost:8081/google-callback` (HTTP, not exp://)

Make sure these EXACT strings are added to your Google Cloud Console OAuth client configuration.

## Why HTTP for Expo?

Google Cloud Console only accepts HTTP/HTTPS URLs for OAuth redirects. Custom URL schemes like `exp://` are rejected. For Expo:
- Use `http://localhost:8081/google-callback` for development
- Expo's WebBrowser can intercept this and route it to your app
- For production, use your actual domain: `https://your-domain.com/google-callback`


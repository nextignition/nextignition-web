# Google OAuth Flow Fixes

## Issues Fixed

### 1. **400 Bad Request Errors**
**Problem:** Multiple 400 errors when calling google-oauth-callback edge function

**Root Causes:**
- useEffect was running multiple times, causing duplicate edge function calls
- No protection against concurrent callback processing
- params dependency was too broad, causing re-renders

**Fix:**
- Added `processingRef` to prevent concurrent processing
- Changed useEffect dependencies to only `[params.code, params.error, params.state]`
- Added condition to only run if code or error exists
- Wrapped in try-finally to always reset processing flag

### 2. **Wrong Redirect After OAuth**
**Problem:** After OAuth, always redirected to schedule-meeting page, even if OAuth was initiated from expert-sessions

**Root Cause:**
- Callback always hardcoded redirect to `/(tabs)/schedule-meeting`
- No state parameter passed to track originating page

**Fix:**
- Added `state` parameter in OAuth initiate call with current path
- Callback now reads state parameter and redirects back to originating page
- Default fallback to `/(tabs)/expert-sessions` if state missing

### 3. **Login Page Redirect**
**Problem:** Sometimes redirected to login page after OAuth

**Root Cause:**
- User authentication check was using `useAuth()` hook which might be stale
- Session check was too early before page fully loaded

**Fix:**
- Changed to use `supabase.auth.getUser()` for fresh user data
- Removed dependency on `user` from useAuth hook in useEffect
- Only redirect to login if truly no user after fresh check

### 4. **Enhanced Error Handling & Logging**
**Improvements:**
- Added comprehensive console logging throughout callback flow
- Better error messages with context
- Logs show exact step where failure occurs
- Shorter redirect delays for better UX (1.5s success, 2s error)

---

## Code Changes

### File: `app/(auth)/google-callback.tsx`

**Changes:**
1. Added `useRef` for processing flag
2. Changed useEffect dependencies
3. Added condition check before running callback
4. Use `supabase.auth.getUser()` instead of `useAuth()` hook
5. Read and use `state` parameter for redirect
6. Added try-finally block
7. Enhanced logging
8. Reduced redirect timeouts

### File: `hooks/useGoogleAuth.ts`

**Changes:**
1. Get current path before OAuth initiate
2. Pass `state` parameter to edge function
3. State contains originating page path

---

## Flow Diagram

### Before (Broken):
```
Expert Sessions → Click "Connect"
    ↓
OAuth Initiate (no state)
    ↓
Google Auth
    ↓
Callback → ALWAYS schedule-meeting
    ↓
User confused (wrong page)
```

### After (Fixed):
```
Expert Sessions → Click "Connect"
    ↓
OAuth Initiate (state: /(tabs)/expert-sessions)
    ↓
Google Auth
    ↓
Callback → Read state → Redirect to /(tabs)/expert-sessions
    ↓
User back where they started ✓
```

---

## Testing Checklist

### Test 1: From Expert Sessions
- [x] Go to Expert Sessions page
- [x] Click "Connect Google Calendar"
- [x] Complete OAuth
- [x] Verify redirected back to Expert Sessions (not schedule-meeting)
- [x] Verify no 400 errors in console
- [x] Verify Google Calendar connected

### Test 2: From Schedule Meeting
- [x] Go to Schedule Meeting page
- [x] Click "Connect Google Calendar"
- [x] Complete OAuth
- [x] Verify redirected back to Schedule Meeting
- [x] Verify connection successful

### Test 3: Error Handling
- [x] Initiate OAuth but cancel/deny
- [x] Verify error message shows
- [x] Verify redirected back to originating page
- [x] No login page redirect

### Test 4: No Duplicate Calls
- [x] Open Network tab
- [x] Connect Google Calendar
- [x] Verify only ONE call to google-oauth-callback
- [x] No repeated 400 errors

---

## Success Criteria

✅ No 400 Bad Request errors  
✅ Redirects to originating page after OAuth  
✅ No unwanted login page redirects  
✅ Only one edge function call per OAuth flow  
✅ Clear error messages if something fails  
✅ Faster redirects (better UX)  

---

## Console Output (Expected)

**Successful Flow:**
```
=== Google Callback Started ===
Params: { code: "...", state: "/(tabs)/expert-sessions" }
Current user: abc-123
Redirect URI: http://localhost:8081/google-callback
Calling edge function with code: 4/0AeanS...
Edge function response: { success: true }
✅ Google Calendar connected successfully
Redirecting to: /(tabs)/expert-sessions
```

**Error Flow:**
```
=== Google Callback Started ===
=== Callback Error ===
Error: Failed to connect Google
Message: [specific error message]
```

---

All issues resolved. OAuth flow now works correctly without errors or wrong redirects.


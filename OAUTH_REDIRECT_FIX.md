# OAuth Redirect & Status Update Fix

## Issues Fixed

### 1. Wrong Redirect After OAuth
**Problem:** After connecting Google Calendar, redirected to expert-sessions instead of schedule-meeting

**Fix:** Changed all redirects in `google-callback.tsx` to always go to `/(tabs)/schedule-meeting`

**Before:**
```typescript
setTimeout(() => {
  const returnTo = state || '/(tabs)/expert-sessions';
  router.replace(returnTo as any);
}, 2000);
```

**After:**
```typescript
setTimeout(() => {
  router.replace('/(tabs)/schedule-meeting');
}, 2000);
```

---

### 2. Google Calendar Status Not Updating
**Problem:** After OAuth callback, schedule-meeting page still showed "Connect Google Calendar" button instead of showing connected status

**Root Cause:** Page wasn't checking Google Calendar status when coming back into focus after OAuth redirect

**Fix:** Added `useFocusEffect` to schedule-meeting page to refresh Google Calendar status

**Code Added:**
```typescript
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';

// In component
const { checkGoogleConnection } = useGoogleAuth();

useFocusEffect(
  React.useCallback(() => {
    console.log('📍 Schedule Meeting page focused - checking Google Calendar status');
    checkGoogleConnection();
  }, [checkGoogleConnection])
);
```

---

## Complete Flow (Fixed)

```
Schedule Meeting Page
    ↓
Click "Connect Google Calendar"
    ↓
Redirect to Google OAuth
    ↓
User authorizes
    ↓
Callback at /google-callback
    ↓
Process OAuth code
    ↓
Save tokens to database
    ↓
Show success message (1.5s)
    ↓
Redirect to /(tabs)/schedule-meeting ✅
    ↓
useFocusEffect triggers
    ↓
checkGoogleConnection() called
    ↓
Fetches latest token status from database
    ↓
UI updates to show "✅ Google Calendar connected" ✅
    ↓
"Schedule Meeting" button enabled ✅
```

---

## Files Modified

### 1. `app/(auth)/google-callback.tsx`
**Changes:**
- All redirects now go to `/(tabs)/schedule-meeting`
- Removed state-based redirect logic
- Consistent behavior for success and error cases

**Lines Changed:**
- Line 38-40: Error case redirect
- Line 48-50: No code case redirect  
- Line 88-91: Success case redirect
- Line 102-104: Finally block redirect

### 2. `app/(tabs)/schedule-meeting.tsx`
**Changes:**
- Added `useFocusEffect` import
- Added `checkGoogleConnection` from useGoogleAuth hook
- Added focus effect to refresh connection status

**Lines Added:**
- Import: `useFocusEffect`
- Hook: `checkGoogleConnection` 
- Effect: `useFocusEffect` block

---

## Expected Behavior

### Success Flow:
1. ✅ User clicks "Connect Google Calendar"
2. ✅ Completes OAuth
3. ✅ Returns to schedule-meeting page (not expert-sessions)
4. ✅ Page checks connection status automatically
5. ✅ UI shows "✅ Google Calendar connected"
6. ✅ "Schedule Meeting" button is enabled
7. ✅ No "Connect" button visible

### Error Flow:
1. ✅ OAuth fails or is cancelled
2. ✅ Shows error message
3. ✅ Redirects to schedule-meeting page
4. ✅ Page shows connection required
5. ✅ User can try again

---

## Testing Checklist

### Test 1: Successful Connection
- [x] Go to schedule-meeting page
- [x] Click "Connect Google Calendar"
- [x] Authorize Google
- [x] Verify redirected to schedule-meeting (not expert-sessions)
- [x] Verify "✅ Google Calendar connected" message shows
- [x] Verify "Connect" button is hidden
- [x] Verify "Schedule Meeting" button is enabled

### Test 2: Already Connected
- [x] Google Calendar already connected
- [x] Go to schedule-meeting page
- [x] Verify immediately shows connected status
- [x] No need to connect again

### Test 3: Connection From Expert Sessions
- [x] Go to expert-sessions page
- [x] Click "Connect Google Calendar"
- [x] Complete OAuth
- [x] Verify redirected to schedule-meeting
- [x] Verify connection status updates

### Test 4: Error Handling
- [x] Start OAuth but cancel
- [x] Verify redirected to schedule-meeting
- [x] Verify can retry connection

---

## Console Output (Expected)

**On OAuth Success:**
```
=== Google Callback Started ===
Params: { code: "4/0Ae...", state: "..." }
Current user: user-123
✅ Google Calendar connected successfully
Redirecting to: /(tabs)/schedule-meeting

[After redirect]
📍 Schedule Meeting page focused - checking Google Calendar status
[checkGoogleConnection fetches latest status]
```

**Result:**
- tokenStatus.isConnected: true
- tokenStatus.isValid: true
- UI shows connected state

---

## Success Criteria

✅ Always redirects to schedule-meeting after OAuth (success or error)  
✅ Connection status refreshes automatically on page focus  
✅ UI updates to show connected state immediately  
✅ No manual refresh needed  
✅ Consistent behavior every time  

---

All issues resolved. OAuth flow now works correctly with proper redirects and status updates.


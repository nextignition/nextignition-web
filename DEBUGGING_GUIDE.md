# Debugging Guide - Appointment Scheduling System

## 🔧 **Fixed Issues**

### ✅ **1. Decline Button Error (`Alert.prompt`)**
**Error:** `Uncaught (in promise) TypeError: Alert.default.prompt is not a function`

**Root Cause:** `Alert.prompt()` is not available on React Native Web.

**Fix:**
```typescript
// BEFORE (doesn't work on web)
Alert.prompt('Reject Request', 'Provide reason:', ...);

// AFTER (works everywhere)
Alert.alert('Reject Request', 'Are you sure?', [
  { text: 'Cancel' },
  { text: 'Reject', onPress: async () => {
    await rejectRequest({ request_id, response_message: 'Declined' });
  }}
]);
```

**Files Updated:**
- `app/(tabs)/expert-sessions.tsx`
- `app/(tabs)/mentorship.tsx`

---

### ✅ **2. Accept Button Not Working**

**Symptoms:**
- Button clicked, nothing happens
- Request stays in "Requests" tab
- No meeting link created

**Fixes Applied:**

#### **a) Added Loading States**
```typescript
const [acceptingId, setAcceptingId] = useState<string | null>(null);

<Button
  title={acceptingId === request.id ? "Accepting..." : "Accept"}
  loading={acceptingId === request.id}
  disabled={acceptingId === request.id}
/>
```

#### **b) Enhanced Logging**
Now you'll see detailed console logs:
```
=== ACCEPT REQUEST FLOW STARTED ===
Request ID: abc123
User ID: user456
✓ Request fetched successfully
Request details: { topic, founder_email, ... }
📅 Calling schedule-meeting edge function...
Meeting parameters: { participantEmail, title, ... }
✓ Meeting created successfully
Meeting details: { id, google_meet_link, ... }
📝 Updating request status to accepted...
✓ Request updated to accepted status
🎉 ACCEPT REQUEST FLOW COMPLETED SUCCESSFULLY
Meeting link: https://meet.google.com/xxx-xxxx-xxx
🔄 Refreshing requests to update UI...
✓ UI refreshed
```

#### **c) Force Refresh After Accept**
```typescript
await acceptRequest({ request_id });
await fetchRequests(); // Force UI refresh
```

**Files Updated:**
- `app/(tabs)/expert-sessions.tsx`
- `hooks/useMentorshipRequests.ts`

---

### ✅ **3. Slot Visibility (Prevent Double Booking)**

**Problem:** Multiple founders could see and request the same slot.

**Solution:** Hide slots that are:
1. Already booked (`is_booked = true`)
2. Have pending requests

**Implementation:**
```typescript
// In useMentorshipAvailability.ts
const fetchSlots = async (onlyAvailable = true) => {
  // 1. Fetch unbooked slots
  let query = supabase
    .from('expert_availability_slots')
    .eq('is_booked', false);
  
  const { data: slots } = await query;
  
  // 2. Check for pending requests on these slots
  const { data: pendingRequests } = await supabase
    .from('mentorship_requests')
    .select('availability_slot_id')
    .in('availability_slot_id', slotIds)
    .eq('status', 'pending');
  
  // 3. Filter out slots with pending requests
  const slotsWithPending = new Set(
    pendingRequests.map(r => r.availability_slot_id)
  );
  
  return slots.filter(s => !slotsWithPending.has(s.id));
};
```

**Files Updated:**
- `hooks/useMentorshipAvailability.ts`

---

### ✅ **4. Real-Time Updates**

**Added subscription for mentorship_requests:**
```typescript
supabase
  .channel(`availability_slots:${expertId}`)
  .on('postgres_changes', {
    event: '*',
    table: 'expert_availability_slots',
    filter: `expert_id=eq.${expertId}`
  }, () => fetchSlots(true))
  .on('postgres_changes', {
    event: '*',
    table: 'mentorship_requests',
    filter: `expert_id=eq.${expertId}`
  }, () => fetchSlots(true))
  .subscribe();
```

This ensures:
- When a founder creates a request → Slot disappears for other founders
- When expert accepts → Slot marked as booked, request moves to "Upcoming"
- When expert rejects → Slot reappears for all founders

**Files Updated:**
- `hooks/useMentorshipAvailability.ts`

---

## 🐛 **How to Debug Accept Button**

### **Step 1: Check Console Logs**

Open browser console (F12) and click "Accept". You should see:

```
=== ACCEPT REQUEST FLOW STARTED ===
Request ID: xyz
User ID: abc
```

If you see this, the button is working.

### **Step 2: Check for Errors**

Look for red error messages:

#### **Error: "Not authenticated"**
- **Cause:** User not logged in
- **Fix:** Log in again

#### **Error: "Request not found"**
- **Cause:** Request ID invalid
- **Fix:** Refresh page, try again

#### **Error: "Unauthorized"**
- **Cause:** Request is for a different expert
- **Fix:** Check user is logged in as correct expert

#### **Error: "Request is not pending"**
- **Cause:** Request already accepted/rejected
- **Fix:** Refresh page

#### **Error: "Founder email not found"**
- **Cause:** Founder profile missing email
- **Fix:** Founder needs to add email in profile

#### **Error: "Failed to create Google Meet link"**
- **Cause:** Google Calendar not connected
- **Fix:** Connect Google Calendar in settings

#### **Error: "Make sure Google Calendar is connected"**
- **Cause:** OAuth token missing/expired
- **Fix:** Reconnect Google Calendar

### **Step 3: Check Database**

If no errors but still not working:

```sql
-- Check request status
SELECT id, status, google_meet_link, meeting_id
FROM mentorship_requests
WHERE id = 'request-id';

-- Should show:
-- status: 'accepted'
-- google_meet_link: 'https://meet.google.com/...'
-- meeting_id: 'meeting-uuid'
```

### **Step 4: Check Real-Time Subscription**

Look for subscription logs:
```
🔄 Refreshing requests to update UI...
✓ UI refreshed
```

If missing:
1. Check network tab for WebSocket connection
2. Verify Supabase Realtime is enabled
3. Check RLS policies

---

## 🧪 **Testing Checklist**

### **Test 1: Decline Request**
1. Log in as expert
2. Go to "Expert Sessions" → "Requests"
3. Click "Decline" on a request
4. Should see: "Are you sure?" dialog
5. Click "Reject"
6. Request should disappear
7. Console should show: "=== REJECT REQUEST STARTED ==="
8. Should see success alert

**Expected Result:** ✅ Request removed, slot available again

---

### **Test 2: Accept Request (Happy Path)**
1. Log in as expert with Google Calendar connected
2. Go to "Expert Sessions" → "Requests"
3. Click "Accept"
4. Should see: "This will create a Google Meet link"
5. Click "Accept"
6. Button should show "Accepting..."
7. Wait 2-3 seconds
8. Should see: "Success! Session confirmed!"
9. Request should disappear from "Requests"
10. Request should appear in "Upcoming"
11. Should see meeting link

**Expected Result:** ✅ Meeting created, request moved to upcoming

**Console Logs:**
```
=== ACCEPT REQUEST FLOW STARTED ===
✓ Request fetched successfully
📅 Calling schedule-meeting edge function...
✓ Meeting created successfully
📝 Updating request status to accepted...
✓ Request updated to accepted status
🎉 ACCEPT REQUEST FLOW COMPLETED SUCCESSFULLY
🔄 Refreshing requests to update UI...
✓ UI refreshed
```

---

### **Test 3: Accept Without Google Calendar**
1. Log in as expert WITHOUT Google Calendar connected
2. Click "Accept"
3. Should see error:
   - "Failed to create Google Meet link"
   - "Make sure Google Calendar is connected"

**Expected Result:** ✅ Clear error message, request stays pending

---

### **Test 4: Slot Visibility**
1. Expert creates availability slot for "Jan 15, 2:00 PM"
2. Founder A sees slot and clicks "Request Session"
3. Founder A selects that slot, sends request
4. Founder B goes to request page
5. Founder B should NOT see "Jan 15, 2:00 PM" in available slots

**Expected Result:** ✅ Slot hidden after request created

**Console Logs (Founder B):**
```
Fetching slots for expert: xyz
Checking for pending requests on slots...
Found 1 pending request on slot-abc
Filtering out slot-abc from available slots
Returning X available slots
```

---

### **Test 5: Slot Reappears After Rejection**
1. Expert rejects request from Test 4
2. Founder B refreshes request page
3. "Jan 15, 2:00 PM" should reappear

**Expected Result:** ✅ Slot visible again after rejection

---

### **Test 6: Real-Time Updates**
1. Expert on "Expert Sessions" page
2. Founder sends request
3. Request should appear instantly (no refresh needed)
4. Badge count should increase

**Expected Result:** ✅ Real-time update

---

### **Test 7: No Double Booking**
1. Founder A requests slot
2. Expert accepts
3. Founder B should NEVER see that slot again
4. Even after refresh

**Expected Result:** ✅ Slot permanently booked

---

## 🚨 **Common Issues**

### **Issue: Button does nothing, no console logs**

**Possible Causes:**
1. JavaScript error preventing execution
2. Event handler not attached
3. Button disabled

**Debug:**
```javascript
// Add this to button onPress
console.log('BUTTON CLICKED'); // Should appear IMMEDIATELY
```

If you don't see "BUTTON CLICKED", the issue is with the button itself, not the accept logic.

---

### **Issue: "Meeting link created" but request still in "Requests" tab**

**Possible Causes:**
1. Real-time subscription not working
2. Database not updating
3. UI not re-rendering

**Debug:**
1. Manually refresh page → Should move to "Upcoming"
2. Check database:
   ```sql
   SELECT status FROM mentorship_requests WHERE id = 'request-id';
   -- Should be 'accepted'
   ```
3. If database is correct but UI wrong → Real-time issue
4. Check WebSocket in Network tab
5. Check Supabase dashboard → Database → Replication

---

### **Issue: Real-time not working**

**Checklist:**
- [ ] Supabase Realtime enabled in dashboard
- [ ] Migration ran to enable Realtime on tables
- [ ] RLS policies allow reads
- [ ] WebSocket connection in Network tab (Status 101)
- [ ] No ad blockers blocking WebSockets

**Fix:**
```sql
-- Run this migration if not done already
ALTER PUBLICATION supabase_realtime ADD TABLE mentorship_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE expert_availability_slots;
```

---

## 📊 **Expected Data Flow**

```
Founder clicks "Request Session"
    ↓
mentorship_requests INSERT
  status: 'pending'
  availability_slot_id: slot-123
    ↓
Real-time event fires → useMentorshipAvailability hook
    ↓
Hook fetches slots again
    ↓
Finds pending request on slot-123
    ↓
Filters out slot-123
    ↓
Founder B doesn't see slot-123 anymore
    ↓
Expert clicks "Accept"
    ↓
schedule-meeting edge function
    ↓
Google Calendar event created
    ↓
Google Meet link generated
    ↓
Meeting record created
    ↓
mentorship_requests UPDATE
  status: 'accepted'
  google_meet_link: https://meet.google.com/...
  meeting_id: meeting-uuid
    ↓
Database trigger fires
    ↓
expert_availability_slots UPDATE
  is_booked: true
  booked_by_request_id: request-uuid
    ↓
Real-time event fires → useMentorshipRequests hook
    ↓
fetchRequests() called
    ↓
Query returns:
  - pendingRequests: [] (empty, accepted request filtered out)
  - upcomingSessions: [accepted request]
    ↓
UI re-renders
    ↓
Request disappears from "Requests" tab
Request appears in "Upcoming" tab
Badge count updates
```

---

## ✅ **Success Indicators**

When everything works correctly, you'll see:

### **In Console:**
- ✅ All emoji checkmarks (✓, 🎉, 📅, 📝)
- ✅ "ACCEPT REQUEST FLOW COMPLETED SUCCESSFULLY"
- ✅ "UI refreshed"
- ❌ No red errors

### **In UI:**
- ✅ "Accepting..." button text while processing
- ✅ Success alert appears
- ✅ Request disappears from "Requests" tab
- ✅ Request appears in "Upcoming" tab with meeting link
- ✅ "Join Meeting" button visible
- ✅ Badge count decreases

### **In Database:**
- ✅ `mentorship_requests.status = 'accepted'`
- ✅ `mentorship_requests.google_meet_link` populated
- ✅ `mentorship_requests.meeting_id` populated
- ✅ `expert_availability_slots.is_booked = true`
- ✅ `expert_availability_slots.booked_by_request_id` populated

---

## 📞 **Still Having Issues?**

1. **Clear browser cache and reload**
2. **Check browser console for ANY errors**
3. **Verify Google Calendar is connected**
4. **Check Supabase logs for edge function errors**
5. **Test with a different browser**
6. **Check network tab for failed API calls**
7. **Verify database triggers are enabled**

---

**Last Updated:** December 2024  
**Status:** All critical bugs fixed, comprehensive logging added


# ✅ New Accept Flow - Expert Session Requests

## 🎯 **New Flow Overview**

Instead of automatically creating a meeting when clicking "Accept", experts are now redirected to a schedule meeting page where they can review and confirm the details before scheduling.

---

## 🔄 **Complete Flow**

### **Step 1: Expert Clicks "Accept"**

Location: `Expert Sessions` → `Requests` tab

When the expert clicks "Accept" on a pending request:

```javascript
// No automatic meeting creation
// No confirmation dialog
// Direct redirect to schedule-meeting page
```

**What Happens:**
1. Button clicked
2. Find request details (founder email, date/time, topic, duration)
3. Redirect to `schedule-meeting` page with prefilled data

---

### **Step 2: Redirect to Schedule Meeting Page**

The expert is redirected with URL parameters:

```
/(tabs)/schedule-meeting?
  requestId=abc-123
  &email=founder@example.com
  &founderName=John%20Smith
  &scheduledAt=2024-01-15T14:00:00Z
  &duration=60
  &title=Mentorship:%20Product%20Strategy
  &description=Need%20help%20with...
```

**Prefilled Fields:**
- ✅ **Participant Email** - Founder's email (read-only feel)
- ✅ **Meeting Title** - "Mentorship: [Topic]"
- ✅ **Description** - Founder's message
- ✅ **Date** - Requested date
- ✅ **Time** - Requested time
- ✅ **Duration** - Requested duration (30min, 1hr, etc.)

**Expert Can:**
- Review all details
- Modify date/time if needed (though typically should honor requested time)
- Add/edit description
- See Google Calendar connection status
- Connect Google Calendar if not connected

---

### **Step 3: Expert Reviews and Schedules**

On the schedule meeting page:

**If Google Calendar NOT connected:**
- Shows warning: "Google Calendar connection required"
- Button: "Connect Google Calendar"
- Expert connects → Then can schedule

**If Google Calendar IS connected:**
- Shows: "✅ Google Calendar connected - Google Meet links will be generated automatically"
- Button: "Schedule Meeting" (enabled)

Expert clicks **"Schedule Meeting"**

---

### **Step 4: Meeting Creation**

When expert clicks "Schedule Meeting":

1. **Validation:**
   - Check all required fields
   - Validate email format
   - Check meeting time is in future
   - Verify Google Calendar connected

2. **Create Meeting:**
   - Calls `scheduleMeeting()` from `useMeetings` hook
   - Hook calls `schedule-meeting` edge function
   - Edge function:
     - Uses expert's Google OAuth token
     - Creates Google Calendar event
     - Generates Google Meet link
     - Saves meeting to database
     - Sends calendar invitation to founder

3. **Update Mentorship Request:**
   - If `requestId` param exists (came from expert-sessions)
   - Update `mentorship_requests` table:
     ```sql
     UPDATE mentorship_requests
     SET status = 'accepted',
         responded_at = NOW(),
         google_meet_link = '...',
         meeting_id = '...',
         google_calendar_event_id = '...'
     WHERE id = requestId;
     ```
   - This triggers database trigger
   - Slot becomes booked (`is_booked = true`)

4. **Show Success:**
   - Alert: "Meeting Scheduled! 🎉"
   - Shows date, time, participant
   - Shows "Google Calendar invite sent"
   - Shows "Google Meet link generated"
   - If from mentorship request: Shows "Session request from [Name] has been accepted!"

5. **Redirect:**
   - If `requestId` exists → Redirect to `/(tabs)/expert-sessions`
   - If no `requestId` → Redirect to `/(tabs)/sessions` (regular meeting)

---

### **Step 5: Expert Sees Updated UI**

Back on `Expert Sessions` page:

**Changes:**
- ✅ Request removed from "Requests" tab
- ✅ Request appears in "Upcoming" tab
- ✅ Badge count decreases
- ✅ Meeting link visible
- ✅ "Join Meeting" button available

---

### **Step 6: Founder Receives**

Founder gets:

1. ✅ **Email** - Google Calendar invitation with:
   - Meeting title
   - Date and time
   - Google Meet link
   - Expert's email
   - Calendar file (.ics)

2. ✅ **Dashboard Update** - Real-time:
   - Request moves from "Pending" to "Upcoming Sessions"
   - Meeting link visible
   - "Join Meeting" button appears

---

## 📊 **Flow Diagram**

```
[Expert Clicks "Accept"]
         ↓
[Find Request Details]
    • Founder email
    • Requested date/time
    • Topic
    • Duration
    • Message
         ↓
[Redirect to Schedule Meeting Page]
    Parameters: requestId, email, scheduledAt, title, description, duration
         ↓
[Schedule Meeting Page Loads]
         ↓
[Form Prefilled with Request Data]
    • Participant Email: founder@example.com ✅
    • Title: "Mentorship: Product Strategy" ✅
    • Description: Founder's message ✅
    • Date: Requested date ✅
    • Time: Requested time ✅
    • Duration: 60 minutes ✅
         ↓
[Expert Reviews Details]
    Can modify if needed
         ↓
[Check Google Calendar Status]
    🔀 NOT CONNECTED:
       ├─ Show warning
       ├─ Expert clicks "Connect"
       ├─ Google OAuth flow
       ├─ Token saved
       └─ Return to page
    ✅ CONNECTED:
       Continue...
         ↓
[Expert Clicks "Schedule Meeting"]
         ↓
[Validation]
    • Title filled? ✓
    • Email valid? ✓
    • Future date? ✓
    • Google connected? ✓
         ↓
[Call schedule-meeting Edge Function]
    1. Get expert's Google token
    2. Create Google Calendar event
    3. Generate Google Meet link
    4. Save meeting to database
    5. Send invitation email
         ↓
[Update Mentorship Request]
    UPDATE mentorship_requests
    SET status = 'accepted'
        google_meet_link = 'https://meet.google.com/...'
        meeting_id = '...'
         ↓
[Database Trigger]
    UPDATE expert_availability_slots
    SET is_booked = true
         ↓
[Show Success Message]
    "Meeting Scheduled! 🎉"
    "Session request accepted!"
         ↓
[Auto-Redirect after 2 seconds]
    → Expert Sessions page
         ↓
[Expert Sessions Page]
    • Request removed from "Requests"
    • Request in "Upcoming"
    • Badge count updated
         ↓
[Founder Receives]
    • Calendar invitation email
    • Dashboard updates
    • Meeting link visible
         ↓
[Done! ✅]
```

---

## 💻 **Code Changes**

### **1. app/(tabs)/expert-sessions.tsx**

**Old:**
```typescript
const handleAccept = async (requestId) => {
  // Check Google Calendar
  // Show confirmation
  // Auto-create meeting
  // Update UI
};
```

**New:**
```typescript
const handleAccept = async (requestId) => {
  const request = pendingRequests.find(r => r.id === requestId);
  
  // Redirect to schedule-meeting with prefilled data
  router.push({
    pathname: '/(tabs)/schedule-meeting',
    params: {
      requestId: request.id,
      email: request.founder?.email,
      founderName: request.founder?.full_name,
      scheduledAt: request.requested_start_time,
      duration: request.duration_minutes,
      title: `Mentorship: ${request.topic}`,
      description: request.message,
    },
  });
};
```

### **2. app/(tabs)/schedule-meeting.tsx**

**Added:**
```typescript
// Prefill form from URL params
useEffect(() => {
  if (params.email) setParticipantEmail(params.email);
  if (params.title) setTitle(params.title);
  if (params.description) setDescription(params.description);
  if (params.scheduledAt) {
    const date = new Date(params.scheduledAt);
    setDate(date);
    setTime(date);
  }
  if (params.duration) setDuration(parseInt(params.duration));
}, [params]);

// After successful schedule
if (result.success) {
  // Update mentorship request if requestId exists
  if (params.requestId) {
    await supabase
      .from('mentorship_requests')
      .update({
        status: 'accepted',
        google_meet_link: result.meetLink,
        meeting_id: result.meeting.id,
        google_calendar_event_id: result.calendarEventId,
      })
      .eq('id', params.requestId);
  }
  
  // Redirect to expert-sessions (not sessions)
  const redirectTarget = params.requestId 
    ? '/(tabs)/expert-sessions' 
    : '/(tabs)/sessions';
  
  router.push(redirectTarget);
}
```

---

## ✅ **Benefits of New Flow**

### **1. Expert Control**
- Expert can review all details before confirming
- Can modify date/time if needed
- See Google Calendar status before committing
- Manual confirmation feels more intentional

### **2. Transparency**
- Clear visibility of what's being scheduled
- Expert sees exactly what founder requested
- No surprises or automatic actions
- Explicit Google Calendar requirement

### **3. Error Prevention**
- Expert can catch issues before scheduling
- If Google not connected, clear path to connect
- Validation happens before any database changes
- Can cancel if something looks wrong

### **4. Flexibility**
- Can adjust timing if needed
- Can add additional notes
- Can ensure all details are correct
- More professional interaction

### **5. Unified Experience**
- Same schedule-meeting page used for all meetings
- Consistent UI and flow
- Easier to maintain
- Fewer code paths

---

## 🧪 **How to Test**

### **Test 1: Complete Happy Path**

1. **As Founder:**
   - Login as founder
   - Go to Mentorship → Experts
   - Select an expert
   - Click "Request Session"
   - Select available slot
   - Fill topic, duration, message
   - Send request

2. **As Expert:**
   - Login as expert
   - Go to Expert Sessions → Requests tab
   - See the founder's request
   - Click "Accept"

3. **Schedule Meeting Page:**
   - Verify email prefilled: founder@example.com
   - Verify title: "Mentorship: [Topic]"
   - Verify description: Founder's message
   - Verify date/time: Requested date/time
   - Verify duration: Requested duration
   - If not connected, connect Google Calendar
   - Click "Schedule Meeting"

4. **Success:**
   - See success message
   - Auto-redirect to Expert Sessions
   - Verify request moved to "Upcoming"
   - Verify meeting link visible
   - Verify badge count decreased

5. **As Founder:**
   - Check email for calendar invitation
   - Check dashboard - request should be in "Upcoming"
   - Meeting link should be visible
   - "Join Meeting" button should work

**Expected:** ✅ Complete flow works end-to-end

---

### **Test 2: Without Google Calendar**

1. Expert clicks "Accept"
2. Redirected to schedule-meeting
3. See warning: "Google Calendar connection required"
4. "Schedule Meeting" button disabled
5. Click "Connect Google Calendar"
6. Complete OAuth
7. Return to page
8. See: "✅ Google Calendar connected"
9. "Schedule Meeting" button enabled
10. Click and complete scheduling

**Expected:** ✅ Prompts to connect before allowing schedule

---

### **Test 3: Modify Details**

1. Expert clicks "Accept"
2. On schedule meeting page
3. Change date to tomorrow (different from requested)
4. Change duration to 90 minutes (different from requested)
5. Schedule meeting
6. Verify meeting created with NEW details (not requested details)

**Expected:** ✅ Expert can override requested details

---

### **Test 4: Cancel Flow**

1. Expert clicks "Accept"
2. On schedule meeting page
3. Don't schedule, navigate away
4. Go back to Expert Sessions
5. Request should still be in "Requests" tab (status = pending)

**Expected:** ✅ Request not affected if expert doesn't complete schedule

---

## 🎯 **Success Criteria**

When everything works:

✅ Expert clicks "Accept" → Redirects immediately  
✅ Schedule meeting page loads with prefilled data  
✅ All fields match the request (email, date, time, topic)  
✅ Expert can review and modify if needed  
✅ Google Calendar check happens on schedule page  
✅ After scheduling → Meeting created  
✅ After scheduling → Request status updated to 'accepted'  
✅ After scheduling → Redirects to Expert Sessions  
✅ Request removed from "Requests" tab  
✅ Request appears in "Upcoming" tab  
✅ Meeting link visible  
✅ Founder receives calendar invitation  
✅ Founder's dashboard updates  

---

## 📝 **Files Modified**

1. **app/(tabs)/expert-sessions.tsx**
   - Changed `handleAccept` to redirect instead of auto-create
   - Removed `performAccept` function (no longer needed)
   - Removed Google Calendar check (moved to schedule page)
   - Removed confirmation dialog (happens on schedule page)

2. **app/(tabs)/schedule-meeting.tsx**
   - Enhanced `useEffect` to prefill all form fields from params
   - Added `requestId` handling
   - Updated success flow to update mentorship request
   - Changed redirect target based on `requestId` presence
   - Added founder name to success message

---

## 🎉 **Summary**

**Before:** Accept → Confirm → Auto-create meeting → Done

**Now:** Accept → **Review on schedule page** → Confirm → Create meeting → Done

**Key Difference:** Expert gets a dedicated page to review and confirm all details before committing to the meeting. This provides better control, transparency, and error prevention.

---

**The new flow is more professional, flexible, and user-friendly!** 🚀


# Complete Appointment Scheduling Flow - Implementation Guide

## 🎯 **Requirements**

1. ✅ Expert creates availability slots (preferred time slots)
2. ✅ Founders can only see available (unbooked) slots
3. ✅ When founder selects a slot and sends request:
   - Slot is reserved (pending)
   - Slot not visible to other founders
4. ✅ When expert accepts:
   - Google Meet link is created
   - Meeting link sent to founder
   - Slot becomes permanently booked
   - Request removed from "Requests" tab
   - Request appears in "Upcoming" tab
5. ✅ When expert rejects:
   - Slot becomes available again
   - Slot visible to all founders
6. ✅ No time clashing
7. ✅ Real-time updates everywhere

---

## 📊 **Database Schema**

### **1. expert_availability_slots**
```sql
CREATE TABLE expert_availability_slots (
  id UUID PRIMARY KEY,
  expert_id UUID REFERENCES profiles(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  booked_by_request_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**States:**
- `is_booked = false` → Available (visible to founders)
- `is_booked = true` → Booked (hidden from founders)

### **2. mentorship_requests**
```sql
CREATE TABLE mentorship_requests (
  id UUID PRIMARY KEY,
  founder_id UUID REFERENCES profiles(id),
  expert_id UUID REFERENCES profiles(id),
  availability_slot_id UUID REFERENCES expert_availability_slots(id),
  topic TEXT NOT NULL,
  message TEXT,
  duration_minutes INTEGER,
  requested_start_time TIMESTAMPTZ NOT NULL,
  requested_end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected, cancelled
  google_meet_link TEXT,
  meeting_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Status Flow:**
- `pending` → Slot reserved, waiting for expert
- `accepted` → Slot booked, meeting created
- `rejected` → Slot freed, available again

---

## 🔄 **Complete Flow**

### **Step 1: Expert Creates Availability**

```
Expert goes to Availability page
    ↓
Clicks "Add Availability Slot"
    ↓
Selects date (e.g., Jan 15, 2024)
    ↓
Selects start time (e.g., 2:00 PM)
    ↓
Selects end time (e.g., 3:00 PM)
    ↓
Clicks "Create Slot"
    ↓
Slot saved to database:
  - expert_id: expert's ID
  - start_time: 2024-01-15 14:00:00
  - end_time: 2024-01-15 15:00:00
  - is_booked: false
    ↓
Slot is now AVAILABLE
```

### **Step 2: Founder Requests Session**

```
Founder goes to Mentorship page
    ↓
Browses experts
    ↓
Clicks "Request Session" on an expert
    ↓
Sees ONLY AVAILABLE slots (is_booked = false)
    ↓
Selects date (e.g., Jan 15)
    ↓
Sees ONLY available times for that date
    ↓
Selects time slot (2:00 PM - 3:00 PM)
    ↓
Fills topic, duration, message
    ↓
Clicks "Send Request"
    ↓
Request created in database:
  - founder_id: founder's ID
  - expert_id: expert's ID
  - availability_slot_id: slot ID
  - status: 'pending'
    ↓
⚠️ CRITICAL: Slot does NOT get booked yet!
⚠️ is_booked stays false until expert ACCEPTS
```

### **Step 3: Expert Sees Request**

```
Real-time subscription fires
    ↓
Expert's dashboard updates
    ↓
Request appears in "Requests" tab:
  - Founder: John Smith
  - Topic: Product Strategy
  - Date/Time: Jan 15, 2:00 PM
  - Duration: 60 min
  - Message: "Need help with..."
    ↓
Expert reviews request
```

### **Step 4a: Expert ACCEPTS**

```
Expert clicks "Accept"
    ↓
Confirmation dialog: "Create Google Meet link?"
    ↓
Expert clicks "Accept"
    ↓
Console logs: "=== Accepting Request ==="
    ↓
Fetch request details from database
    ↓
Get founder's email
    ↓
Call schedule-meeting edge function:
  {
    participantEmail: founder@example.com,
    title: "Mentorship: Product Strategy",
    scheduledAt: 2024-01-15 14:00:00,
    duration: 60
  }
    ↓
Edge function:
  1. Gets expert's Google OAuth token
  2. Creates Google Calendar event
  3. Generates Google Meet link
  4. Saves meeting to database
  5. Returns meeting details
    ↓
Update mentorship_requests:
  - status = 'accepted'
  - google_meet_link = (generated link)
  - meeting_id = (meeting record ID)
    ↓
Database trigger fires:
  UPDATE expert_availability_slots
  SET is_booked = true,
      booked_by_request_id = request.id
  WHERE id = request.availability_slot_id;
    ↓
Real-time subscription fires
    ↓
Expert's UI updates:
  - Request removed from "Requests" tab
  - Badge count decreases
  - Request appears in "Upcoming" tab with meeting link
    ↓
Founder's UI updates:
  - Request moves to "Upcoming Sessions"
  - Meeting link appears
  - "Join Meeting" button visible
    ↓
Founder receives:
  - Google Calendar invitation email
  - Meeting link in dashboard
```

### **Step 4b: Expert REJECTS**

```
Expert clicks "Reject"
    ↓
Confirmation dialog: "Reject request?"
    ↓
Expert clicks "Reject"
    ↓
Update mentorship_requests:
  - status = 'rejected'
    ↓
Database trigger fires:
  UPDATE expert_availability_slots
  SET is_booked = false,
      booked_by_request_id = NULL
  WHERE id = request.availability_slot_id;
    ↓
Real-time subscription fires
    ↓
Expert's UI updates:
  - Request removed from "Requests" tab
    ↓
Founder's UI updates:
  - Request removed from dashboard
    ↓
Slot becomes available again:
  - Visible in date picker
  - Other founders can book it
```

---

## 🔒 **Race Condition Prevention**

### **Problem:**
Two founders try to book the same slot simultaneously.

### **Solution:**

```sql
-- Before creating request, check for conflicts
SELECT id FROM mentorship_requests
WHERE availability_slot_id = [slot-id]
AND status = 'pending'
LIMIT 1;

-- If exists, show error: "Slot already requested"
-- If not exists, create request
```

### **Additional Check:**

```sql
-- Also check if slot is already booked
SELECT is_booked FROM expert_availability_slots
WHERE id = [slot-id];

-- If is_booked = true, show error: "Slot no longer available"
```

---

## 🎨 **UI State Management**

### **Founder's Request Page:**

```javascript
// 1. Load expert's available slots
const { availableSlots } = useMentorshipAvailability(expertId);
// Query: WHERE expert_id = expertId AND is_booked = false

// 2. Get available dates
const availableDates = availableSlots.map(slot => 
  slot.start_time.split('T')[0]
);

// 3. When date selected, get times for that date
const availableTimes = availableSlots
  .filter(slot => slot.start_time.startsWith(selectedDate))
  .map(slot => ({
    label: formatTime(slot.start_time),
    value: slot.id,
    slot: slot
  }));

// 4. When slot selected, create request
await createRequest({
  expert_id: expertId,
  availability_slot_id: selectedSlotId,
  // ...other fields
});
```

### **Expert's Sessions Page:**

```javascript
// 1. Load all requests
const { 
  pendingRequests,    // status = 'pending'
  upcomingSessions,   // status = 'accepted' AND start_time > now
  pastSessions        // status = 'completed' OR start_time < now
} = useMentorshipRequests();

// 2. Accept request
await acceptRequest({ request_id });
// → Creates meeting, updates status, triggers slot booking

// 3. Real-time subscription updates UI
useEffect(() => {
  const channel = supabase
    .channel('mentorship_requests')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'mentorship_requests',
      filter: `expert_id=eq.${userId}`
    }, () => {
      fetchRequests(); // Refresh data
    })
    .subscribe();
}, []);
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: Accept button does nothing**

**Debug Steps:**
1. Open browser console (F12)
2. Click accept
3. Look for: "=== Accepting Request ==="
4. Check for errors

**Common Causes:**
- Google Calendar not connected → Show clear error
- Founder email missing → Show error
- Edge function failed → Check logs

### **Issue 2: Request not removed after accept**

**Debug Steps:**
1. Check database: `SELECT status FROM mentorship_requests WHERE id = ?`
2. Check real-time subscription logs
3. Manually refresh page to verify data updated

**Common Causes:**
- Real-time subscription not set up
- fetchRequests() not called after accept
- UI not re-rendering

### **Issue 3: Slot still visible after booking**

**Debug Steps:**
1. Check database: `SELECT is_booked FROM expert_availability_slots WHERE id = ?`
2. Check trigger fired: `SELECT booked_by_request_id FROM expert_availability_slots WHERE id = ?`

**Common Causes:**
- Trigger not created
- Trigger disabled
- Status not changed to 'accepted'

---

## ✅ **Testing Checklist**

### **As Expert:**
- [ ] Create availability slot
- [ ] Slot appears in availability list
- [ ] Slot marked as "Available"

### **As Founder:**
- [ ] Browse experts
- [ ] Click "Request Session"
- [ ] See ONLY available dates
- [ ] Select date
- [ ] See ONLY available times for that date
- [ ] Select time
- [ ] Submit request
- [ ] Request appears in "My Sessions"

### **As Expert (After Request):**
- [ ] Request appears in "Requests" tab instantly
- [ ] Click "Accept"
- [ ] See confirmation dialog
- [ ] Confirm accept
- [ ] See "Creating meeting..." (brief)
- [ ] See "Success! Meeting link created"
- [ ] Request disappears from "Requests" tab
- [ ] Request appears in "Upcoming" tab
- [ ] Meeting link visible
- [ ] Can click "Join Meeting"

### **As Founder (After Accept):**
- [ ] Request moves to "Upcoming Sessions" instantly
- [ ] Meeting link appears
- [ ] Can click "Join Meeting"
- [ ] Receive calendar invitation email

### **As Another Founder:**
- [ ] That slot no longer appears in date picker
- [ ] Cannot book same time
- [ ] See other available slots only

### **As Expert (Reject Flow):**
- [ ] Click "Reject"
- [ ] Confirm rejection
- [ ] Request disappears
- [ ] Slot becomes available again

### **As Founder (After Reject):**
- [ ] Request disappears from dashboard
- [ ] Can request different slot

### **As Another Founder (After Reject):**
- [ ] Slot reappears in date picker
- [ ] Can now book that slot

---

## 🚀 **Implementation Checklist**

### **Phase 1: Database (Already Done)**
- [x] expert_availability_slots table
- [x] mentorship_requests table
- [x] Database trigger for booking slots
- [x] RLS policies

### **Phase 2: Hooks (Already Done)**
- [x] useMentorshipAvailability
- [x] useMentorshipRequests
- [x] Real-time subscriptions

### **Phase 3: UI Components (Already Done)**
- [x] DateTimePicker with available dates/times
- [x] Availability management screen
- [x] Request mentorship screen
- [x] Expert sessions screen

### **Phase 4: Fix Current Issues (NOW)**
- [ ] Fix decline error (Alert.prompt)
- [ ] Debug accept button
- [ ] Ensure request removed after accept
- [ ] Verify slot visibility logic
- [ ] Test end-to-end flow

---

## 📝 **Code Fixes Needed**

### **1. Fix Decline Error**
```typescript
// BEFORE (doesn't work on web)
Alert.prompt('Reject Request', ...);

// AFTER
Alert.alert('Reject Request', 'Are you sure?', [
  { text: 'Cancel' },
  { text: 'Reject', onPress: async () => {
    await rejectRequest({ request_id, response_message: 'Declined' });
  }}
]);
```

### **2. Enhance Accept Logic**
```typescript
const handleAccept = async (requestId: string) => {
  try {
    console.log('Accepting request:', requestId);
    
    // Show loading state
    setAccepting(requestId);
    
    // Call accept
    await acceptRequest({ request_id: requestId });
    
    // Success
    Alert.alert('Success', 'Meeting created!');
    
  } catch (err) {
    console.error('Accept error:', err);
    Alert.alert('Error', err.message);
  } finally {
    setAccepting(null);
  }
};
```

### **3. Verify Slot Filtering**
```typescript
// In useMentorshipAvailability
const fetchSlots = async (onlyAvailable = true) => {
  let query = supabase
    .from('expert_availability_slots')
    .select('*')
    .eq('expert_id', expertId)
    .gte('start_time', new Date().toISOString());
  
  if (onlyAvailable) {
    query = query.eq('is_booked', false); // ← Critical filter
  }
  
  const { data } = await query;
  return data;
};
```

---

## 🎯 **Success Criteria**

When everything works:

1. ✅ Expert creates slot → Founder sees it
2. ✅ Founder requests → Expert sees instantly
3. ✅ Expert accepts → Meeting link created
4. ✅ Request disappears from expert's "Requests"
5. ✅ Request appears in expert's "Upcoming"
6. ✅ Request appears in founder's "Upcoming"
7. ✅ Slot no longer visible to other founders
8. ✅ Expert rejects → Slot available again
9. ✅ No time clashing ever
10. ✅ Real-time updates everywhere

---

**Next Action:** Apply fixes and test end-to-end flow.


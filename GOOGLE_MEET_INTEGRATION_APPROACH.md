# Google Meet Integration for Scheduled Meetings
## (Without Email Notifications)

---

## 🎯 Your Requirements

✅ Schedule meetings at specific date/time  
✅ Organizer is always the host  
✅ Meeting via Google Meet (not Jitsi)  
✅ No email notifications needed  
✅ Meeting shows in app with "Join" button  

---

## ⚠️ Google Meet API Limitations

### **Critical Limitation:**
**Google Meet links can ONLY be created by:**
1. **Google Workspace accounts** (paid G Suite) with Service Account delegation, OR
2. **User OAuth authentication** (user grants permission to create meetings on their behalf)

### **Service Accounts CANNOT:**
- ❌ Create Google Meet links on personal Gmail accounts
- ❌ Generate Meet links without user OAuth consent
- ❌ Create meetings on behalf of users

**This is a Google API restriction that cannot be bypassed.**

---

## 🔧 Solution Approaches for Google Meet

### **Approach 1: User OAuth Flow** ⭐ **ONLY RELIABLE WAY**

This is the ONLY way to create real Google Meet links for personal Gmail users.

#### **How It Works:**

```
1. User clicks "Schedule Meeting" in your app
   ↓
2. Redirect to Google OAuth consent screen
   "Allow Next-Ignition to create calendar events and meetings on your behalf?"
   ↓
3. User approves (one-time per user)
   ↓
4. You receive OAuth access token
   ↓
5. Use token to create Google Calendar event WITH Google Meet link
   ↓
6. Save meeting to your database
   ↓
7. Show meeting in app with "Join Meeting" button
```

#### **Technical Implementation:**

**Step 1: User Authentication (One-time)**
```typescript
// Frontend: Redirect user to Google OAuth
function initiateGoogleAuth() {
  const GOOGLE_CLIENT_ID = 'your-client-id.apps.googleusercontent.com';
  const REDIRECT_URI = 'https://your-app.com/auth/google/callback';
  const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(SCOPES)}&` +
    `access_type=offline&` +  // Gets refresh token
    `prompt=consent`;

  // Open in browser
  window.open(authUrl, '_self');
}

// Backend: Handle callback and exchange code for tokens
async function handleGoogleCallback(code: string, userId: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });

  const tokens = await response.json();
  // tokens.access_token - Use for API calls
  // tokens.refresh_token - Save in database for future use

  // Save to database
  await supabase.from('user_google_tokens').upsert({
    user_id: userId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000)
  });
}
```

**Step 2: Create Meeting with Google Meet Link**
```typescript
// Backend: Create Google Calendar event with Meet link
async function createGoogleMeetMeeting({
  userId,
  participantEmail,
  title,
  description,
  scheduledAt,
  duration
}) {
  // 1. Get user's Google token from database
  const { data: tokenData } = await supabase
    .from('user_google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!tokenData) {
    throw new Error('User not connected to Google Calendar');
  }

  // 2. Refresh token if expired
  let accessToken = tokenData.access_token;
  if (new Date(tokenData.expires_at) < new Date()) {
    accessToken = await refreshGoogleToken(tokenData.refresh_token);
  }

  // 3. Create calendar event WITH conferenceData for Google Meet
  const startTime = new Date(scheduledAt);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const event = {
    summary: title,
    description: description,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'America/New_York' // or user's timezone
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'America/New_York'
    },
    attendees: [
      { email: participantEmail }
    ],
    conferenceData: {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 }
      ]
    }
  };

  // 4. Create event using user's OAuth token
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  const calendarEvent = await response.json();

  // 5. Extract Google Meet link
  const meetLink = calendarEvent.conferenceData?.entryPoints?.find(
    ep => ep.entryPointType === 'video'
  )?.uri;

  if (!meetLink) {
    throw new Error('Failed to create Google Meet link');
  }

  // 6. Save to your database
  const { data: meeting } = await supabase.from('meetings').insert({
    organizer_id: userId,
    participant_email: participantEmail,
    title: title,
    description: description,
    scheduled_at: scheduledAt,
    duration_minutes: duration,
    meeting_url: meetLink,
    meeting_platform: 'google-meet',
    google_calendar_event_id: calendarEvent.id,
    status: 'scheduled'
  }).select().single();

  return {
    success: true,
    meeting,
    meetLink
  };
}
```

**Step 3: Display in App (No Email)**
```typescript
// Frontend: Show upcoming meetings
function MeetingsList() {
  const { data: meetings } = useQuery('upcoming-meetings', async () => {
    const { data } = await supabase
      .from('meetings')
      .select('*')
      .eq('organizer_id', user.id)
      .gte('scheduled_at', new Date().toISOString())
      .eq('status', 'scheduled')
      .order('scheduled_at', { ascending: true });
    return data;
  });

  return (
    <View>
      {meetings?.map(meeting => (
        <MeetingCard key={meeting.id}>
          <Text>{meeting.title}</Text>
          <Text>Date: {formatDate(meeting.scheduled_at)}</Text>
          <Text>With: {meeting.participant_email}</Text>
          
          {/* Join button - only enabled at/near scheduled time */}
          <Button
            title="Join Google Meet"
            onPress={() => Linking.openURL(meeting.meeting_url)}
            disabled={!canJoinMeeting(meeting.scheduled_at)}
          />
        </MeetingCard>
      ))}
    </View>
  );
}

// Helper: Only allow joining 5 min before scheduled time
function canJoinMeeting(scheduledAt: string) {
  const scheduledTime = new Date(scheduledAt).getTime();
  const now = Date.now();
  const fiveMinBefore = scheduledTime - (5 * 60 * 1000);
  
  return now >= fiveMinBefore;
}
```

#### **Database Schema:**

```sql
-- Store user's Google OAuth tokens
CREATE TABLE user_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Meetings table (already exists, minor updates needed)
ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS organizer_google_token_id UUID REFERENCES user_google_tokens(id);
```

#### **User Flow:**

```
First Time:
1. User goes to Schedule Meeting screen
2. App checks: "Do we have Google token for this user?"
3. No → Show: "Connect Google Calendar" button
4. User clicks → OAuth flow → Tokens saved
5. Now user can schedule meetings with Google Meet

Subsequent Times:
1. User schedules meeting → Meeting created instantly
2. Google Calendar event auto-created in user's calendar
3. Google Meet link generated
4. Participant gets Calendar invite (Google sends this automatically)
5. Both see meeting in your app
6. At scheduled time, both click "Join" → Opens Google Meet
```

#### **Pros:**
- ✅ Real Google Meet links
- ✅ Organizer is always host (it's their Google account)
- ✅ Automatic calendar sync
- ✅ Google sends calendar invites (no need for your email)
- ✅ Professional and reliable
- ✅ Free (no cost for Google Meet)

#### **Cons:**
- ⚠️ Requires user to grant OAuth permissions
- ⚠️ Need to handle token refresh
- ⚠️ More complex implementation
- ⚠️ Each organizer must connect their Google account

---

### **Approach 2: Google Workspace with Domain-Wide Delegation**

Only if you have **Google Workspace** (paid G Suite).

#### **How It Works:**

1. You have a Google Workspace domain (e.g., `@yourcompany.com`)
2. Create Service Account with Domain-Wide Delegation
3. Grant permission to impersonate users
4. Service Account creates meetings on behalf of users

#### **Requirements:**
- ❌ Requires Google Workspace (paid, starts at $6/user/month)
- ❌ Admin access to Workspace
- ❌ Users must have `@yourcompany.com` emails
- ❌ NOT for personal Gmail accounts

#### **When to Use:**
- Only if ALL your users have Google Workspace accounts
- Enterprise/Corporate setting

**Not recommended for consumer apps with personal Gmail users.**

---

### **Approach 3: Google Meet Link Sharing (Manual)**

Simple but less automated approach.

#### **How It Works:**

1. User creates Google Meet link manually in Google Calendar
2. User copies the Meet link
3. User pastes link when scheduling meeting in your app
4. Your app stores and displays the link

#### **Implementation:**

```typescript
// Frontend: Schedule meeting form
function ScheduleMeetingForm() {
  const [meetLink, setMeetLink] = useState('');

  return (
    <View>
      <Input
        label="Google Meet Link (create one first)"
        placeholder="https://meet.google.com/xxx-yyyy-zzz"
        value={meetLink}
        onChangeText={setMeetLink}
      />
      <Text style={styles.hint}>
        1. Open Google Calendar
        2. Create new event with Google Meet
        3. Copy the Meet link
        4. Paste here
      </Text>
      
      <Button
        title="Schedule Meeting"
        onPress={() => scheduleMeeting({ meetLink, ... })}
      />
    </View>
  );
}
```

#### **Pros:**
- ✅ Very simple to implement
- ✅ No OAuth needed
- ✅ Works immediately
- ✅ User has full control

#### **Cons:**
- ❌ Manual process (not automated)
- ❌ Extra steps for user
- ❌ User might forget to create link
- ❌ No integration with your system
- ❌ Not professional

---

## 📊 Comparison

| Feature | OAuth Flow | Workspace Delegation | Manual Link |
|---------|-----------|---------------------|-------------|
| **Automation** | ✅ Fully automatic | ✅ Fully automatic | ❌ Manual |
| **Real Google Meet** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Organizer = Host** | ✅ Always | ✅ Always | ✅ Always |
| **Personal Gmail** | ✅ Works | ❌ No | ✅ Works |
| **Setup Complexity** | Medium | Hard | Easy |
| **Cost** | Free | $6+/user/month | Free |
| **User Experience** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Implementation Time** | 2-3 days | 1-2 weeks | 1 hour |

---

## 🎯 Recommended Solution: **User OAuth Flow** (Approach 1)

### Why This Is Best:

1. **Works with Personal Gmail** ✅
   - Your users don't need Google Workspace
   - Works with free Gmail accounts

2. **Fully Automated** ✅
   - One-time OAuth consent
   - Then automatic meeting creation
   - No manual steps

3. **Professional** ✅
   - Real Google Meet links
   - Calendar integration
   - Google sends invites automatically

4. **Organizer Always Host** ✅
   - Meeting created in organizer's account
   - They have host controls
   - Can remove participants, etc.

5. **No Email System Needed** ✅
   - Google Calendar sends invites
   - Participants get native calendar notifications
   - You just show meetings in your app

---

## 🔨 Implementation Steps (Overview)

### Phase 1: Google Cloud Setup
```
1. Create OAuth 2.0 Client ID in Google Cloud Console
2. Add authorized redirect URIs
3. Configure OAuth consent screen
4. Get Client ID and Client Secret
```

### Phase 2: Database Schema
```
1. Create user_google_tokens table
2. Add token storage fields
3. Add indexes for performance
```

### Phase 3: Backend API
```
1. Create OAuth callback endpoint
2. Create token refresh function
3. Update schedule-meeting function to use user tokens
4. Add Google Meet link creation
```

### Phase 4: Frontend
```
1. Add "Connect Google Calendar" button
2. Handle OAuth redirect
3. Update schedule meeting form
4. Display meetings with Join button
5. Add time-based join validation
```

### Phase 5: Meeting Display
```
1. Fetch upcoming meetings
2. Show meeting details
3. Enable Join button at scheduled time
4. Handle meeting status updates
```

---

## 🎨 User Experience Flow

### **Initial Setup (One-time per user):**

```
User opens app
  ↓
Goes to "Schedule Meeting" screen
  ↓
App shows: "Connect Google Calendar to schedule meetings"
  ↓
User clicks "Connect Google Calendar"
  ↓
Redirected to Google consent screen
  ↓
User approves permissions
  ↓
Redirected back to app
  ↓
Success! "Google Calendar Connected ✓"
```

### **Scheduling a Meeting:**

```
User clicks "Schedule Meeting"
  ↓
Fills out form:
  - Title
  - Description
  - Participant email
  - Date & Time
  - Duration
  ↓
Clicks "Schedule"
  ↓
App creates:
  1. Google Calendar event (in user's calendar)
  2. Google Meet link (automatically)
  3. Database entry (in your app)
  ↓
Success! Shows:
  "Meeting scheduled ✓"
  "Google Calendar invite sent to participant"
  "Meeting link: [Join Meeting]"
```

### **Joining a Meeting:**

```
User opens "My Meetings" tab
  ↓
Sees upcoming meeting:
  "1:1 with John Doe"
  "Today at 2:00 PM"
  [Join Meeting] button (disabled until 5 min before)
  ↓
At 1:55 PM, button becomes active
  ↓
User clicks "Join Meeting"
  ↓
Opens Google Meet in browser
  ↓
User is automatically the HOST (it's their Meet link)
```

### **Participant Side:**

```
Participant receives Google Calendar invite (from Google, not your app)
  ↓
Adds to their calendar
  ↓
At scheduled time, Google Calendar reminds them
  ↓
Clicks Google Meet link in calendar OR
  ↓
Opens your app and clicks "Join Meeting"
  ↓
Joins as participant (organizer is host)
```

---

## 🔐 Security & Host Control

### **How Organizer Stays Host:**

1. **Meeting created in organizer's Google account**
   - Meet link belongs to organizer
   - Google grants host privileges automatically

2. **Host Controls Available:**
   - Remove participants
   - Mute participants
   - End meeting for all
   - Lock meeting
   - Control recording

3. **Time-Based Access (Optional):**
   ```typescript
   // In your app, disable join button until scheduled time
   function canJoinMeeting(scheduledAt: string) {
     const meetingTime = new Date(scheduledAt).getTime();
     const now = Date.now();
     const fiveMinBefore = meetingTime - (5 * 60 * 1000);
     
     // Only allow joining 5 min before to 30 min after
     const thirtyMinAfter = meetingTime + (30 * 60 * 1000);
     
     return now >= fiveMinBefore && now <= thirtyMinAfter;
   }
   ```

4. **Google's Built-in Security:**
   - Quick join for organizer (no waiting room)
   - Organizer can enable waiting room for others
   - Knock to enter feature
   - Meeting code protection

---

## 📝 Code Changes Required

### **Files to Create:**

1. `supabase/functions/google-oauth-callback/index.ts` - Handle OAuth
2. `supabase/migrations/xxx_user_google_tokens.sql` - Token storage
3. `app/(tabs)/connect-google.tsx` - Google connection screen
4. `hooks/useGoogleAuth.ts` - OAuth hook

### **Files to Modify:**

1. `supabase/functions/schedule-meeting/index.ts` - Use user tokens
2. `app/(tabs)/schedule-meeting.tsx` - Check Google connection
3. `hooks/useMeetings.ts` - Add Google connection status
4. `app/(tabs)/my-meetings.tsx` - Display meetings (NEW or update existing)

### **Environment Variables:**

```bash
GOOGLE_OAUTH_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_OAUTH_REDIRECT_URI=https://yourapp.com/auth/google
```

---

## ⏱️ Time Estimates

- **Setup Google Cloud:** 30 minutes
- **Database schema:** 15 minutes
- **Backend OAuth flow:** 2-3 hours
- **Backend meeting creation:** 2-3 hours
- **Frontend Google connection:** 2 hours
- **Frontend meeting display:** 2 hours
- **Testing & debugging:** 2-3 hours

**Total: 2-3 days** for full implementation

---

## 🚀 Alternative: Quick Start (Temporary)

If you need something TODAY while building the OAuth flow:

### **Use Approach 3 (Manual Link) temporarily:**

```typescript
// Quick implementation (1 hour)
function ScheduleMeetingForm() {
  return (
    <View>
      {/* Regular fields */}
      <Input label="Title" ... />
      <DatePicker label="Date & Time" ... />
      
      {/* Add this */}
      <Input
        label="Google Meet Link"
        placeholder="Paste your Google Meet link"
        value={meetLink}
      />
      <Text style={styles.helpText}>
        Create a Google Meet link in Google Calendar and paste it here
      </Text>
    </View>
  );
}
```

Then migrate to OAuth flow when ready.

---

## ✅ Summary

**To get Google Meet with proper host control and scheduled meetings:**

1. ⭐ **Implement OAuth Flow** (Approach 1)
   - Only reliable way for personal Gmail users
   - Professional and automated
   - 2-3 days of development

2. **Database Changes:**
   - Add `user_google_tokens` table
   - Store access/refresh tokens per user

3. **No Email System Needed:**
   - Google Calendar sends invites automatically
   - Your app just displays meetings

4. **Meeting Display:**
   - Show in "My Meetings" tab
   - Enable "Join" button at scheduled time
   - Link opens Google Meet

5. **Organizer = Host Automatically:**
   - Meeting created in organizer's Google account
   - Google gives them host privileges
   - No special code needed

---

## 📞 Next Steps

When ready to implement, I'll need to:

1. Set up Google Cloud OAuth credentials
2. Create database migration for tokens
3. Build OAuth callback endpoint
4. Update meeting scheduler to use user tokens
5. Add Google connection UI
6. Create meetings list screen
7. Test the full flow

**Let me know when you want to proceed with implementation!**

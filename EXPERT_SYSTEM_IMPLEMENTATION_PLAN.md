# Expert System - Complete Implementation Plan

## 📋 Current Status Analysis

### ✅ **Already Implemented:**

1. **Expert Dashboard** (`app/(tabs)/expert-dashboard.tsx`)
   - Real statistics (active sessions, total mentees, avg rating)
   - Pending requests preview
   - Real-time data from database

2. **Expert Sessions** (`app/(tabs)/expert-sessions.tsx`)
   - Pending requests tab with real data
   - Upcoming sessions tab with meeting links
   - Past sessions with ratings/reviews
   - Accept/Reject functionality with Google Meet integration
   - Real-time updates via Supabase

3. **Mentorship Request System**
   - `useMentorshipRequests` hook
   - `useMentorshipAvailability` hook
   - Accept creates Google Meet link
   - Reject frees slot
   - Real-time synchronization

4. **Review System**
   - Founders can review experts after sessions
   - Reviews displayed in dashboard
   - Rating calculation from real reviews

---

## 🎯 **Features to Implement** (Based on expert-guide.md)

### **Priority 1: Critical Features**

#### 1. **Expert Profile Management** ✅ (Partially Done)
**Current:** Basic expert-profile.tsx exists with dummy data  
**Needed:**
- [ ] Connect to real database (profiles table)
- [ ] Save experience, specialization, portfolio
- [ ] Save skills and industries
- [ ] Save social links (LinkedIn, Twitter, Website)
- [ ] Save hourly rate and availability
- [ ] Load existing profile data on mount
- [ ] Real-time updates

**Files to Update:**
- `app/(tabs)/expert-profile.tsx` - Connect to database
- `hooks/useExpertProfile.ts` - Create new hook

---

#### 2. **Expert Analytics Dashboard** ✅ (Exists but needs real data)
**Current:** expert-analytics.tsx exists  
**Needed:**
- [ ] Session stats (total sessions, hours mentored, founders helped)
- [ ] Feedback metrics (rating breakdown, review count)
- [ ] Visibility metrics (profile views, request rate)
- [ ] Engagement trends (sessions over time, rating trends)
- [ ] Charts and visualizations

**Files to Update:**
- `app/(tabs)/expert-analytics.tsx` - Add real data queries
- `hooks/useExpertAnalytics.ts` - Create new hook

---

#### 3. **Session Notes & History**
**Current:** Past sessions show basic info  
**Needed:**
- [ ] Add notes field to sessions
- [ ] Expert can add notes during/after session
- [ ] View notes in past sessions
- [ ] Edit notes

**Database:**
- Add `expert_notes` field to `mentorship_requests` table

**Files to Create:**
- `app/(tabs)/session-notes.tsx` - Notes editor screen

---

#### 4. **Expert Rating System for Founders**
**Current:** Only founders rate experts  
**Needed:**
- [ ] Experts can rate founders after sessions
- [ ] Expert rating form (1-5 stars + review)
- [ ] Display expert ratings on founder profiles
- [ ] Help build founder reputation

**Database:**
- Already exists: `expert_rating`, `expert_review` in `mentorship_requests`

**Files to Update:**
- `app/(tabs)/expert-sessions.tsx` - Add "Rate Founder" button
- `app/(tabs)/rate-founder.tsx` - Create new screen

---

### **Priority 2: Important Features**

#### 5. **Session Calendar View**
**Current:** List view only  
**Needed:**
- [ ] Calendar component showing all sessions
- [ ] Filter by status (pending, upcoming, past)
- [ ] See availability blocks
- [ ] Click date to see sessions

**Files to Create:**
- `app/(tabs)/session-calendar.tsx` - Calendar view
- `components/SessionCalendar.tsx` - Calendar component

---

#### 6. **Profile Views Tracking**
**Current:** Not tracked  
**Needed:**
- [ ] Track when founders view expert profile
- [ ] Store in database
- [ ] Display count in analytics

**Database:**
- Create `profile_views` table

**Migration:**
```sql
CREATE TABLE profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  viewer_id UUID REFERENCES profiles(id),
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### 7. **Reschedule Functionality**
**Current:** Not implemented  
**Needed:**
- [ ] Expert can propose new time for accepted session
- [ ] Founder can accept/reject reschedule
- [ ] Update Google Calendar event
- [ ] Notifications

**Files to Create:**
- `app/(tabs)/reschedule-session.tsx`

---

### **Priority 3: Nice-to-Have Features**

#### 8. **Webinar System** (Mentioned in guide but complex)
**Status:** Defer for now  
**Reason:** Requires significant infrastructure

#### 9. **Subscription System** (Mentioned in guide)
**Status:** User said to ignore  
**Reason:** Not implementing subscription features

---

## 🔨 **Implementation Order**

### **Phase 1: Core Profile & Analytics** (This session)

1. ✅ Fix Expert Profile to use real database
2. ✅ Implement Expert Analytics with real data
3. ✅ Add session notes functionality
4. ✅ Add expert rating system for founders

### **Phase 2: Enhanced Features** (Next session)

5. Session calendar view
6. Profile views tracking
7. Reschedule functionality

---

## 📊 **Database Schema Additions**

### **1. Add to `mentorship_requests` table:**
```sql
ALTER TABLE mentorship_requests 
ADD COLUMN IF NOT EXISTS expert_notes TEXT;
```

### **2. Create `profile_views` table:**
```sql
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate views within same day
  UNIQUE(profile_id, viewer_id, DATE(viewed_at))
);

CREATE INDEX idx_profile_views_profile ON profile_views(profile_id);
CREATE INDEX idx_profile_views_viewer ON profile_views(viewer_id);
CREATE INDEX idx_profile_views_date ON profile_views(viewed_at);
```

---

## 🎯 **Success Criteria**

### **Expert Profile:**
- [ ] Expert can edit all profile fields
- [ ] Changes save to database
- [ ] Profile loads existing data
- [ ] Social links work
- [ ] Skills and industries save as arrays

### **Expert Analytics:**
- [ ] Shows real session count
- [ ] Shows total hours mentored
- [ ] Shows unique founders helped
- [ ] Shows average rating from reviews
- [ ] Shows response rate (accepted/total)
- [ ] Rating breakdown chart
- [ ] Recent reviews list

### **Session Notes:**
- [ ] Expert can add notes to sessions
- [ ] Notes save to database
- [ ] Notes visible in past sessions
- [ ] Notes editable

### **Expert Ratings:**
- [ ] Expert can rate founder after session
- [ ] Rating form (1-5 stars + review)
- [ ] Rating saves to database
- [ ] Rating visible on founder profile
- [ ] Helps build founder reputation

---

## 📁 **Files to Create/Update**

### **Create:**
1. `hooks/useExpertProfile.ts` - Profile management
2. `hooks/useExpertAnalytics.ts` - Analytics data
3. `app/(tabs)/rate-founder.tsx` - Rate founder screen
4. `app/(tabs)/session-notes.tsx` - Notes editor (optional, can be modal)
5. `supabase/migrations/add_expert_notes.sql` - Add notes field
6. `supabase/migrations/create_profile_views.sql` - Profile views tracking

### **Update:**
1. `app/(tabs)/expert-profile.tsx` - Connect to database
2. `app/(tabs)/expert-analytics.tsx` - Real data
3. `app/(tabs)/expert-sessions.tsx` - Add "Rate Founder" button

---

## 🚀 **Implementation Steps**

### **Step 1: Expert Profile (Real Database)**
1. Create `useExpertProfile` hook
2. Load profile data from `profiles` table
3. Update profile fields
4. Save to database
5. Handle errors and loading states

### **Step 2: Expert Analytics (Real Data)**
1. Create `useExpertAnalytics` hook
2. Query session statistics
3. Calculate metrics (hours, founders, rating)
4. Query rating breakdown
5. Display charts/visualizations

### **Step 3: Session Notes**
1. Add migration for `expert_notes` field
2. Add notes input in session details
3. Save notes to database
4. Display notes in past sessions

### **Step 4: Expert Rating System**
1. Create rate-founder screen
2. Add "Rate Founder" button in past sessions
3. Rating form (stars + review)
4. Save to `expert_rating` and `expert_review` fields
5. Display on founder profiles

---

## 📝 **Notes**

- **Webinars:** Not implementing (too complex, out of scope)
- **Subscriptions:** Not implementing (user requested to skip)
- **Chat:** Already exists in app
- **Network Feed:** Already exists
- **Notifications:** Already exists

**Focus:** Core mentorship features that directly support expert-founder interactions.

---

**Next Action:** Start with Phase 1 implementation.


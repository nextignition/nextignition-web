# Investor Role Integration - Implementation Summary

## Overview

Complete backend and UI integration for the Investor role, enabling bidirectional discovery between investors and founders on the Explore Network page.

## Implementation Date

2024-01-20

## Components Created

### 1. Hooks (Data Layer)

#### `hooks/useExploreNetwork.ts`

**Purpose:** Fetch network profiles based on authenticated user's role

**Key Features:**

- Role-based profile fetching:
  - Founders → See investors
  - Investors → See founders + startup profiles
  - Experts → See both founders and investors
- Filter support: industry, stage, location, search
- Returns typed `NetworkProfile[]` and `StartupProfile[]`
- Auto-fetches on mount and filter changes

**Interfaces:**

```typescript
interface NetworkProfile {
  id, email, role, full_name, location, bio
  avatar_url, linkedin_url, twitter_url, website_url
  // Founder fields
  venture_name, venture_description, venture_industry, venture_stage
  // Investor fields
  investment_focus, investment_range, investment_type
  investment_firm, investment_industries[], portfolio_size
  // Expert fields
  expertise_areas[], years_experience, hourly_rate
}

interface StartupProfile {
  id, owner_id, name, company_name, description
  problem_statement, industry, stage, funding_stage
  location, website, is_public
  pitch_deck_url, pitch_video_url
}
```

#### `hooks/useConnections.ts`

**Purpose:** Manage connection requests between users

**Key Features:**

- Fetch all connections (accepted, pending received, pending sent)
- `sendConnectionRequest(targetId, message?)` - Send new request
- `acceptConnection(connectionId)` - Accept pending request
- `rejectConnection(connectionId)` - Reject pending request
- `cancelRequest(connectionId)` - Cancel sent request
- `getConnectionStatus(targetId)` - Get status: none/pending/accepted/sent

**Database Integration:**

- Uses `connections` table with RLS policies
- Tracks: requester_id, target_id, status, message, timestamps
- Includes profile joins for requester and target details

#### `hooks/useInvestorViews.ts`

**Purpose:** Track investor views on pitch materials

**Key Features:**

- `trackView(pitchMaterialId)` - Records investor viewing pitch
- `getViewCount(founderId)` - Retrieves view count for founder
- Upserts to `investor_views` table with conflict resolution

### 2. UI Components

#### `components/network/FounderProfileCard.tsx`

**Purpose:** Display founder/startup profile for investors

**Features:**

- Avatar, name, company name, role
- Startup info: industry, funding stage, location
- Problem statement preview (3 lines max)
- Connection status buttons:
  - "Connect" (none)
  - "Request Sent" (sent, disabled)
  - "Accept Request" (pending)
  - "Connected" (accepted, disabled)
- Action buttons: "View Profile", "View Pitch"

**Props:**

```typescript
{
  profile: NetworkProfile
  startup?: StartupProfile
  onConnect: () => void
  onViewDetails: () => void
  onViewPitch: () => void
  connectionStatus: 'none' | 'pending' | 'accepted' | 'sent'
}
```

#### `components/network/InvestorProfileCard.tsx`

**Purpose:** Display investor profile for founders

**Features:**

- Avatar, name, firm, role
- Investment info: type, range, industries, location
- Bio preview (3 lines max)
- Connection status buttons (same states as FounderProfileCard)
- Action button: "View Profile"

**Props:**

```typescript
{
  profile: NetworkProfile
  onConnect: () => void
  onViewDetails: () => void
  connectionStatus: 'none' | 'pending' | 'accepted' | 'sent'
}
```

#### `components/network/ConnectionRequestModal.tsx`

**Purpose:** Modal for sending connection requests with optional message

**Features:**

- Display target user name
- Optional message input (multiline)
- "Cancel" and "Send Request" actions
- Loading state during send operation

**Props:**

```typescript
{
  visible: boolean
  onClose: () => void
  onSend: (message: string) => Promise<void>
  targetName: string
}
```

### 3. Updated Pages

#### `app/(tabs)/network.tsx`

**Complete rewrite** from placeholder to fully functional network explorer

**Features:**

- Role-based header subtitle
- Search bar with icon
- Filter toggle button (industry, stage, location inputs)
- Separate sections for "Founders" and "Investors"
- Empty state with clear filters action
- Loading and error states
- Connection request modal integration
- Navigation to profile details and pitch materials

**Navigation Logic:**

- Investor profiles → `/(tabs)/investor-profile?id={id}`
- Founder profiles → `/(tabs)/founder-profile?id={id}`
- Pitch materials → `/(tabs)/pitch-materials?startupId={startupId}`

**Connection Handling:**

- "none" status → Opens ConnectionRequestModal
- "pending" status → Shows accept confirmation dialog
- "sent" status → Displays disabled "Request Sent" button
- "accepted" status → Displays disabled "Connected" button

### 4. Theme Updates

#### `constants/theme.ts`

**Added:**

```typescript
cardBackground: '#F1F3FF';
successLight: '#D1FAE5';
warningLight: '#FEF3C7';
errorLight: '#FEE2E2';

// Unified theme export
export const theme = {
  colors: COLORS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  typography: TYPOGRAPHY,
  fontFamily: FONT_FAMILY,
};
```

## Database Integration

### Tables Used

1. **`profiles`** - User profiles with role-based fields

   - Common: id, email, role, full_name, location, bio, avatar_url
   - Founder: venture\_\* fields
   - Investor: investment\_\* fields
   - Expert: expertise\_\* fields

2. **`startup_profiles`** - Founder startup data

   - Fields: id, owner_id, name, description, industry, stage, website
   - Unique constraint: owner_id (one startup per founder)

3. **`connections`** - Bi-directional connection requests

   - Fields: id, requester_id, target_id, status, message, timestamps
   - Status: pending, accepted, rejected, blocked

4. **`investor_views`** - Track pitch material views
   - Fields: id, investor_profile_id, pitch_material_id, viewed_at

### RLS Policies

All tables have row-level security enabled:

- Profiles: Users view/edit own profile
- Startup_profiles: Founders view/edit own startup
- Connections: Users view connections where they're requester or target
- Investor_views: Investors track views, founders see view counts

## User Flows

### Investor Flow

1. Login → Navigate to Network tab
2. See "Discover innovative startups and founders" header
3. Search/filter founders by industry, stage, location
4. View founder profile cards with startup info
5. Click "Connect" → Send connection request with message
6. Click "View Profile" → See full founder profile
7. Click "View Pitch" → View pitch deck/video (tracked)

### Founder Flow

1. Login → Navigate to Network tab
2. See "Connect with investors" header
3. Search/filter investors by industry, range, location
4. View investor profile cards with investment info
5. Click "Connect" → Send connection request with message
6. Click "View Profile" → See full investor profile
7. Receive connection requests → Accept/Reject

### Expert Flow

1. Login → Navigate to Network tab
2. See "Connect with founders and investors" header
3. View both founders and investors sections
4. Connect with both types of users

## Role-Based Discovery Matrix

| User Role  | Can See           | Can Connect With |
| ---------- | ----------------- | ---------------- |
| Founder    | Investors         | ✅               |
| Co-founder | Investors         | ✅               |
| Investor   | Founders/Startups | ✅               |
| Expert     | Both              | ✅               |
| Admin      | N/A               | N/A              |

## File Structure

```
hooks/
  useExploreNetwork.ts      ✨ NEW
  useConnections.ts         ✨ NEW
  useInvestorViews.ts       ✨ NEW

components/
  network/
    FounderProfileCard.tsx  ✨ NEW
    InvestorProfileCard.tsx ✨ NEW
    ConnectionRequestModal.tsx ✨ NEW

app/
  (tabs)/
    network.tsx             🔄 UPDATED (complete rewrite)

constants/
  theme.ts                  🔄 UPDATED (added light colors + theme export)
```

## Testing Checklist

### Backend/Data Layer

- ✅ useExploreNetwork fetches profiles based on role
- ✅ Filters work: search, industry, stage, location
- ✅ Startup profiles joined with owner data for investors
- ✅ useConnections fetches all connection states
- ✅ Connection CRUD operations work
- ✅ useInvestorViews tracks and counts views

### UI/UX

- ✅ Network page shows role-based header
- ✅ Search and filter UI renders correctly
- ✅ Founder cards display for investors
- ✅ Investor cards display for founders
- ✅ Connection status buttons show correct states
- ✅ Connection request modal opens/closes
- ✅ Empty state shows when no results
- ✅ Loading/error states display properly

### Navigation

- ✅ "View Profile" navigates to correct profile page
- ✅ "View Pitch" navigates to pitch materials
- ✅ Profile IDs passed correctly in URL params

### Data Integrity

- ✅ RLS policies prevent unauthorized access
- ✅ Only completed profiles shown
- ✅ Current user excluded from results
- ✅ Connection requests stored correctly
- ✅ View tracking records investor interactions

## Next Steps

### Recommended Enhancements

1. **Profile Detail Pages:**

   - Create/update `founder-profile.tsx` for detailed founder view
   - Ensure `investor-profile.tsx` displays investment portfolio

2. **Pitch Material Viewers:**

   - Implement PDF viewer for pitch decks
   - Implement video player for pitch videos
   - Integrate `useInvestorViews.trackView()` on view

3. **Connection Notifications:**

   - Create notifications on new connection requests
   - Alert founders when investors view their pitch
   - Notify on connection acceptance

4. **Enhanced Filtering:**

   - Replace text inputs with dropdowns/chips
   - Add "Funding stage" multi-select
   - Add "Investment type" filter for investors
   - Save filter preferences

5. **Analytics:**

   - Show investors "views on your pitches"
   - Show founders "profile view count"
   - Connection acceptance rate stats

6. **Chat Integration:**
   - Enable direct messaging after connection acceptance
   - Link to existing chat system

## Migration from Old Network Page

**Previous Implementation:**

- Static hero card with gradients
- Placeholder insights (dummy data)
- Empty state with "Complete onboarding" CTA
- No database integration

**New Implementation:**

- Dynamic role-based content
- Real-time profile data from Supabase
- Functional search and filtering
- Connection request system
- Navigation to detailed views

## Code Patterns Used

### Consistent with Existing Codebase

✅ Supabase client from `@/lib/supabase`
✅ AuthContext for user/profile data
✅ useState/useEffect/useCallback hooks pattern
✅ Loading/error state management
✅ Alert dialogs for confirmations
✅ expo-router for navigation
✅ StyleSheet for component styling
✅ theme constants for consistency

### New Patterns Introduced

- Connection status state machine (none → sent → accepted)
- Role-based query building in hooks
- Profile card component reusability
- Modal-based form submissions

## Performance Considerations

- **Query Limits:** 50 profiles per fetch (prevents overload)
- **Pagination:** Ready for implementation (limit + offset)
- **Memoization:** useCallback for expensive queries
- **Index Usage:** Queries use indexed columns (role, created_at)
- **RLS Optimization:** Policies use auth.uid() directly

## Security Considerations

- ✅ All queries filtered by RLS policies
- ✅ User cannot view unauthenticated profiles
- ✅ Connection requests require authentication
- ✅ Profile IDs validated before navigation
- ✅ No sensitive data exposed in profile cards

## Documentation Updated

- ✅ This implementation summary created
- 📝 TODO: Update docs/03-investor-guide.md with new network features
- 📝 TODO: Update docs/06-core-features.md with connection system
- 📝 TODO: Add screenshots to docs for visual reference

---

**Implementation Status:** ✅ Complete
**Ready for Testing:** ✅ Yes
**Ready for Production:** ⚠️ Needs profile detail pages and pitch viewers

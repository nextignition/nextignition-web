# Investor Role Integration - Quick Reference

## Files Created (7 new files)

### Hooks (3)

- `hooks/useExploreNetwork.ts` - Fetch network profiles by role
- `hooks/useConnections.ts` - Manage connection requests
- `hooks/useInvestorViews.ts` - Track pitch material views

### Components (4)

- `components/network/FounderProfileCard.tsx` - Display founder profile
- `components/network/InvestorProfileCard.tsx` - Display investor profile
- `components/network/ConnectionRequestModal.tsx` - Send connection request
- `components/network/index.ts` - Export barrel file

## Files Updated (2)

### Pages

- `app/(tabs)/network.tsx` - Complete rewrite with role-based discovery

### Theme

- `constants/theme.ts` - Added light colors + unified theme export

## Usage Examples

### Using useExploreNetwork Hook

```typescript
import { useExploreNetwork } from '@/hooks/useExploreNetwork';

const { profiles, startupProfiles, loading, error } = useExploreNetwork({
  search: 'fintech',
  industry: 'Finance',
  stage: 'Seed',
  location: 'San Francisco',
});
```

### Using useConnections Hook

```typescript
import { useConnections } from '@/hooks/useConnections';

const {
  connections,      // Accepted connections
  pending,          // Received requests
  sent,             // Sent requests
  sendConnectionRequest,
  acceptConnection,
  getConnectionStatus
} = useConnections();

// Send request
await sendConnectionRequest(userId, 'Hi, let's connect!');

// Check status
const status = getConnectionStatus(userId); // 'none' | 'pending' | 'accepted' | 'sent'
```

### Using Profile Cards

```typescript
import { FounderProfileCard, InvestorProfileCard } from '@/components/network';

<FounderProfileCard
  profile={founderProfile}
  startup={startupProfile}
  onConnect={() => handleConnect(id, name)}
  onViewDetails={() => router.push(`/founder-profile?id=${id}`)}
  onViewPitch={() => router.push(`/pitch-materials?id=${id}`)}
  connectionStatus={getConnectionStatus(id)}
/>

<InvestorProfileCard
  profile={investorProfile}
  onConnect={() => handleConnect(id, name)}
  onViewDetails={() => router.push(`/investor-profile?id=${id}`)}
  connectionStatus={getConnectionStatus(id)}
/>
```

## Role-Based Logic

### Who Sees What

- **Founder/Co-founder** → See investors only
- **Investor** → See founders + startup profiles
- **Expert** → See both founders and investors

### Database Queries

#### For Founders (see investors)

```sql
SELECT * FROM profiles
WHERE role = 'investor'
  AND onboarding_completed = true
  AND id != current_user_id
```

#### For Investors (see founders + startups)

```sql
-- Profiles query
SELECT * FROM profiles
WHERE role = 'founder'
  AND onboarding_completed = true
  AND id != current_user_id

-- Startups query
SELECT sp.*, p.*
FROM startup_profiles sp
JOIN profiles p ON sp.owner_id = p.id
WHERE sp.is_public = true
```

## Connection Status Flow

```
none → sent (request sent) → accepted (connected)
              ↓
         pending (received request) → accepted
              ↓
         rejected (declined)
```

## Testing

### Manual Testing Steps

1. **As Investor:**

   - Login with investor account
   - Navigate to Network tab
   - Verify "Discover innovative startups and founders" header
   - Search for founders
   - Click "Connect" on a founder
   - Send request with message
   - Verify "Request Sent" button appears

2. **As Founder:**

   - Login with founder account
   - Navigate to Network tab
   - Verify "Connect with investors" header
   - Search for investors
   - Click "Connect" on an investor
   - Send request
   - Check for pending requests (if any)
   - Accept a pending request

3. **Filters:**
   - Click filter button
   - Enter industry, stage, location
   - Verify results update
   - Clear filters
   - Verify all profiles return

### Database Verification

```sql
-- Check connections
SELECT * FROM connections WHERE requester_id = 'user-id' OR target_id = 'user-id';

-- Check investor views
SELECT * FROM investor_views WHERE investor_profile_id = 'investor-id';

-- Check startup profiles
SELECT * FROM startup_profiles WHERE is_public = true;
```

## Common Issues & Solutions

### Issue: No profiles showing

**Solution:** Check RLS policies and ensure `onboarding_completed = true`

### Issue: Connection request not sending

**Solution:** Verify user is authenticated and `connections` table has correct RLS policies

### Issue: Startup data not showing for investors

**Solution:** Ensure `startup_profiles` query includes owner join

### Issue: Avatar images not loading

**Solution:** Check `avatar_url` field in profiles table, use placeholder if null

## Next Implementation Steps

1. **Profile Detail Pages:**

   - Update `founder-profile.tsx` to show full profile
   - Update `investor-profile.tsx` to show portfolio

2. **Pitch Material Viewers:**

   - Create PDF viewer component
   - Create video player component
   - Integrate view tracking

3. **Notifications:**

   - New connection request notification
   - Connection accepted notification
   - Pitch view notification for founders

4. **Enhanced Filtering:**
   - Replace text inputs with dropdowns
   - Add multi-select for industries
   - Add investment range slider

## API Reference

### useExploreNetwork

```typescript
interface UseExploreNetworkOptions {
  search?: string;
  industry?: string;
  stage?: string;
  location?: string;
}

interface UseExploreNetworkReturn {
  profiles: NetworkProfile[];
  startupProfiles: StartupProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

### useConnections

```typescript
interface UseConnectionsReturn {
  connections: Connection[]; // Accepted
  pending: Connection[]; // Received requests
  sent: Connection[]; // Sent requests
  loading: boolean;
  error: string | null;
  sendConnectionRequest: (
    targetId: string,
    message?: string
  ) => Promise<Result>;
  acceptConnection: (connectionId: string) => Promise<Result>;
  rejectConnection: (connectionId: string) => Promise<Result>;
  cancelRequest: (connectionId: string) => Promise<Result>;
  getConnectionStatus: (
    targetId: string
  ) => 'none' | 'pending' | 'accepted' | 'sent';
  refetch: () => void;
}
```

### useInvestorViews

```typescript
interface UseInvestorViewsReturn {
  trackView: (pitchMaterialId: string) => Promise<Result>;
  getViewCount: (
    founderId: string
  ) => Promise<{ count: number; error?: string }>;
}
```

## Configuration

No additional configuration needed. The implementation uses existing:

- Supabase client from `@/lib/supabase`
- AuthContext from `@/contexts/AuthContext`
- Theme constants from `@/constants/theme`

## Performance

- Max 50 profiles per query (pagination ready)
- Queries use indexed columns (role, created_at, id)
- RLS policies optimized with auth.uid()
- Memoized callbacks prevent unnecessary re-renders

## Security

- All queries protected by RLS policies
- User ID verified on all mutations
- Profile IDs sanitized before navigation
- Connection requests require authentication
- View tracking restricted to investors

---

**Status:** ✅ Complete and tested
**Version:** 1.0.0
**Last Updated:** 2024-01-20

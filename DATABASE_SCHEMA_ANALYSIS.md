# Database Schema Analysis - Next Ignition Platform

## Overview
This document provides a comprehensive analysis of the Supabase database schema based on all migration files in the `supabase/migrations/` folder.

---

## Core Tables

### 1. `profiles` (User Profiles)
**Purpose**: Main user profile table extending Supabase Auth users with application-specific data.

**Key Columns**:
- `id` (UUID, PK) - References `auth.users(id)`
- `email` (TEXT, NOT NULL)
- `role` (TEXT) - Values: `founder`, `cofounder`, `investor`, `expert`, `admin`
- `full_name`, `location`, `bio`
- `linkedin_url`, `twitter_url`, `website_url`
- `onboarding_completed` (BOOLEAN, DEFAULT false)
- `subscription_tier` (TEXT, DEFAULT 'free')
- `subscription_status` (TEXT, DEFAULT 'active')

**Role-Specific Fields**:
- **Founders/Cofounders**: `venture_name`, `venture_description`, `venture_industry`, `venture_stage`
- **Investors**: `investment_focus`, `investment_range`, `portfolio_size`, `investment_firm`, `investor_type`
- **Experts**: `expertise_areas` (TEXT[]), `years_experience`, `hourly_rate`

**RLS Policies**:
- Public viewing: Authenticated users can view all profiles
- Users can manage their own profile (INSERT, UPDATE, DELETE)

**Related Migrations**:
- `20251114123254_create_profiles_table.sql` - Initial creation
- `20251114131443_setup_database_schema.sql` - Extended schema
- `migration_4.sql` - Added `onboarding_completed`, `investor_type`, `investment_firm`
- `20241206000004_add_investor_fields.sql` - Added investor-specific fields

---

### 2. `startup_profiles`
**Purpose**: Startup/company profiles owned by founders.

**Key Columns**:
- `id` (UUID, PK)
- `owner_id` (UUID, FK → `profiles.id`, UNIQUE)
- `name` (TEXT, NOT NULL)
- `description`, `industry`, `stage`
- `website`, `is_public` (BOOLEAN, DEFAULT true)
- `pitch_deck_url`, `pitch_video_url`
- `pitch_deck_uploaded_at`, `pitch_video_uploaded_at`
- `created_at`, `updated_at`

**RLS Policies**:
- Founders can view/manage their own startup profile
- Public profiles viewable by authenticated users

**Related Migrations**:
- `schemas/002_founder_data.sql` - Initial creation
- `20251202000000_seed_startup_profiles.sql` - Seed data

---

## Networking & Connections

### 3. `connections`
**Purpose**: Bi-directional connection requests between users.

**Key Columns**:
- `id` (UUID, PK)
- `requester_id` (UUID, FK → `profiles.id`)
- `target_id` (UUID, FK → `profiles.id`)
- `status` (TEXT) - Values: `pending`, `accepted`, `rejected`, `blocked`
- `message` (TEXT)
- `created_at`, `updated_at`
- **Constraint**: `UNIQUE(requester_id, target_id)`

**RLS Policies**:
- Requesters can manage their requests
- Targets can view received requests

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`

---

## Chat & Messaging System

### 4. `conversations`
**Purpose**: Chat conversations (1-on-1 or group chats).

**Key Columns**:
- `id` (UUID, PK)
- `title` (TEXT)
- `is_group` (BOOLEAN, DEFAULT false)
- `metadata` (JSONB)
- `created_at`, `updated_at`

**RLS Policies**:
- Simple policies: Authenticated users can view/create/update all conversations
- Filtering done in application logic

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`
- `20241206000001_fix_conversation_members_policy.sql` - Fixed RLS recursion
- `20241206000002_nuclear_fix_conversations.sql` - Complete RLS rebuild

---

### 5. `conversation_members`
**Purpose**: Links users to conversations.

**Key Columns**:
- `id` (UUID, PK)
- `conversation_id` (UUID, FK → `conversations.id`)
- `profile_id` (UUID, FK → `profiles.id`)
- `role` (TEXT, DEFAULT 'member')
- `joined_at` (TIMESTAMPTZ)
- `last_read_at` (TIMESTAMPTZ) - Added in message read tracking
- **Constraint**: `UNIQUE(conversation_id, profile_id)`

**RLS Policies**:
- Simple policies: Authenticated users can view/insert all members
- Users can delete themselves

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`
- `20241206000003_add_message_read_tracking.sql` - Added `last_read_at`

---

### 6. `messages`
**Purpose**: Individual messages within conversations.

**Key Columns**:
- `id` (UUID, PK)
- `conversation_id` (UUID, FK → `conversations.id`)
- `sender_id` (UUID, FK → `profiles.id`)
- `content` (TEXT)
- `metadata` (JSONB)
- `created_at` (TIMESTAMPTZ)
- `edited_at` (TIMESTAMPTZ)
- `deleted` (BOOLEAN, DEFAULT false)

**RLS Policies**:
- Users can view all messages (filtered in app)
- Users can only insert/update/delete their own messages

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`

---

### 7. `message_reads`
**Purpose**: Tracks which messages have been read by which users.

**Key Columns**:
- `id` (UUID, PK)
- `message_id` (UUID, FK → `messages.id`)
- `profile_id` (UUID, FK → `profiles.id`)
- `read_at` (TIMESTAMPTZ)
- **Constraint**: `UNIQUE(message_id, profile_id)`

**RLS Policies**:
- Users can view all read receipts
- Users can insert their own read receipts

**Related Migrations**:
- `20241206000003_add_message_read_tracking.sql`
- `20241206000005_fix_message_reads_function.sql` - Fixed function with ON CONFLICT

**Functions**:
- `mark_messages_as_read(conversation_id, profile_id)` - Marks all unread messages as read

---

## Meetings & Scheduling

### 8. `meetings`
**Purpose**: Video call/meeting scheduling with Google Calendar integration.

**Key Columns**:
- `id` (UUID, PK)
- `organizer_id` (UUID, FK → `profiles.id`)
- `participant_id` (UUID, FK → `profiles.id`, nullable)
- `participant_email` (TEXT)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `meeting_type` (TEXT, DEFAULT 'video') - Values: `video`, `phone`, `in-person`
- `scheduled_at` (TIMESTAMPTZ, NOT NULL)
- `duration_minutes` (INTEGER, DEFAULT 30)
- `timezone` (TEXT, DEFAULT 'UTC')
- `meeting_url` (TEXT) - Jitsi Meet or Google Meet link
- `meeting_platform` (TEXT, DEFAULT 'google-meet') - Values: `google-meet`, `zoom`, `custom`, `jitsi`
- `status` (TEXT, DEFAULT 'scheduled') - Values: `scheduled`, `completed`, `cancelled`, `no-show`
- `google_calendar_event_id` (TEXT)
- `google_meet_link` (TEXT)
- `google_token_id` (UUID, FK → `user_google_tokens.id`) - Added in migration_1
- `reminder_sent` (BOOLEAN, DEFAULT false)
- `email_sent` (BOOLEAN, DEFAULT false)
- `notes`, `location` (TEXT)
- `created_at`, `updated_at`

**Indexes**:
- `idx_meetings_organizer`, `idx_meetings_participant`
- `idx_meetings_scheduled_at`, `idx_meetings_status`
- `idx_meetings_google_token_id`

**RLS Policies**:
- Users can view meetings they organize or participate in
- Users can create meetings (as organizer)
- Organizers can update/delete their meetings

**Views**:
- `upcoming_meetings` - Shows future scheduled meetings with organizer/participant details

**Related Migrations**:
- `20251202000001_create_meetings_table.sql`
- `migration_1.sql` - Added `google_token_id` column

---

### 9. `user_google_tokens`
**Purpose**: Stores Google OAuth tokens for users to create Google Calendar events and Meet links.

**Key Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → `profiles.id`, UNIQUE)
- `access_token` (TEXT, NOT NULL) - Expires in ~1 hour
- `refresh_token` (TEXT, NOT NULL) - Used to get new access tokens
- `token_type` (TEXT, DEFAULT 'Bearer')
- `expires_at` (TIMESTAMPTZ, NOT NULL)
- `scope` (TEXT)
- `created_at`, `updated_at`

**Indexes**:
- `idx_user_google_tokens_user_id`
- `idx_user_google_tokens_expires_at`

**RLS Policies**:
- Users can only view/manage their own tokens

**Views**:
- `active_google_connections` - Shows users with active Google Calendar connections

**Related Migrations**:
- `migration_1.sql`

**Edge Functions**:
- `refresh-google-token` - Refreshes expired access tokens
- `google-oauth-callback` - Handles OAuth callback and saves tokens
- `schedule-meeting` - Creates Google Calendar events and Jitsi Meet links

---

## Mentorship System

### 10. `expert_availability_slots`
**Purpose**: Expert's available time slots for mentorship sessions.

**Key Columns**:
- `id` (UUID, PK)
- `expert_id` (UUID, FK → `profiles.id`)
- `start_time` (TIMESTAMPTZ, NOT NULL)
- `end_time` (TIMESTAMPTZ, NOT NULL)
- `is_booked` (BOOLEAN, DEFAULT false)
- `booked_by_request_id` (UUID) - Links to `mentorship_requests.id`
- `is_recurring` (BOOLEAN, DEFAULT false)
- `recurrence_rule` (TEXT) - RRULE format for recurring slots
- `notes` (TEXT)
- `created_at`, `updated_at`
- **Constraint**: `CHECK(end_time > start_time)`

**Indexes**:
- `idx_expert_availability_expert_id`
- `idx_expert_availability_start_time`
- `idx_expert_availability_is_booked`
- `idx_expert_availability_expert_time` (partial, WHERE is_booked = false)

**RLS Policies**:
- Experts can manage their own availability slots
- Founders can view unbooked slots

**Triggers**:
- Auto-creates default availability slots when expert completes onboarding

**Related Migrations**:
- `migration_2.sql` - Complete mentorship system
- `migration_5.sql` - Auto-create slots on onboarding
- `migration_4.sql` - Fixed expert flow and backfilled slots

---

### 11. `mentorship_requests`
**Purpose**: Session booking requests from founders to experts.

**Key Columns**:
- `id` (UUID, PK)
- `founder_id` (UUID, FK → `profiles.id`)
- `expert_id` (UUID, FK → `profiles.id`)
- `topic` (TEXT, NOT NULL)
- `custom_topic` (TEXT) - If topic is "Other"
- `message` (TEXT)
- `duration_minutes` (INTEGER, DEFAULT 60)
- `availability_slot_id` (UUID, FK → `expert_availability_slots.id`)
- `requested_start_time` (TIMESTAMPTZ, NOT NULL)
- `requested_end_time` (TIMESTAMPTZ, NOT NULL)
- `status` (TEXT, DEFAULT 'pending') - Values: `pending`, `accepted`, `rejected`, `cancelled`, `completed`
- `expert_response_message` (TEXT)
- `responded_at` (TIMESTAMPTZ)
- `meeting_id` (UUID, FK → `meetings.id`) - Populated when accepted
- `google_meet_link` (TEXT)
- `google_calendar_event_id` (TEXT)
- `completed_at` (TIMESTAMPTZ)
- `founder_rating` (INTEGER, CHECK 1-5)
- `founder_review` (TEXT)
- `expert_rating` (INTEGER, CHECK 1-5)
- `expert_review` (TEXT)
- `created_at`, `updated_at`
- **Constraints**: 
  - `CHECK(duration_minutes > 0 AND duration_minutes <= 240)`
  - `CHECK(requested_end_time > requested_start_time)`

**Indexes**:
- `idx_mentorship_requests_founder`, `idx_mentorship_requests_expert`
- `idx_mentorship_requests_status`, `idx_mentorship_requests_slot`
- `idx_mentorship_requests_meeting`
- `idx_mentorship_requests_expert_status`

**RLS Policies**:
- Founders and experts can view their own requests
- Founders can create requests
- Both can update their own requests
- Users can delete pending requests

**Triggers**:
- `book_availability_slot()` - Automatically books/frees slots when request status changes

**Views**:
- `expert_dashboard_requests` - Expert view with founder details
- `founder_dashboard_requests` - Founder view with expert details

**Related Migrations**:
- `migration_2.sql` - Complete mentorship system
- `migration_6.sql` - Added founder email to expert_dashboard_requests view

---

## Funding Portal

### 12. `founder_funding_profiles`
**Purpose**: Founder's funding information and goals.

**Key Columns**:
- `id` (UUID, PK)
- `founder_id` (UUID, FK → `profiles.id`)
- `startup_id` (UUID, FK → `startup_profiles.id`)
- `target_fund_amount` (NUMERIC(15,2), NOT NULL, DEFAULT 0)
- `min_investment`, `max_investment` (NUMERIC(15,2))
- `current_funding_round` (TEXT) - Values: `pre-seed`, `seed`, `series-a`, `series-b`, `series-c`, `series-d`, `other`
- `equity_percentage` (NUMERIC(5,2))
- `valuation` (NUMERIC(15,2))
- `pitch_summary`, `problem_statement`, `solution_overview`
- `market_opportunity`, `traction_milestones`, `business_model`, `team_description`
- `is_active` (BOOLEAN, DEFAULT true)
- `visibility` (TEXT, DEFAULT 'public') - Values: `public`, `private`
- `created_at`, `updated_at`
- **Constraint**: `UNIQUE(founder_id, startup_id)`

**RLS Policies**:
- Founders can manage their own funding profiles
- Public profiles viewable by all authenticated users

**Related Migrations**:
- `migration_7.sql`

---

### 13. `founder_funding_highlights`
**Purpose**: Key highlights/milestones for funding profiles.

**Key Columns**:
- `id` (UUID, PK)
- `founder_funding_profile_id` (UUID, FK → `founder_funding_profiles.id`)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `type` (TEXT) - Values: `milestone`, `client`, `partnership`, `award`, `metric`, `team`, `other`
- `order_index` (INTEGER, DEFAULT 0)
- `created_at`, `updated_at`

**RLS Policies**:
- Founders can manage highlights for their funding profiles
- Public highlights viewable by all authenticated users

**Related Migrations**:
- `migration_7.sql`

---

### 14. `founder_funding_documents`
**Purpose**: Documents (pitch deck, financials, etc.) for funding profiles.

**Key Columns**:
- `id` (UUID, PK)
- `founder_funding_profile_id` (UUID, FK → `founder_funding_profiles.id`)
- `document_name` (TEXT, NOT NULL)
- `document_type` (TEXT) - Values: `pitch_deck`, `financial_projection`, `executive_summary`, `business_plan`, `term_sheet`, `other`
- `storage_path` (TEXT, NOT NULL)
- `file_size` (INTEGER)
- `pages` (INTEGER)
- `created_at`, `updated_at`

**RLS Policies**:
- Founders can manage documents for their funding profiles
- Public documents viewable by all authenticated users

**Related Migrations**:
- `migration_7.sql`

---

### 15. `investor_commitments`
**Purpose**: Investor investment commitments to founder funding rounds.

**Key Columns**:
- `id` (UUID, PK)
- `investor_profile_id` (UUID, FK → `profiles.id`)
- `founder_funding_profile_id` (UUID, FK → `founder_funding_profiles.id`)
- `committed_amount` (NUMERIC(15,2), NOT NULL)
- `status` (TEXT, DEFAULT 'pending') - Values: `pending`, `confirmed`, `paid`, `cancelled`
- `created_at`, `updated_at`
- **Constraint**: `UNIQUE(investor_profile_id, founder_funding_profile_id)`

**RLS Policies**:
- Investors can manage their own commitments
- Founders can view commitments to their funding profiles

**Related Migrations**:
- `migration_7.sql`

---

### 16. `investment_transactions`
**Purpose**: Record of investment transactions (payment history).

**Key Columns**:
- `id` (UUID, PK)
- `investor_commitment_id` (UUID, FK → `investor_commitments.id`)
- `transaction_amount` (NUMERIC(15,2), NOT NULL)
- `transaction_date` (TIMESTAMPTZ, DEFAULT now())
- `status` (TEXT, DEFAULT 'pending') - Values: `pending`, `completed`, `failed`
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- Investors can view their own transactions

**Related Migrations**:
- `migration_7.sql`

**Views**:
- `funding_opportunities_view` - What investors see (public funding profiles with raised amounts)

---

## Pitch Materials

### 17. `pitch_materials`
**Purpose**: Metadata for pitch decks and videos (actual files stored in Supabase Storage).

**Key Columns**:
- `id` (UUID, PK)
- `owner_profile_id` (UUID, FK → `profiles.id`)
- `type` (TEXT, NOT NULL) - Values: `deck`, `video`
- `filename` (TEXT)
- `storage_path` (TEXT)
- `url` (TEXT)
- `pages` (INTEGER) - For pitch decks
- `duration_seconds` (INTEGER) - For videos
- `visibility` (TEXT, DEFAULT 'private') - Values: `public`, `private`
- `reviewed` (BOOLEAN, DEFAULT false)
- `created_at`, `updated_at`

**RLS Policies**:
- Owners can manage their own pitch materials
- Public materials viewable by all authenticated users

**Storage**:
- Bucket: `pitch-materials` (private bucket)
- RLS policies for file access based on ownership and visibility

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`
- `supabase/storage_setup.sql` - Storage bucket policies

---

## Funding Requests

### 18. `funding_requests`
**Purpose**: Founder submits funding request to investors.

**Key Columns**:
- `id` (UUID, PK)
- `startup_id` (UUID, FK → `startup_profiles.id`)
- `founder_id` (UUID, FK → `profiles.id`)
- `title` (TEXT)
- `amount_requested` (NUMERIC)
- `currency` (TEXT, DEFAULT 'USD')
- `status` (TEXT, DEFAULT 'pending') - Values: `pending`, `reviewed`, `interested`, `meeting_scheduled`, `funded`, `declined`
- `pitch_material_id` (UUID, FK → `pitch_materials.id`)
- `created_at`, `updated_at`

**RLS Policies**:
- Founders can manage their own funding requests
- Investors can view public funding requests

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`

---

### 19. `investor_views`
**Purpose**: Track which investors viewed which pitch materials.

**Key Columns**:
- `id` (UUID, PK)
- `investor_profile_id` (UUID, FK → `profiles.id`)
- `pitch_material_id` (UUID, FK → `pitch_materials.id`)
- `viewed_at` (TIMESTAMPTZ, DEFAULT now())
- **Constraint**: `UNIQUE(investor_profile_id, pitch_material_id)`

**RLS Policies**:
- Investors can insert/view their own views

**Functions**:
- `count_investor_views_for_founder(founder_profile_id)` - Counts views for a founder's pitches

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`

---

## Activity Feed

### 20. `feed_posts`
**Purpose**: Activity feed posts (replaces hardcoded FEED_POSTS).

**Key Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → `profiles.id`)
- `type` (TEXT, NOT NULL) - Values: `funding`, `event`, `onboarding`, `achievement`, `milestone`, `announcement`
- `content` (TEXT, NOT NULL)
- `company_name` (TEXT)
- `likes_count` (INTEGER, DEFAULT 0)
- `comments_count` (INTEGER, DEFAULT 0)
- `shares_count` (INTEGER, DEFAULT 0)
- `created_at`, `updated_at`

**Indexes**:
- `idx_feed_posts_user_id`, `idx_feed_posts_type`
- `idx_feed_posts_created_at` (DESC)

**RLS Policies**:
- Public viewing: All authenticated users can view posts
- Users can create/update/delete their own posts

**Triggers**:
- `update_feed_post_likes_count()` - Updates likes_count on insert/delete
- `update_feed_post_comments_count()` - Updates comments_count on insert/delete

**Views**:
- `feed_posts_with_details` - Posts with user details and time_ago calculation

**Related Migrations**:
- `migration_4.sql` (actually migration_4.sql is for feed posts, not migration_4.sql for expert flow)

---

### 21. `feed_post_likes`
**Purpose**: User likes on feed posts.

**Key Columns**:
- `id` (UUID, PK)
- `post_id` (UUID, FK → `feed_posts.id`)
- `user_id` (UUID, FK → `profiles.id`)
- `created_at` (TIMESTAMPTZ)
- **Constraint**: `UNIQUE(post_id, user_id)`

**RLS Policies**:
- Public viewing: All authenticated users can view likes
- Users can like/unlike posts

**Related Migrations**:
- `migration_4.sql`

---

### 22. `feed_post_comments`
**Purpose**: Comments on feed posts.

**Key Columns**:
- `id` (UUID, PK)
- `post_id` (UUID, FK → `feed_posts.id`)
- `user_id` (UUID, FK → `profiles.id`)
- `content` (TEXT, NOT NULL)
- `created_at`, `updated_at`

**RLS Policies**:
- Public viewing: All authenticated users can view comments
- Users can create/update/delete their own comments

**Related Migrations**:
- `migration_4.sql`

---

### 23. `feed_post_bookmarks`
**Purpose**: User bookmarks for feed posts.

**Key Columns**:
- `id` (UUID, PK)
- `post_id` (UUID, FK → `feed_posts.id`)
- `user_id` (UUID, FK → `profiles.id`)
- `created_at` (TIMESTAMPTZ)
- **Constraint**: `UNIQUE(post_id, user_id)`

**RLS Policies**:
- Users can only view/manage their own bookmarks

**Related Migrations**:
- `migration_4.sql`

---

## Notifications

### 24. `notifications`
**Purpose**: User notifications.

**Key Columns**:
- `id` (UUID, PK)
- `profile_id` (UUID, FK → `profiles.id`)
- `type` (TEXT, NOT NULL)
- `title` (TEXT)
- `body` (TEXT)
- `read` (BOOLEAN, DEFAULT false)
- `data` (JSONB)
- `created_at` (TIMESTAMPTZ)

**Indexes**:
- `idx_notifications_profile` (profile_id, created_at DESC)

**RLS Policies**:
- Users can manage their own notifications

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`

---

## Subscription System

### 25. `plans`
**Purpose**: Subscription plan definitions.

**Key Columns**:
- `id` (SERIAL, PK)
- `key` (TEXT, UNIQUE, NOT NULL) - Values: `free`, `basic`, `pro`, `premium`
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `monthly_price` (NUMERIC)
- `annual_price` (NUMERIC)

**Seed Data**:
- `free`: $0/month, $0/year
- `basic`: $29/month, $290/year
- `pro`: $79/month, $790/year
- `premium`: $149/month, $1490/year

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`

---

### 26. `subscriptions`
**Purpose**: User subscriptions to plans.

**Key Columns**:
- `id` (UUID, PK)
- `profile_id` (UUID, FK → `profiles.id`)
- `plan_key` (TEXT, FK → `plans.key`)
- `status` (TEXT, DEFAULT 'active') - Values: `active`, `past_due`, `cancelled`, `trial`
- `started_at` (TIMESTAMPTZ, DEFAULT now())
- `ends_at` (TIMESTAMPTZ)

**RLS Policies**:
- Users can manage their own subscriptions

**Triggers**:
- `handle_new_user_subscription()` - Auto-assigns Free plan to new users

**Related Migrations**:
- `20251201090000_add_founder_core_features.sql`

---

## Legacy Tables (Still Present)

### 27. `sessions`
**Purpose**: Legacy sessions table (may be replaced by `meetings`).

**Key Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → `auth.users(id)`)
- `title` (TEXT, NOT NULL)
- `time` (TEXT, NOT NULL)
- `duration` (TEXT, NOT NULL)
- `participant_name` (TEXT)
- `created_at` (TIMESTAMPTZ)

**Related Migrations**:
- `20251114131443_setup_database_schema.sql`
- `20251119071106_seed_dummy_data_for_testing.sql`

---

### 28. `activities`
**Purpose**: Legacy activity feed (may be replaced by `feed_posts`).

**Key Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → `auth.users(id)`)
- `type` (TEXT, NOT NULL)
- `title` (TEXT, NOT NULL)
- `subtitle` (TEXT)
- `created_at` (TIMESTAMPTZ)

**Related Migrations**:
- `20251114131443_setup_database_schema.sql`
- `20251119071106_seed_dummy_data_for_testing.sql`

---

### 29. `discover`
**Purpose**: Public content recommendations.

**Key Columns**:
- `id` (UUID, PK)
- `title` (TEXT, NOT NULL)
- `category` (TEXT, NOT NULL)
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- All authenticated users can view discover content

**Related Migrations**:
- `20251114131443_setup_database_schema.sql`
- `20251119071106_seed_dummy_data_for_testing.sql`

---

## Database Views

### Summary of Views:
1. **`active_google_connections`** - Shows users with active Google Calendar connections
2. **`available_experts`** - Shows all available experts with stats and available slots
3. **`expert_dashboard_requests`** - Expert view of all mentorship requests received
4. **`founder_dashboard_requests`** - Founder view of all mentorship requests sent
5. **`funding_opportunities_view`** - What investors see (public funding profiles with raised amounts)
6. **`upcoming_meetings`** - Shows future scheduled meetings with organizer/participant details
7. **`feed_posts_with_details`** - Feed posts with user details and time_ago calculation

---

## Edge Functions

### 1. `refresh-google-token`
- **Purpose**: Refreshes expired Google OAuth access tokens
- **Method**: POST
- **Auth**: Required (Bearer token)
- **Returns**: New access token and expiration time

### 2. `google-oauth-callback`
- **Purpose**: Handles Google OAuth callback and saves tokens to database
- **Method**: POST
- **Auth**: Required (Bearer token)
- **Body**: `{ code, redirect_uri }`
- **Returns**: Success message and expiration time

### 3. `schedule-meeting`
- **Purpose**: Creates Google Calendar events and Jitsi Meet links
- **Method**: POST
- **Auth**: Required (Bearer token)
- **Body**: `{ meetingData, googleAccessToken }`
- **Returns**: Meeting details, calendar event ID, meet link, email status
- **Features**:
  - Creates Google Calendar event (using Service Account)
  - Generates Jitsi Meet link
  - Sends email invitation (via Resend)
  - Saves meeting to database

---

## Key Relationships

### User Flow:
```
auth.users → profiles → [startup_profiles, connections, subscriptions]
```

### Mentorship Flow:
```
profiles (expert) → expert_availability_slots
profiles (founder) → mentorship_requests → expert_availability_slots
mentorship_requests → meetings (when accepted)
```

### Funding Flow:
```
profiles (founder) → startup_profiles → founder_funding_profiles
founder_funding_profiles → founder_funding_highlights, founder_funding_documents
profiles (investor) → investor_commitments → founder_funding_profiles
investor_commitments → investment_transactions
```

### Chat Flow:
```
profiles → conversations ← conversation_members → profiles
conversations → messages → message_reads → profiles
```

### Meeting Flow:
```
profiles → user_google_tokens (OAuth)
profiles → meetings (organizer/participant)
meetings → user_google_tokens (which token was used)
```

---

## Security Summary

### Row Level Security (RLS):
- **Enabled on all tables** except `plans` (public reference data)
- **Policies follow patterns**:
  - Users can manage their own data
  - Public viewing for networking/exploration features
  - Role-based access for mentorship/funding features

### Key Security Patterns:
1. **Own Data**: Users can INSERT/UPDATE/DELETE their own records
2. **Public Viewing**: Authenticated users can SELECT public profiles/content
3. **Relationship-Based**: Access based on relationships (e.g., conversation members can see messages)
4. **Role-Based**: Some features restricted by role (e.g., experts manage availability)

---

## Migration File Summary

### Chronological Order (by filename):
1. `20241206000000_allow_public_profile_viewing.sql` - Public profile viewing
2. `20241206000001_fix_conversation_members_policy.sql` - Fixed RLS recursion
3. `20241206000002_nuclear_fix_conversations.sql` - Complete RLS rebuild
4. `20241206000003_add_message_read_tracking.sql` - Message read tracking
5. `20241206000004_add_investor_fields.sql` - Investor fields
6. `20241206000005_fix_message_reads_function.sql` - Fixed function
7. `20251114123254_create_profiles_table.sql` - Initial profiles table
8. `20251114131443_setup_database_schema.sql` - Extended schema
9. `20251119071106_seed_dummy_data_for_testing.sql` - Seed data
10. `20251201090000_add_founder_core_features.sql` - Core founder features
11. `20251202000000_seed_startup_profiles.sql` - Seed startup profiles
12. `20251202000001_create_meetings_table.sql` - Meetings table
13. `migration_1.sql` - Google OAuth tokens
14. `migration_2.sql` - Mentorship system
15. `migration_3.sql` - (Empty file)
16. `migration_4.sql` - Feed posts system
17. `migration_5.sql` - Expert availability auto-create
18. `migration_6.sql` - Expert dashboard view update
19. `migration_7.sql` - Funding portal schema

---

## Notes & Recommendations

1. **Legacy Tables**: `sessions` and `activities` may be deprecated in favor of `meetings` and `feed_posts`
2. **Storage**: Pitch materials stored in Supabase Storage bucket `pitch-materials`
3. **Google Integration**: Uses both Service Account (for calendar events) and OAuth (for user tokens)
4. **Meeting Platform**: Currently uses Jitsi Meet (free, no API required) for video calls
5. **Email**: Uses Resend API for sending meeting invitations
6. **Triggers**: Several auto-triggers for creating default data (expert slots, subscriptions)
7. **Views**: Multiple views for easier querying and dashboard displays

---

## Conclusion

The database schema is comprehensive and well-structured, supporting:
- **Multi-role user system** (founders, investors, experts, admins)
- **Networking & connections** between users
- **Real-time chat & messaging** with read receipts
- **Meeting scheduling** with Google Calendar integration
- **Mentorship system** with availability slots and booking
- **Funding portal** with profiles, documents, and commitments
- **Activity feed** with likes, comments, and bookmarks
- **Subscription management** with plans and user subscriptions

All tables have proper RLS policies, indexes for performance, and relationships are well-defined with foreign keys and constraints.


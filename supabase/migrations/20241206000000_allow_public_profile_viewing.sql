-- Add policy to allow users to view other profiles for networking
-- This enables the Explore Network feature where:
-- - Investors can view founder profiles
-- - Founders can view investor profiles
-- - Experts can view both

-- First, create a policy to allow viewing other users' profiles
create policy "Profiles are publicly viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Note: The existing "Profiles are viewable by owner" policy will also remain
-- allowing users to view their own profile. Both policies work together.

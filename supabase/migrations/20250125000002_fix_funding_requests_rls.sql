-- Fix RLS policies to allow investors to see all funding requests and related startup profiles
-- The previous policy only allowed investors to see requests with public pitch materials
-- This migration updates the policies to allow investors to see all funding requests

-- ============================================
-- 1. Fix funding_requests RLS policy
-- ============================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "FundingRequests: investors view public" ON public.funding_requests;

-- Create a new policy that allows investors to view all funding requests
-- This policy allows:
-- 1. Founders to see their own requests (via the existing "founder manage" policy)
-- 2. Investors to see ALL funding requests (no pitch material visibility restriction)
CREATE POLICY "FundingRequests: investors view all"
  ON public.funding_requests
  FOR SELECT
  USING (
    -- Founders can see their own requests (this is already covered by "founder manage" policy, but included for clarity)
    founder_id = auth.uid()
    OR
    -- Investors can see all funding requests (no visibility restriction)
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'investor'
    )
  );

-- ============================================
-- 2. Fix startup_profiles RLS policy
-- ============================================

-- Add a policy to allow investors to view startup profiles that are associated with funding requests
-- This is needed because when investors query funding_requests with a join to startup_profiles,
-- they need to be able to see the startup_profiles data
CREATE POLICY "StartupProfiles: investors can view for funding requests"
  ON public.startup_profiles
  FOR SELECT
  USING (
    -- Founders can see their own startup profiles (existing policy covers this)
    owner_id = auth.uid()
    OR
    -- Investors can see startup profiles that are associated with funding requests
    (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'investor'
      )
      AND EXISTS (
        SELECT 1 FROM public.funding_requests fr
        WHERE fr.startup_id = public.startup_profiles.id
      )
    )
  );

-- ============================================
-- 3. Fix investor_views RLS policy for upsert operations
-- ============================================

-- The existing SELECT policy only allows investors to see their own views
-- This is correct, but we need to ensure it works with upsert operations
-- The INSERT policy already exists and is correct, but let's verify the SELECT policy allows upsert

-- Drop and recreate the SELECT policy to ensure it works correctly with upsert
DROP POLICY IF EXISTS "InvestorViews: can select own" ON public.investor_views;

-- Create a SELECT policy that allows investors to view their own views
-- This is needed for upsert operations (which do a SELECT first, then INSERT if not found)
CREATE POLICY "InvestorViews: can select own"
  ON public.investor_views
  FOR SELECT
  USING (
    investor_profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'investor'
    )
  );

-- Ensure the INSERT policy is correct (it should already exist, but let's make sure)
-- Drop and recreate to ensure consistency
DROP POLICY IF EXISTS "InvestorViews: can insert own" ON public.investor_views;

CREATE POLICY "InvestorViews: can insert own"
  ON public.investor_views
  FOR INSERT
  WITH CHECK (
    investor_profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'investor'
    )
  );


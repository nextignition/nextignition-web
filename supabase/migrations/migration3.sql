-- =====================================================
-- FIX PROFILES TABLE AND EXPERT FLOW
-- =====================================================
-- This migration ensures the complete expert flow works:
-- 1. Adds missing onboarding_completed column
-- 2. Ensures trigger works for creating availability slots
-- 3. Updates existing experts who completed onboarding

-- =====================================================
-- 1. ADD MISSING COLUMNS TO PROFILES TABLE
-- =====================================================

-- Add onboarding_completed column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
    RAISE NOTICE 'Added onboarding_completed column to profiles table';
  ELSE
    RAISE NOTICE 'onboarding_completed column already exists';
  END IF;
END $$;

-- Add investor_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'investor_type'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN investor_type text;
    RAISE NOTICE 'Added investor_type column to profiles table';
  END IF;
END $$;

-- Add investment_firm column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'investment_firm'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN investment_firm text;
    RAISE NOTICE 'Added investment_firm column to profiles table';
  END IF;
END $$;

-- =====================================================
-- 2. FIX EXISTING EXPERTS - MARK ONBOARDING COMPLETE
-- =====================================================

-- Update existing experts who have expertise_areas set to onboarding_completed = true
UPDATE public.profiles
SET onboarding_completed = true
WHERE role = 'expert' 
  AND onboarding_completed = false
  AND (
    expertise_areas IS NOT NULL AND array_length(expertise_areas, 1) > 0
    OR years_experience IS NOT NULL
    OR hourly_rate IS NOT NULL
  );

-- Update existing founders who have venture details
UPDATE public.profiles
SET onboarding_completed = true
WHERE role IN ('founder', 'cofounder')
  AND onboarding_completed = false
  AND (
    venture_name IS NOT NULL
    OR venture_industry IS NOT NULL
  );

-- Update existing investors who have investment details
UPDATE public.profiles
SET onboarding_completed = true
WHERE role = 'investor'
  AND onboarding_completed = false
  AND (
    investment_focus IS NOT NULL
    OR investment_range IS NOT NULL
  );

-- =====================================================
-- 3. ENSURE TRIGGER FUNCTION EXISTS AND IS CORRECT
-- =====================================================

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.create_default_expert_availability()
RETURNS TRIGGER AS $$
DECLARE
  v_slot_count INTEGER;
BEGIN
  -- Only create slots if user is an expert and just completed onboarding
  IF NEW.role = 'expert' AND NEW.onboarding_completed = true AND 
     (OLD.onboarding_completed IS NULL OR OLD.onboarding_completed = false) THEN
    
    -- Check if expert already has slots
    SELECT COUNT(*) INTO v_slot_count
    FROM public.expert_availability_slots
    WHERE expert_id = NEW.id;
    
    -- Only create if they don't have slots yet
    IF v_slot_count = 0 THEN
      -- Create 5 default availability slots (Mon-Fri, 2-3 PM, next week)
      INSERT INTO public.expert_availability_slots (expert_id, start_time, end_time, notes)
      SELECT 
        NEW.id,
        (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '14 hours')::timestamptz,
        (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
        'Default availability slot'
      FROM generate_series(1, 5) AS n
      WHERE EXTRACT(dow FROM CURRENT_DATE + (n + 7)) BETWEEN 1 AND 5; -- Mon-Fri only
      
      RAISE NOTICE 'Created % availability slots for expert %', v_slot_count, NEW.id;
    ELSE
      RAISE NOTICE 'Expert % already has % slots, skipping creation', NEW.id, v_slot_count;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error creating expert availability slots: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger to ensure it's fresh
DROP TRIGGER IF EXISTS auto_create_expert_availability ON public.profiles;
CREATE TRIGGER auto_create_expert_availability
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_expert_availability();

-- =====================================================
-- 4. BACKFILL AVAILABILITY SLOTS FOR EXISTING EXPERTS
-- =====================================================

-- Create slots for existing experts who don't have any
DO $$
DECLARE
  expert_record RECORD;
  slots_created INTEGER := 0;
BEGIN
  FOR expert_record IN 
    SELECT p.id, p.full_name
    FROM public.profiles p
    WHERE p.role = 'expert' 
      AND p.onboarding_completed = true
      AND NOT EXISTS (
        SELECT 1 FROM public.expert_availability_slots 
        WHERE expert_id = p.id
      )
  LOOP
    -- Create 5 default slots for this expert
    INSERT INTO public.expert_availability_slots (expert_id, start_time, end_time, notes)
    SELECT 
      expert_record.id,
      (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '14 hours')::timestamptz,
      (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
      'Backfilled availability slot'
    FROM generate_series(1, 5) AS n
    WHERE EXTRACT(dow FROM CURRENT_DATE + (n + 7)) BETWEEN 1 AND 5;
    
    slots_created := slots_created + 1;
    RAISE NOTICE 'Created slots for existing expert: % (%)', expert_record.full_name, expert_record.id;
  END LOOP;
  
  RAISE NOTICE 'Backfilled availability slots for % existing experts', slots_created;
END $$;

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Check experts with onboarding completed
DO $$
DECLARE
  expert_count INTEGER;
  expert_with_slots INTEGER;
BEGIN
  SELECT COUNT(*) INTO expert_count 
  FROM public.profiles 
  WHERE role = 'expert' AND onboarding_completed = true;
  
  SELECT COUNT(DISTINCT expert_id) INTO expert_with_slots
  FROM public.expert_availability_slots;
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'VERIFICATION RESULTS:';
  RAISE NOTICE 'Experts with onboarding completed: %', expert_count;
  RAISE NOTICE 'Experts with availability slots: %', expert_with_slots;
  RAISE NOTICE '==========================================';
  
  IF expert_count > 0 AND expert_with_slots = 0 THEN
    RAISE WARNING 'WARNING: Experts exist but none have availability slots!';
  ELSIF expert_count > 0 AND expert_with_slots > 0 THEN
    RAISE NOTICE 'SUCCESS: Experts have availability slots!';
  END IF;
END $$;

-- Show available experts
SELECT 
  'Available Experts in View' as check_type,
  COUNT(*) as count
FROM public.available_experts;

-- Show sample expert data
SELECT 
  id,
  full_name,
  role,
  onboarding_completed,
  expertise_areas,
  hourly_rate,
  (SELECT COUNT(*) FROM public.expert_availability_slots WHERE expert_id = profiles.id) as slot_count
FROM public.profiles
WHERE role = 'expert'
LIMIT 10;

-- =====================================================
-- FIX EXPERT DATA FLOW AND SEED SAMPLE EXPERTS
-- =====================================================
-- This migration fixes issues preventing experts from showing up:
-- 1. Creates default availability slots when expert completes onboarding
-- 2. Seeds sample expert profiles for testing
-- 3. Ensures RLS policies don't conflict

-- =====================================================
-- 1. AUTO-CREATE AVAILABILITY SLOTS FOR EXPERTS
-- =====================================================

-- Function to create default availability slots for new experts
CREATE OR REPLACE FUNCTION public.create_default_expert_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create slots if user is an expert and just completed onboarding
  IF NEW.role = 'expert' AND NEW.onboarding_completed = true AND 
     (OLD.onboarding_completed IS NULL OR OLD.onboarding_completed = false) THEN
    
    -- Create 5 default availability slots (Mon-Fri, 2-3 PM, next week)
    INSERT INTO public.expert_availability_slots (expert_id, start_time, end_time, notes)
    SELECT 
      NEW.id,
      (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '14 hours')::timestamptz,
      (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
      'Default availability slot'
    FROM generate_series(1, 5) AS n
    WHERE EXTRACT(dow FROM CURRENT_DATE + (n + 7)) BETWEEN 1 AND 5; -- Mon-Fri only
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create availability slots
DROP TRIGGER IF EXISTS auto_create_expert_availability ON public.profiles;
CREATE TRIGGER auto_create_expert_availability
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_expert_availability();

-- =====================================================
-- 2. FIX RLS POLICY CONFLICTS
-- =====================================================

-- Drop any conflicting "view own profile" policies that might block public viewing
DO $$
BEGIN
  -- Check if there's a restrictive policy from older migration
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
    AND NOT (qual::text LIKE '%true%')
  ) THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  END IF;
END $$;

-- Ensure the public viewing policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Profiles are publicly viewable by authenticated users'
  ) THEN
    CREATE POLICY "Profiles are publicly viewable by authenticated users"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- =====================================================
-- 3. SEED SAMPLE EXPERT PROFILES
-- =====================================================

-- Insert sample expert profiles for testing (only if they don't exist)
DO $$
DECLARE
  v_expert_id_1 UUID;
  v_expert_id_2 UUID;
  v_expert_id_3 UUID;
BEGIN
  -- Create first expert (Marketing & Growth)
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    instance_id,
    aud,
    role
  ) VALUES (
    gen_random_uuid(),
    'expert1_sarah@example.com',
    crypt('SampleExpert123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sarah Marketing"}',
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_expert_id_1;

  -- If expert was just created, create profile
  IF v_expert_id_1 IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      email,
      role,
      full_name,
      bio,
      location,
      expertise_areas,
      years_experience,
      hourly_rate,
      linkedin_url,
      onboarding_completed,
      created_at,
      updated_at
    ) VALUES (
      v_expert_id_1,
      'expert1_sarah@example.com',
      'expert',
      'Sarah Marketing',
      'Marketing strategist with 10+ years helping startups scale. Specialized in growth hacking, content marketing, and customer acquisition.',
      'San Francisco, CA',
      ARRAY['Growth Marketing', 'Content Strategy', 'Customer Acquisition', 'SEO'],
      10,
      150.00,
      'https://linkedin.com/in/sarahmarketing',
      true,
      NOW(),
      NOW()
    );

    -- Create some availability slots
    INSERT INTO public.expert_availability_slots (expert_id, start_time, end_time, notes)
    SELECT 
      v_expert_id_1,
      (CURRENT_DATE + n * INTERVAL '1 day' + INTERVAL '10 hours')::timestamptz,
      (CURRENT_DATE + n * INTERVAL '1 day' + INTERVAL '11 hours')::timestamptz,
      CASE n
        WHEN 1 THEN 'Morning session - Best for strategy discussions'
        WHEN 3 THEN 'Afternoon slot - Great for deep dives'
        WHEN 5 THEN 'Friday session - Week wrap-up'
        ELSE 'Available for mentorship'
      END
    FROM generate_series(1, 7, 2) AS n;
  END IF;

  -- Create second expert (Product & Tech)
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    instance_id,
    aud,
    role
  ) VALUES (
    gen_random_uuid(),
    'expert2_mike@example.com',
    crypt('SampleExpert123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Mike Chen"}',
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_expert_id_2;

  IF v_expert_id_2 IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      email,
      role,
      full_name,
      bio,
      location,
      expertise_areas,
      years_experience,
      hourly_rate,
      linkedin_url,
      twitter_url,
      onboarding_completed,
      created_at,
      updated_at
    ) VALUES (
      v_expert_id_2,
      'expert2_mike@example.com',
      'expert',
      'Mike Chen',
      'Former CTO at 3 successful startups. Expert in product development, technical architecture, and building high-performing engineering teams.',
      'Austin, TX',
      ARRAY['Product Development', 'Technical Architecture', 'Team Building', 'SaaS'],
      12,
      200.00,
      'https://linkedin.com/in/mikechen',
      'https://twitter.com/mikechen',
      true,
      NOW(),
      NOW()
    );

    -- Create availability slots
    INSERT INTO public.expert_availability_slots (expert_id, start_time, end_time, notes)
    SELECT 
      v_expert_id_2,
      (CURRENT_DATE + n * INTERVAL '1 day' + INTERVAL '14 hours')::timestamptz,
      (CURRENT_DATE + n * INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
      'Technical mentorship session'
    FROM generate_series(2, 10, 2) AS n;
  END IF;

  -- Create third expert (Fundraising)
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    instance_id,
    aud,
    role
  ) VALUES (
    gen_random_uuid(),
    'expert3_lisa@example.com',
    crypt('SampleExpert123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Lisa Rodriguez"}',
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_expert_id_3;

  IF v_expert_id_3 IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      email,
      role,
      full_name,
      bio,
      location,
      expertise_areas,
      years_experience,
      hourly_rate,
      linkedin_url,
      website_url,
      onboarding_completed,
      created_at,
      updated_at
    ) VALUES (
      v_expert_id_3,
      'expert3_lisa@example.com',
      'expert',
      'Lisa Rodriguez',
      'Venture capital advisor who has helped 50+ startups raise over $200M. Specialized in pitch deck review, investor intros, and fundraising strategy.',
      'New York, NY',
      ARRAY['Fundraising', 'Pitch Deck Review', 'Investor Relations', 'Due Diligence'],
      15,
      250.00,
      'https://linkedin.com/in/lisarodriguez',
      'https://lisarodriguez.com',
      true,
      NOW(),
      NOW()
    );

    -- Create availability slots
    INSERT INTO public.expert_availability_slots (expert_id, start_time, end_time, notes)
    SELECT 
      v_expert_id_3,
      (CURRENT_DATE + n * INTERVAL '1 day' + INTERVAL '16 hours')::timestamptz,
      (CURRENT_DATE + n * INTERVAL '1 day' + INTERVAL '17 hours')::timestamptz,
      'Fundraising consultation'
    FROM generate_series(1, 6) AS n;
  END IF;

  RAISE NOTICE 'Sample expert profiles created successfully';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some expert profiles may already exist or error occurred: %', SQLERRM;
END $$;

-- =====================================================
-- 4. UPDATE EXISTING EXPERT PROFILES
-- =====================================================

-- For any existing expert profiles without availability slots, create default ones
DO $$
DECLARE
  expert_record RECORD;
BEGIN
  FOR expert_record IN 
    SELECT p.id 
    FROM public.profiles p
    LEFT JOIN public.expert_availability_slots eas ON p.id = eas.expert_id
    WHERE p.role = 'expert' 
      AND p.onboarding_completed = true
      AND eas.id IS NULL
  LOOP
    -- Create default availability slots for this expert
    INSERT INTO public.expert_availability_slots (expert_id, start_time, end_time, notes)
    SELECT 
      expert_record.id,
      (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '14 hours')::timestamptz,
      (CURRENT_DATE + (n + 7) * INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
      'Auto-generated availability slot'
    FROM generate_series(1, 5) AS n
    WHERE EXTRACT(dow FROM CURRENT_DATE + (n + 7)) BETWEEN 1 AND 5;
    
    RAISE NOTICE 'Created availability slots for existing expert: %', expert_record.id;
  END LOOP;
END $$;

-- =====================================================
-- 5. VERIFICATION QUERY
-- =====================================================

-- Count experts with availability
DO $$
DECLARE
  expert_count INTEGER;
  slots_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO expert_count FROM public.profiles WHERE role = 'expert' AND onboarding_completed = true;
  SELECT COUNT(*) INTO slots_count FROM public.expert_availability_slots WHERE is_booked = false AND start_time > NOW();
  
  RAISE NOTICE 'Total experts with completed onboarding: %', expert_count;
  RAISE NOTICE 'Total available slots (unbooked, future): %', slots_count;
END $$;

COMMENT ON FUNCTION public.create_default_expert_availability IS 'Auto-creates availability slots when expert completes onboarding';

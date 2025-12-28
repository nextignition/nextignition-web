-- =====================================================
-- MENTORSHIP SYSTEM COMPLETE DATABASE SCHEMA
-- =====================================================
-- This migration creates all tables needed for the mentorship system:
-- 1. expert_availability_slots - Expert's available time slots
-- 2. mentorship_requests - Session booking requests from founders
-- 3. Updates to existing meetings table to link with mentorship requests

-- =====================================================
-- 1. EXPERT AVAILABILITY SLOTS TABLE
-- =====================================================
-- Stores when experts are available for mentorship sessions
CREATE TABLE IF NOT EXISTS public.expert_availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Time slot details
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  
  -- Slot status
  is_booked BOOLEAN DEFAULT false,
  booked_by_request_id UUID, -- Links to mentorship_requests table
  
  -- Recurring availability (optional - for future)
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- RRULE format for recurring slots
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Indexes for performance
CREATE INDEX idx_expert_availability_expert_id ON public.expert_availability_slots(expert_id);
CREATE INDEX idx_expert_availability_start_time ON public.expert_availability_slots(start_time);
CREATE INDEX idx_expert_availability_is_booked ON public.expert_availability_slots(is_booked);
CREATE INDEX idx_expert_availability_expert_time ON public.expert_availability_slots(expert_id, start_time) WHERE is_booked = false;

-- =====================================================
-- 2. MENTORSHIP REQUESTS TABLE
-- =====================================================
-- Stores session requests from founders to experts
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participants
  founder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Session details
  topic TEXT NOT NULL,
  custom_topic TEXT, -- If topic is "Other"
  message TEXT, -- Optional message to expert
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Requested time slot
  availability_slot_id UUID REFERENCES public.expert_availability_slots(id) ON DELETE SET NULL,
  requested_start_time TIMESTAMPTZ NOT NULL,
  requested_end_time TIMESTAMPTZ NOT NULL,
  
  -- Status workflow: pending -> accepted/rejected
  -- If accepted, creates a meeting and books the slot
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  
  -- Response from expert
  expert_response_message TEXT,
  responded_at TIMESTAMPTZ,
  
  -- Meeting integration (populated when accepted)
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL,
  google_meet_link TEXT,
  google_calendar_event_id TEXT,
  
  -- Session completion
  completed_at TIMESTAMPTZ,
  founder_rating INTEGER CHECK (founder_rating >= 1 AND founder_rating <= 5),
  founder_review TEXT,
  expert_rating INTEGER CHECK (expert_rating >= 1 AND expert_rating <= 5),
  expert_review TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 240),
  CONSTRAINT valid_time_range CHECK (requested_end_time > requested_start_time)
);

-- Indexes for performance
CREATE INDEX idx_mentorship_requests_founder ON public.mentorship_requests(founder_id);
CREATE INDEX idx_mentorship_requests_expert ON public.mentorship_requests(expert_id);
CREATE INDEX idx_mentorship_requests_status ON public.mentorship_requests(status);
CREATE INDEX idx_mentorship_requests_slot ON public.mentorship_requests(availability_slot_id);
CREATE INDEX idx_mentorship_requests_meeting ON public.mentorship_requests(meeting_id);
CREATE INDEX idx_mentorship_requests_expert_status ON public.mentorship_requests(expert_id, status);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Expert Availability Slots RLS
ALTER TABLE public.expert_availability_slots ENABLE ROW LEVEL SECURITY;

-- Experts can manage their own availability
CREATE POLICY "Experts can view own availability slots"
  ON public.expert_availability_slots
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = expert_id OR
    -- Founders can view unbooked slots
    (is_booked = false AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('founder', 'cofounder'))
  );

CREATE POLICY "Experts can insert own availability slots"
  ON public.expert_availability_slots
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can update own availability slots"
  ON public.expert_availability_slots
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = expert_id)
  WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can delete own availability slots"
  ON public.expert_availability_slots
  FOR DELETE
  TO authenticated
  USING (auth.uid() = expert_id);

-- Mentorship Requests RLS
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Founders and experts can view their own requests
CREATE POLICY "Users can view own mentorship requests"
  ON public.mentorship_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = founder_id OR auth.uid() = expert_id);

-- Founders can create requests
CREATE POLICY "Founders can create mentorship requests"
  ON public.mentorship_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = founder_id);

-- Founders and experts can update their own requests
CREATE POLICY "Users can update own mentorship requests"
  ON public.mentorship_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = founder_id OR auth.uid() = expert_id)
  WITH CHECK (auth.uid() = founder_id OR auth.uid() = expert_id);

-- Users can delete their own requests (only if pending)
CREATE POLICY "Users can delete pending requests"
  ON public.mentorship_requests
  FOR DELETE
  TO authenticated
  USING (
    (auth.uid() = founder_id OR auth.uid() = expert_id) AND
    status = 'pending'
  );

-- =====================================================
-- 4. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for expert_availability_slots
DROP TRIGGER IF EXISTS update_expert_availability_slots_updated_at ON public.expert_availability_slots;
CREATE TRIGGER update_expert_availability_slots_updated_at
  BEFORE UPDATE ON public.expert_availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for mentorship_requests
DROP TRIGGER IF EXISTS update_mentorship_requests_updated_at ON public.mentorship_requests;
CREATE TRIGGER update_mentorship_requests_updated_at
  BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to book a slot when request is accepted
CREATE OR REPLACE FUNCTION public.book_availability_slot()
RETURNS TRIGGER AS $$
BEGIN
  -- When a mentorship request is accepted
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Mark the availability slot as booked
    IF NEW.availability_slot_id IS NOT NULL THEN
      UPDATE public.expert_availability_slots
      SET 
        is_booked = true,
        booked_by_request_id = NEW.id,
        updated_at = NOW()
      WHERE id = NEW.availability_slot_id;
    END IF;
  END IF;
  
  -- When a request is rejected or cancelled, free the slot
  IF (NEW.status = 'rejected' OR NEW.status = 'cancelled') AND OLD.status IN ('pending', 'accepted') THEN
    IF NEW.availability_slot_id IS NOT NULL THEN
      UPDATE public.expert_availability_slots
      SET 
        is_booked = false,
        booked_by_request_id = NULL,
        updated_at = NOW()
      WHERE id = NEW.availability_slot_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS book_slot_on_request_status_change ON public.mentorship_requests;
CREATE TRIGGER book_slot_on_request_status_change
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.book_availability_slot();

-- =====================================================
-- 5. VIEWS FOR EASIER QUERYING
-- =====================================================

-- View: Available experts with their details
CREATE OR REPLACE VIEW public.available_experts AS
SELECT 
  p.id,
  p.full_name,
  p.bio,
  p.location,
  p.expertise_areas,
  p.years_experience,
  p.hourly_rate,
  p.linkedin_url,
  p.twitter_url,
  p.website_url,
  -- Count available slots
  (SELECT COUNT(*) FROM public.expert_availability_slots 
   WHERE expert_id = p.id AND is_booked = false AND start_time > NOW()) as available_slots_count,
  -- Average rating from completed sessions
  COALESCE((SELECT AVG(founder_rating) FROM public.mentorship_requests 
   WHERE expert_id = p.id AND status = 'completed' AND founder_rating IS NOT NULL), 0) as average_rating,
  -- Total completed sessions
  (SELECT COUNT(*) FROM public.mentorship_requests 
   WHERE expert_id = p.id AND status = 'completed') as total_sessions,
  p.created_at,
  p.updated_at
FROM public.profiles p
WHERE p.role = 'expert' AND p.onboarding_completed = true
ORDER BY available_slots_count DESC, average_rating DESC;

-- View: Expert dashboard - all requests
CREATE OR REPLACE VIEW public.expert_dashboard_requests AS
SELECT 
  mr.id,
  mr.status,
  mr.topic,
  mr.custom_topic,
  mr.message,
  mr.duration_minutes,
  mr.requested_start_time,
  mr.requested_end_time,
  mr.expert_response_message,
  mr.responded_at,
  mr.google_meet_link,
  mr.created_at,
  mr.updated_at,
  -- Founder details
  fp.id as founder_id,
  fp.full_name as founder_name,
  fp.venture_name,
  fp.venture_industry,
  fp.venture_stage,
  fp.bio as founder_bio,
  -- Meeting details if accepted
  m.id as meeting_id,
  m.meeting_url,
  m.google_calendar_event_id
FROM public.mentorship_requests mr
JOIN public.profiles fp ON mr.founder_id = fp.id
LEFT JOIN public.meetings m ON mr.meeting_id = m.id
WHERE mr.expert_id = auth.uid()
ORDER BY 
  CASE mr.status
    WHEN 'pending' THEN 1
    WHEN 'accepted' THEN 2
    WHEN 'completed' THEN 3
    ELSE 4
  END,
  mr.requested_start_time ASC;

-- View: Founder dashboard - all requests
CREATE OR REPLACE VIEW public.founder_dashboard_requests AS
SELECT 
  mr.id,
  mr.status,
  mr.topic,
  mr.custom_topic,
  mr.message,
  mr.duration_minutes,
  mr.requested_start_time,
  mr.requested_end_time,
  mr.expert_response_message,
  mr.responded_at,
  mr.google_meet_link,
  mr.founder_rating,
  mr.founder_review,
  mr.created_at,
  mr.updated_at,
  -- Expert details
  ep.id as expert_id,
  ep.full_name as expert_name,
  ep.bio as expert_bio,
  ep.expertise_areas,
  ep.years_experience,
  ep.hourly_rate,
  ep.linkedin_url as expert_linkedin,
  -- Meeting details if accepted
  m.id as meeting_id,
  m.meeting_url,
  m.google_calendar_event_id
FROM public.mentorship_requests mr
JOIN public.profiles ep ON mr.expert_id = ep.id
LEFT JOIN public.meetings m ON mr.meeting_id = m.id
WHERE mr.founder_id = auth.uid()
ORDER BY 
  CASE mr.status
    WHEN 'pending' THEN 1
    WHEN 'accepted' THEN 2
    WHEN 'completed' THEN 3
    ELSE 4
  END,
  mr.requested_start_time ASC;

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.expert_availability_slots TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorship_requests TO authenticated;
GRANT SELECT ON public.available_experts TO authenticated;
GRANT SELECT ON public.expert_dashboard_requests TO authenticated;
GRANT SELECT ON public.founder_dashboard_requests TO authenticated;

-- =====================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.expert_availability_slots IS 'Stores expert availability time slots for mentorship sessions';
COMMENT ON TABLE public.mentorship_requests IS 'Stores mentorship session requests from founders to experts';
COMMENT ON VIEW public.available_experts IS 'Shows all available experts with their stats and available slots';
COMMENT ON VIEW public.expert_dashboard_requests IS 'Expert view of all mentorship requests received';
COMMENT ON VIEW public.founder_dashboard_requests IS 'Founder view of all mentorship requests sent';

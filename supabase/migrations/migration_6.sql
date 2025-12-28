-- Migration: Add founder email to expert_dashboard_requests view
-- Description: Adds founder email field so experts can see the email when accepting requests

-- Drop existing view
DROP VIEW IF EXISTS public.expert_dashboard_requests;

-- Recreate view with founder email
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
  fp.email as founder_email,  -- ADDED: Founder email
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

-- Recreate grants
GRANT SELECT ON public.expert_dashboard_requests TO authenticated;

-- Add comment
COMMENT ON VIEW public.expert_dashboard_requests IS 'Expert view of all mentorship requests received with founder email';

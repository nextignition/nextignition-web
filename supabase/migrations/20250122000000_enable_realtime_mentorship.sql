-- Enable Realtime for mentorship_requests table
-- This allows real-time updates when founders send requests to experts

alter publication supabase_realtime add table mentorship_requests;

-- Add comment
comment on table mentorship_requests is 'Mentorship session requests between founders and experts - Realtime enabled';


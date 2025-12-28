-- Enable Realtime for chat tables
-- This migration ensures Supabase Realtime works properly for messages, conversations, and message_reads

-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable Realtime for conversations table
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Enable Realtime for conversation_members table
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;

-- Enable Realtime for message_reads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reads;

-- Set REPLICA IDENTITY to FULL for messages table (required for UPDATE/DELETE events)
-- This allows Realtime to send the full row data on updates/deletes
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Set REPLICA IDENTITY to FULL for message_reads table
ALTER TABLE public.message_reads REPLICA IDENTITY FULL;

-- Note: REPLICA IDENTITY DEFAULT is sufficient for INSERT events
-- FULL is needed if you want to track UPDATE/DELETE events with full row data

-- Create indexes for better Realtime performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reads_message_profile ON public.message_reads(message_id, profile_id);

COMMENT ON TABLE public.messages IS 'Chat messages table with Realtime enabled for instant updates';
COMMENT ON TABLE public.message_reads IS 'Message read receipts table with Realtime enabled';


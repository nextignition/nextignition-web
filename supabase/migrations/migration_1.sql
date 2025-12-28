-- Migration: Add Google OAuth tokens storage
-- Created: 2025-12-07
-- Purpose: Store user Google OAuth tokens for creating Google Meet meetings

-- Create table for storing user Google OAuth tokens
CREATE TABLE IF NOT EXISTS public.user_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_google_tokens_user_id ON public.user_google_tokens(user_id);
CREATE INDEX idx_user_google_tokens_expires_at ON public.user_google_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only view and manage their own tokens
CREATE POLICY "Users can view own Google tokens"
  ON public.user_google_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Google tokens"
  ON public.user_google_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Google tokens"
  ON public.user_google_tokens
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own Google tokens"
  ON public.user_google_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_google_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_google_tokens_updated_at
  BEFORE UPDATE ON public.user_google_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_user_google_tokens_updated_at();

-- Add column to meetings table to track which token was used
ALTER TABLE public.meetings
  ADD COLUMN IF NOT EXISTS google_token_id UUID REFERENCES public.user_google_tokens(id) ON DELETE SET NULL;

-- Create index
CREATE INDEX IF NOT EXISTS idx_meetings_google_token_id ON public.meetings(google_token_id);

-- Create view for active Google connections
CREATE OR REPLACE VIEW public.active_google_connections AS
SELECT
  ugt.user_id,
  p.email,
  p.full_name,
  ugt.expires_at,
  ugt.created_at,
  CASE
    WHEN ugt.expires_at > NOW() THEN true
    ELSE false
  END AS is_valid,
  ugt.scope
FROM public.user_google_tokens ugt
JOIN public.profiles p ON p.id = ugt.user_id;

-- Grant access to view
GRANT SELECT ON public.active_google_connections TO authenticated;

COMMENT ON TABLE public.user_google_tokens IS 'Stores Google OAuth tokens for users to create Google Calendar events and Meet links';
COMMENT ON COLUMN public.user_google_tokens.access_token IS 'OAuth access token (expires in ~1 hour)';
COMMENT ON COLUMN public.user_google_tokens.refresh_token IS 'OAuth refresh token (use to get new access token)';
COMMENT ON COLUMN public.user_google_tokens.expires_at IS 'When the access token expires';
COMMENT ON VIEW public.active_google_connections IS 'Shows which users have active Google Calendar connections';

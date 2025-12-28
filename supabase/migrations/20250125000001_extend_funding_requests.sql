-- Extend funding_requests table with additional details
ALTER TABLE public.funding_requests
ADD COLUMN IF NOT EXISTS valuation numeric(15, 2),
ADD COLUMN IF NOT EXISTS equity_percentage numeric(5, 2),
ADD COLUMN IF NOT EXISTS revenue numeric(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS growth_rate numeric(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_investment numeric(15, 2),
ADD COLUMN IF NOT EXISTS max_investment numeric(15, 2),
ADD COLUMN IF NOT EXISTS team_size integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS pitch_video_id uuid REFERENCES public.pitch_materials(id),
ADD COLUMN IF NOT EXISTS mrr numeric(15, 2),
ADD COLUMN IF NOT EXISTS arr numeric(15, 2),
ADD COLUMN IF NOT EXISTS users_count integer,
ADD COLUMN IF NOT EXISTS customers_count integer;


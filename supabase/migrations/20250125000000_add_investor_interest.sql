-- Investor interest in funding requests
CREATE TABLE IF NOT EXISTS public.investor_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  funding_request_id uuid NOT NULL REFERENCES public.funding_requests(id) ON DELETE CASCADE,
  interest_amount numeric(15, 2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'withdrawn')),
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_investor_funding_request UNIQUE (investor_profile_id, funding_request_id)
);

ALTER TABLE public.investor_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "InvestorInterest: investor manage own"
  ON public.investor_interest
  FOR ALL
  USING (investor_profile_id = auth.uid())
  WITH CHECK (investor_profile_id = auth.uid());

CREATE POLICY "InvestorInterest: founder view own funding"
  ON public.investor_interest
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.funding_requests fr
      WHERE fr.id = public.investor_interest.funding_request_id
      AND fr.founder_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_investor_interest_investor ON public.investor_interest(investor_profile_id);
CREATE INDEX IF NOT EXISTS idx_investor_interest_funding_request ON public.investor_interest(funding_request_id);


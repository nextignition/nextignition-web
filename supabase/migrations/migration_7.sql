/*
  Funding Portal Schema
  
  Tables:
  - founder_funding_profiles: Founder's funding information and goals
  - founder_funding_highlights: Key highlights/milestones for funding
  - founder_funding_documents: Documents (pitch deck, financials, etc.)
  - investor_commitments: Investor investment commitments
  - investment_transactions: Record of investment transactions
*/

-- Founder funding profile (one per founder/startup)
CREATE TABLE IF NOT EXISTS public.founder_funding_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  startup_id uuid NOT NULL REFERENCES public.startup_profiles(id) ON DELETE CASCADE,
  
  -- Funding Information
  target_fund_amount numeric(15, 2) NOT NULL DEFAULT 0,
  min_investment numeric(15, 2),
  max_investment numeric(15, 2),
  current_funding_round text CHECK (current_funding_round IN ('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'series-d', 'other')),
  
  -- Equity Information
  equity_percentage numeric(5, 2),
  valuation numeric(15, 2),
  
  -- Details Section Data
  pitch_summary text,
  problem_statement text,
  solution_overview text,
  market_opportunity text,
  traction_milestones text,
  business_model text,
  team_description text,
  
  -- Status
  is_active boolean DEFAULT true,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_founder_startup UNIQUE (founder_id, startup_id)
);

ALTER TABLE public.founder_funding_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FounderFundingProfiles: founder manage own"
  ON public.founder_funding_profiles
  FOR ALL
  USING (founder_id = auth.uid())
  WITH CHECK (founder_id = auth.uid());

CREATE POLICY "FounderFundingProfiles: public view"
  ON public.founder_funding_profiles
  FOR SELECT
  USING (visibility = 'public' OR founder_id = auth.uid());

-- Founder funding highlights (key points, team members, milestones)
CREATE TABLE IF NOT EXISTS public.founder_funding_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_funding_profile_id uuid NOT NULL REFERENCES public.founder_funding_profiles(id) ON DELETE CASCADE,
  
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('milestone', 'client', 'partnership', 'award', 'metric', 'team', 'other')),
  order_index integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.founder_funding_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FounderFundingHighlights: founder manage"
  ON public.founder_funding_highlights
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_funding_profiles ffp
      WHERE ffp.id = public.founder_funding_highlights.founder_funding_profile_id
      AND ffp.founder_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.founder_funding_profiles ffp
      WHERE ffp.id = public.founder_funding_highlights.founder_funding_profile_id
      AND ffp.founder_id = auth.uid()
    )
  );

CREATE POLICY "FounderFundingHighlights: public view"
  ON public.founder_funding_highlights
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_funding_profiles ffp
      WHERE ffp.id = public.founder_funding_highlights.founder_funding_profile_id
      AND ffp.visibility = 'public'
    )
  );

-- Founder funding documents (pitch deck, financials, etc.)
CREATE TABLE IF NOT EXISTS public.founder_funding_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_funding_profile_id uuid NOT NULL REFERENCES public.founder_funding_profiles(id) ON DELETE CASCADE,
  
  document_name text NOT NULL,
  document_type text CHECK (document_type IN ('pitch_deck', 'financial_projection', 'executive_summary', 'business_plan', 'term_sheet', 'other')),
  storage_path text NOT NULL,
  file_size integer,
  pages integer,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.founder_funding_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FounderFundingDocuments: founder manage"
  ON public.founder_funding_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_funding_profiles ffp
      WHERE ffp.id = public.founder_funding_documents.founder_funding_profile_id
      AND ffp.founder_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.founder_funding_profiles ffp
      WHERE ffp.id = public.founder_funding_documents.founder_funding_profile_id
      AND ffp.founder_id = auth.uid()
    )
  );

CREATE POLICY "FounderFundingDocuments: public view"
  ON public.founder_funding_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_funding_profiles ffp
      WHERE ffp.id = public.founder_funding_documents.founder_funding_profile_id
      AND ffp.visibility = 'public'
    )
  );

-- Investor commitments (investor invests in a founder's round)
CREATE TABLE IF NOT EXISTS public.investor_commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  founder_funding_profile_id uuid NOT NULL REFERENCES public.founder_funding_profiles(id) ON DELETE CASCADE,
  
  committed_amount numeric(15, 2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_investor_commitment UNIQUE (investor_profile_id, founder_funding_profile_id)
);

ALTER TABLE public.investor_commitments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "InvestorCommitments: investor manage own"
  ON public.investor_commitments
  FOR ALL
  USING (investor_profile_id = auth.uid())
  WITH CHECK (investor_profile_id = auth.uid());

CREATE POLICY "InvestorCommitments: founder view own funding"
  ON public.investor_commitments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_funding_profiles ffp
      WHERE ffp.id = public.investor_commitments.founder_funding_profile_id
      AND ffp.founder_id = auth.uid()
    )
  );

-- Investment transactions (history of payments)
CREATE TABLE IF NOT EXISTS public.investment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_commitment_id uuid NOT NULL REFERENCES public.investor_commitments(id) ON DELETE CASCADE,
  
  transaction_amount numeric(15, 2) NOT NULL,
  transaction_date timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.investment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "InvestmentTransactions: investor view own"
  ON public.investment_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.investor_commitments ic
      WHERE ic.id = public.investment_transactions.investor_commitment_id
      AND ic.investor_profile_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_founder_funding_profiles_founder ON public.founder_funding_profiles(founder_id);
CREATE INDEX IF NOT EXISTS idx_founder_funding_profiles_startup ON public.founder_funding_profiles(startup_id);
CREATE INDEX IF NOT EXISTS idx_founder_funding_profiles_visibility ON public.founder_funding_profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_investor_commitments_investor ON public.investor_commitments(investor_profile_id);
CREATE INDEX IF NOT EXISTS idx_investor_commitments_founder_funding ON public.investor_commitments(founder_funding_profile_id);
CREATE INDEX IF NOT EXISTS idx_founder_funding_highlights_profile ON public.founder_funding_highlights(founder_funding_profile_id);
CREATE INDEX IF NOT EXISTS idx_founder_funding_documents_profile ON public.founder_funding_documents(founder_funding_profile_id);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_commitment ON public.investment_transactions(investor_commitment_id);

-- View for funding opportunities (what investors see)
CREATE OR REPLACE VIEW public.funding_opportunities_view AS
SELECT
  ffp.id,
  ffp.startup_id,
  ffp.founder_id,
  sp.name AS company_name,
  sp.description AS tagline,
  sp.industry AS industry,
  ffp.target_fund_amount,
  COALESCE(SUM(ic.committed_amount), 0) AS raised_amount,
  ffp.target_fund_amount - COALESCE(SUM(ic.committed_amount), 0) AS remaining_amount,
  ffp.min_investment,
  ffp.max_investment,
  ffp.valuation,
  ffp.equity_percentage,
  ffp.current_funding_round AS stage,
  ffp.pitch_summary,
  ffp.problem_statement,
  ffp.solution_overview,
  ffp.market_opportunity,
  ffp.traction_milestones,
  ffp.business_model,
  ffp.visibility,
  ffp.is_active,
  ffp.created_at,
  ffp.updated_at,
  p.full_name AS founder_name,
  p.location
FROM public.founder_funding_profiles ffp
LEFT JOIN public.investor_commitments ic ON ic.founder_funding_profile_id = ffp.id AND ic.status != 'cancelled'
LEFT JOIN public.startup_profiles sp ON sp.id = ffp.startup_id
LEFT JOIN public.profiles p ON p.id = ffp.founder_id
WHERE ffp.visibility = 'public' AND ffp.is_active = true
GROUP BY ffp.id, sp.id, p.id, sp.name, sp.description, sp.industry, p.full_name, p.location;

-- Grant view access
GRANT SELECT ON public.funding_opportunities_view TO authenticated;

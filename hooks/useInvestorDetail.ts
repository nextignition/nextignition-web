import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface InvestorProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  bio: string | null;
  location: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  investment_focus: string | null;
  investment_range: string | null;
  portfolio_companies: string | null;
  created_at: string;
}

export function useInvestorDetail(investorId?: string) {
  const { user } = useAuth();
  const [investor, setInvestor] = useState<InvestorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestorDetail = useCallback(async () => {
    // If no investorId provided, fetch current user's profile
    const targetId = investorId || user?.id;

    if (!targetId) {
      setLoading(false);
      setError('No investor ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch investor profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        throw new Error('Investor profile not found');
      }

      // Ensure this is actually an investor profile
      if (profileData.role !== 'investor') {
        throw new Error('Profile is not an investor');
      }

      setInvestor(profileData as InvestorProfile);
    } catch (err: any) {
      console.error('Error fetching investor details:', err);
      setError(err.message || 'Failed to load investor details');
    } finally {
      setLoading(false);
    }
  }, [investorId, user?.id]);

  useEffect(() => {
    fetchInvestorDetail();
  }, [fetchInvestorDetail]);

  return {
    investor,
    loading,
    error,
    refresh: fetchInvestorDetail,
  };
}

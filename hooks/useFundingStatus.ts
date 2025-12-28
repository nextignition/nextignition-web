import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface FundingRequestStatus {
  id: string;
  title: string | null;
  amount_requested: number | null;
  status: string;
  created_at: string;
  investorsViewed: number;
  interestedCount: number;
  totalInterestAmount: number;
}

export interface InterestedInvestor {
  id: string;
  investor_profile_id: string;
  funding_request_id: string;
  interest_amount: number;
  status: string;
  message: string | null;
  created_at: string;
  investor: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
}

export function useFundingStatus() {
  const { user } = useAuth();
  const [fundingRequests, setFundingRequests] = useState<FundingRequestStatus[]>([]);
  const [interestedInvestors, setInterestedInvestors] = useState<InterestedInvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFundingStatus = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch funding requests for the founder
      const { data: requests, error: requestsError } = await supabase
        .from('funding_requests')
        .select('id, title, amount_requested, status, created_at')
        .eq('founder_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // For each request, fetch view count and interest data
      const requestsWithStats = await Promise.all(
        (requests || []).map(async (request) => {
          // Count investor views for the pitch material
          const { data: pitchMaterial } = await supabase
            .from('funding_requests')
            .select('pitch_material_id')
            .eq('id', request.id)
            .single();

          let viewCount = 0;
          if (pitchMaterial?.pitch_material_id) {
            const { count } = await supabase
              .from('investor_views')
              .select('*', { count: 'exact', head: true })
              .eq('pitch_material_id', pitchMaterial.pitch_material_id);
            viewCount = count || 0;
          }

          // Count interested investors and total interest amount
          const { data: interests } = await supabase
            .from('investor_interest')
            .select('interest_amount, status')
            .eq('funding_request_id', request.id)
            .in('status', ['pending', 'confirmed']);

          const interestedCount = interests?.length || 0;
          const totalInterestAmount = interests?.reduce((sum, i) => sum + Number(i.interest_amount || 0), 0) || 0;

          return {
            ...request,
            investorsViewed: viewCount,
            interestedCount,
            totalInterestAmount,
          };
        })
      );

      setFundingRequests(requestsWithStats);

      // Fetch all interested investors for all requests
      const { data: interests, error: interestsError } = await supabase
        .from('investor_interest')
        .select(`
          id,
          investor_profile_id,
          funding_request_id,
          interest_amount,
          status,
          message,
          created_at,
          investor:profiles!investor_interest_investor_profile_id_fkey(
            id,
            full_name,
            email
          )
        `)
        .in('funding_request_id', requestsWithStats.map(r => r.id))
        .in('status', ['pending', 'confirmed'])
        .order('created_at', { ascending: false });

      if (interestsError) throw interestsError;

      const formattedInterests: InterestedInvestor[] = (interests || []).map((interest: any) => ({
        id: interest.id,
        investor_profile_id: interest.investor_profile_id,
        funding_request_id: interest.funding_request_id,
        interest_amount: Number(interest.interest_amount),
        status: interest.status,
        message: interest.message,
        created_at: interest.created_at,
        investor: Array.isArray(interest.investor) ? interest.investor[0] : interest.investor,
      }));

      setInterestedInvestors(formattedInterests);
    } catch (err: any) {
      console.error('Error fetching funding status:', err);
      setError(err.message || 'Failed to load funding status');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFundingStatus();
  }, [fetchFundingStatus]);

  return {
    fundingRequests,
    interestedInvestors,
    loading,
    error,
    refresh: fetchFundingStatus,
  };
}


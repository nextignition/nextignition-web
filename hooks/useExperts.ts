import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';

export interface ExpertProfile {
  id: string;
  name: string;
  expertise: string;
  experience: string;
  rating: number;
  sessions: number;
  hourlyRate: string;
  available: boolean;
  full_name?: string;
  bio?: string;
  location?: string;
  expertise_areas?: string[];
  years_experience?: number;
  hourly_rate?: number;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
}

export function useExperts() {
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all profiles with role = 'expert'
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'expert')
        .not('full_name', 'is', null) // Only get experts with names
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Fetch review statistics for all experts
      const expertIds = (data || []).map(p => p.id);
      const { data: reviewStats } = await supabase
        .from('mentorship_requests')
        .select('expert_id, founder_rating, status')
        .in('expert_id', expertIds)
        .not('founder_rating', 'is', null);

      // Calculate stats per expert
      const statsMap = (reviewStats || []).reduce((acc: any, review: any) => {
        if (!acc[review.expert_id]) {
          acc[review.expert_id] = { totalRating: 0, count: 0, sessions: 0 };
        }
        if (review.founder_rating) {
          acc[review.expert_id].totalRating += review.founder_rating;
          acc[review.expert_id].count += 1;
        }
        if (review.status === 'completed' || review.status === 'accepted') {
          acc[review.expert_id].sessions += 1;
        }
        return acc;
      }, {});

      // Transform database profiles to ExpertProfile format
      const transformedExperts: ExpertProfile[] = (data || []).map((profile: any) => {
        // Convert expertise_areas array to comma-separated string
        const expertise = Array.isArray(profile.expertise_areas) && profile.expertise_areas.length > 0
          ? profile.expertise_areas.join(', ')
          : profile.bio || 'Expert';

        // Convert years_experience to experience string
        const experience = profile.years_experience
          ? `${profile.years_experience}+ years`
          : 'Experienced';

        // Convert hourly_rate to formatted string
        const hourlyRate = profile.hourly_rate
          ? `$${Number(profile.hourly_rate).toFixed(0)}`
          : 'Contact for rate';

        // Calculate real rating and sessions from review stats
        const stats = statsMap[profile.id] || { totalRating: 0, count: 0, sessions: 0 };
        const rating = stats.count > 0 ? stats.totalRating / stats.count : 0;
        const sessions = stats.sessions;

        return {
          id: profile.id,
          name: profile.full_name || 'Expert',
          expertise,
          experience,
          rating: Math.round(rating * 10) / 10, // Round to 1 decimal
          sessions,
          hourlyRate,
          available: true, // Default to available - can be enhanced with availability tracking
          full_name: profile.full_name,
          bio: profile.bio,
          location: profile.location,
          expertise_areas: profile.expertise_areas,
          years_experience: profile.years_experience,
          hourly_rate: profile.hourly_rate,
          linkedin_url: profile.linkedin_url,
          twitter_url: profile.twitter_url,
          website_url: profile.website_url,
        };
      });

      setExperts(transformedExperts);
    } catch (err: any) {
      console.error('Error fetching experts:', err);
      setError(err.message || 'Failed to load experts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  return {
    experts,
    loading,
    error,
    refresh: fetchExperts,
  };
}


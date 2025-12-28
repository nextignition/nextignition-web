import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface ExpertProfileData {
  full_name: string;
  bio: string | null;
  location: string | null;
  expertise_areas: string[] | null;
  years_experience: number | null;
  hourly_rate: number | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  // Additional expert-specific fields
  specialization: string | null;
  portfolio: string | null;
  industries: string[] | null;
  skills: string[] | null;
  availability_hours: number | null;
  timezone: string | null;
}

export function useExpertProfile() {
  const [profile, setProfile] = useState<ExpertProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching expert profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<ExpertProfileData>) => {
    try {
      setSaving(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh profile data
      await fetchProfile();

      return { success: true };
    } catch (err: any) {
      console.error('Error updating expert profile:', err);
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    saving,
    error,
    fetchProfile,
    updateProfile,
  };
}


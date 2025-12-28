import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useInvestorViews() {
  const { user, profile } = useAuth();
  const [tracking, setTracking] = useState(false);
  const trackedRef = useRef<Set<string>>(new Set());
  const lastErrorRef = useRef<{ pitchMaterialId: string; timestamp: number } | null>(null);

  const trackView = async (pitchMaterialId: string) => {
    // Validate user and role
    if (!user?.id || !pitchMaterialId) return;
    
    // Only allow investors to track views
    if (profile?.role !== 'investor') {
      console.warn('Only investors can track views');
      return;
    }

    // Prevent duplicate tracking for the same pitch material
    if (tracking || trackedRef.current.has(pitchMaterialId)) {
      return;
    }

    // Prevent rapid retries - if we just failed for this pitch material, wait at least 5 seconds
    if (lastErrorRef.current?.pitchMaterialId === pitchMaterialId) {
      const timeSinceError = Date.now() - lastErrorRef.current.timestamp;
      if (timeSinceError < 5000) {
        return;
      }
    }

    try {
      setTracking(true);
      trackedRef.current.add(pitchMaterialId);
      
      // Insert or update view record
      const { error } = await supabase
        .from('investor_views')
        .upsert({
          investor_profile_id: user.id,
          pitch_material_id: pitchMaterialId,
          viewed_at: new Date().toISOString(),
        }, {
          onConflict: 'investor_profile_id,pitch_material_id',
        });

      if (error) {
        // Clear the tracked ref so we can retry later
        trackedRef.current.delete(pitchMaterialId);
        lastErrorRef.current = {
          pitchMaterialId,
          timestamp: Date.now(),
        };
        throw error;
      }

      // Clear error ref on success
      if (lastErrorRef.current?.pitchMaterialId === pitchMaterialId) {
        lastErrorRef.current = null;
      }
    } catch (err: any) {
      // Only log if it's not an RLS policy error (those are expected until migration is applied)
      if (err?.code !== '42501') {
        console.error('Error tracking investor view:', err);
      }
    } finally {
      setTracking(false);
    }
  };

  const getViewCount = async (founderId: string): Promise<number> => {
    if (!founderId) return 0;

    try {
      const { count, error } = await supabase
        .from('investor_views')
        .select('*', { count: 'exact', head: true })
        .eq('investor_profile_id', founderId);

      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error getting view count:', err);
      return 0;
    }
  };

  return {
    trackView,
    getViewCount,
    tracking,
  };
}

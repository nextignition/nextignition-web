import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface InvestorStats {
  activeDeals: number;
  newPitches: number;
  connections: number;
}

export interface RecentPitch {
  id: string;
  company: string;
  stage: string;
  amount: string;
  industry: string;
  viewed: boolean;
  owner_id: string;
  description: string | null;
  created_at: string;
}

export function useInvestorStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<InvestorStats>({
    activeDeals: 0,
    newPitches: 0,
    connections: 0,
  });
  const [recentPitches, setRecentPitches] = useState<RecentPitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch direct conversations only (exclude group channels like Community Chat)
      const { data: allMemberships, error: membershipsError } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          conversations (
            id,
            is_group
          )
        `)
        .eq('profile_id', user.id);

      if (membershipsError) throw membershipsError;

      // Filter to only direct conversations (is_group = false)
      const directConversations = (allMemberships || []).filter((cm: any) => {
        const conv = cm.conversations;
        return conv && conv.is_group === false;
      });

      const directConversationIds = directConversations
        .map((dc: any) => dc.conversation_id)
        .filter((id: string) => id);

      // Count unique other users in direct conversations (connections)
      const connectionUserIds = new Set<string>();
      if (directConversationIds.length > 0) {
        const { data: otherMembers } = await supabase
          .from('conversation_members')
          .select('profile_id')
          .in('conversation_id', directConversationIds)
          .neq('profile_id', user.id);
        
        otherMembers?.forEach((m: any) => connectionUserIds.add(m.profile_id));
      }

      // Fetch all startup profiles (new pitches)
      const { data: startupsData, error: startupsError } = await supabase
        .from('startup_profiles')
        .select('id', { count: 'exact' })
        .eq('is_public', true);

      if (startupsError) throw startupsError;

      // Fetch pitch materials count (active deals - pitches with materials)
      const { data: pitchMaterialsData, error: pitchMaterialsError } = await supabase
        .from('pitch_materials')
        .select('owner_profile_id', { count: 'exact' });

      if (pitchMaterialsError) throw pitchMaterialsError;

      // Get unique owners with pitch materials
      const uniqueOwnersWithPitches = new Set(
        pitchMaterialsData?.map(p => p.owner_profile_id) || []
      ).size;

      setStats({
        activeDeals: uniqueOwnersWithPitches,
        newPitches: startupsData?.length || 0,
        connections: connectionUserIds.size,
      });

      // Fetch recent startup profiles for pitches
      const { data: recentStartups, error: recentError } = await supabase
        .from('startup_profiles')
        .select(`
          id,
          owner_id,
          name,
          description,
          industry,
          stage,
          created_at,
          profiles:owner_id (
            full_name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Check which ones have been viewed by this investor
      // For now, we'll mark all as new (not viewed) - you can add view tracking later
      const formattedPitches: RecentPitch[] = (recentStartups || []).map(startup => ({
        id: startup.id,
        company: startup.name || 'Unnamed Startup',
        stage: startup.stage || 'Not specified',
        amount: 'View Details', // You can add funding amount to schema later
        industry: startup.industry || 'Various',
        viewed: false, // Add view tracking if needed
        owner_id: startup.owner_id,
        description: startup.description,
        created_at: startup.created_at,
      }));

      setRecentPitches(formattedPitches);
    } catch (err: any) {
      console.error('Error fetching investor stats:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  const refresh = () => {
    fetchStats();
  };

  return {
    stats,
    recentPitches,
    loading,
    error,
    refresh,
  };
}

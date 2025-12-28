import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileStats {
  totalConnections: number;
  totalChats: number;
  profileViews: number;
  pitchMaterialsCount: number;
  fundingRequestsCount: number;
  notificationsCount: number;
  unreadNotificationsCount: number;
}

export function useProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats>({
    totalConnections: 0,
    totalChats: 0,
    profileViews: 0,
    pitchMaterialsCount: 0,
    fundingRequestsCount: 0,
    notificationsCount: 0,
    unreadNotificationsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get direct conversations only (exclude group channels like Community Chat)
      // First, get all conversation memberships for the user
      const allMembershipsResult = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          conversations (
            id,
            is_group
          )
        `)
        .eq('profile_id', user.id);

      if (allMembershipsResult.error) {
        console.error('Error fetching conversation memberships:', allMembershipsResult.error);
      }

      // Filter to only direct conversations (is_group = false)
      const directConversationsResult = {
        data: (allMembershipsResult.data || []).filter((cm: any) => {
          const conv = cm.conversations;
          return conv && conv.is_group === false;
        }),
        error: allMembershipsResult.error,
      };

      if (directConversationsResult.error) {
        console.error('Error fetching direct conversations:', directConversationsResult.error);
      }

      const directConversationIds = (directConversationsResult.data || [])
        .map((cm: any) => cm.conversation_id)
        .filter((id: string) => id); // Remove any null/undefined

      // For connections: count unique other users in direct conversations
      const connectionUserIds = new Set<string>();
      if (directConversationIds.length > 0) {
        const { data: otherMembers } = await supabase
          .from('conversation_members')
          .select('profile_id, conversation_id')
          .in('conversation_id', directConversationIds)
          .neq('profile_id', user.id);

        otherMembers?.forEach((m: any) => connectionUserIds.add(m.profile_id));
      }

      const totalConnections = connectionUserIds.size;
      
      // For active chats: count unique direct conversations
      const uniqueDirectConversations = new Set(directConversationIds);
      const totalChats = uniqueDirectConversations.size;

      // Count profile views (with error handling if table doesn't exist)
      let profileViewsCount = 0;
      try {
        const viewsResult = await supabase
          .from('profile_views')
          .select('id', { count: 'exact', head: true })
          .eq('viewed_profile_id', user.id);
        profileViewsCount = viewsResult.count || 0;
      } catch (viewsError) {
        console.log('Profile views table not available, defaulting to 0');
      }

      // Fetch remaining stats in parallel
      const [
        pitchesResult,
        fundingResult,
        notificationsResult,
      ] = await Promise.all([
        // Count pitch materials
        supabase
          .from('pitch_materials')
          .select('id', { count: 'exact', head: true })
          .eq('owner_profile_id', user.id),

        // Count funding requests
        supabase
          .from('funding_requests')
          .select('id', { count: 'exact', head: true })
          .eq('founder_id', user.id),

        // Count notifications
        supabase
          .from('notifications')
          .select('id, read', { count: 'exact' })
          .eq('profile_id', user.id),
      ]);

      
      const profileViews = profileViewsCount;
      const pitchMaterialsCount = pitchesResult.count || 0;
      const fundingRequestsCount = fundingResult.count || 0;
      
      const notifications = notificationsResult.data || [];
      const notificationsCount = notifications.length;
      const unreadNotificationsCount = notifications.filter((n: any) => !n.read).length;

      setStats({
        totalConnections,
        totalChats,
        profileViews,
        pitchMaterialsCount,
        fundingRequestsCount,
        notificationsCount,
        unreadNotificationsCount,
      });
    } catch (err: any) {
      console.error('Error fetching profile stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}

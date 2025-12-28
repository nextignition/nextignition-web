import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface MentorshipRequest {
  id: string;
  founder_id: string;
  expert_id: string;
  topic: string;
  custom_topic: string | null;
  message: string | null;
  duration_minutes: number;
  availability_slot_id: string | null;
  requested_start_time: string;
  requested_end_time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  expert_response_message: string | null;
  responded_at: string | null;
  meeting_id: string | null;
  google_meet_link: string | null;
  google_calendar_event_id: string | null;
  completed_at: string | null;
  founder_rating: number | null;
  founder_review: string | null;
  expert_rating: number | null;
  expert_review: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  expert?: {
    id: string;
    full_name: string;
    email: string;
    expertise_areas: string[];
    bio: string;
  };
  founder?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreateRequestData {
  expert_id: string;
  topic: string;
  custom_topic?: string;
  message?: string;
  duration_minutes: number;
  availability_slot_id: string;
  requested_start_time: string;
  requested_end_time: string;
}

export interface AcceptRequestData {
  request_id: string;
  response_message?: string;
}

export interface RejectRequestData {
  request_id: string;
  response_message?: string;
}

/**
 * Hook for managing mentorship session requests
 */
export function useMentorshipRequests() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const fetchingRef = useRef(false);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  /**
   * Fetch all requests for the current user (as founder or expert)
   */
  const fetchRequests = useCallback(async (showLoading = true) => {
    if (!currentUser) {
      console.log('⏸️ Cannot fetch requests: No current user');
      setLoading(false);
      return;
    }

    // Prevent concurrent fetches
    if (fetchingRef.current) {
      console.log('⏸️ Fetch already in progress, skipping...');
      return;
    }

    try {
      fetchingRef.current = true;
      console.log('🔄 Fetching mentorship requests for user:', currentUser.id, showLoading ? '(with loading)' : '(silent update)');
      
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      // Get user's role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        throw profileError;
      }

      console.log('👤 User role:', profile?.role);

      let query = supabase
        .from('mentorship_requests')
        .select(`
          *,
          expert:profiles!mentorship_requests_expert_id_fkey(id, full_name, email, expertise_areas, bio),
          founder:profiles!mentorship_requests_founder_id_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (profile?.role === 'expert') {
        console.log('🔍 Filtering requests as expert');
        query = query.eq('expert_id', currentUser.id);
      } else {
        console.log('🔍 Filtering requests as founder');
        query = query.eq('founder_id', currentUser.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Error fetching requests:', fetchError);
        throw fetchError;
      }

      console.log('✅ Fetched requests:', data?.length || 0);
      console.log('📋 Request IDs:', data?.map(r => r.id) || []);
      console.log('📋 Request statuses:', data?.map(r => `${r.id}:${r.status}`) || []);
      console.log('📋 Pending requests count:', data?.filter(r => r.status === 'pending' && new Date(r.requested_start_time) > new Date()).length || 0);
      
      // Force state update with a new array reference to ensure React detects the change
      const newRequests = data || [];
      setRequests([...newRequests]);
      console.log('✅ State updated with', newRequests.length, 'requests');
      console.log('✅ State update complete, component should re-render');
    } catch (err: any) {
      console.error('❌ Error in fetchRequests:', err);
      setError(err.message || 'Failed to load requests');
    } finally {
      fetchingRef.current = false;
      if (showLoading) {
        setLoading(false);
        console.log('✅ Loading state set to false');
      }
    }
  }, [currentUser]);

  /**
   * Create a new mentorship request (founders only)
   */
  const createRequest = useCallback(async (requestData: CreateRequestData) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate slot is still available
      const { data: slot, error: slotError } = await supabase
        .from('expert_availability_slots')
        .select('id, is_booked, expert_id')
        .eq('id', requestData.availability_slot_id)
        .single();

      if (slotError) throw slotError;
      if (!slot) throw new Error('Slot not found');
      if (slot.is_booked) throw new Error('This slot is no longer available');
      if (slot.expert_id !== requestData.expert_id) throw new Error('Slot does not belong to this expert');

      // Check for conflicts with existing pending requests
      const { data: existingRequests, error: conflictError } = await supabase
        .from('mentorship_requests')
        .select('id')
        .eq('availability_slot_id', requestData.availability_slot_id)
        .eq('status', 'pending')
        .limit(1);

      if (conflictError) throw conflictError;
      if (existingRequests && existingRequests.length > 0) {
        throw new Error('Someone else has already requested this slot');
      }

      // Create the request
      const { data, error: insertError } = await supabase
        .from('mentorship_requests')
        .insert({
          founder_id: user.id,
          expert_id: requestData.expert_id,
          topic: requestData.topic,
          custom_topic: requestData.custom_topic || null,
          message: requestData.message || null,
          duration_minutes: requestData.duration_minutes,
          availability_slot_id: requestData.availability_slot_id,
          requested_start_time: requestData.requested_start_time,
          requested_end_time: requestData.requested_end_time,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Refresh requests
      await fetchRequests();

      return data;
    } catch (err: any) {
      console.error('Error creating request:', err);
      setError(err.message || 'Failed to create request');
      throw err;
    }
  }, [fetchRequests]);

  /**
   * Accept a mentorship request (experts only)
   * This will create a Google Meet link and mark the slot as booked
   */
  const acceptRequest = useCallback(async (acceptData: AcceptRequestData) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('=== ACCEPT REQUEST FLOW STARTED ===');
      console.log('Request ID:', acceptData.request_id);
      console.log('User ID:', user.id);

      // Get request details with founder email
      const { data: request, error: fetchError } = await supabase
        .from('mentorship_requests')
        .select(`
          *,
          founder:profiles!mentorship_requests_founder_id_fkey(id, email, full_name)
        `)
        .eq('id', acceptData.request_id)
        .single();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }
      if (!request) throw new Error('Request not found');
      if (request.expert_id !== user.id) throw new Error('Unauthorized - This request is not for you');
      if (request.status !== 'pending') throw new Error('Request is not pending');

      console.log('✓ Request fetched successfully');
      console.log('Request details:', {
        id: request.id,
        topic: request.topic,
        founder_id: request.founder_id,
        founder_name: request.founder?.full_name,
        founder_email: request.founder?.email,
        start_time: request.requested_start_time,
        duration: request.duration_minutes,
        current_status: request.status,
      });

      if (!request.founder?.email) {
        throw new Error('Founder email not found. Cannot schedule meeting.');
      }

      // Create Google Meet link via edge function
      console.log('📅 Calling schedule-meeting edge function...');
      console.log('Meeting parameters:', {
        participantEmail: request.founder.email,
        title: `Mentorship: ${request.topic}`,
        scheduledAt: request.requested_start_time,
        duration: request.duration_minutes,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      const { data: scheduleData, error: scheduleError } = await supabase.functions.invoke('schedule-meeting', {
        body: {
          participantEmail: request.founder.email,
          title: `Mentorship: ${request.topic}`,
          description: request.message || `Mentorship session about ${request.topic}`,
          scheduledAt: request.requested_start_time,
          duration: request.duration_minutes,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      if (scheduleError) {
        console.error('❌ Schedule error:', scheduleError);
        throw new Error(`Failed to create Google Meet link: ${scheduleError.message || 'Make sure Google Calendar is connected in your profile settings.'}`);
      }

      if (!scheduleData?.meeting) {
        console.error('❌ No meeting data returned:', scheduleData);
        throw new Error('Failed to create meeting. No meeting data returned from server.');
      }

      console.log('✓ Meeting created successfully');
      console.log('Meeting details:', {
        id: scheduleData.meeting.id,
        google_meet_link: scheduleData.meeting.google_meet_link,
        google_calendar_event_id: scheduleData.meeting.google_calendar_event_id,
      });

      // Update request with meeting details and accept
      console.log('📝 Updating request status to accepted...');
      const updatePayload = {
        status: 'accepted',
        expert_response_message: acceptData.response_message || null,
        responded_at: new Date().toISOString(),
        meeting_id: scheduleData.meeting.id,
        google_meet_link: scheduleData.meeting.google_meet_link,
        google_calendar_event_id: scheduleData.meeting.google_calendar_event_id,
      };

      const { error: updateError } = await supabase
        .from('mentorship_requests')
        .update(updatePayload)
        .eq('id', acceptData.request_id);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }

      console.log('✓ Request updated to accepted status');
      console.log('🎉 ACCEPT REQUEST FLOW COMPLETED SUCCESSFULLY');
      console.log('Meeting link:', scheduleData.meeting.google_meet_link);

      // Refresh requests to update UI
      console.log('🔄 Refreshing requests to update UI...');
      await fetchRequests();
      console.log('✓ UI refreshed');
    } catch (err: any) {
      console.error('Error accepting request:', err);
      setError(err.message || 'Failed to accept request');
      throw err;
    }
  }, [fetchRequests]);

  /**
   * Reject a mentorship request (experts only)
   */
  const rejectRequest = useCallback(async (rejectData: RejectRequestData) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Verify ownership
      const { data: request, error: fetchError } = await supabase
        .from('mentorship_requests')
        .select('expert_id, status')
        .eq('id', rejectData.request_id)
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Request not found');
      if (request.expert_id !== user.id) throw new Error('Unauthorized');
      if (request.status !== 'pending') throw new Error('Request is not pending');

      // Update request status
      const { error: updateError } = await supabase
        .from('mentorship_requests')
        .update({
          status: 'rejected',
          expert_response_message: rejectData.response_message || null,
          responded_at: new Date().toISOString(),
        })
        .eq('id', rejectData.request_id);

      if (updateError) throw updateError;

      // Refresh requests
      await fetchRequests();
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setError(err.message || 'Failed to reject request');
      throw err;
    }
  }, [fetchRequests]);

  /**
   * Cancel a request (founders only)
   */
  const cancelRequest = useCallback(async (requestId: string) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Verify ownership
      const { data: request, error: fetchError } = await supabase
        .from('mentorship_requests')
        .select('founder_id, status')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Request not found');
      if (request.founder_id !== user.id) throw new Error('Unauthorized');
      if (request.status === 'completed') throw new Error('Cannot cancel completed session');

      // Update request status
      const { error: updateError } = await supabase
        .from('mentorship_requests')
        .update({
          status: 'cancelled',
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Refresh requests
      await fetchRequests();
    } catch (err: any) {
      console.error('Error cancelling request:', err);
      setError(err.message || 'Failed to cancel request');
      throw err;
    }
  }, [fetchRequests]);

  // Initial fetch
  useEffect(() => {
    if (currentUser) {
      console.log('🚀 Initial fetch triggered for user:', currentUser.id);
      fetchRequests();
    }
  }, [currentUser]);

  // Set up real-time subscription
  useEffect(() => {
    if (!currentUser) {
      console.log('⏸️ No current user - skipping real-time subscription');
      return;
    }

    console.log('📡 Setting up real-time subscription for mentorship requests, user:', currentUser.id);

    const channel = supabase
      .channel(`mentorship_requests_${currentUser.id}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentorship_requests',
          filter: `founder_id=eq.${currentUser.id}`,
        },
        (payload) => {
          console.log('🔔 Real-time update (as founder):', payload.eventType, payload.new);
          console.log('📥 Payload details:', JSON.stringify(payload, null, 2));
          // Use setTimeout to ensure we're not in the middle of a render
          setTimeout(() => {
            fetchRequests(false);
          }, 100);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentorship_requests',
          filter: `expert_id=eq.${currentUser.id}`,
        },
        (payload) => {
          console.log('🔔 Real-time update (as expert):', payload.eventType, payload.new);
          console.log('📥 Payload details:', JSON.stringify(payload, null, 2));
          // Use setTimeout to ensure we're not in the middle of a render
          setTimeout(() => {
            fetchRequests(false);
          }, 100);
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error('❌ Subscription error:', err);
        } else {
          console.log('📡 Mentorship requests subscription status:', status);
        }
      });

    return () => {
      console.log('🔴 Cleaning up mentorship requests subscription');
      channel.unsubscribe();
    };
  }, [currentUser, fetchRequests]);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    // Filtered lists
    pendingRequests: requests.filter(r => 
      r.status === 'pending' && 
      new Date(r.requested_start_time) > new Date()
    ),
    acceptedRequests: requests.filter(r => r.status === 'accepted'),
    upcomingSessions: requests.filter(r => 
      r.status === 'accepted' && 
      new Date(r.requested_start_time) > new Date()
    ),
    pastSessions: requests.filter(r => {
      // Include completed sessions (always)
      if (r.status === 'completed') {
        return true;
      }
      // Include accepted sessions that are in the past
      if (r.status === 'accepted') {
        return new Date(r.requested_start_time) <= new Date();
      }
      return false;
    }),
  };
}


import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface AvailabilitySlot {
  id: string;
  expert_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  booked_by_request_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSlotData {
  start_time: string;
  end_time: string;
  notes?: string;
}

/**
 * Hook for managing expert availability slots
 */
export function useMentorshipAvailability(expertId?: string) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch available slots for an expert
   * If onlyAvailable is true, only fetch unbooked slots
   */
  const fetchSlots = useCallback(async (onlyAvailable = false) => {
    if (!expertId) {
      setSlots([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch slots
      let query = supabase
        .from('expert_availability_slots')
        .select('*')
        .eq('expert_id', expertId)
        .gte('start_time', new Date().toISOString()) // Only future slots
        .order('start_time', { ascending: true });

      if (onlyAvailable) {
        query = query.eq('is_booked', false);
      }

      const { data: slotsData, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // If filtering for available slots, also check for pending requests
      if (onlyAvailable && slotsData && slotsData.length > 0) {
        const slotIds = slotsData.map(s => s.id);
        
        // Get slots that have pending requests
        const { data: pendingRequests } = await supabase
          .from('mentorship_requests')
          .select('availability_slot_id')
          .in('availability_slot_id', slotIds)
          .eq('status', 'pending');

        const slotsWithPendingRequests = new Set(
          (pendingRequests || []).map(r => r.availability_slot_id)
        );

        // Filter out slots with pending requests
        const trulyAvailableSlots = slotsData.filter(
          slot => !slotsWithPendingRequests.has(slot.id)
        );

        setSlots(trulyAvailableSlots);
      } else {
        setSlots(slotsData || []);
      }
    } catch (err: any) {
      console.error('Error fetching availability slots:', err);
      setError(err.message || 'Failed to load availability slots');
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  /**
   * Create a new availability slot (experts only)
   */
  const createSlot = useCallback(async (slotData: CreateSlotData) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate times
      const startTime = new Date(slotData.start_time);
      const endTime = new Date(slotData.end_time);

      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }

      if (startTime < new Date()) {
        throw new Error('Cannot create slots in the past');
      }

      // Check for overlapping slots
      const { data: overlapping, error: overlapError } = await supabase
        .from('expert_availability_slots')
        .select('id')
        .eq('expert_id', user.id)
        .or(`and(start_time.lte.${endTime.toISOString()},end_time.gte.${startTime.toISOString()})`)
        .limit(1);

      if (overlapError) throw overlapError;

      if (overlapping && overlapping.length > 0) {
        throw new Error('This slot overlaps with an existing slot');
      }

      const { data, error: insertError } = await supabase
        .from('expert_availability_slots')
        .insert({
          expert_id: user.id,
          start_time: slotData.start_time,
          end_time: slotData.end_time,
          notes: slotData.notes || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Refresh slots
      await fetchSlots();

      return data;
    } catch (err: any) {
      console.error('Error creating slot:', err);
      setError(err.message || 'Failed to create slot');
      throw err;
    }
  }, [fetchSlots]);

  /**
   * Delete an availability slot (if not booked)
   */
  const deleteSlot = useCallback(async (slotId: string) => {
    try {
      setError(null);

      // Check if slot is booked
      const { data: slot, error: fetchError } = await supabase
        .from('expert_availability_slots')
        .select('is_booked')
        .eq('id', slotId)
        .single();

      if (fetchError) throw fetchError;

      if (slot.is_booked) {
        throw new Error('Cannot delete a booked slot');
      }

      const { error: deleteError } = await supabase
        .from('expert_availability_slots')
        .delete()
        .eq('id', slotId);

      if (deleteError) throw deleteError;

      // Refresh slots
      await fetchSlots();
    } catch (err: any) {
      console.error('Error deleting slot:', err);
      setError(err.message || 'Failed to delete slot');
      throw err;
    }
  }, [fetchSlots]);

  /**
   * Get available dates (dates that have at least one available slot)
   */
  const getAvailableDates = useCallback(() => {
    const dates = new Set<string>();
    slots
      .filter(slot => !slot.is_booked)
      .forEach(slot => {
        const date = new Date(slot.start_time).toISOString().split('T')[0];
        dates.add(date);
      });
    return Array.from(dates).sort();
  }, [slots]);

  /**
   * Get available time slots for a specific date
   */
  const getAvailableTimesForDate = useCallback((date: string) => {
    return slots
      .filter(slot => {
        const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
        return slotDate === date && !slot.is_booked;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [slots]);

  // Initial fetch - by default fetch only available slots for founders
  useEffect(() => {
    fetchSlots(true); // Only fetch available slots by default
  }, [fetchSlots]);

  // Set up real-time subscription for slot changes and request changes
  useEffect(() => {
    if (!expertId) return;

    const channel = supabase
      .channel(`availability_slots:${expertId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expert_availability_slots',
          filter: `expert_id=eq.${expertId}`,
        },
        () => {
          // Refresh slots on any change - fetch available slots
          fetchSlots(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentorship_requests',
          filter: `expert_id=eq.${expertId}`,
        },
        () => {
          // Refresh when requests change (affects slot availability)
          fetchSlots(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [expertId, fetchSlots]);

  return {
    slots,
    loading,
    error,
    fetchSlots,
    createSlot,
    deleteSlot,
    getAvailableDates,
    getAvailableTimesForDate,
    availableSlots: slots.filter(s => !s.is_booked),
  };
}


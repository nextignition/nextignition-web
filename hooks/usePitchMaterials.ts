import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from 'react-native';

export interface PitchMaterial {
  id: string;
  owner_profile_id: string;
  type: 'deck' | 'video';
  filename: string | null;
  storage_path: string | null;
  url: string | null;
  pages: number | null;
  duration_seconds: number | null;
  visibility: 'public' | 'private';
  reviewed: boolean;
  created_at: string;
  updated_at: string;
}

export function usePitchMaterials() {
  const { user } = useAuth();
  const [pitchMaterials, setPitchMaterials] = useState<PitchMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPitchMaterials = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setPitchMaterials([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('pitch_materials')
        .select('*')
        .eq('owner_profile_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Refresh signed URLs for all materials (in case they expired)
      const materialsWithFreshUrls = await Promise.all(
        (data || []).map(async (material) => {
          if (material.storage_path) {
            try {
              const { data: urlData } = await supabase.storage
                .from('pitch-materials')
                .createSignedUrl(material.storage_path, 157680000); // 5 years
              
              if (urlData?.signedUrl) {
                // Update the URL in database if it changed
                if (urlData.signedUrl !== material.url) {
                  await supabase
                    .from('pitch_materials')
                    .update({ url: urlData.signedUrl })
                    .eq('id', material.id);
                }
                return { ...material, url: urlData.signedUrl };
              }
            } catch (err) {
              console.error('Error refreshing signed URL:', err);
            }
          }
          return material;
        })
      );
      
      setPitchMaterials(materialsWithFreshUrls);
    } catch (err: any) {
      console.error('Error fetching pitch materials:', err);
      setError(err.message);
      setPitchMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Only fetch on mount or when user.id changes
  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (isActive) {
        await fetchPitchMaterials();
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [user?.id]); // Only depend on user.id, not the function

  const uploadPitchMaterial = async (
    type: 'deck' | 'video',
    file: File | Blob | string,
    filename: string,
    visibility: 'public' | 'private' = 'private'
  ) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const storagePath = `${user.id}/${type}s/${Date.now()}_${filename}`;
      
      let uploadData;
      let uploadError;

      // Handle different file types based on platform
      if (typeof file === 'string') {
        // File URI from React Native (mobile) or data URL (web)
        if (Platform.OS === 'web') {
          // On web, fetch and convert to blob
          const response = await fetch(file);
          const blob = await response.blob();
          const result = await supabase.storage
            .from('pitch-materials')
            .upload(storagePath, blob);
          uploadData = result.data;
          uploadError = result.error;
        } else {
          // On React Native mobile - use fetch to get ArrayBuffer
          // This works natively with content:// URIs on Android and file:// URIs on iOS
          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          
          const result = await supabase.storage
            .from('pitch-materials')
            .upload(storagePath, arrayBuffer, {
              contentType: type === 'video' ? 'video/mp4' : 'application/pdf',
            });
          uploadData = result.data;
          uploadError = result.error;
        }
      } else {
        // File or Blob object (web only)
        const result = await supabase.storage
          .from('pitch-materials')
          .upload(storagePath, file);
        uploadData = result.data;
        uploadError = result.error;
      }

      if (uploadError) throw uploadError;

      // Get signed URL (valid for 5 years)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('pitch-materials')
        .createSignedUrl(storagePath, 157680000); // 5 years in seconds

      if (urlError) throw urlError;

      // Create pitch_materials record
      const { data: materialData, error: insertError } = await supabase
        .from('pitch_materials')
        .insert({
          owner_profile_id: user.id,
          type,
          filename,
          storage_path: storagePath,
          url: urlData.signedUrl,
          visibility,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Update startup_profiles table with the new pitch material URL
      if (type === 'deck') {
        await supabase
          .from('startup_profiles')
          .update({
            pitch_deck_url: urlData.signedUrl,
            pitch_deck_uploaded_at: new Date().toISOString(),
          })
          .eq('owner_id', user.id);
      } else if (type === 'video') {
        await supabase
          .from('startup_profiles')
          .update({
            pitch_video_url: urlData.signedUrl,
            pitch_video_uploaded_at: new Date().toISOString(),
          })
          .eq('owner_id', user.id);
      }

      await fetchPitchMaterials();
      return { success: true, data: materialData };
    } catch (err: any) {
      console.error('Error uploading pitch material:', err);
      return { success: false, error: err.message };
    }
  };

  const deletePitchMaterial = async (materialId: string, storagePath: string | null) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('[deletePitchMaterial] Starting deletion:', { materialId, storagePath, userId: user.id });
      
      // First, fetch the material from database to ensure we have the correct data
      const { data: materialData, error: fetchError } = await supabase
        .from('pitch_materials')
        .select('id, type, storage_path, url, owner_profile_id')
        .eq('id', materialId)
        .single(); // Don't filter by owner here - we'll check it manually

      if (fetchError || !materialData) {
        console.error('[deletePitchMaterial] Material not found:', fetchError);
        return { success: false, error: fetchError?.message || 'Material not found' };
      }

      // Verify ownership
      if (materialData.owner_profile_id !== user.id) {
        console.error('[deletePitchMaterial] Ownership mismatch:', {
          materialOwner: materialData.owner_profile_id,
          currentUser: user.id
        });
        return { success: false, error: 'You do not have permission to delete this material' };
      }

      const materialToDelete = materialData;
      const actualStoragePath = storagePath || materialToDelete.storage_path;
      
      console.log('[deletePitchMaterial] Material found and ownership verified:', { 
        type: materialToDelete.type, 
        storagePath: actualStoragePath,
        materialId: materialToDelete.id
      });

      // IMPORTANT: Update funding_requests FIRST to remove foreign key references
      // This must happen BEFORE deleting the material to avoid foreign key constraint violation
      console.log('[deletePitchMaterial] Updating funding_requests to remove references...');
      const { error: fundingUpdateError, data: fundingUpdateData } = await supabase
        .from('funding_requests')
        .update({ 
          pitch_material_id: null,
          pitch_video_id: null 
        })
        .or(`pitch_material_id.eq.${materialId},pitch_video_id.eq.${materialId}`)
        .select();

      if (fundingUpdateError) {
        console.error('[deletePitchMaterial] Error updating funding_requests:', fundingUpdateError);
        return { success: false, error: `Failed to update funding requests: ${fundingUpdateError.message}` };
      } else {
        console.log('[deletePitchMaterial] Funding requests updated:', { count: fundingUpdateData?.length || 0 });
      }

      // Now delete from database (foreign key references are cleared)
      // RLS policy will ensure only owner can delete
      console.log('[deletePitchMaterial] Deleting from database:', { materialId, userId: user.id });
      const { error: deleteError, data: deleteResult } = await supabase
        .from('pitch_materials')
        .delete()
        .eq('id', materialId)
        .select();

      if (deleteError) {
        console.error('[deletePitchMaterial] Database deletion error:', deleteError);
        return { success: false, error: deleteError.message || 'Failed to delete material from database' };
      }

      // Check if deletion was successful
      if (!deleteResult || deleteResult.length === 0) {
        console.error('[deletePitchMaterial] No rows deleted - RLS may be blocking');
        // Check if material still exists
        const { data: checkData } = await supabase
          .from('pitch_materials')
          .select('id')
          .eq('id', materialId)
          .maybeSingle();
        
        if (checkData) {
          console.error('[deletePitchMaterial] Material still exists after delete attempt');
          return { success: false, error: 'Material could not be deleted. Row-level security may be blocking the operation.' };
        } else {
          // Material doesn't exist - deletion succeeded
          console.log('[deletePitchMaterial] Material deleted (verified by absence)');
        }
      } else {
        console.log('[deletePitchMaterial] Database record deleted successfully:', deleteResult);
      }

      // Update UI optimistically (remove from local state)
      setPitchMaterials(prev => prev.filter(m => m.id !== materialId));
      
      // Delete from storage if path exists (non-blocking)
      if (actualStoragePath) {
        console.log('[deletePitchMaterial] Deleting from storage:', actualStoragePath);
        const { error: storageError } = await supabase.storage
          .from('pitch-materials')
          .remove([actualStoragePath]);
        
        if (storageError) {
          console.error('[deletePitchMaterial] Storage deletion error (non-fatal):', storageError);
          // Don't fail - database deletion already succeeded
        } else {
          console.log('[deletePitchMaterial] Storage file deleted successfully');
        }
      }

      // Update startup_profiles to remove the URL if this was the latest material
      // Get remaining materials of the same type
      const { data: remainingMaterials } = await supabase
        .from('pitch_materials')
        .select('url, created_at')
        .eq('owner_profile_id', user.id)
        .eq('type', materialToDelete.type)
        .order('created_at', { ascending: false })
        .limit(1);

      const latestMaterial = remainingMaterials && remainingMaterials.length > 0 ? remainingMaterials[0] : null;
      
      if (materialToDelete.type === 'deck') {
        await supabase
          .from('startup_profiles')
          .update({
            pitch_deck_url: latestMaterial?.url || null,
            pitch_deck_uploaded_at: latestMaterial?.created_at || null,
          })
          .eq('owner_id', user.id);
        console.log('[deletePitchMaterial] Updated startup_profiles pitch_deck_url');
      } else if (materialToDelete.type === 'video') {
        await supabase
          .from('startup_profiles')
          .update({
            pitch_video_url: latestMaterial?.url || null,
            pitch_video_uploaded_at: latestMaterial?.created_at || null,
          })
          .eq('owner_id', user.id);
        console.log('[deletePitchMaterial] Updated startup_profiles pitch_video_url');
      }

      // Fetch fresh data to ensure consistency
      await fetchPitchMaterials();
      console.log('[deletePitchMaterial] Deletion completed successfully');
      return { success: true };
    } catch (err: any) {
      console.error('[deletePitchMaterial] Error deleting pitch material:', err);
      // Revert optimistic update on error
      await fetchPitchMaterials();
      return { success: false, error: err.message || 'Failed to delete material' };
    }
  };

  const updateVisibility = async (materialId: string, visibility: 'public' | 'private') => {
    try {
      const { error: updateError } = await supabase
        .from('pitch_materials')
        .update({ visibility })
        .eq('id', materialId);

      if (updateError) throw updateError;

      await fetchPitchMaterials();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating visibility:', err);
      return { success: false, error: err.message };
    }
  };

  const pitchDecks = pitchMaterials.filter(m => m.type === 'deck');
  const pitchVideos = pitchMaterials.filter(m => m.type === 'video');

  return {
    pitchMaterials,
    pitchDecks,
    pitchVideos,
    loading,
    error,
    uploadPitchMaterial,
    deletePitchMaterial,
    updateVisibility,
    refresh: fetchPitchMaterials,
  };
}

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface StartupDetail {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  industry: string | null;
  stage: string | null;
  website: string | null;
  is_public: boolean;
  pitch_deck_url: string | null;
  pitch_deck_uploaded_at: string | null;
  pitch_video_url: string | null;
  pitch_video_uploaded_at: string | null;
  created_at: string;
  updated_at: string;
  // Profile data from joined profiles table
  founder_name: string | null;
  founder_email: string | null;
  location: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  bio: string | null;
  venture_name: string | null;
  venture_description: string | null;
  venture_industry: string | null;
  venture_stage: string | null;
}

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

export interface FounderProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  location: string | null;
  bio: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  venture_name: string | null;
  venture_description: string | null;
  venture_industry: string | null;
  venture_stage: string | null;
}

export function useStartupDetail(startupId?: string, ownerId?: string) {
  const [startup, setStartup] = useState<StartupDetail | null>(null);
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
  const [pitchDecks, setPitchDecks] = useState<PitchMaterial[]>([]);
  const [pitchVideos, setPitchVideos] = useState<PitchMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startupId) {
      fetchStartupDetail(startupId);
    } else if (ownerId) {
      fetchStartupByOwner(ownerId);
    } else {
      // If no ID provided, try to fetch current user's startup
      fetchCurrentUserStartup();
    }
  }, [startupId, ownerId]);

  const fetchCurrentUserStartup = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching current user startup');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Failed to get authenticated user: ' + userError.message);
      }

      if (!user) {
        throw new Error('No authenticated user found. Please log in.');
      }

      console.log('Current user ID:', user.id);

      // Fetch startup for current user
      const { data: startupData, error: startupError } = await supabase
        .from('startup_profiles')
        .select(`
          *,
          profiles:owner_id (
            full_name,
            email,
            location,
            linkedin_url,
            twitter_url,
            bio,
            venture_name,
            venture_description,
            venture_industry,
            venture_stage
          )
        `)
        .eq('owner_id', user.id)
        .maybeSingle();

      if (startupError) {
        console.error('Startup fetch error:', startupError);
        throw new Error('Database error: ' + startupError.message);
      }

      if (!startupData) {
        console.log('No startup profile found for current user');
        throw new Error('No startup profile found. Please create one from your profile page.');
      }

      console.log('Current user startup data fetched:', startupData);

      const profile = Array.isArray(startupData.profiles) 
        ? startupData.profiles[0] 
        : startupData.profiles;

      setStartup({
        id: startupData.id,
        owner_id: startupData.owner_id,
        name: startupData.name,
        description: startupData.description,
        industry: startupData.industry,
        stage: startupData.stage,
        website: startupData.website,
        is_public: startupData.is_public ?? true,
        pitch_deck_url: startupData.pitch_deck_url,
        pitch_deck_uploaded_at: startupData.pitch_deck_uploaded_at,
        pitch_video_url: startupData.pitch_video_url,
        pitch_video_uploaded_at: startupData.pitch_video_uploaded_at,
        created_at: startupData.created_at,
        updated_at: startupData.updated_at,
        founder_name: profile?.full_name || null,
        founder_email: profile?.email || null,
        location: profile?.location || null,
        linkedin_url: profile?.linkedin_url || null,
        twitter_url: profile?.twitter_url || null,
        bio: profile?.bio || null,
        venture_name: profile?.venture_name || null,
        venture_description: profile?.venture_description || null,
        venture_industry: profile?.venture_industry || null,
        venture_stage: profile?.venture_stage || null,
      });

      // Fetch pitch materials for this startup owner
      await fetchPitchMaterials(startupData.owner_id);
    } catch (err: any) {
      console.error('Error fetching current user startup:', err);
      setError(err.message || 'Failed to load startup details');
      setStartup(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStartupDetail = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching startup with ID:', id);

      // Fetch startup profile with founder details
      const { data: startupData, error: startupError } = await supabase
        .from('startup_profiles')
        .select(`
          *,
          profiles:owner_id (
            full_name,
            email,
            location,
            linkedin_url,
            twitter_url,
            bio,
            venture_name,
            venture_description,
            venture_industry,
            venture_stage
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (startupError) {
        console.error('Startup fetch error:', startupError);
        throw new Error('Database error: ' + startupError.message);
      }

      if (!startupData) {
        throw new Error('Startup not found with ID: ' + id);
      }

      console.log('Startup data fetched:', startupData);

      const profile = Array.isArray(startupData.profiles) 
        ? startupData.profiles[0] 
        : startupData.profiles;

      setStartup({
        id: startupData.id,
        owner_id: startupData.owner_id,
        name: startupData.name,
        description: startupData.description,
        industry: startupData.industry,
        stage: startupData.stage,
        website: startupData.website,
        is_public: startupData.is_public ?? true,
        pitch_deck_url: startupData.pitch_deck_url,
        pitch_deck_uploaded_at: startupData.pitch_deck_uploaded_at,
        pitch_video_url: startupData.pitch_video_url,
        pitch_video_uploaded_at: startupData.pitch_video_uploaded_at,
        created_at: startupData.created_at,
        updated_at: startupData.updated_at,
        founder_name: profile?.full_name || null,
        founder_email: profile?.email || null,
        location: profile?.location || null,
        linkedin_url: profile?.linkedin_url || null,
        twitter_url: profile?.twitter_url || null,
        bio: profile?.bio || null,
        venture_name: profile?.venture_name || null,
        venture_description: profile?.venture_description || null,
        venture_industry: profile?.venture_industry || null,
        venture_stage: profile?.venture_stage || null,
      });

      // Fetch pitch materials for this startup owner
      await fetchPitchMaterials(startupData.owner_id);
    } catch (err: any) {
      console.error('Error fetching startup detail:', err);
      setError(err.message || 'Failed to load startup details');
      setStartup(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStartupByOwner = async (ownerProfileId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching startup by owner ID:', ownerProfileId);

      // First, always fetch the founder's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, location, bio, linkedin_url, twitter_url, website_url, venture_name, venture_description, venture_industry, venture_stage')
        .eq('id', ownerProfileId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to load founder profile');
      }

      if (!profileData) {
        throw new Error('Founder profile not found');
      }

      setFounderProfile({
        id: profileData.id,
        full_name: profileData.full_name,
        email: profileData.email,
        location: profileData.location,
        bio: profileData.bio,
        linkedin_url: profileData.linkedin_url,
        twitter_url: profileData.twitter_url,
        website_url: profileData.website_url,
        venture_name: profileData.venture_name,
        venture_description: profileData.venture_description,
        venture_industry: profileData.venture_industry,
        venture_stage: profileData.venture_stage,
      });

      // Then try to fetch their startup profile
      const { data: startupData, error: startupError } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('owner_id', ownerProfileId)
        .maybeSingle();

      if (startupError) {
        console.error('Startup fetch error:', startupError);
      }

      // If they have a startup profile, use it
      if (startupData) {
        console.log('Startup data fetched by owner:', startupData);

        setStartup({
          id: startupData.id,
          owner_id: startupData.owner_id,
          name: startupData.name,
          description: startupData.description,
          industry: startupData.industry,
          stage: startupData.stage,
          website: startupData.website,
          is_public: startupData.is_public ?? true,
          pitch_deck_url: startupData.pitch_deck_url,
          pitch_deck_uploaded_at: startupData.pitch_deck_uploaded_at,
          pitch_video_url: startupData.pitch_video_url,
          pitch_video_uploaded_at: startupData.pitch_video_uploaded_at,
          created_at: startupData.created_at,
          updated_at: startupData.updated_at,
          founder_name: profileData.full_name,
          founder_email: profileData.email,
          location: profileData.location,
          linkedin_url: profileData.linkedin_url,
          twitter_url: profileData.twitter_url,
          bio: profileData.bio,
          venture_name: profileData.venture_name,
          venture_description: profileData.venture_description,
          venture_industry: profileData.venture_industry,
          venture_stage: profileData.venture_stage,
        });

        // Fetch pitch materials for this startup owner
        await fetchPitchMaterials(startupData.owner_id);
      } else {
        // If no startup profile, create a virtual one from profile venture data
        console.log('No startup profile found, creating virtual startup from profile data');
        
        setStartup({
          id: `virtual-${ownerProfileId}`,
          owner_id: ownerProfileId,
          name: profileData.venture_name || profileData.full_name || 'Unnamed Venture',
          description: profileData.venture_description || profileData.bio,
          industry: profileData.venture_industry,
          stage: profileData.venture_stage,
          website: profileData.website_url,
          is_public: true,
          pitch_deck_url: null,
          pitch_deck_uploaded_at: null,
          pitch_video_url: null,
          pitch_video_uploaded_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          founder_name: profileData.full_name,
          founder_email: profileData.email,
          location: profileData.location,
          linkedin_url: profileData.linkedin_url,
          twitter_url: profileData.twitter_url,
          bio: profileData.bio,
          venture_name: profileData.venture_name,
          venture_description: profileData.venture_description,
          venture_industry: profileData.venture_industry,
          venture_stage: profileData.venture_stage,
        });

        // Try to fetch pitch materials anyway (in case they uploaded some)
        await fetchPitchMaterials(ownerProfileId);
      }
    } catch (err: any) {
      console.error('Error fetching startup by owner:', err);
      setError(err.message || 'Failed to load startup details');
      setStartup(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPitchMaterials = async (ownerId: string) => {
    try {
      console.log('Fetching pitch materials for owner:', ownerId);

      const { data, error } = await supabase
        .from('pitch_materials')
        .select('*')
        .eq('owner_profile_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Pitch materials fetch error:', error);
        throw error;
      }

      console.log('Pitch materials fetched:', data);

      if (data) {
        // Refresh signed URLs for all materials
        const materialsWithFreshUrls = await Promise.all(
          data.map(async (material) => {
            if (material.storage_path) {
              try {
                const { data: urlData } = await supabase.storage
                  .from('pitch-materials')
                  .createSignedUrl(material.storage_path, 157680000); // 5 years
                
                if (urlData?.signedUrl) {
                  return { ...material, url: urlData.signedUrl };
                }
              } catch (err) {
                console.error('Error refreshing signed URL:', err);
              }
            }
            return material;
          })
        );
        
        const decks = materialsWithFreshUrls.filter(item => item.type === 'deck');
        const videos = materialsWithFreshUrls.filter(item => item.type === 'video');
        
        setPitchDecks(decks);
        setPitchVideos(videos);
      }
    } catch (err: any) {
      console.error('Error fetching pitch materials:', err);
      // Don't throw error, just log it - pitch materials are optional
    }
  };

  const refresh = () => {
    if (startupId) {
      fetchStartupDetail(startupId);
    } else if (ownerId) {
      fetchStartupByOwner(ownerId);
    } else {
      fetchCurrentUserStartup();
    }
  };

  return {
    startup,
    founderProfile,
    pitchDecks,
    pitchVideos,
    loading,
    error,
    refresh,
  };
}

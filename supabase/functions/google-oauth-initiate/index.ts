import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    console.log('=== Google OAuth Initiate Function Started ===')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from auth header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Unauthorized')
    }

    console.log('User authenticated:', user.email)

    const { redirect_uri } = await req.json()
    
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
    
    if (!GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_OAUTH_CLIENT_ID is not set in Supabase environment variables')
      throw new Error('Google OAuth client ID not configured. Please set GOOGLE_OAUTH_CLIENT_ID in Supabase Edge Function secrets.')
    }

    // Use provided redirect_uri - it MUST match exactly what's configured in Google Cloud Console
    // Do NOT use fallback - the frontend should provide the correct redirect URI
    if (!redirect_uri) {
      throw new Error('redirect_uri is required. Please ensure the frontend provides the correct redirect URI.')
    }
    
    const REDIRECT_URI = redirect_uri
    
    console.log('=== Redirect URI Configuration ===')
    console.log('Received redirect_uri:', redirect_uri)
    console.log('Using redirect URI:', REDIRECT_URI)
    console.log('⚠️  CRITICAL: This redirect URI must EXACTLY match what is configured in Google Cloud Console')
    console.log('⚠️  Check Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs')
    console.log('⚠️  The URI must match EXACTLY including:')
    console.log('   - Protocol (http:// or https://)')
    console.log('   - Domain (localhost or your domain)')
    console.log('   - Port (if specified, e.g., :8081 or :3000)')
    console.log('   - Path (/google-callback)')
    console.log('   - NO trailing slash')

    const SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' ')

    // Generate OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `access_type=offline&` +
      `prompt=consent`

    console.log('=== OAuth URL Generated ===')
    console.log('OAuth URL (first 200 chars):', authUrl.substring(0, 200) + '...')
    console.log('Redirect URI in URL:', REDIRECT_URI)
    console.log('Encoded redirect URI:', encodeURIComponent(REDIRECT_URI))
    console.log('')
    console.log('⚠️  USER ACTION REQUIRED:')
    console.log('   Add this EXACT redirect URI to Google Cloud Console:')
    console.log('   ', REDIRECT_URI)
    console.log('   Go to: https://console.cloud.google.com/apis/credentials')

    return new Response(
      JSON.stringify({
        success: true,
        authUrl,
        redirectUri: REDIRECT_URI,
        // Include helpful debug info for frontend
        debug: {
          redirectUri: REDIRECT_URI,
          clientIdConfigured: !!GOOGLE_CLIENT_ID,
          instructions: `Add this exact URI to Google Cloud Console: ${REDIRECT_URI}`,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('=== Error in OAuth initiate ===')
    console.error('Error:', error.message)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to initiate OAuth flow',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})


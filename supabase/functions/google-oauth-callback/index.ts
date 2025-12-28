import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests FIRST before any other processing
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    console.log('=== Google OAuth Callback Function Started ===')
    
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

    const { code, redirect_uri } = await req.json()
    console.log('OAuth code received:', !!code)
    console.log('Redirect URI from request:', redirect_uri)

    if (!code) {
      throw new Error('OAuth code is required')
    }

    if (!redirect_uri) {
      throw new Error('redirect_uri is required and must match the one used in the OAuth request')
    }

    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')
    
    // Use the EXACT redirect_uri from request - it must match what was sent to Google
    const REDIRECT_URI = redirect_uri
    
    console.log('Using redirect URI for token exchange:', REDIRECT_URI)

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured')
    }

    console.log('Exchanging code for tokens...')

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error('Token exchange error:', error)
      throw new Error(`Failed to exchange code for tokens: ${error}`)
    }

    const tokens = await tokenResponse.json()
    console.log('Tokens received successfully')

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid token response from Google')
    }

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000))

    // Save tokens to database (upsert to handle reconnections)
    const { data: savedToken, error: saveError } = await supabaseClient
      .from('user_google_tokens')
      .upsert({
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type || 'Bearer',
        expires_at: expiresAt.toISOString(),
        scope: tokens.scope,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving tokens:', saveError)
      throw saveError
    }

    console.log('Tokens saved to database successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Google Calendar connected successfully',
        expiresAt: expiresAt.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('=== Error in OAuth callback ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

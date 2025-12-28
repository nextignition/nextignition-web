import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Schedule Meeting Function Started ===')
    
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

    const { meetingData } = await req.json()
    console.log('Meeting data received:', meetingData)

    // 1. Check if user has Google OAuth tokens
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Google Calendar not connected. Please connect your Google account first.')
    }

    // 2. Check if token is expired and refresh if needed
    let accessToken = tokenData.access_token
    const expiresAt = new Date(tokenData.expires_at)
    const now = new Date()
    const buffer = 5 * 60 * 1000 // 5 minutes buffer

    if (expiresAt.getTime() - now.getTime() < buffer) {
      console.log('Token expired or expiring soon, refreshing...')
      
      // Refresh token
      const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
      const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')

      if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        throw new Error('Google OAuth credentials not configured')
      }

      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: tokenData.refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      if (!refreshResponse.ok) {
        const error = await refreshResponse.text()
        console.error('Token refresh error:', error)
        throw new Error(`Failed to refresh token: ${error}`)
      }

      const newTokens = await refreshResponse.json()
      accessToken = newTokens.access_token
      const newExpiresAt = new Date(Date.now() + (newTokens.expires_in * 1000))

      // Update token in database
      await supabaseClient
        .from('user_google_tokens')
        .update({
          access_token: accessToken,
          expires_at: newExpiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      console.log('Token refreshed successfully')
    }

    // 3. Create Google Calendar Event with Google Meet link
    console.log('Creating Google Calendar event with Google Meet...')
    const googleCalendarEvent = await createGoogleMeetEvent(meetingData, user.email, accessToken, tokenData.id)
    console.log('Calendar event created:', googleCalendarEvent.id)
    
    // Extract Google Meet link
    const meetLink = googleCalendarEvent.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === 'video'
    )?.uri || googleCalendarEvent.hangoutLink

    if (!meetLink) {
      throw new Error('Failed to create Google Meet link')
    }

    console.log('Google Meet link generated:', meetLink)

    // 4. Try to find participant_id by email (if participant is a registered user)
    let participantId: string | null = null
    try {
      const { data: participantProfile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('email', meetingData.participantEmail)
        .maybeSingle()
      
      if (participantProfile) {
        participantId = participantProfile.id
        console.log('Found participant by email:', participantId)
      }
    } catch (err) {
      console.log('Could not find participant by email, will use email only:', err)
    }

    // 5. Save meeting to database
    const { data: meeting, error: dbError } = await supabaseClient
      .from('meetings')
      .insert({
        organizer_id: user.id,
        participant_id: participantId,
        participant_email: meetingData.participantEmail,
        title: meetingData.title,
        description: meetingData.description,
        meeting_type: 'video',
        scheduled_at: meetingData.scheduledAt,
        duration_minutes: meetingData.duration,
        timezone: meetingData.timezone || 'UTC',
        google_calendar_event_id: googleCalendarEvent.id,
        google_meet_link: meetLink,
        meeting_url: meetLink,
        meeting_platform: 'google-meet',
        google_token_id: tokenData.id,
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Note: Google Calendar automatically sends email invites to attendees
    // No need to send separate email
    const emailSent = true // Google handles this

    return new Response(
      JSON.stringify({
        success: true,
        meeting,
        calendarEventId: googleCalendarEvent.id,
        meetLink: meetLink,
        emailSent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('=== Error scheduling meeting ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    // Return detailed error for debugging
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        errorName: error.constructor.name,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Create Google Calendar Event with Google Meet link using user OAuth token
async function createGoogleMeetEvent(meetingData: any, organizerEmail: string, accessToken: string, tokenId: string) {
  console.log('=== Creating Google Calendar Event with Google Meet ===')

  // Calculate end time
  const startTime = new Date(meetingData.scheduledAt)
  const endTime = new Date(startTime.getTime() + meetingData.duration * 60000)

  // Create calendar event WITH conferenceData for Google Meet
  const event: any = {
    summary: meetingData.title,
    description: meetingData.description || '',
    start: {
      dateTime: startTime.toISOString(),
      timeZone: meetingData.timezone || 'UTC',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: meetingData.timezone || 'UTC',
    },
    attendees: [
      { email: meetingData.participantEmail }
    ],
    conferenceData: {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 },
        { method: 'email', minutes: 24 * 60 } // 24 hours before
      ]
    }
  }

  console.log('Event object:', JSON.stringify(event, null, 2))

  // Create the event with conferenceDataVersion=1 to get Meet link
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1`

  const response = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  console.log('Google Calendar API response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    console.error('Google Calendar API error:', error)
    throw new Error(`Google Calendar API error: ${error}`)
  }

  const calendarEvent = await response.json()
  console.log('Calendar event created successfully:', calendarEvent.id)
  console.log('Conference data:', JSON.stringify(calendarEvent.conferenceData, null, 2))
  
  return calendarEvent
}

// Legacy function - no longer used, but kept for reference
// Create JWT for Google Service Account
async function createJWT(email: string, privateKey: string) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  // Base64 URL encode function
  function base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const headerBase64 = base64UrlEncode(JSON.stringify(header))
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload))
  const unsignedToken = `${headerBase64}.${payloadBase64}`

  // Import private key
  const keyData = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '')

  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  )

  // Sign the token
  const encoder = new TextEncoder()
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(unsignedToken)
  )

  const signatureArray = new Uint8Array(signature)
  const signatureBase64 = base64UrlEncode(
    String.fromCharCode.apply(null, Array.from(signatureArray))
  )
  const jwt = `${unsignedToken}.${signatureBase64}`

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const tokenData = await tokenResponse.json()
  
  if (!tokenData.access_token) {
    throw new Error('No access token received from Google')
  }
  
  return tokenData.access_token
}

// Legacy function - no longer used (Google Calendar sends invites automatically)
// Send email invitation using Resend
async function sendEmailInvitation(params: any) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

  if (!RESEND_API_KEY) {
    console.warn('Resend API key not configured, skipping email')
    return
  }

  const meetingDate = new Date(params.meeting.scheduled_at)
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = meetingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .meeting-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Meeting Invitation</h1>
          <p>You've been invited to a meeting</p>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p><strong>${params.organizerName}</strong> (${params.organizerEmail}) has invited you to a meeting.</p>
          
          <div class="meeting-details">
            <div class="detail-row">
              <span class="label">Title:</span> ${params.meeting.title}
            </div>
            <div class="detail-row">
              <span class="label">Date:</span> ${formattedDate}
            </div>
            <div class="detail-row">
              <span class="label">Time:</span> ${formattedTime}
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span> ${params.meeting.duration_minutes} minutes
            </div>
            ${params.meeting.description ? `
            <div class="detail-row">
              <span class="label">Description:</span><br/>
              ${params.meeting.description}
            </div>
            ` : ''}
          </div>

          ${params.meeting.meetingUrl ? `
            <center>
              <a href="${params.meeting.meetingUrl}" class="button">Join Video Meeting</a>
            </center>

            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              <strong>Meeting Link:</strong><br/>
              <a href="${params.meeting.meetingUrl}" style="color: #667eea;">${params.meeting.meetingUrl}</a>
            </p>

            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>ℹ️ About Jitsi Meet:</strong> This meeting uses Jitsi Meet, a free and secure video conferencing platform. No account or download required - just click the link to join!
              </p>
            </div>
          ` : `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Note:</strong> A Google Meet link could not be generated automatically. Please create a meeting link manually or the organizer will send one shortly.
              </p>
            </div>
          `}

          <div style="background: #f3f4f6; border-left: 4px solid #9ca3af; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📅 Add to Calendar:</strong> Manually add this event to your calendar using the date/time above.
            </p>
          </div>
        </div>
        <div class="footer">
          <p>Sent by Next Ignition Platform</p>
        </div>
      </div>
    </body>
    </html>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Next Ignition <onboarding@resend.dev>',
      to: [params.to],
      subject: `Meeting Invitation: ${params.meeting.title}`,
      html: emailHtml,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Email send error:', error)
    throw new Error('Failed to send email invitation')
  }

  return await response.json()
}

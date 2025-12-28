import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Picker } from '@/components/Picker';
import { useMeetings } from '@/hooks/useMeetings';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { showAlert } from '@/utils/platformAlert';
import { supabase } from '@/lib/supabase';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  GRADIENTS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react-native';

const DURATION_OPTIONS = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
];

export default function ScheduleMeetingScreen() {
  const params = useLocalSearchParams();
  const { scheduleMeeting, loading } = useMeetings();
  const { tokenStatus, checking, connectGoogle, loading: googleLoading, checkGoogleConnection } = useGoogleAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(60);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      console.log('📍 Schedule Meeting page focused - checking Google Calendar status');
      checkGoogleConnection();
    }, [checkGoogleConnection])
  );

  // Prefill form from params
  useEffect(() => {
    console.log('📝 Prefilling form from params:', params);
    
    // Prefill participant email
    if (params.email) {
      try {
        const decodedEmail = decodeURIComponent(params.email as string);
        setParticipantEmail(decodedEmail);
        console.log('✓ Participant email prefilled:', decodedEmail);
      } catch (error) {
        console.warn('Failed to decode email param:', error);
        setParticipantEmail(params.email as string);
      }
    }
    
    // Prefill title
    if (params.title) {
      const decodedTitle = decodeURIComponent(params.title as string);
      setTitle(decodedTitle);
      console.log('✓ Title prefilled:', decodedTitle);
    }
    
    // Prefill description
    if (params.description) {
      const decodedDesc = decodeURIComponent(params.description as string);
      setDescription(decodedDesc);
      console.log('✓ Description prefilled:', decodedDesc);
    }
    
    // Prefill date and time from scheduledAt
    if (params.scheduledAt) {
      try {
        const scheduledDate = new Date(params.scheduledAt as string);
        if (!isNaN(scheduledDate.getTime())) {
          setDate(scheduledDate);
          setTime(scheduledDate);
          console.log('✓ Date & Time prefilled:', scheduledDate.toISOString());
        }
      } catch (error) {
        console.warn('Failed to parse scheduledAt param:', error);
      }
    }
    
    // Prefill duration
    if (params.duration) {
      const durationNum = parseInt(params.duration as string, 10);
      if (!isNaN(durationNum)) {
        setDuration(durationNum);
        console.log('✓ Duration prefilled:', durationNum);
      }
    }
    
    console.log('✅ Form prefilled successfully');
  }, [params]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, the picker dismisses automatically after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    // On iOS, keep it open (modal behavior)
    if (selectedDate && event.type !== 'dismissed') {
      setDate(selectedDate);
    }
    // If user dismissed/cancelled, close the picker
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    // On Android, the picker dismisses automatically after selection
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    // On iOS, keep it open (modal behavior)
    if (selectedTime && event.type !== 'dismissed') {
      setTime(selectedTime);
    }
    // If user dismissed/cancelled, close the picker
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  const handleWebDateChange = (e: any) => {
    const selectedDate = new Date(e.target.value);
    if (!isNaN(selectedDate.getTime())) {
      setDate(selectedDate);
    }
  };

  const handleWebTimeChange = (e: any) => {
    const [hours, minutes] = e.target.value.split(':');
    const newTime = new Date(time);
    newTime.setHours(parseInt(hours, 10));
    newTime.setMinutes(parseInt(minutes, 10));
    setTime(newTime);
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (time: Date) => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleConnectGoogle = async () => {
    try {
      // Log the redirect URI being used for debugging
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const redirectUri = `${window.location.origin}/google-callback`;
        console.log('=== Google OAuth Connection Debug ===');
        console.log('🌐 Platform: Web');
        console.log('📍 Current URL:', window.location.href);
        console.log('📍 Origin:', window.location.origin);
        console.log('📍 Port:', window.location.port || 'default (80/443)');
        console.log('🔗 Redirect URI that will be used:', redirectUri);
        console.log('⚠️  CRITICAL: Add this EXACT URI to Google Cloud Console:');
        console.log('   1. Go to: https://console.cloud.google.com/apis/credentials');
        console.log('   2. Click your OAuth 2.0 Client ID');
        console.log('   3. Under "Authorized redirect URIs", click "+ ADD URI"');
        console.log('   4. Add:', redirectUri);
        console.log('   5. Save and wait 2-3 minutes');
      } else {
        console.log('=== Google OAuth Connection Debug ===');
        console.log('📱 Platform: Mobile/Expo');
        console.log('🔗 Redirect URI that will be used: http://localhost:8081/google-callback');
        console.log('⚠️  CRITICAL: Add this EXACT URI to Google Cloud Console:');
        console.log('   http://localhost:8081/google-callback');
      }
      
      const result = await connectGoogle();
      if (result.success) {
        // For web, redirect happens automatically, so don't show alert
        if (Platform.OS !== 'web') {
          showAlert('Success', result.message || 'Google Calendar connected successfully!');
        }
      } else {
        const errorMsg = result.error || 'Failed to connect Google Calendar';
        let detailedMsg = errorMsg;
        
        // Add helpful context for common errors
        if (errorMsg.includes('redirect_uri') || errorMsg.includes('redirect URI') || errorMsg.includes('redirect_uri_mismatch')) {
          const currentRedirectUri = Platform.OS === 'web' && typeof window !== 'undefined'
            ? `${window.location.origin}/google-callback`
            : 'http://localhost:8081/google-callback';
          
          // Try to extract redirect URI from error message if available
          let googleErrorDetails = '';
          if (errorMsg.includes('redirect_uri_mismatch')) {
            googleErrorDetails = '\n\n🔴 Google Error: redirect_uri_mismatch\nThis means the redirect URI sent to Google does not match any URI in your Google Cloud Console configuration.';
          }
          
          detailedMsg = errorMsg + 
            googleErrorDetails +
            `\n\n🔍 Redirect URI being used by app: ${currentRedirectUri}` +
            `\n\n✅ SOLUTION - Add this EXACT URI to Google Cloud Console:` +
            `\n\n1. Go to: https://console.cloud.google.com/apis/credentials` +
            `\n2. Select your project` +
            `\n3. Click on your OAuth 2.0 Client ID` +
            `\n4. Scroll to "Authorized redirect URIs"` +
            `\n5. Click "+ ADD URI"` +
            `\n6. Paste this EXACT URI: ${currentRedirectUri}` +
            `\n7. Click "SAVE"` +
            `\n8. Wait 2-3 minutes for changes to propagate` +
            `\n9. Try connecting again` +
            `\n\n⚠️ IMPORTANT:` +
            `\n• The URI must match EXACTLY (including http/https, port, path)` +
            `\n• No trailing slashes` +
            `\n• Google only accepts HTTP/HTTPS URLs (not exp://)` +
            `\n• If you're on a different port, update the URI above accordingly`;
        } else if (errorMsg.includes('client_id') || errorMsg.includes('client ID')) {
          detailedMsg = errorMsg + '\n\nPlease ensure GOOGLE_OAUTH_CLIENT_ID is set in Supabase Edge Function secrets.';
        } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('session')) {
          detailedMsg = errorMsg + '\n\nPlease try logging out and logging back in.';
        }
        
        showAlert('Connection Error', detailedMsg);
      }
    } catch (error: any) {
      console.error('Error connecting Google:', error);
      showAlert(
        'Connection Error',
        error.message || 'An unexpected error occurred. Please try again or contact support.'
      );
    }
  };

  const handleSchedule = async () => {
    // Check if Google is connected
    if (!tokenStatus.isConnected) {
      showAlert(
        'Google Calendar Required',
        'Please connect your Google Calendar to schedule meetings with Google Meet.\n\nThis allows us to create calendar events and generate secure meeting links.',
        [
          {
            text: 'Connect Google',
            onPress: handleConnectGoogle,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // Validation
    if (!title.trim()) {
      showAlert('Required Field', 'Please enter a meeting title');
      return;
    }

    if (!participantEmail.trim()) {
      showAlert('Required Field', 'Please enter participant email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participantEmail)) {
      showAlert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Combine date and time
    const scheduledDateTime = new Date(date);
    scheduledDateTime.setHours(time.getHours());
    scheduledDateTime.setMinutes(time.getMinutes());
    scheduledDateTime.setSeconds(0);
    scheduledDateTime.setMilliseconds(0);

    // Check if meeting is in the past
    if (scheduledDateTime < new Date()) {
      showAlert('Invalid Date', 'Meeting time must be in the future');
      return;
    }

    try {
      const result = await scheduleMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        participantEmail: participantEmail.trim(),
        scheduledAt: scheduledDateTime.toISOString(),
        duration,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      if (result.success) {
        console.log('✅ Meeting scheduled successfully');
        console.log('Meeting details:', result);
        
        // If this is from a mentorship request, update the request status
        if (params.requestId) {
          console.log('📝 Updating mentorship request:', params.requestId);
          
          try {
            const { error: updateError } = await supabase
              .from('mentorship_requests')
              .update({
                status: 'accepted',
                responded_at: new Date().toISOString(),
                google_meet_link: result.meetLink,
                meeting_id: result.meeting?.id || null,
                google_calendar_event_id: result.calendarEventId || null,
              })
              .eq('id', params.requestId as string);
            
            if (updateError) {
              console.error('Failed to update request:', updateError);
            } else {
              console.log('✅ Mentorship request updated to accepted');
            }
          } catch (err) {
            console.error('Error updating request:', err);
          }
        }
        
        // Determine redirect target
        const redirectTarget = params.requestId ? '/(tabs)/expert-sessions' : '/(tabs)/sessions';
        
        // Show success alert and redirect
        showAlert(
          'Meeting Scheduled! 🎉',
          `Your meeting has been scheduled successfully!\n\n` +
          `📅 ${formatDate(scheduledDateTime)} at ${formatTime(scheduledDateTime)}\n` +
          `👥 With ${participantEmail}\n\n` +
          `✅ Google Calendar invite sent automatically\n` +
          `✅ Google Meet link generated\n\n` +
          `${params.founderName ? `Session request from ${params.founderName} has been accepted!` : ''}\n\n` +
          `Redirecting...`,
          [
            {
              text: 'Copy Link',
              onPress: async () => {
                await Clipboard.setStringAsync(result.meetLink);
                showAlert('Link Copied!', 'Meeting link has been copied to clipboard.');
                // Redirect after copying
                setTimeout(() => {
                  router.push(redirectTarget as any);
                }, 500);
              },
            },
            {
              text: 'View Sessions',
              onPress: () => router.push(redirectTarget as any),
            },
          ]
        );
        
        // Auto-redirect to appropriate page after 2 seconds
        setTimeout(() => {
          router.push(redirectTarget as any);
        }, 2000);
      } else {
        // Check if error is about Google connection
        if (result.error?.includes('Google Calendar not connected')) {
          showAlert(
            'Google Calendar Required',
            result.error + '\n\nPlease connect your Google account to continue.',
            [
              {
                text: 'Connect Google',
                onPress: handleConnectGoogle,
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        } else {
          showAlert('Error', result.error || 'Failed to schedule meeting');
        }
      }
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      showAlert('Error', error.message || 'Failed to schedule meeting');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary as any} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Calendar size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Schedule Meeting</Text>
              <Text style={styles.heroSubtitle}>
                Video call link will be generated automatically
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Details</Text>
          <Input
            label="Meeting Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Funding Discussion, Product Review"
          />
          <Input
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the meeting agenda..."
            multiline
            numberOfLines={4}
          />
          <Input
            label="Participant Email"
            value={participantEmail}
            onChangeText={setParticipantEmail}
            placeholder="participant@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          
          {Platform.OS === 'web' ? (
            <>
              {/* Web Date Input */}
              <View style={styles.dateTimeButton}>
                <Calendar size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dateTimeLabel}>Date</Text>
                  <input
                    type="date"
                    value={formatDateForInput(date)}
                    onChange={handleWebDateChange}
                    style={{
                      fontSize: FONT_SIZES.md,
                      fontFamily: FONT_FAMILY.bodyMedium,
                      color: COLORS.text,
                      padding: 0,
                      margin: 0,
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      width: '100%',
                    }}
                    min={formatDateForInput(new Date())}
                  />
                </View>
              </View>

              {/* Web Time Input */}
              <View style={styles.dateTimeButton}>
                <Clock size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dateTimeLabel}>Time</Text>
                  <input
                    type="time"
                    value={formatTimeForInput(time)}
                    onChange={handleWebTimeChange}
                    style={{
                      fontSize: FONT_SIZES.md,
                      fontFamily: FONT_FAMILY.bodyMedium,
                      color: COLORS.text,
                      padding: 0,
                      margin: 0,
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      width: '100%',
                    }}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Mobile Date Picker */}
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}>
                <Calendar size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dateTimeLabel}>Date</Text>
                  <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                </View>
              </TouchableOpacity>

              {/* Mobile Time Picker */}
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}>
                <Clock size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dateTimeLabel}>Time</Text>
                  <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                </View>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </>
          )}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Duration</Text>
            <Picker
              items={DURATION_OPTIONS.map(opt => ({ label: opt.label, value: opt.value.toString() }))}
              selectedValue={duration.toString()}
              onValueChange={(value) => setDuration(parseInt(value))}
              placeholder="Select duration"
            />
          </View>
        </View>

        {/* Google Connection Status */}
        {checking ? (
          <View style={styles.infoCard}>
            <Clock size={20} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.infoText}>Checking Google Calendar connection...</Text>
          </View>
        ) : !tokenStatus.isConnected ? (
          <View style={[styles.infoCard, styles.warningCard]}>
            <AlertCircle size={20} color={COLORS.warning} strokeWidth={2} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoText, styles.warningText]}>
                Google Calendar connection required
              </Text>
              <Text style={[styles.infoText, { fontSize: FONT_SIZES.sm, marginTop: SPACING.xs }]}>
                Connect your Google account to create Google Meet links and calendar events.
              </Text>
              <Button
                title={googleLoading ? 'Connecting...' : 'Connect Google Calendar'}
                onPress={handleConnectGoogle}
                loading={googleLoading}
                variant="outline"
                style={{ marginTop: SPACING.md }}
                icon={<ExternalLink size={16} color={COLORS.primary} strokeWidth={2} />}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.infoCard}>
              <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
              <Text style={styles.infoText}>
                ✅ Google Calendar connected - Google Meet links will be generated automatically
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Video size={20} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.infoText}>
                Calendar invites will be sent automatically to participants via Google Calendar
              </Text>
            </View>
          </>
        )}

        <Button
          title={loading ? 'Scheduling...' : 'Schedule Meeting'}
          onPress={handleSchedule}
          loading={loading}
          disabled={!tokenStatus.isConnected || checking}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    gap: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  pickerLabel: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  meetingTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  meetingTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 120,
  },
  meetingTypeCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  meetingTypeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  meetingTypeTextActive: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  warningCard: {
    backgroundColor: COLORS.warning + '15',
    borderLeftColor: COLORS.warning,
  },
  warningText: {
    color: COLORS.warning,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateTimeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateTimeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
  scheduleButton: {
    marginTop: SPACING.sm,
  },
});


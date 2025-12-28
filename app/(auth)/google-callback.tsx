import { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from '@/constants/theme';
import { CheckCircle, XCircle } from 'lucide-react-native';

export default function GoogleCallbackScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Google authorization...');
  const processingRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (processingRef.current) {
        console.log('Already processing callback, skipping...');
        return;
      }
      
      processingRef.current = true;
      try {
        console.log('=== Google Callback Started ===');
        console.log('Params:', params);
        console.log('User:', user?.id);
        
        const code = params.code as string;
        const error = params.error as string;
        const state = params.state as string;

        if (error) {
          console.error('OAuth error:', error);
          setStatus('error');
          setMessage(`Authorization failed: ${error}`);
          setTimeout(() => {
            router.replace('/(tabs)/schedule-meeting');
          }, 2000);
          return;
        }

        if (!code) {
          console.error('No code received');
          setStatus('error');
          setMessage('No authorization code received');
          setTimeout(() => {
            router.replace('/(tabs)/schedule-meeting');
          }, 2000);
          return;
        }

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('Current user:', currentUser?.id);
        
        if (!currentUser) {
          console.error('No authenticated user');
          setStatus('error');
          setMessage('Please log in first');
          setTimeout(() => {
            router.replace('/(auth)/login');
          }, 2000);
          return;
        }

        const redirectUri = Platform.OS === 'web' && typeof window !== 'undefined'
          ? `${window.location.origin}/google-callback`
          : 'http://localhost:8081/google-callback';
        
        console.log('Redirect URI:', redirectUri);
        console.log('Calling edge function with code:', code.substring(0, 10) + '...');

        const { data, error: functionError } = await supabase.functions.invoke('google-oauth-callback', {
          body: {
            code,
            redirect_uri: redirectUri,
          },
        });

        console.log('Edge function response:', data);
        
        if (functionError) {
          console.error('Edge function error:', functionError);
          throw new Error(functionError.message || 'Failed to connect Google');
        }

        if (!data || !data.success) {
          console.error('Edge function returned error:', data?.error);
          throw new Error(data?.error || 'Failed to connect Google');
        }

        console.log('✅ Google Calendar connected successfully');
        setStatus('success');
        setMessage('Google Calendar connected successfully!');
        
        setTimeout(() => {
          console.log('Redirecting to: /(tabs)/schedule-meeting');
          router.replace('/(tabs)/schedule-meeting');
        }, 1500);
      } catch (err: any) {
        console.error('=== Callback Error ===');
        console.error('Error:', err);
        console.error('Message:', err.message);
        setStatus('error');
        setMessage(err.message || 'Failed to connect Google Calendar');
        
        setTimeout(() => {
          router.replace('/(tabs)/schedule-meeting');
        }, 2000);
      } finally {
        processingRef.current = false;
      }
    };

    if (params.code || params.error) {
      handleCallback();
    }
  }, [params.code, params.error, params.state]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.message}>{message}</Text>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle size={48} color={COLORS.success} strokeWidth={2} />
            <Text style={[styles.message, styles.successMessage]}>{message}</Text>
            <Text style={styles.subMessage}>Redirecting to schedule meeting...</Text>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle size={48} color={COLORS.error} strokeWidth={2} />
            <Text style={[styles.message, styles.errorMessage]}>{message}</Text>
            <Text style={styles.subMessage}>Redirecting back...</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  message: {
    fontFamily: FONT_FAMILY.bodyMedium,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  successMessage: {
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  errorMessage: {
    color: COLORS.error,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  subMessage: {
    fontFamily: FONT_FAMILY.bodyMedium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});


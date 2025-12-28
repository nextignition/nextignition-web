import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@/constants/theme';
import { AdminNavigation } from '@/components/admin/AdminNavigation';

export default function AdminLayout() {
  const { session, loading, profile } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/(auth)/login');
    } else if (!loading && session && profile?.role !== 'admin') {
      // Redirect non-admin users to tabs
      router.replace('/(tabs)');
    }
  }, [session, loading, profile]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!session || profile?.role !== 'admin') {
    return null;
  }

  return (
    <View style={{ flex: 1, flexDirection: Platform.OS === 'web' ? 'row' : 'column' }}>
      <AdminNavigation />
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="users" />
          <Stack.Screen name="content" />
          <Stack.Screen name="reports" />
          <Stack.Screen name="analytics" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="support" />
          <Stack.Screen name="webinar-management" />
        </Stack>
      </View>
    </View>
  );
}


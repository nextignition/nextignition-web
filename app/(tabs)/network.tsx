import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { FounderProfileCard } from '@/components/network/FounderProfileCard';
import { InvestorProfileCard } from '@/components/network/InvestorProfileCard';
import { useExploreNetwork } from '@/hooks/useExploreNetwork';
import { getOrCreateDirectConversation } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_FAMILY, theme } from '@/constants/theme';
import { Search, Filter, Network } from 'lucide-react-native';

export default function NetworkScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [chatLoading, setChatLoading] = useState<Record<string, boolean>>({});

  const {
    profiles,
    startups,
    loading: networkLoading,
    error: networkError,
    refetch,
  } = useExploreNetwork({
    search: searchQuery,
    industry: industryFilter,
    stage: stageFilter,
    location: locationFilter,
  });

  const handleChat = async (targetId: string, targetName: string) => {
    console.log('handleChat called with:', { targetId, targetName, userId: user?.id });
    
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to start a chat');
      return;
    }

    // Set loading for this specific profile only
    setChatLoading(prev => ({ ...prev, [targetId]: true }));
    
    try {
      console.log('Creating/getting conversation...');
      const { conversationId, error } = await getOrCreateDirectConversation(
        user.id,
        targetId,
        targetName
      );

      console.log('Conversation result:', { conversationId, error });

      if (error || !conversationId) {
        Alert.alert('Error', error || 'Failed to start conversation');
        setChatLoading(prev => ({ ...prev, [targetId]: false }));
        return;
      }

      console.log('Navigating to chat with conversationId:', conversationId);
      // Navigate to chat with conversation ID using query params
      router.push(`/(tabs)/chat?conversationId=${conversationId}&userName=${encodeURIComponent(targetName)}`);
      // Don't reset loading immediately - let navigation happen
      setTimeout(() => {
        setChatLoading(prev => ({ ...prev, [targetId]: false }));
      }, 500);
    } catch (err: any) {
      console.error('Chat error:', err);
      Alert.alert('Error', err.message || 'Failed to start chat');
      setChatLoading(prev => ({ ...prev, [targetId]: false }));
    }
  };

  const handleViewDetails = (profileId: string) => {
    // Navigate to profile details based on role
    const targetProfile = profiles.find(p => p.id === profileId);
    if (targetProfile?.role === 'investor') {
      router.push(`/(tabs)/investor-detail?id=${profileId}`);
    } else if (targetProfile?.role === 'founder' || targetProfile?.role === 'cofounder') {
      // For founders, navigate to their startup detail page
      router.push(`/(tabs)/startup-detail?ownerId=${profileId}`);
    } else {
      router.push(`/(tabs)/founder-profile?id=${profileId}`);
    }
  };

  const handleViewPitch = (profileId: string) => {
    const startup = startups?.find(s => s.owner_id === profileId);
    if (startup) {
      router.push(`/(tabs)/pitch-materials?startupId=${startup.id}`);
    }
  };

  const handleScheduleMeeting = (founderEmail: string) => {
    if (founderEmail) {
      router.push(`/(tabs)/schedule-meeting?email=${encodeURIComponent(founderEmail)}`);
    } else {
      router.push('/(tabs)/schedule-meeting');
    }
  };

  if (networkLoading) {
    return <LoadingScreen />;
  }

  if (networkError) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={Network}
          title="Error loading network"
          message={networkError}
          actionLabel="Try Again"
          onAction={refetch}
        />
      </SafeAreaView>
    );
  }

  const showFounders = profile?.role === 'investor' || profile?.role === 'expert';
  const showInvestors = profile?.role === 'founder' || profile?.role === 'cofounder' || profile?.role === 'expert';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Network</Text>
        <Text style={styles.headerSubtitle}>
          {showFounders && 'Discover innovative startups and founders'}
          {showInvestors && !showFounders && 'Connect with investors'}
          {profile?.role === 'expert' && 'Connect with founders and investors'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, company, or industry"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Industry"
            placeholderTextColor={theme.colors.textSecondary}
            value={industryFilter}
            onChangeText={setIndustryFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Stage"
            placeholderTextColor={theme.colors.textSecondary}
            value={stageFilter}
            onChangeText={setStageFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Location"
            placeholderTextColor={theme.colors.textSecondary}
            value={locationFilter}
            onChangeText={setLocationFilter}
          />
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {profiles.length === 0 ? (
          <EmptyState
            icon={Network}
            title="No profiles found"
            message="Try adjusting your search or filters"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setIndustryFilter('');
              setStageFilter('');
              setLocationFilter('');
            }}
          />
        ) : (
          <>
            {showFounders && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Founders ({profiles.filter(p => p.role === 'founder' || p.role === 'cofounder').length})
                </Text>
                {profiles
                  .filter(p => p.role === 'founder' || p.role === 'cofounder')
                  .map(founderProfile => {
                    const startup = startups?.find(s => s.owner_id === founderProfile.id);
                    return (
                      <FounderProfileCard
                        key={founderProfile.id}
                        profile={founderProfile}
                        startup={startup}
                        onChat={() => handleChat(founderProfile.id, founderProfile.full_name || 'User')}
                        onViewDetails={() => handleViewDetails(founderProfile.id)}
                        onViewPitch={profile?.role !== 'investor' ? () => handleViewPitch(founderProfile.id) : undefined}
                        onScheduleMeeting={profile?.role === 'investor' ? () => handleScheduleMeeting(founderProfile.email || '') : undefined}
                        chatLoading={chatLoading[founderProfile.id] || false}
                      />
                    );
                  })}
              </View>
            )}

            {showInvestors && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Investors ({profiles.filter(p => p.role === 'investor').length})
                </Text>
                {profiles
                  .filter(p => p.role === 'investor')
                  .map(investorProfile => (
                    <InvestorProfileCard
                      key={investorProfile.id}
                      profile={investorProfile}
                      onChat={() => handleChat(investorProfile.id, investorProfile.full_name || 'User')}
                      onViewDetails={() => handleViewDetails(investorProfile.id)}
                      chatLoading={chatLoading[investorProfile.id] || false}
                    />
                  ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterInput: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.3,
  },
});


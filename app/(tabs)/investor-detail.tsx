import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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
  Building2,
  MapPin,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Twitter,
  Globe,
  Briefcase,
  Award,
  UserRound,
  Mail,
  Bookmark,
  BookmarkCheck,
  Calendar,
  DollarSign,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useInvestorDetail } from '@/hooks/useInvestorDetail';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { useAuth } from '@/contexts/AuthContext';
import { getOrCreateDirectConversation } from '@/hooks/useChat';

export default function InvestorDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const investorId = params.id;
  const { user } = useAuth();
  const { investor, loading, error, refresh } = useInvestorDetail(investorId);
  const [refreshing, setRefreshing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const isOwnProfile = user?.id === investorId;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleOpenLink = (url: string | null) => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(fullUrl).catch(err => console.error('Failed to open URL:', err));
  };

  const handleStartChat = async () => {
    if (!user?.id || !investor) return;

    setChatLoading(true);
    try {
      const { conversationId, error: chatError } = await getOrCreateDirectConversation(
        user.id,
        investor.id,
        investor.full_name
      );

      if (chatError || !conversationId) {
        console.error('Failed to create conversation:', chatError);
        return;
      }

      router.push(`/(tabs)/chat?conversationId=${conversationId}&userName=${encodeURIComponent(investor.full_name)}`);
    } catch (err) {
      console.error('Error starting chat:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading investor profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !investor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <ArrowLeft size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ErrorState
          message={error || "The investor profile you're looking for doesn't exist."}
          onRetry={refresh}
        />
      </SafeAreaView>
    );
  }

  const joinedDate = investor.created_at ? formatDate(investor.created_at) : 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }>
        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <ArrowLeft size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={toggleBookmark}
            activeOpacity={0.7}>
            {bookmarked ? (
              <BookmarkCheck size={24} color={COLORS.primary} fill={COLORS.primary} strokeWidth={2} />
            ) : (
              <Bookmark size={24} color={COLORS.text} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>

        <LinearGradient colors={GRADIENTS.primary as any} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Building2 size={32} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{investor.full_name}</Text>
              <View style={styles.heroMeta}>
                <UserRound size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                <Text style={styles.heroMetaText}>Investor</Text>
                {investor.location && (
                  <>
                    <View style={styles.heroDivider} />
                    <MapPin size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                    <Text style={styles.heroMetaText}>{investor.location}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <View style={styles.heroTags}>
            {investor.investment_focus && (
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{investor.investment_focus.split(',')[0].trim()}</Text>
              </View>
            )}
            {investor.investment_range && (
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{investor.investment_range}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {investor.bio ? (
            <Text style={styles.description}>{investor.bio}</Text>
          ) : (
            <Text style={[styles.description, { color: COLORS.textSecondary }]}>
              No bio available
            </Text>
          )}

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Member Since</Text>
              <Text style={styles.detailValue}>{joinedDate}</Text>
            </View>
            {investor.email && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{investor.email}</Text>
              </View>
            )}
          </View>

          {/* Social Links */}
          {(investor.linkedin_url || investor.twitter_url || investor.website_url) && (
            <View style={styles.socialLinks}>
              {investor.linkedin_url && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(investor.linkedin_url)}
                  activeOpacity={0.7}>
                  <Linkedin size={20} color={COLORS.primary} />
                  <Text style={styles.socialButtonText}>LinkedIn</Text>
                </TouchableOpacity>
              )}
              {investor.twitter_url && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(investor.twitter_url)}
                  activeOpacity={0.7}>
                  <Twitter size={20} color={COLORS.primary} />
                  <Text style={styles.socialButtonText}>Twitter</Text>
                </TouchableOpacity>
              )}
              {investor.website_url && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(investor.website_url)}
                  activeOpacity={0.7}>
                  <Globe size={20} color={COLORS.primary} />
                  <Text style={styles.socialButtonText}>Website</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Investment Details Section */}
        {(investor.investment_focus || investor.investment_range || investor.portfolio_companies) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Details</Text>
            
            {investor.investment_focus && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <TrendingUp size={20} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.infoCardTitle}>Investment Focus</Text>
                </View>
                <Text style={styles.infoCardText}>{investor.investment_focus}</Text>
              </View>
            )}

            {investor.investment_range && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <DollarSign size={20} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.infoCardTitle}>Investment Range</Text>
                </View>
                <Text style={styles.infoCardText}>{investor.investment_range}</Text>
              </View>
            )}

            {investor.portfolio_companies && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <Briefcase size={20} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.infoCardTitle}>Portfolio</Text>
                </View>
                <Text style={styles.infoCardText}>{investor.portfolio_companies}</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {!isOwnProfile && (
          <View style={styles.actionsSection}>
            <Button
              title="Connect with Investor"
              onPress={handleStartChat}
              loading={chatLoading}
              variant="primary"
              style={styles.connectButton}
            />
            <Button
              title="Schedule Meeting"
              onPress={() => {
                const investorEmail = investor?.email;
                if (investorEmail) {
                  const encodedEmail = encodeURIComponent(investorEmail);
                  router.push(`/(tabs)/schedule-meeting?email=${encodedEmail}`);
                } else {
                  router.push('/(tabs)/schedule-meeting');
                }
              }}
              variant="outline"
              style={styles.scheduleButton}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  bookmarkButton: {
    padding: SPACING.xs,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginBottom: SPACING.xs,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  heroMetaText: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONT_SIZES.sm,
  },
  heroDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: SPACING.xs / 2,
  },
  heroTags: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  heroTag: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.full,
  },
  heroTagText: {
    ...TYPOGRAPHY.body,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.background,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  detailItem: {
    flex: 1,
    minWidth: 140,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs / 2,
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.bodyMedium,
    letterSpacing: 0.5,
  },
  detailValue: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    flexWrap: 'wrap',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialButtonText: {
    ...TYPOGRAPHY.body,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
  },
  infoCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoCardTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  infoCardText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  actionsSection: {
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
  },
  scheduleButton: {
    borderColor: COLORS.primary,
  },
});

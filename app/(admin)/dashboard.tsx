import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '@/hooks/useResponsive';
import { AnalyticsWidget } from '@/components/admin/AnalyticsWidget';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  GRADIENTS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import {
  Users,
  UserCheck,
  Flag,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  MessageSquare,
  FileText,
  Video,
  ChevronRight,
} from 'lucide-react-native';

export default function AdminDashboard() {
  const { isMobile } = useResponsive();

  const quickActions = [
    { icon: Users, label: 'New Users', count: 12, route: '/(admin)/users', color: COLORS.primary },
    { icon: Flag, label: 'Flagged Content', count: 5, route: '/(admin)/reports', color: COLORS.error },
    { icon: MessageSquare, label: 'Support Tickets', count: 8, route: '/(admin)/support', color: COLORS.accent },
    { icon: AlertCircle, label: 'System Alerts', count: 2, route: '/(admin)/settings', color: COLORS.warning },
  ];

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Platform overview and quick actions</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={[styles.quickActionsGrid, isMobile && styles.quickActionsGridMobile]}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={action.label}
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction(action.route)}>
                  <View style={styles.quickActionHeader}>
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                      <Icon size={24} color={action.color} strokeWidth={2} />
                    </View>
                    {action.count > 0 && (
                      <View style={[styles.badge, { backgroundColor: action.color }]}>
                        <Text style={styles.badgeText}>{action.count}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                  <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={[styles.widgetsGrid, isMobile && styles.widgetsGridMobile]}>
            <AnalyticsWidget
              title="Total Users"
              value={1247}
              change={12.5}
              trend="up"
              icon={Users}
              gradient={GRADIENTS.primary}
            />
            <AnalyticsWidget
              title="Pending Approvals"
              value={23}
              change={-5.2}
              trend="down"
              icon={UserCheck}
              gradient={GRADIENTS.accent}
            />
            <AnalyticsWidget
              title="Active Reports"
              value={8}
              change={0}
              trend="neutral"
              icon={Flag}
              gradient={GRADIENTS.navy}
            />
            <AnalyticsWidget
              title="Revenue"
              value={125000}
              change={18.3}
              trend="up"
              icon={DollarSign}
              gradient={GRADIENTS.primary}
            />
          </View>
        </View>

        {/* Platform Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Activity</Text>
          <View style={styles.chartsSection}>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>User Growth</Text>
                <Activity size={20} color={COLORS.primary} strokeWidth={2} />
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>User registration and activity trends</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Revenue Trends</Text>
                <TrendingUp size={20} color={COLORS.primary} strokeWidth={2} />
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Subscription revenue over time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Overview</Text>
          <View style={[styles.statsGrid, isMobile && styles.statsGridMobile]}>
            <View style={styles.statCard}>
              <FileText size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.statValue}>342</Text>
              <Text style={styles.statLabel}>Pitch Decks</Text>
            </View>
            <View style={styles.statCard}>
              <Video size={24} color={COLORS.accent} strokeWidth={2} />
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Pitch Videos</Text>
            </View>
            <View style={styles.statCard}>
              <Video size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Webinars</Text>
            </View>
            <View style={styles.statCard}>
              <MessageSquare size={24} color={COLORS.accent} strokeWidth={2} />
              <Text style={styles.statValue}>12.5k</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          </View>
        </View>
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
  header: {
    gap: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.display,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.text,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  quickActionsGridMobile: {
    flexDirection: 'column',
  },
  quickActionCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.sm,
  },
  quickActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.displayBold,
  },
  quickActionLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  widgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  widgetsGridMobile: {
    flexDirection: 'column',
  },
  chartsSection: {
    gap: SPACING.lg,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
    gap: SPACING.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  chartPlaceholderText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statsGridMobile: {
    flexDirection: 'column',
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.display,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.text,
    fontSize: 32,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});


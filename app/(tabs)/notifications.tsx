import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';
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
  Bell,
  TrendingUp,
  Calendar,
  Star,
  MessageSquare,
  CheckCircle,
  X,
  Users,
  AlertCircle,
  Eye,
  UserPlus,
  Clock,
  XCircle,
  Award,
  FileText,
} from 'lucide-react-native';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'funding':
      return TrendingUp;
    case 'session':
    case 'mentorship':
      return Calendar;
    case 'review':
      return Star;
    case 'message':
      return MessageSquare;
    case 'connection':
      return Users;
    case 'system':
      return Bell;
    default:
      return CheckCircle;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'funding':
      return COLORS.success;
    case 'session':
    case 'mentorship':
      return COLORS.primary;
    case 'review':
      return COLORS.warning;
    case 'message':
      return COLORS.accent;
    case 'connection':
      return COLORS.primary;
    case 'system':
      return COLORS.textSecondary;
    default:
      return COLORS.success;
  }
};

const NOTIFICATION_TYPE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Funding', value: 'funding' },
  { label: 'Sessions', value: 'session' },
  { label: 'Reviews', value: 'review' },
  { label: 'Connections', value: 'connection' },
  { label: 'Messages', value: 'message' },
  { label: 'System', value: 'system' },
] as const;

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter notifications by type
  const filteredNotifications = useMemo(() => {
    if (selectedFilter === 'all') {
      return notifications;
    }
    return notifications.filter(n => n.type === selectedFilter);
  }, [notifications, selectedFilter]);

  const handleNotificationPress = (notification: typeof notifications[0]) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.primary} />
        }>
        <LinearGradient colors={GRADIENTS.accent} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Bell size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Notifications</Text>
              <Text style={styles.heroSubtitle}>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllRead}
            onPress={markAllAsRead}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read">
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}>
          {NOTIFICATION_TYPE_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                selectedFilter === filter.value && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.value)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.value && styles.filterChipTextActive,
                ]}>
                {filter.label}
              </Text>
              {selectedFilter === filter.value && filter.value !== 'all' && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {notifications.filter(n => n.type === filter.value).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.notificationsList}>
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationUnread,
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${notification.title}: ${notification.message}`}>
                <View style={[styles.notificationIcon, { backgroundColor: `${iconColor}15` }]}>
                  <IconComponent size={20} color={iconColor} strokeWidth={2} />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTimestamp}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={() => deleteNotification(notification.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss notification">
                  <X size={16} color={COLORS.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={48} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'all' ? 'No notifications' : `No ${selectedFilter} notifications`}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedFilter === 'all'
                ? "You're all caught up! New notifications will appear here."
                : `No ${selectedFilter} notifications found. Try selecting a different filter.`}
            </Text>
          </View>
        )}
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
  markAllRead: {
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  markAllReadText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  notificationsList: {
    gap: SPACING.sm,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
    gap: SPACING.md,
  },
  notificationUnread: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  notificationTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  notificationMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  notificationTimestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  dismissButton: {
    padding: SPACING.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyStateText: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  emptyStateSubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyMedium,
    fontSize: FONT_SIZES.sm,
  },
  filterChipTextActive: {
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  filterBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
    fontSize: FONT_SIZES.xs,
  },
});


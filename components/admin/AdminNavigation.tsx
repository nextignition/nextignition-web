import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  Video,
  Menu,
  X,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  FONT_FAMILY,
  BORDER_RADIUS,
  SHADOWS,
} from '@/constants/theme';

interface NavigationItem {
  icon: any;
  label: string;
  route: string;
}

const navigationItems: NavigationItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    route: '/(admin)/dashboard',
  },
  {
    icon: Users,
    label: 'Users',
    route: '/(admin)/users',
  },
  {
    icon: FileText,
    label: 'Content',
    route: '/(admin)/content',
  },
  {
    icon: FileText,
    label: 'Reports',
    route: '/(admin)/reports',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    route: '/(admin)/analytics',
  },
  {
    icon: Video,
    label: 'Webinars',
    route: '/(admin)/webinar-management',
  },
  {
    icon: MessageSquare,
    label: 'Support',
    route: '/(admin)/support',
  },
  {
    icon: Settings,
    label: 'Settings',
    route: '/(admin)/settings',
  },
];

export function AdminNavigation() {
  const pathname = usePathname();
  const { signOut, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (route: string) => {
    router.push(route as any);
    setMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const handleBackToApp = () => {
    router.replace('/(tabs)');
  };

  // Mobile header with hamburger menu
  if (Platform.OS !== 'web') {
    return (
      <>
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X size={24} color={COLORS.text} strokeWidth={2} />
            ) : (
              <Menu size={24} color={COLORS.text} strokeWidth={2} />
            )}
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>Admin Panel</Text>
          <TouchableOpacity onPress={handleBackToApp}>
            <Text style={styles.backToAppText}>App</Text>
          </TouchableOpacity>
        </View>

        {menuOpen && (
          <View style={styles.mobileMenu}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.mobileMenuContent}>
                <View style={styles.profileSection}>
                  <Text style={styles.profileName}>{profile?.full_name || 'Admin'}</Text>
                  <Text style={styles.profileRole}>Administrator</Text>
                </View>

                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.route;
                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={[styles.mobileMenuItem, isActive && styles.mobileMenuItemActive]}
                      onPress={() => handleNavigate(item.route)}>
                      <Icon
                        size={20}
                        color={isActive ? COLORS.primary : COLORS.textSecondary}
                        strokeWidth={2}
                      />
                      <Text
                        style={[
                          styles.mobileMenuItemText,
                          isActive && styles.mobileMenuItemTextActive,
                        ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.divider} />

                <TouchableOpacity style={styles.mobileMenuItem} onPress={handleSignOut}>
                  <LogOut size={20} color={COLORS.error} strokeWidth={2} />
                  <Text style={[styles.mobileMenuItemText, { color: COLORS.error }]}>
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <View style={styles.sidebar}>
      <LinearGradient colors={['#1a1f2e', '#0f1419']} style={styles.sidebarGradient}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoContainer}>
            <LayoutDashboard size={24} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.logoText}>Admin Panel</Text>
          </View>
          <TouchableOpacity style={styles.backToAppButton} onPress={handleBackToApp}>
            <Text style={styles.backToAppButtonText}>← Back to App</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.navItems} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <Text style={styles.profileName}>{profile?.full_name || 'Admin'}</Text>
            <Text style={styles.profileRole}>Administrator</Text>
          </View>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => handleNavigate(item.route)}>
                <Icon
                  size={20}
                  color={isActive ? COLORS.primary : COLORS.textSecondary}
                  strokeWidth={2}
                />
                <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color={COLORS.error} strokeWidth={2} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mobile styles
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  mobileHeaderTitle: {
    ...TYPOGRAPHY.heading,
    color: COLORS.text,
  },
  backToAppText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  mobileMenu: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    maxHeight: '70%',
  },
  mobileMenuContent: {
    padding: SPACING.lg,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  mobileMenuItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  mobileMenuItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  mobileMenuItemTextActive: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },

  // Desktop sidebar styles
  sidebar: {
    width: 260,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  sidebarGradient: {
    flex: 1,
    padding: SPACING.lg,
  },
  sidebarHeader: {
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  logoText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.text,
  },
  backToAppButton: {
    paddingVertical: SPACING.xs,
  },
  backToAppButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  navItems: {
    flex: 1,
  },
  profileSection: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  profileName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
    marginBottom: 2,
  },
  profileRole: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  navItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  navItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  navItemTextActive: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  sidebarFooter: {
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  signOutText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
});

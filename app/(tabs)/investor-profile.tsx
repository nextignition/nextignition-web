import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Picker } from '@/components/Picker';
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
  Link,
  Globe,
  Plus,
  X,
  Briefcase,
  TrendingUp,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const INVESTMENT_FOCUS_OPTIONS = [
  'Seed Stage',
  'Series A',
  'Series B',
  'Growth Stage',
  'B2B SaaS',
  'FinTech',
  'HealthTech',
  'E-commerce',
  'AI/ML',
  'Enterprise Software',
];

const PORTFOLIO_COMPANIES = [
  { id: '1', name: 'TechStart Inc', stage: 'Series A', invested: '$500K' },
  { id: '2', name: 'HealthTech Solutions', stage: 'Seed', invested: '$250K' },
  { id: '3', name: 'FinTech Innovations', stage: 'Series B', invested: '$1M' },
];

export default function InvestorProfileScreen() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investmentFocus, setInvestmentFocus] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [portfolioSize, setPortfolioSize] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setInvestmentFocus(profile.investment_focus || '');
      setInvestmentRange(profile.investment_range || '');
      setPortfolioSize(profile.portfolio_size || '');
      setLinkedinUrl(profile.linkedin_url || '');
      setTwitterUrl(profile.twitter_url || '');
      setWebsiteUrl(profile.website_url || '');
      setLoading(false);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to update your profile');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          investment_focus: investmentFocus,
          investment_range: investmentRange,
          portfolio_size: portfolioSize,
          linkedin_url: linkedinUrl,
          twitter_url: twitterUrl,
          website_url: websiteUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert('Success', 'Investor profile updated successfully!');
    } catch (error: any) {
      console.error('Error saving investor profile:', error);
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary as any} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Building2 size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Investor Profile</Text>
              <Text style={styles.heroSubtitle}>Manage your investment information</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Focus</Text>
          <Input
            label="Areas of Investment Interest"
            value={investmentFocus}
            onChangeText={setInvestmentFocus}
            placeholder="e.g., Seed Stage, B2B SaaS, FinTech"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Range</Text>
          <Input
            label="Investment Amount Range"
            value={investmentRange}
            onChangeText={setInvestmentRange}
            placeholder="e.g., $50K - $500K"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Information</Text>
          <Input
            label="Portfolio Size/Description"
            value={portfolioSize}
            onChangeText={setPortfolioSize}
            placeholder="e.g., 50+ portfolio companies, $50M+ AUM"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links & Website</Text>
          <Input
            label="LinkedIn URL"
            value={linkedinUrl}
            onChangeText={setLinkedinUrl}
            placeholder="https://linkedin.com/in/yourprofile"
          />
          <Input
            label="Twitter URL"
            value={twitterUrl}
            onChangeText={setTwitterUrl}
            placeholder="https://twitter.com/yourhandle"
          />
          <Input
            label="Website URL"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            placeholder="https://yourwebsite.com"
          />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={saving}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  saveButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xxl,
  },
});
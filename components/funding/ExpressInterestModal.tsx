import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { X, DollarSign, MessageSquare } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/hooks/useNotification';
import { FundingOpportunity } from '@/types/funding';

interface ExpressInterestModalProps {
  visible: boolean;
  opportunity: FundingOpportunity | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ExpressInterestModal({
  visible,
  opportunity,
  onClose,
  onSuccess,
}: ExpressInterestModalProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [interestAmount, setInterestAmount] = useState('');
  const [message, setMessage] = useState('');

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  const handleSubmit = async () => {
    if (!user?.id || !opportunity) {
      showError('Please log in to express interest');
      return;
    }

    if (!interestAmount || parseFloat(interestAmount) <= 0) {
      showError('Please enter a valid interest amount');
      return;
    }

    const amount = parseFloat(interestAmount);
    if (amount < opportunity.min_investment) {
      showError(`Minimum investment is ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(opportunity.min_investment)}`);
      return;
    }

    if (amount > opportunity.max_investment) {
      showError(`Maximum investment is ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(opportunity.max_investment)}`);
      return;
    }

    try {
      setLoading(true);
      console.log('[ExpressInterest] Submitting interest:', {
        investor_profile_id: user.id,
        funding_request_id: opportunity.id,
        interest_amount: amount,
      });

      // Check if interest already exists
      const { data: existingInterest, error: checkError } = await supabase
        .from('investor_interest')
        .select('id, status')
        .eq('investor_profile_id', user.id)
        .eq('funding_request_id', opportunity.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is fine
        console.error('[ExpressInterest] Error checking existing interest:', checkError);
        throw checkError;
      }

      if (existingInterest) {
        if (existingInterest.status === 'withdrawn') {
          // Update withdrawn interest to pending
          const { data, error } = await supabase
            .from('investor_interest')
            .update({
              interest_amount: amount,
              currency: 'USD',
              status: 'pending',
              message: message.trim() || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingInterest.id)
            .select()
            .single();

          if (error) {
            console.error('[ExpressInterest] Error updating interest:', error);
            throw error;
          }

          console.log('[ExpressInterest] Updated existing interest:', data);
          showSuccess('Interest updated successfully! The founder will be notified.');
        } else {
          showError('You have already expressed interest in this opportunity.');
          setLoading(false);
          return;
        }
      } else {
        // Insert new interest
        const { data, error } = await supabase
          .from('investor_interest')
          .insert({
            investor_profile_id: user.id,
            funding_request_id: opportunity.id,
            interest_amount: amount,
            currency: 'USD',
            status: 'pending',
            message: message.trim() || null,
          })
          .select()
          .single();

        if (error) {
          console.error('[ExpressInterest] Error from Supabase:', error);
          throw error;
        }

        console.log('[ExpressInterest] Success:', data);
        showSuccess('Interest expressed successfully! The founder will be notified.');
      }

      // Reset form
      setInterestAmount('');
      setMessage('');
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('[ExpressInterest] Error expressing interest:', err);
      const errorMessage = err?.message || err?.details || 'Failed to express interest. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add debug logging
  useEffect(() => {
    console.log('[ExpressInterestModal] Modal state:', {
      visible,
      hasOpportunity: !!opportunity,
      opportunityId: opportunity?.id,
      opportunityName: opportunity?.company_name,
      user: user?.id,
    });
    
    if (visible && !opportunity) {
      console.error('[ExpressInterestModal] ERROR: Modal is visible but opportunity is null!');
    }
    
    if (visible && opportunity) {
      console.log('[ExpressInterestModal] Modal should be visible with opportunity:', opportunity.company_name);
    }
  }, [visible, opportunity, user]);

  if (!opportunity) {
    console.log('[ExpressInterestModal] No opportunity, returning null');
    return null;
  }

  const formatCurrencyDisplay = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Express Interest</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{opportunity.company_name}</Text>
            <Text style={styles.sectionDescription}>
              Express your interest in this funding opportunity. The founder will be notified of your interest.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Interest Amount (USD) <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.amountInputContainer}>
                <DollarSign size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.amountInput}
                  placeholder="50000"
                  placeholderTextColor={COLORS.textSecondary}
                  value={interestAmount}
                  onChangeText={(text) => {
                    const formatted = formatCurrency(text);
                    setInterestAmount(formatted);
                  }}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              <Text style={styles.hint}>
                Investment range: {formatCurrencyDisplay(opportunity.min_investment)} - {formatCurrencyDisplay(opportunity.max_investment)}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Message (Optional)
              </Text>
              <View style={styles.messageInputContainer}>
                <MessageSquare size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.messageInput}
                  placeholder="Add a message to the founder..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Funding Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Target Amount:</Text>
                <Text style={styles.infoValue}>{formatCurrencyDisplay(opportunity.target_amount)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Raised:</Text>
                <Text style={styles.infoValue}>{formatCurrencyDisplay(opportunity.raised_amount)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valuation:</Text>
                <Text style={styles.infoValue}>{formatCurrencyDisplay(opportunity.valuation)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={loading ? 'Submitting...' : 'Express Interest'}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  sectionDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  form: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_WEIGHTS.medium,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  required: {
    color: COLORS.error,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  amountInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    minHeight: 120,
  },
  messageInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  hint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  infoTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    width: '100%',
  },
});


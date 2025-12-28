import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, FONT_FAMILY, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '@/constants/theme';
import { Calendar as CalendarIcon, Clock, X, ChevronDown, Check } from 'lucide-react-native';

interface DateTimePickerProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  mode: 'date' | 'time';
  placeholder?: string;
  error?: string;
  minDate?: Date;
  availableDates?: string[]; // ISO date strings (YYYY-MM-DD)
  availableTimes?: { label: string; value: string }[]; // For time picker
}

export function DateTimePicker({
  label,
  value,
  onValueChange,
  mode,
  placeholder = 'Select...',
  error,
  minDate,
  availableDates,
  availableTimes,
}: DateTimePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setModalVisible(false);
  };

  const formatDisplayValue = useMemo(() => {
    if (!value) return placeholder;

    if (mode === 'date') {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } catch {
        return value;
      }
    } else {
      // Time mode - look up the label from availableTimes
      if (availableTimes && availableTimes.length > 0) {
        const selectedTime = availableTimes.find(t => t.value === value);
        if (selectedTime) {
          return selectedTime.label;
        }
      }
      // Fallback: return value as-is
      return value;
    }
  }, [value, mode, availableTimes, placeholder]);

  // Generate calendar dates for date picker
  const calendarDates = useMemo(() => {
    const dates: { date: string; display: string; available: boolean }[] = [];
    const today = minDate || new Date();
    
    // Generate next 60 days
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const isoDate = date.toISOString().split('T')[0];
      
      const available = !availableDates || availableDates.includes(isoDate);
      
      dates.push({
        date: isoDate,
        display: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        available,
      });
    }
    
    return dates;
  }, [minDate, availableDates]);

  const renderDateItem = (item: { date: string; display: string; available: boolean }) => {
    const isSelected = value === item.date;
    
    return (
      <TouchableOpacity
        key={item.date}
        activeOpacity={item.available ? 0.6 : 1}
        style={[
          styles.optionItem,
          isSelected && styles.optionItemSelected,
          !item.available && styles.optionItemDisabled,
        ]}
        onPress={() => item.available && handleSelect(item.date)}
        disabled={!item.available}>
        <Text
          style={[
            styles.optionText,
            isSelected && styles.optionTextSelected,
            !item.available && styles.optionTextDisabled,
          ]}>
          {item.display}
        </Text>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Check size={18} color={COLORS.background} strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTimeItem = (item: { label: string; value: string }) => {
    const isSelected = value === item.value;
    
    return (
      <TouchableOpacity
        key={item.value}
        activeOpacity={0.6}
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
        onPress={() => handleSelect(item.value)}>
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {item.label}
        </Text>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Check size={18} color={COLORS.background} strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const hasValue = !!value;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.picker, error && styles.pickerError, hasValue && styles.pickerWithValue]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}>
        <View style={styles.pickerContent}>
          {mode === 'date' ? (
            <CalendarIcon size={20} color={hasValue ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
          ) : (
            <Clock size={20} color={hasValue ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
          )}
          <Text style={[styles.pickerText, !hasValue && styles.pickerPlaceholder]}>
            {formatDisplayValue}
          </Text>
          <ChevronDown size={18} color={COLORS.textSecondary} strokeWidth={2} />
        </View>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
        statusBarTranslucent>
        <View style={styles.modalOverlay}>
          {/* Backdrop */}
          <Pressable style={styles.modalBackdrop} onPress={handleClose} />
          
          {/* Modal Content */}
          <View style={styles.modalSheet}>
            {/* Handle bar */}
            <View style={styles.modalHandle}>
              <View style={styles.handleBar} />
            </View>
            
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'date' ? 'Select Date' : 'Select Time'}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={24} color={COLORS.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <ScrollView 
              style={styles.optionsList}
              contentContainerStyle={styles.optionsContent}
              showsVerticalScrollIndicator={true}
              bounces={false}>
              {mode === 'date' ? (
                calendarDates.length > 0 ? (
                  calendarDates.map(renderDateItem)
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No dates available</Text>
                  </View>
                )
              ) : (
                availableTimes && availableTimes.length > 0 ? (
                  availableTimes.map(renderTimeItem)
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {availableDates && availableDates.length === 0
                        ? 'Please select a date first'
                        : 'No time slots available'}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontSize: FONT_SIZES.md,
  },
  picker: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 56,
    justifyContent: 'center',
  },
  pickerWithValue: {
    borderColor: COLORS.primary + '60',
    backgroundColor: COLORS.primaryLight + '10',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pickerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  pickerPlaceholder: {
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.body,
  },
  pickerError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    minHeight: 350,
    ...SHADOWS.lg,
    ...(Platform.OS === 'web' ? { boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' } : {}),
  },
  modalHandle: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  optionsList: {
    flex: 1,
  },
  optionsContent: {
    paddingVertical: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.sm,
    marginVertical: 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'transparent',
    minHeight: 54,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primary + '15',
  },
  optionItemDisabled: {
    opacity: 0.4,
  },
  optionText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILY.body,
    color: COLORS.text,
    flex: 1,
  },
  optionTextSelected: {
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.primary,
  },
  optionTextDisabled: {
    color: COLORS.textSecondary,
  },
  checkIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});

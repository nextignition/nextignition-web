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
import { ChevronDown, X, Check } from 'lucide-react-native';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerProps {
  label?: string;
  value?: string;
  selectedValue?: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
  error?: string;
}

export function Picker({ label, value, selectedValue, onValueChange, items, placeholder = 'Select...', error }: PickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Support both 'value' and 'selectedValue' props for compatibility
  const currentValue = value !== undefined ? value : selectedValue || '';
  
  const selectedItem = useMemo(() => {
    return items.find((item) => item.value === currentValue);
  }, [items, currentValue]);
  
  const displayValue = selectedItem ? selectedItem.label : placeholder;
  const hasValue = !!selectedItem;

  const handleSelect = (val: string) => {
    onValueChange?.(val);
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const renderItem = (item: PickerItem) => {
    const isSelected = currentValue === item.value;
    
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.picker, error && styles.pickerError, hasValue && styles.pickerWithValue]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}>
        <Text 
          style={[
            styles.pickerText, 
            !hasValue && styles.pickerPlaceholder
          ]}
          numberOfLines={1}>
          {displayValue}
        </Text>
        <ChevronDown size={18} color={COLORS.textSecondary} strokeWidth={2} />
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
              <Text style={styles.modalTitle}>{label || 'Select an option'}</Text>
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
              {items.length > 0 ? (
                items.map(renderItem)
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No options available</Text>
                </View>
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
    marginBottom: SPACING.xs,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 56,
    gap: SPACING.sm,
  },
  pickerWithValue: {
    borderColor: COLORS.primary + '60',
    backgroundColor: COLORS.primaryLight + '10',
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
    maxHeight: '70%',
    minHeight: 300,
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
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
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
  checkIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Copy, Trash2, Reply, MoreVertical } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, FONT_FAMILY } from '@/constants/theme';
import { Message } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import * as Clipboard from 'expo-clipboard';

interface MessageActionsProps {
  message: Message;
  onReply?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export function MessageActions({
  message,
  onReply,
  onDelete,
  visible,
  onClose,
  position,
}: MessageActionsProps) {
  const { user } = useAuth();
  const isOwnMessage = message.sender_id === user?.id;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message.content);
    onClose();
    // TODO: Show toast notification
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={[styles.menu, { top: position.y, left: position.x }]}>
          <TouchableOpacity style={styles.menuItem} onPress={handleCopy}>
            <Copy size={18} color={COLORS.text} strokeWidth={2} />
            <Text style={styles.menuItemText}>Copy</Text>
          </TouchableOpacity>

          {!isOwnMessage && onReply && (
            <TouchableOpacity style={styles.menuItem} onPress={handleReply}>
              <Reply size={18} color={COLORS.text} strokeWidth={2} />
              <Text style={styles.menuItemText}>Reply</Text>
            </TouchableOpacity>
          )}

          {isOwnMessage && onDelete && (
            <TouchableOpacity style={[styles.menuItem, styles.deleteItem]} onPress={handleDelete}>
              <Trash2 size={18} color={COLORS.error} strokeWidth={2} />
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.xs,
    minWidth: 150,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  menuItemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  deleteItem: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
  },
  deleteText: {
    color: COLORS.error,
  },
});


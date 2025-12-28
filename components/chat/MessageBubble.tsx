import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '@/constants/theme';
import { Message } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { Check, CheckCheck } from 'lucide-react-native';
import { MessageActions } from './MessageActions';

interface MessageBubbleProps {
  message: Message;
  onReply?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
}

export function MessageBubble({ message, onReply, onDelete }: MessageBubbleProps) {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ x: 0, y: 0 });
  const isOwnMessage = message.sender_id === user?.id;
  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Determine read receipt status
  // For direct messages: check if the other user has read it
  // Single check = sent, Double check = delivered, Blue double check = read
  const readReceiptStatus = isOwnMessage ? (() => {
    if (!message.read_by || message.read_by.length === 0) {
      return 'sent'; // Single gray check
    }
    // Check if any other user (not sender) has read it
    const otherUsersRead = message.read_by.filter(id => id !== user?.id);
    if (otherUsersRead.length > 0) {
      return 'read'; // Double blue check
    }
    return 'delivered'; // Double gray check
  })() : null;

  const handleLongPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setActionPosition({ x: pageX - 75, y: pageY - 50 });
    setShowActions(true);
  };

  return (
    <>
      <Pressable
        style={[styles.container, isOwnMessage && styles.ownMessageContainer]}
        onLongPress={handleLongPress}
        delayLongPress={300}>
        <View style={[styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
          {!isOwnMessage && (
            <View style={styles.senderInfo}>
              <Text style={styles.senderName}>{message.sender_name}</Text>
              {message.sender_role && (
                <Text style={styles.senderRole}>
                  {message.sender_role.charAt(0).toUpperCase() + message.sender_role.slice(1)}
                </Text>
              )}
            </View>
          )}
          <Text style={[styles.content, isOwnMessage && styles.ownContent]}>
            {message.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.time, isOwnMessage && styles.ownTime]}>{time}</Text>
            {isOwnMessage && (
              <View style={styles.readReceipt}>
                {readReceiptStatus === 'read' ? (
                  <CheckCheck size={14} color={COLORS.primary} strokeWidth={2.5} fill={COLORS.primary} />
                ) : readReceiptStatus === 'delivered' ? (
                  <CheckCheck size={14} color={COLORS.textSecondary} strokeWidth={2.5} />
                ) : (
                  <Check size={14} color={COLORS.textSecondary} strokeWidth={2.5} />
                )}
              </View>
            )}
          </View>
        </View>
      </Pressable>
      
      <MessageActions
        message={message}
        onReply={onReply}
        onDelete={onDelete}
        visible={showActions}
        onClose={() => setShowActions(false)}
        position={actionPosition}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  otherBubble: {
    backgroundColor: COLORS.inputBackground,
    borderBottomLeftRadius: SPACING.xs,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: SPACING.xs,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    marginBottom: SPACING.xs / 2,
  },
  senderName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  senderRole: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  content: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.xs / 2,
  },
  ownContent: {
    color: COLORS.background,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    marginTop: SPACING.xs / 2,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  ownTime: {
    color: COLORS.background,
    opacity: 0.8,
  },
  readReceipt: {
    marginLeft: SPACING.xs / 2,
  },
});

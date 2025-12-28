import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Notification, NotificationType } from './Notification';

export interface NotificationData {
  id: string;
  message: string;
  type?: NotificationType;
  duration?: number;
}

interface NotificationContainerProps {
  notifications: NotificationData[];
  onDismiss: (id: string) => void;
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {notifications.map((notification, index) => (
        <View
          key={notification.id}
          style={[
            styles.notificationWrapper,
            {
              top: 60 + index * 80, // Stack notifications with spacing
            },
          ]}>
          <Notification
            id={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onDismiss={onDismiss}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    pointerEvents: 'box-none',
  },
  notificationWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});


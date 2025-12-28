import { useState, useCallback } from 'react';
import { NotificationData } from '@/components/NotificationContainer';

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration = 5000) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const newNotification: NotificationData = {
        id,
        message,
        type,
        duration,
      };

      setNotifications((prev) => [...prev, newNotification]);
      return id;
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration = 5000) => {
    return showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message: string, duration = 5000) => {
    return showNotification(message, 'error', duration);
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration = 5000) => {
    return showNotification(message, 'info', duration);
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration = 5000) => {
    return showNotification(message, 'warning', duration);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    dismissNotification,
  };
}


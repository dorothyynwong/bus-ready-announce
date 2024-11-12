import { registerForPushNotificationsAsync } from '@/config/notificationConfig';
import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';
import { Context, createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationContextType = {
  expoPushToken: string;
  notification?: Notifications.Notification;
};

type NotificationContextPropsType = {
  children: ReactNode;
};


const NotificationContext: Context<NotificationContextType | null> =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: NotificationContextPropsType) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        setExpoPushToken(token ?? '');
        if (token && token !== '') {
          await AsyncStorage.setItem('expoPushToken', token);
        }
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);

      if (notification.request.content.body) {
        const speechOptions = {
          rate: 0.5,
        };
        Speech.speak(notification.request.content.body, speechOptions);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <>
      <NotificationContext.Provider value={{ expoPushToken, notification }}>
        {children}
      </NotificationContext.Provider>
    </>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within an NotificationProvider. Make sure you are rendering NotificationProvider at the top level of your application."
    );
  }

  return context;
};
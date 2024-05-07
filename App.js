import React, { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import Navigation from "./screens/Navigation";

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't forget!",
        body: "Have you checked your bills yet?",
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't forget!",
        body: "Have you checked your bills yet?",
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });

    return () => {
    };
  }, []);

  /* Modify Notification to alert when bills are Overdue, SoonDue, OnDue */
  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  };

  return <Navigation />;
}

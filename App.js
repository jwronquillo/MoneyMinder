import React, { useEffect } from "react";
<<<<<<< HEAD
=======
import * as Notifications from 'expo-notifications';
>>>>>>> 92abf1e9adad7fb0ae7416efc9f403043daf4609
import Navigation from "./screens/Navigation";
import { getAllBills } from "./Storage";

export default function App() {
  useEffect(() => {
<<<<<<< HEAD
    checkUpcomingBills();
  }, []);

  const checkUpcomingBills = async () => {
    try {
      const parsedBills = await getAllBills();
      const today = new Date();
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      const upcomingBills = parsedBills.filter(
        (bill) => new Date(bill.dueDate) <= sevenDaysFromNow
      );

      if (upcomingBills.length > 0) {
        const message =
          "You have bills due within the next 7 days. Check your bills!";
        alert(message);
      }
    } catch (error) {
      console.error("Error checking upcoming bills:", error);
    }
=======
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
>>>>>>> 92abf1e9adad7fb0ae7416efc9f403043daf4609
  };

  return <Navigation />;
}

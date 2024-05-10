import React, { useEffect } from "react";
import Navigation from "./screens/Navigation";
import { getAllBills } from "./Storage";

export default function App() {
  useEffect(() => {
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
  };

  return <Navigation />;
}

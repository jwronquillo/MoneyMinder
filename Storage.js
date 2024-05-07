// dataStorage.js
//Add billEdit Function

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllBills = async () => {
    try {
        const storedBills = await AsyncStorage.getItem('bills');
        return storedBills ? JSON.parse(storedBills) : [];
    } catch (error) {
        console.error('Error getting bills: ', error);
        return [];
    }
};

export const saveBill = async (newBill) => {
    try {
        const existingBills = await getAllBills();
        const updatedBills = [...existingBills, newBill];
        await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));
        return updatedBills;
    } catch (error) {
        console.error('Error saving bill: ', error);
        return [];
    }
};

export const deleteBill = async (billID) => {
    try {
        const existingBills = await getAllBills();
        const updatedBills = existingBills.filter((bill) => bill.id !== billID);
        await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));
        return updatedBills;
    } catch (error) {
        console.error('Error deleting bill: ', error);
        return [];
    }
};

export const updateBillStatus = async (billID, newStatus) => {
    try {
        const existingBills = await getAllBills();
        const updatedBills = existingBills.map(bill => {
            if (bill.id === billID) {
                return { ...bill, status: newStatus };
            }
            return bill;
        });
        await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));
        return updatedBills;
    } catch (error) {
        console.error('Error updating bill status: ', error);
        return [];
    }
};

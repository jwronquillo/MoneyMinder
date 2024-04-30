
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Modal, TextInput } from "react-native";
import { Calendar } from "react-native-calendars";
import { deleteBill, saveBill, getAllBills } from "../Storage";
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
    const [bills, setBills] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newBillName, setNewBillName] = useState('');
    const [newBillAmount, setNewBillAmount] = useState('');

    useEffect(() => {
        loadBills(selectedDay);
    }, [selectedDay]);

    const loadBills = async (date) => {
        try {
            const parsedBills = await getAllBills();
            const billsDueOnDate = parsedBills.filter(bills => bills.dueDate === date);
            setBills(billsDueOnDate);
        } catch (error) {
            console.error('Error loading bills: ', error);
        }
    };

    const addBill = async () => {
        try{
            const newBill = {
                id: Date.now(),
                name: newBillName,
                dueDate: selectedDay,
                amount: parseFloat(newBillAmount),
                status: 'unpaid'
            };
            await saveBill(newBill);
            setNewBillName('');
            setNewBillAmount('');
            setIsModalVisible(false);
            loadBills(selectedDay);
        } catch (error) {
            console.error('Error adding bill: ', error);
        }
    };

    const handleDeleteBill = async (billID) => {
        try {
            await deleteBill(billID);
            loadBills(selectedDay);
        } catch (error) {
            console.error('Error deleting bill: ', error);
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Calendar Screen</Text>
            </View>
            <Calendar
                style={styles.calendar}
                current={selectedDay}
                markedDates={{
                    [selectedDay]: { selected: true, selectedColor: 'tomato' },
                    [new Date().toISOString().split('T')[0]]: { startingDay: true, color: 'tomato', textColor: 'white' },
                }}
                onDayPress={(day) => {
                    setSelectedDay(day.dateString);
                }}
            />
            <View style={styles.billsContainer}>
                <Text style={styles.billsTitle}>Bills Due on {selectedDay}: </Text>
                {bills.map((bill) => (
                    <View key={bill.id} style={styles.bill}>
                        <Text>{bill.name}</Text>
                        <Text>₱ {bill.amount}</Text>
                        <Text>Status: {bill.status}</Text>
                        <Button title="Delete" onPress={() => handleDeleteBill(bill.id)} />
                    </View>
                ))}
            </View>
            
            <View style={styles.addButton}>
                <Ionicons name="add-circle" size={70} color="tomato" onPress={() => setIsModalVisible(true)} />
            </View>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Bill Title"
                            value={newBillName}
                            onChangeText={setNewBillName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={newBillAmount}
                            onChangeText={setNewBillAmount}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Confirm" onPress={addBill} />
                            <Button title="Cancel" color="red" onPress={() => setIsModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    calendar: {
        marginBottom: 20,
    },
    billsContainer: {
        marginTop: 20,
    },
    billsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bill:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%',
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default CalendarScreen;

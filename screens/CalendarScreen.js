
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
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
                <Text style={styles.headerText}>UPCOMING BILLS</Text>
            </View>
            <View style={styles.calendarcontainer}>
            <Calendar
                style={styles.calendar}
                current={selectedDay}
                markedDates={{
                    [selectedDay]: { selected: true, selectedColor: '#195fe6' },
                    [new Date().toISOString().split('T')[0]]: { startingDay: true, color: '#195fe6', textColor: 'white' },
                }}
                onDayPress={(day) => {
                    setSelectedDay(day.dateString);
                }}
            />
            </View>
            <View style={styles.billsContainer}>
                <Text style={styles.billsTitle}>Bills Due on {selectedDay}: </Text>
                {bills.map((bill) => (
                    <View key={bill.id} style={styles.bill}>
                        <Text style={styles.billname}>{bill.name}</Text>
                        <Text>₱ {bill.amount}</Text>
                        <Text>Status: {bill.status}</Text>
                        <TouchableOpacity onPress={() => handleDeleteBill(bill.id)}>
                            <Ionicons name="close-circle" size={35} color="red" />
                        </TouchableOpacity>

                    </View>
                ))}
                
            </View>
            
            <View style={styles.addButton}>
                <Ionicons name="add-circle" size={70} color="#195fe6" onPress={() => setIsModalVisible(true)} />
            </View>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Bill title</Text>
                        <TextInput
                            style={styles.input} 
                            placeholder="Enter Bill Title"
                            value={newBillName}
                            onChangeText={setNewBillName}
                        />
                    <Text style={styles.modalTitle}>Amount</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Amount"
                            keyboardType="numeric"
                            value={newBillAmount}
                            onChangeText={setNewBillAmount}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.confirmButton} onPress={addBill}>
                                            <Text style={styles.buttonText}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
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
        padding: 30,
        backgroundColor: '#9ddfff',
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        
    },
    calendarcontainer:{
        padding: 5,
        backgroundColor: 'white',
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    },
    calendar: {
        
    },
    billsContainer: {
        marginTop: 20,
    },
    billsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    billname: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    bill:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        backgroundColor: '#fff',
        // Shadow properties
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,

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
        borderRadius: 20,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        marginBottom: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    confirmButton: {
        backgroundColor: '#195fe6',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginRight: 10,
        width: '40%',
    },
    cancelButton: {
        backgroundColor: '#ff5757',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '40%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center'
    },

});

export default CalendarScreen;

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAllBills, updateBillStatus } from "../Storage";

const MainScreen = ({ navigation }) => {
    const [overdueBills, setOverdueBills] = useState([]);
    const [soonDueBills, setSoonDueBills] = useState([]);
    const [onDueBills, setOnDueBills] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);

    // Function to load bills data
    const loadBills = async () => {
        try {
            const parsedBills = await getAllBills();
            const today = new Date().toISOString().split('T')[0];

            const overdue = parsedBills.filter(bill => bill.dueDate < today && bill.status !== 'paid');
            const soonDue = parsedBills.filter(bill => bill.dueDate >= today && bill.dueDate <= calculateDate(7) && bill.status !== 'paid');
            const onDue = parsedBills.filter(bill => bill.dueDate === today && bill.status !== 'paid');

            setOverdueBills(overdue);
            setSoonDueBills(soonDue);
            setOnDueBills(onDue);
        } catch (error) {
            console.error('Error loading bills: ', error);
        }
    };

    // Function to calculate date
    const calculateDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    // Load bills data when screen gains focus
    useFocusEffect(
        useCallback(() => {
            loadBills();
        }, [])
    );

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
        setModalVisible(true);
    };

    const handlePaidButtonPress = async (billID) => {
        try {
            await updateBillStatus(billID, 'paid');
            const updatedCategory = selectedCategory.filter(bill => bill.id !== billID);
            setSelectedCategory(updatedCategory);
            loadBills(); // Reload bills data after updating status
        } catch (error) {
            console.error('Error updating bill status: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress(overdueBills)}>
                <Text style={styles.categoryTitle}>Overdue Bills</Text>
                <Text style={styles.categoryContent}>Total: {overdueBills.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress(soonDueBills)}>
                <Text style={styles.categoryTitle}>Soon Due Bills</Text>
                <Text style={styles.categoryContent}>Total: {soonDueBills.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress(onDueBills)}>
                <Text style={styles.categoryTitle}>On Due Bills</Text>
                <Text style={styles.categoryContent}>Total: {onDueBills.length}</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                {/* Modal Content */}
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bills</Text>
                        {selectedCategory.map(bill => (
                            <View key={bill.id} style={styles.bill}>
                                <Text>{bill.name}</Text>
                                <Text>₱ {bill.amount}</Text>
                                <Text>{bill.dueDate}</Text>
                                <Text>{bill.status}</Text>
                                {bill.status !== 'paid' && (
                                    <Button title="Paid" onPress={() => handlePaidButtonPress(bill.id)} />
                                )}
                            </View>
                        ))}
                    </View>
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    category: {
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryContent: {
        fontSize: 16,
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
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bill: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default MainScreen;

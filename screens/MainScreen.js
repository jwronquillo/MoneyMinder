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
            <Text style={styles.header}>MONEY MINDER</Text>
            <TouchableOpacity style={[styles.category, styles.category1]} onPress={() => handleCategoryPress(overdueBills)}>
                <Text style={styles.categoryTitle}>Overdue Bills</Text>
                <Text style={styles.categoryContent}>Total: {overdueBills.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.category, styles.category2]} onPress={() => handleCategoryPress(soonDueBills)}>
                <Text style={styles.categoryTitle}>Soon Due Bills</Text>
                <Text style={styles.categoryContent}>Total: {soonDueBills.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.category, styles.category3]} onPress={() => handleCategoryPress(onDueBills)}>
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
                        {selectedCategory.length === 0 ? (
                            <View style={styles.noBillsContainer}>
                                <Text style={styles.noBillsText}>No bills yet</Text>
                            </View>
                        ) : (
                            selectedCategory.map(bill => (
                                <View key={bill.id} style={styles.bill}>
                                    <View style={styles.billDetails}>
                                        <Text style={styles.billname}>{bill.name}</Text>
                                        <Text style={styles.billAmount}>₱ {bill.amount}</Text>
                                        <Text style={styles.billDueDate}>{bill.dueDate}</Text>
                                        <Text style={styles.billStatus}>Status: {bill.status}</Text>
                                    </View>
                                    {bill.status !== 'paid' && (
                                        <TouchableOpacity style={styles.paidButton} onPress={() => handlePaidButtonPress(bill.id)}>
                                            <Text style={styles.buttonText}>Paid</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))
                        )}
                        <Button title="Close" onPress={() => setModalVisible(false)}  />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
        backgroundColor: '#9ddfff',

    },
    header: {
        fontSize: 60,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 50,
        color: '#007BFF',
        textShadowColor: 'rgba(25, 95, 230, 0.5)', // Adjust shadow color and opacity
        textShadowOffset: { width: 0, height: 4 }, // Adjust the offset for the shadow
        textShadowRadius: 10, // Adjust the radius of the shadow
    },
    
    category: {
        marginBottom: 20,
        padding: 30,
        borderRadius: 20,
        height: '20%',
        shadowColor: '#000', // Add shadow for a card-like effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    category1:{
        backgroundColor: 'tomato'
    },
    category2:{
        backgroundColor: '#e3b437'
    },
    category3:{
        backgroundColor: '#2fd087'
    },
    categoryTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff', // White text color
        marginBottom: 5,
    },
    categoryContent: {
        fontSize: 20,
        color: '#fff', // White text color
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#06f9dc',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%',
    },
    modalTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bill: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    billDetails: {
        flex: 1,
        marginLeft: 10,
    },
    billname: {
        fontSize:25,
        fontWeight: 'bold',
    },
    billAmount: {
        fontSize: 16,
        color: '#666',
    },
    billDueDate: {
        fontSize: 16,
        color: '#666',
    },
    billStatus: {
        fontSize: 16,
        color: '#666',
    },
    paidButton: {
        backgroundColor: '#06f9dc',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paidButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },

    noBillsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    noBillsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    
});

export default MainScreen;

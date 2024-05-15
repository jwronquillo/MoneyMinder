import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import * as Notifications from 'expo-notifications';

const Settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Request permission to send notifications
        const requestPermission = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Notification Permission',
                    'Please allow notifications in your device settings to enable this feature.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                );
            } else {
                setIsEnabled(true);
            }
        };

        requestPermission();
    }, []);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

    return (
        <View style={styles.container}>
            <View style={styles.notif}>
                <Text style={styles.heading}>Notification Settings</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.notheading}>Enable Notifications</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9ddfff',
        justifyContent: 'center'
    },
    notif: {
        padding:40,
        backgroundColor: 'white',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    notheading:{
        fontSize: 20,
        fontWeight: "bold",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: 'center',
        width: "80%",
    },
});

export default Settings;

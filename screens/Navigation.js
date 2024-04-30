import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

import MainScreen from "./MainScreen";
import CalendarScreen from "./CalendarScreen";
import Settings from "./Settings";
import Tips from "./TipsScreen";

const Tab = createBottomTabNavigator();


const Navigation = () => {
    return(
        <NavigationContainer>
            <Tab.Navigator 
                screenOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                    labelStyle: { fontSize: 12 },
                    style: { backgroundColor: 'lightgray' },
                }}
            >
                <Tab.Screen
                    name="MainScreen"
                    component={MainScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" color={color} size={size} />
                        ),
                    }}
                    />
                <Tab.Screen
                    name="Calendar"
                    component={CalendarScreen}
                    options={{
                        tabBarLabel: 'Calendar',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="calendar" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="settings" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Tips"
                    component={Tips}
                    options={{
                        tabBarLabel: 'Tips',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="information-circle" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
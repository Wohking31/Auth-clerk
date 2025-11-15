import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/app/HomeScreen";
import ProfileScreen from "../screens/app/ProfileScreen";
import SettingsScreen from "../screens/app/SettingScreen";
// import SettingsScreen from "../screens/app/SettingsScreen";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// First create a tab navigator for main app sections
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          // You would add an icon here using React Native Vector Icons
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

// Wrap tabs in a drawer for additional navigation options
export default function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: "#6366f1",
        drawerInactiveTintColor: "#6b7280",
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ title: "My App" }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

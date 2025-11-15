import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";
import AuthNavigator from "../navigator/AuthNavigator";
import AppNavigator from "../navigator/AppNavigator";
import LoadingScreen from "../screens/auth/LoadingScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  // While Clerk is initializing, show a loading screen
  // This prevents flashing between authentication states
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          // User is authenticated - show main app
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          // User is not authenticated - show auth screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

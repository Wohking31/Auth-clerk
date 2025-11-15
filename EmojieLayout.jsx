import { NavigationContainer } from "react-navigation/native";
import { createNativeStackNavigator } from "react-navigation/native-stack";
import { createBottomTabNavigator } from "react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
// import { FavoriteScreen } from "./screens/FavoriteScreen";
import React from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.screen name="home" component={TabNavigator} />
      <Tab.screen name="favorite" component={FavoriteScreen} />
    </Tab.Navigator>
  );
};

const EmojieLayout = () => {
  return (
    <NavigationContainer>
      <Stack.navigator>
        <Stack.screen
          name="onboarding"
          component={OnboardingScreen}
        ></Stack.screen>
        <Stack.screen name="signin" component={SignInScreen}></Stack.screen>
        <Stack.screen name="home" component={TabNavigator}></Stack.screen>
      </Stack.navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default EmojieLayout;

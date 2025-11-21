// App.js - FIXED

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { CartProvider } from "./context/CartContext";
import AppNavigator from "./navigation/AppNavigation";

// Token cache for Clerk
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Get your publishable key from Clerk Dashboard
const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "YOUR_CLERK_PUBLISHABLE_KEY";

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <CartProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CartProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

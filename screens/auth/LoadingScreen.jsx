import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "500",
  },
});

export default LoadingScreen;

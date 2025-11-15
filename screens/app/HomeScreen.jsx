import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.firstName || "there"}! 👋
        </Text>
        <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Account Status</Text>
        <Text style={styles.cardText}>
          Email: {user?.primaryEmailAddress?.emailAddress}
        </Text>
        <Text style={styles.cardText}>
          Verified: {user?.primaryEmailAddress?.verification?.status || "No"}
        </Text>
      </View>

      {/* Additional content sections would go here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 20,
    backgroundColor: "#6366f1",
    paddingTop: 60, // Account for status bar
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e7ff",
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#1f2937",
  },
  cardText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
});

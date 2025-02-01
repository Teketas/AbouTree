import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the authentication token
      await AsyncStorage.removeItem("userToken");

      // Navigate back to the login screen
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An error occurred during logout.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pagrindinis puslapis</Text>
      <Button title="Logout" onPress={handleLogout} color="#FF6347" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

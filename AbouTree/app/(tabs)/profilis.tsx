import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../../axiosConfig";
import { useRouter } from "expo-router";

export default function Profilis() {
  const [profile, setProfile] = useState({ email: "", created_at: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await apiClient.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error: any) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        Alert.alert("Error", "Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Naudotojo profilis</Text>
      <Text>El.Paštas: {profile.email}</Text>
      <Text>Sukurimo data: {new Date(profile.created_at).toLocaleString()}</Text>
      <Button title="Atsijungti" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
});

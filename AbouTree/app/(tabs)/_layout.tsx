import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Pressable, View, Text, Modal, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const navigateAndClose = (route: "/" | "/profilis" | "/nustatymai") => {
    router.push(route);
    setModalVisible(false);
  };

  const HeaderRight = () => (
    <View>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          marginRight: 15,
        })}
      >
        <Ionicons
          name="menu"
          size={24}
          color={colorScheme === "dark" ? "#fff" : "#000"}
        />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Pressable
              style={styles.menuItem}
              onPress={() => navigateAndClose("/")}
            >
              <FontAwesome5
                name="tree"
                size={20}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
              <Text
                style={[
                  styles.menuText,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Pagrindinis
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => navigateAndClose("/profilis")}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
              <Text
                style={[
                  styles.menuText,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Profilis
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => navigateAndClose("/nustatymai")}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
              <Text
                style={[
                  styles.menuText,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Nustatymai
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#000",
        headerShown: true,
        headerRight: () => <HeaderRight />,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pagrindinis",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tree" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profilis"
        options={{
          title: "Profilis",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nustatymai"
        options={{
          title: "Nustatymai",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  modalContent: {
    marginTop: 60,
    marginRight: 20,
    marginLeft: "auto",
    padding: 15,
    borderRadius: 10,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Profilis() {
  return (
    <View style={styles.container}>
      <Text>Profilio puslapis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

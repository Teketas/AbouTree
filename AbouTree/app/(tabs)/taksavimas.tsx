import { View, Text, StyleSheet } from "react-native";

export default function TaksavimasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Taksavimas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontFamily: "SpaceMono",
  },
});

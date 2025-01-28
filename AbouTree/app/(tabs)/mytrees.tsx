import { View, Text, StyleSheet } from "react-native";

export default function MyTreesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MyTrees</Text>
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

import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

export default function PagrindinisScreen() {
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // Fono animacija
    const backgroundAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -50,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    );

    // Teksto išnykimo ir mygtukų atsiradimo animacija
    setTimeout(() => {
      Animated.sequence([
        // Teksto išnykimas
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Mygtukų atsiradimas
        Animated.timing(buttonsAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    backgroundAnimation.start();
    return () => backgroundAnimation.stop();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/images/tree.png")}
        style={[
          styles.background,
          {
            transform: [{ translateX: translateX }],
          },
        ]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
          AbouTree
        </Animated.Text>

        <Animated.View
          style={[styles.buttonsContainer, { opacity: buttonsAnim }]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/taksavimas")}
          >
            <Text style={styles.buttonText}>Taksavimas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/mytrees")}
          >
            <Text style={styles.buttonText}>MyTrees</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    width: "150%",
    height: "100%",
    left: -100,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  text: {
    fontSize: 40,
    fontFamily: "SpaceMono",
    color: "white",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonsContainer: {
    position: "absolute",
    gap: 20,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "SpaceMono",
    color: "#000",
  },
});

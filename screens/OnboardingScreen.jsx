import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../constants/colors";
import burgerImage from "../assets/foods/burger.png";

export default function OnboardingScreen({ navigation, onComplete }) {
  const handleGetStarted = () => {
    if (onComplete) {
      onComplete();
    }
    navigation.navigate("Auth");
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={burgerImage} style={styles.image} />
      </View>

      <Text style={styles.title}>Hungry!</Text>
      <Text style={styles.subtitle}>Place Order Now</Text>
      <Text style={styles.description}>
        Fresh bakery delivery in Bamenda.{"\n"}
        Order your favorite bread, pastries & cakes online.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  imageContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    objectFit: "contain",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    objectFit: "cover",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 8,
    opacity: 0.95,
  },
  description: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 40,
    maxWidth: 320,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#000",
    borderColor: "black",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

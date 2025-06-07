import {
  StyleSheet,
  ImageBackground,
} from "react-native";

const backgroundImg = require("@/assets/images/home-background.png");

export default function HomeScreen() {
  return (
    <ImageBackground
      source={backgroundImg}
      resizeMode="cover"
      style={styles.background}
    ></ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    padding: 20,
  },
});

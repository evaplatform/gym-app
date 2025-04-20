import { ImageBackground, StyleSheet, Text } from "react-native";
const backgroundImg = require("@assets/images/background.jpg");

export default function App() {
  return (
    <ImageBackground
      source={backgroundImg}
      resizeMode="cover"
      style={styles.background}
    >
      <Text>sdasfsd</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});

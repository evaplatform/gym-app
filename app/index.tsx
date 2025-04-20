import { Button } from "@/components/ui/Button";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
const backgroundImg = require("@assets/images/background.jpg");

export default function App() {
  return (
    <ImageBackground
      source={backgroundImg}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.content}>
        <Button title="Acessar" />
      </View>
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
  content: {
    flex: 1,
    justifyContent: "flex-end", 
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});

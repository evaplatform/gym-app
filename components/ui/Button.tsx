import {
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useMemo } from "react";

type ButtonProps = {
  title: string;
};

export function Button({ title }: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors[theme].tint }]}
    >
      <Text style={[styles.text, { color: Colors[theme].text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 3,
    width: "100%",
  },
  text: {},
});

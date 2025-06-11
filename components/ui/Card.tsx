import { Colors } from "@/constants/Colors";
import { useMemo } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import Text from "@/components/ui/Text";

type CardProps = {
  label?: string;
};

export default function Card({ label }: CardProps) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      borderColor: Colors[theme].tint,
    };
  }, [theme]);

  return (
    <View style={[styles.cardContainer, customStyle]}>
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

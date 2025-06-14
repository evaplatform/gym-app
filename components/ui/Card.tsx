import { Colors } from "@/constants/Colors";
import { useMemo } from "react";
import { View, StyleSheet, useColorScheme, Image } from "react-native";
import Text from "@/components/ui/Text";

type CardProps = {
  label?: string;
  imageUri?: string;
};

export default function Card({ label, imageUri }: CardProps) {
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
      {imageUri && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
});

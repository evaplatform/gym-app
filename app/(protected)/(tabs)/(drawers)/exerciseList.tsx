import { Button } from "@/components/ui/Button";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View></View>

      <Button
        title="Adicionar exercício"
        onPress={() =>
          router.push("/(protected)/(exercisesStacks)/addExercise")
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 10,
  },
});

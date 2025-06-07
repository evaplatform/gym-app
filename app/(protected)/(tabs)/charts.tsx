import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "react-native";

export default function ChartsScreen() {
  return (
    <ThemedView>
      <ThemedText>Charts</ThemedText>
      <Button
        title="Go to Explore"
        onPress={() => {
          // Navigate to the Explore screen
        }}
      />
    </ThemedView>
  );
}
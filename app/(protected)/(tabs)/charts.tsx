import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import { Button } from "react-native";

export default function ChartsScreen() {
  return (
    <Container>
      <ThemedText>Charts</ThemedText>
      <Button
        title="Go to Explore"
        onPress={() => {
          // Navigate to the Explore screen
        }}
      />
    </Container>
  );
}
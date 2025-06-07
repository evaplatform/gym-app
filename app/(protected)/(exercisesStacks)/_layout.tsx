import { Stack } from "expo-router";

export default function Layou() {
  return (
    <Stack>
      <Stack.Screen
        name="addExercise"
        options={{
          headerTitle: "Adicionar Exercício",
          title: "Adicionar Exercício",
        }}
      />
    </Stack>
  );
}

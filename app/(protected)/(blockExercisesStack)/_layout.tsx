import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="addBlock"
        options={{
          headerTitle: "Adicionar Bloco",
          title: "Adicionar Bloco",
        }}
      />
      {/* <Stack.Screen
        name="updateExercise"
        options={{
          headerTitle: "Editar Bloco",
          title: "Editar Bloco",
        }}
      /> */}
    </Stack>
  );
}

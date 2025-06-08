import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { View, StyleSheet, Text } from "react-native";
import useAddExercise from "./useAddExercise";

// export interface IExercise {
//   id: string;
//   name: string; // unique
//   academyId: IdType; // point to academy collection
//   exerciseBlockId: IdType;
//   description?: string;
//   video?: string;
//   imagePath?: string;
//   videoPath?: string;
//   createdAt: Date;
//   updatedAt?: Date;
// }

export default function Page() {
  const hooks = useAddExercise();

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", padding: 10 }}>
        <Input
          label="nome do exercício"
          value={hooks.name}  
          onChange={(e) => hooks.setName(e.nativeEvent.text)}
        />
        {/* Dropdown para selecionar o bloco de exercícios */}
        {/* Dropdown para selecionar a academia */}
        <Input
          label="descrição"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ height: 120 }}
          value={hooks.description}
          onChange={(e) => hooks.setDescription(e.nativeEvent.text)}
        />
      </View>

      <Button title="Criar" onPress={hooks.addExercise} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { View, StyleSheet, Text } from "react-native";

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
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", padding: 10 }}>
        <Input label="nome do exercício" />
        {/* Dropdown para selecionar o bloco de exercícios */}
        {/* Dropdown para selecionar a academia */}
        <Input
          label="descrição"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ height: 120 }}
        />
      </View>

      <Button title="Adicionar exercício" onPress={() => null} />
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

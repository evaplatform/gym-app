import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { View, StyleSheet } from "react-native";

type ExerciseScreenProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  onSave: () => Promise<void>;
};

export default function ExerciseScreen({
  name,
  setName,
  description,
  onSave,
  setDescription,
}: ExerciseScreenProps) {
  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <Input
          label="nome do exercício"
          value={name}
          onChange={(e) => setName(e.nativeEvent.text)}
        />
        {/* Dropdown para selecionar o bloco de exercícios */}
        {/* Dropdown para selecionar a academia */}
        <Input
          label="descrição"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ height: 120 }}
          value={description}
          onChange={(e) => setDescription(e.nativeEvent.text)}
        />
      </View>

      <Button title="Salvar" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});

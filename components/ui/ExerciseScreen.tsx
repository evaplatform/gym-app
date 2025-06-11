import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import usePickVideoImage from "@/hooks/usePickVideoImage";
import { View, StyleSheet } from "react-native";
import Container from "./Container";

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
  const { pickImage, pickVideo } = usePickVideoImage();

  return (
    <Container style={styles.container}>
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

      <Button title="subir imagem" onPress={pickImage} />
      <Button title="subir video" onPress={pickVideo} />
      <Button title="Salvar" onPress={onSave} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
  },
});

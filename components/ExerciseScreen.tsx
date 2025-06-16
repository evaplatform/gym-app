import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import usePickVideoImage from "@/hooks/usePickVideoImage";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import Container from "./ui/Container";
import * as ImagePicker from "expo-image-picker";

type ExerciseScreenProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  currentImagePath?: string | undefined;
  setExerciseImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  exerciseImage: string | undefined;
  onSave: () => Promise<void>;
  setImageAsset: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[] | null>
  >;
};

export default function ExerciseScreen({
  name,
  setName,
  description,
  onSave,
  setDescription,
  setExerciseImage,
  exerciseImage,
  setImageAsset,
  currentImagePath,
}: ExerciseScreenProps) {
  const { pickImage, pickVideo } = usePickVideoImage();

  return (
    <Container>
      <ScrollView contentContainerStyle={{ width: "100%" }}>
        <View style={styles.fields}>
          <View style={styles.inputWrapper}>
            <Input
              label="nome do exercício"
              value={name}
              onChange={(e) => setName(e.nativeEvent.text)}
            />
          </View>
          {/* Dropdown para selecionar o bloco de exercícios */}
          {/* Dropdown para selecionar a academia */}
          <View style={styles.inputWrapper}>
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

          <View style={styles.imageVideoGroup}>
            <View style={styles.imageWrapper}>
              {exerciseImage && (
                <Image source={{ uri: exerciseImage }} style={styles.image} />
              )}
              {!exerciseImage && (
                <Image
                  source={require("@/assets/images/default-exercise.jpg")}
                  style={styles.image}
                />
              )}
            </View>
            <Button
              title="subir imagem"
              onPress={async () => {
                const imageAsset = await pickImage(exerciseImage);
                if (imageAsset) {
                  setImageAsset(imageAsset);
                  setExerciseImage(imageAsset[0].uri);
                }
              }}
            />
          </View>

          <View style={styles.imageVideoGroup}>
            <View style={styles.imageWrapper}>
              {/* {exerciseImage && (
            <Image source={{ uri: exerciseImage }} style={styles.image} />
          )} */}
            </View>
            <Button title="subir video" onPress={pickVideo} />
          </View>
        </View>
      </ScrollView>
      <Button title="Salvar" onPress={onSave} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputWrapper: { width: "100%" },
  fields: {
    width: "100%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageVideoGroup: {
    width: 200,
    alignItems: "center",
    gap: 5,
    marginVertical: 10,
  },
  imageWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
});

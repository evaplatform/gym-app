import { Button } from "@/components/ui/Button";
import usePickVideoImage from "@/hooks/usePickVideoImage";
import { View, StyleSheet, Image, ScrollView, Text } from "react-native";
import Container from "./ui/Container";
import * as ImagePicker from "expo-image-picker";
import Dropdown, { ItemType } from "./ui/Dropdown";
import Input from "./ui/Input";
import { blockType, BlockTypeEnum } from "@/shared/enum/BlockTypeEnum";

type BlockScreenProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  currentImagePath?: string | undefined;
  setExerciseImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  exerciseImage: string | undefined;
  onSave: () => Promise<void>;
  setImageAsset: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[] | null>
  >;
  selectedBlock: BlockTypeEnum;
  setSelectedBlock: React.Dispatch<React.SetStateAction<BlockTypeEnum>>;
};

const items: ItemType[] = [
  {
    value: BlockTypeEnum.BODYBUILDING,
    label: blockType[BlockTypeEnum.BODYBUILDING],
  },
  {
    value: BlockTypeEnum.CARDIO,
    label: blockType[BlockTypeEnum.CARDIO],
  },
];

export default function BlockScreen({
  name,
  setName,
  onSave,
  setExerciseImage,
  exerciseImage,
  setImageAsset,
  currentImagePath,
  selectedBlock,
  setSelectedBlock,
}: BlockScreenProps) {
  const { pickImage, pickVideo } = usePickVideoImage();

  return (
    <Container>
      <ScrollView contentContainerStyle={{ width: "100%" }}>
        <View style={styles.fields}>
          <View style={styles.inputWrapper}>
            <Input
              label="nome do bloco de exercício"
              value={name}
              onChange={(e) => setName(e.nativeEvent.text)}
            />
          </View>
          <Dropdown
            items={items}
            label="tipo de bloco"
            selectedValue={selectedBlock}
            setSelectedLanguage={setSelectedBlock}
          />

          <View style={styles.imageVideoGroup}>
            <View style={styles.imageWrapper}>
              {exerciseImage && (
                <Image source={{ uri: exerciseImage }} style={styles.image} />
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

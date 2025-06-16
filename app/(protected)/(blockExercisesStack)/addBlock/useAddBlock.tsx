import { BlockTypeEnum } from "@/shared/enum/BlockTypeEnum";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function useAddBlock() {
  const [name, setName] = useState<string>("");
  const [currentImagePath, setCurrentImagePath] = useState<string | undefined>(
    undefined
  );
  const [imageAsset, setImageAsset] = useState<
    ImagePicker.ImagePickerAsset[] | null
  >(null);

  const [selectedBlock, setSelectedBlock] = useState(
    BlockTypeEnum.BODYBUILDING
  );

  const addBlock = async () => {

  }

  return {
    selectedBlock,
    setSelectedBlock,
    name,
    setName,
    currentImagePath,
    setCurrentImagePath,
    imageAsset,
    setImageAsset,
    addBlock
  };
}

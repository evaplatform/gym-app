import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useVideoImageStates() {
  const [imageAsset, setImageAsset] = useState<
    ImagePicker.ImagePickerAsset[] | null
  >(null);

  const [videoAsset, setVideoAsset] = useState<
    ImagePicker.ImagePickerAsset[] | undefined
  >(undefined);

  return {
    videoAsset,
    imageAsset,
    setImageAsset,
    setVideoAsset,
  };
}

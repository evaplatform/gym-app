import {
  StyleSheet,
  ImageSourcePropType,
  View,
  useColorScheme,
} from "react-native";

import { Skeleton } from "@/components/custom/Skeleton";
import { useMemo, useState } from "react";
import { IImagesTempProps } from "@/shared/interfaces/IImagesTempProps";
import CustomImage from "./CustomImage";
import { Colors } from "@/shared/constants/Colors";
import { IImageProp } from "@/shared/interfaces/IImageProp";

function hasImagePath(obj: any): obj is IImageProp {
  return obj && typeof obj.imagePath === "string";
}

export function ImageWrapper<T extends IImagesTempProps | IImageProp>({
  newRegister = false,
  object,
  isLoading,
  defaultImage,
}: {
  isLoading: boolean;
  object: T;
  newRegister?: boolean;
  defaultImage: ImageSourcePropType;
}) {
  const [fallbackImage, setFallbackImage] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      imageBorder: {
        borderColor: Colors[theme].gray300,
      },
    };
  }, [theme]);

  // loading
  if (isLoading && !fallbackImage) {
    return (
      <View style={[styles.imageBorder, customStyle.imageBorder]}>
        <Skeleton style={styles.imageVideoWrapper} />
      </View>
    );
  }

  if (hasImagePath(object)) {
    return (
      <CustomImage
        source={{ uri: object.imagePath }}
        style={styles.imageVideoWrapper}
        onError={() => setFallbackImage(true)}
      />
    );
  }

  // fallback image case there is no image
  if (!object?.currentImagePath || fallbackImage) {
    return (
      <CustomImage source={defaultImage} style={styles.imageVideoWrapper} />
    );
  }

  // loaded image
  if (object?.currentImagePath && !fallbackImage) {
    return (
      <View style={styles.imageBorder}>
        <CustomImage
          source={{ uri: object?.currentImagePath }}
          style={styles.imageVideoWrapper}
          onError={() => setFallbackImage(true)}
        />
      </View>
    );
  }

  if (newRegister) {
    return (
      <View style={styles.imageBorder}>
        <CustomImage source={defaultImage} style={styles.imageVideoWrapper} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageVideoWrapper: {
    width: 350,
    height: 275,
    resizeMode: "cover",
  },
  imageBorder: {
    borderWidth: 1,
  },
});

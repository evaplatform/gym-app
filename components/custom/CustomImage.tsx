import { fixFirebaseStorageUrl } from "@/shared/utils/fixFirebaseStorageUrl";
import React, { useState } from "react";
import {
  Image as RNImage,
  ImageProps,
  ImageSourcePropType,
  View,
  ViewStyle,
} from "react-native";
import { Skeleton } from "@/components/custom/Skeleton";

export interface ImageProperties extends ImageProps {
  source?: ImageSourcePropType | undefined;
  skeletonStyle?: ViewStyle;
}

export default function CustomImage({
  source,
  style,
  skeletonStyle,
  ...rest
}: ImageProperties) {
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se source existe e se tem a propriedade uri
  const processedSource =
    source &&
    typeof source === "object" &&
    "uri" in source &&
    typeof source.uri === "string"
      ? { ...source, uri: fixFirebaseStorageUrl(source.uri) }
      : source;

  return (
    <View style={style}>
      {isLoading && (
        <Skeleton style={[style as any, { position: "absolute", zIndex: 1 }]} />
      )}
      <RNImage
        {...rest}
        source={processedSource}
        style={[style, { opacity: isLoading ? 0 : 1 }]}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setIsLoading(false);
          rest.onError && rest.onError(e);
        }}
      />
    </View>
  );
}

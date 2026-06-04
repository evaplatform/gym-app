import { useMemo, useState } from "react";
import { View, StyleSheet, ImageSourcePropType, Pressable } from "react-native";
import Text from "@/components/custom/Text";
import { Skeleton } from "@/components/custom/Skeleton";
import CustomImage from "./CustomImage";
import useCustomStyle from "@/hooks/useCustomStyle";
import { ViewProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { IconType } from "@/shared/types/IconType";

type CardProps = {
  leftLabel?: string;
  centerIcon?: IconType;
  secondaryLabel?: string;
  source?: ImageSourcePropType;
  isLoading?: boolean;
  roundedImage?: boolean;
  viewStyles?: ViewProps["style"];
  isActive?: boolean;
  onPress?: () => void;
  rightLabel?: string;
  disabled?: boolean;
};

const fallbackImage = require("@/assets/images/default-exercise.jpg");

export default function Card({
  leftLabel,
  centerIcon,
  secondaryLabel,
  rightLabel,
  source,
  isLoading = false,
  roundedImage = false,
  isActive = false,
  viewStyles,
  onPress,
  disabled = false,
}: CardProps) {
  const { colors } = useCustomStyle();

  const [imageSource, setImageSource] = useState<
    ImageSourcePropType | undefined
  >(source);

  const customStyle = useMemo(() => {
    return {
      cardContainer: {
        borderColor: colors.tint,
      },
      activeCardContainer: {
        backgroundColor: colors.tint,
      },
    };
  }, [colors]);

  const treatedLeftLabel = useMemo(() => {
    const LIMIT_LENGTH_WITH_CENTER_ICON = 20;
    const LIMIT_LENGTH_WITHOUT_CENTER_ICON = 30;

    if (!leftLabel) return "";

    if (leftLabel.length > LIMIT_LENGTH_WITH_CENTER_ICON && centerIcon) {
      return leftLabel.slice(0, LIMIT_LENGTH_WITH_CENTER_ICON) + "...";
    }

    if (leftLabel.length > LIMIT_LENGTH_WITHOUT_CENTER_ICON) {
      return leftLabel.slice(0, LIMIT_LENGTH_WITHOUT_CENTER_ICON) + "...";
    }

    return leftLabel;
  }, [leftLabel]);

  return (
    <Pressable onPress={() => !disabled && onPress && onPress()}>
      <View
        style={[
          styles.cardContainer,
          customStyle.cardContainer,
          viewStyles,
          isActive && customStyle.activeCardContainer,
        ]}
      >
        {isLoading && <Skeleton style={[styles.skeletonText]} />}

        {!isLoading && (
          <View style={styles.labelContainer}>
            <Text>{treatedLeftLabel}</Text>
            {secondaryLabel && <Text>{secondaryLabel}</Text>}
          </View>
        )}

        {!isLoading && centerIcon && (
          <MaterialIcons
            name={centerIcon}
            size={24}
            color={colors.gray500}
            style={styles.centerIcon}
          />
        )}

        {!isLoading && rightLabel && <Text>{rightLabel}</Text>}

        {isLoading ? (
          <Skeleton style={[...(roundedImage ? [styles.roundedImage] : [])]} />
        ) : (
          imageSource && (
            <CustomImage
              source={imageSource}
              style={[styles.image, roundedImage && styles.roundedImage]}
              onError={() => setImageSource(fallbackImage)}
            />
          )
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skeletonText: {
    flex: 1,
    height: 20,
  },
  labelContainer: {},
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  roundedImage: { borderRadius: 40, width: 80, height: 80 },
  centerIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }],
  },
});

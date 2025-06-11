import {
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  TouchableOpacityProps,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useMemo } from "react";
import Text from "@/components/ui/Text";

type ButtonProps = {
  title: string;
  transparent?: boolean;
  imageSource?: ImageSourcePropType;
} & TouchableOpacityProps;

export function Button({
  title,
  children,
  transparent,
  imageSource,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      backgroundColor: transparent ? "transparent" : Colors[theme].tint,
      borderColor: Colors[theme].tint,
      borderWidth: transparent ? 1 : 0,
    };
  }, [theme, transparent]);

  return (
    <TouchableOpacity {...rest} style={[styles.container, customStyle]}>
      {children ?? (
        <View style={styles.contentWrapper}>
          {imageSource && (
            <Image
              source={imageSource}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Text style={[styles.text]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 3,
    width: "100%",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logo: {
    width: 60,
    height: 20,
  },
  text: {},
});

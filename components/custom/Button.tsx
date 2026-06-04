import {
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  TouchableOpacityProps,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "@/shared/constants/Colors";
import { useMemo } from "react";
import Text from "@/components/custom/Text";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { IAppColors, ThemeColors } from "@/shared/interfaces/IAppColors";
import { ThemeType } from "@/shared/types/ThemeType";
import CustomImage from "./CustomImage";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import useCustomStyle from "@/hooks/useCustomStyle";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons/";

type ButtonProps = {
  title?: string;
  isTransparent?: boolean;
  imageSource?: ImageSourcePropType;
  severity?: SeverityEnum;
  style?: TouchableOpacityProps["style"];
  icon?:
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  rounded?: boolean;
} & TouchableOpacityProps;

type ColorType = {
  isTransparent: boolean | undefined;
  colors: ThemeColors;
  severity: SeverityEnum;
  isBorder?: boolean;
};

const getColor = ({
  isTransparent = false,
  colors,
  severity,
  isBorder = false,
}: ColorType) => {
  if (isTransparent && !isBorder) return hexToRgba(colors.gray300, 0.9);

  switch (severity) {
    case SeverityEnum.PRIMARY:
      return colors.tint;
    case SeverityEnum.SECONDARY:
      return colors.secondary;
    case SeverityEnum.SUCCESS:
      return colors.notification.success;
    case SeverityEnum.DANGER:
      return colors.notification.danger;
    case SeverityEnum.WARN:
      return colors.notification.warn;
    case SeverityEnum.INFO:
      return colors.notification.info;
  }
};

export function Button({
  rounded = false,
  title,
  children,
  isTransparent,
  imageSource,
  severity = SeverityEnum.PRIMARY,
  style,
  icon,
  iconSize = 20,
  disabled,
  iconColor,
  ...rest
}: ButtonProps) {
  const { colors } = useCustomStyle();

  const iconFinalColor = iconColor || colors.text;

  const customStyle = useMemo(() => {
    const color = getColor({ isTransparent, colors, severity });

    return {
      backgroundColor: color,
      borderColor: color,
      borderWidth: isTransparent ? 0.5 : 0,
      opacity: disabled ? 0.5 : 1,
    };
  }, [isTransparent, severity, disabled, colors]);

  const onHandlePress = disabled ? undefined : rest.onPress;

  // Determine o estilo baseado na propriedade rounded
  const buttonStyle = [
    customStyle,
    styles.container,
    rounded && styles.rounded,
    // Se não houver título e for redondo, aplique o estilo de botão circular
    rounded && !title && !children && styles.circularButton,
    style,
  ];

  return (
    <TouchableOpacity
      {...rest}
      onPress={onHandlePress}
      activeOpacity={disabled ? 0.5 : 0.8}
      style={buttonStyle}
    >
      {children ?? (
        <View
          style={[
            styles.contentWrapper,
            rounded && !title && styles.circularContent,
          ]}
        >
          {imageSource && (
            <CustomImage
              source={imageSource}
              style={styles.logo}
              resizeMode="contain"
            />
          )}

          {icon &&
            (icon in MaterialIcons.glyphMap ? (
              <MaterialIcons
                name={icon as keyof typeof MaterialIcons.glyphMap}
                size={iconSize}
                color={iconFinalColor}
              />
            ) : (
              icon in FontAwesome.glyphMap && (
                <FontAwesome
                  name={icon as keyof typeof FontAwesome.glyphMap}
                  size={iconSize}
                  color={iconFinalColor}
                />
              )
            ))}

          {title && <Text style={[styles.text]}>{title}</Text>}
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
  rounded: {
    borderRadius: 9999,
  },
  // Estilo para botões circulares (sem texto, apenas ícone)
  circularButton: {
    width: 40, // Defina um tamanho fixo para botões circulares
    height: 40, // Mesmo valor da largura para formar um círculo perfeito
    padding: 0, // Remova o padding para que o botão fique perfeitamente redondo
    aspectRatio: 1, // Garante que a largura e altura sejam iguais
  },
  // Ajuste o conteúdo para botões circulares
  circularContent: {
    gap: 0,
  },
});

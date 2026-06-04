import { useMemo, useState } from "react";
import { Colors } from "@/shared/constants/Colors";
import {
  StyleSheet,
  useColorScheme,
  TextInputProps,
  View,
  ViewStyle,
  TextInput,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import setFirstLabelUppercase from "@/shared/utils/setFirstLabelUppercase";
import Text from "@/components/custom/Text";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import { MaterialIcons } from "@expo/vector-icons";

type MaskType = string | string[];

type InputProps = Omit<TextInputProps, "onChangeText"> & {
  label?: string;
  mask?: MaskType;
  onChangeText?: (text: string, rawText: string) => void;
  hidden?: boolean;
  leftIcon?: React.ComponentProps<typeof MaterialIcons>["name"];
  iconSize?: number;
  containerStyle?: ViewStyle;
};

export default function Input({
  label,
  style,
  mask,
  onChangeText,
  editable = true,
  hidden,
  leftIcon,
  iconSize = 20,
  containerStyle,
  ...rest
}: InputProps) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);
  const [currentMaskIndex, setCurrentMaskIndex] = useState(0);

  const inputCustomStyle = useMemo(() => {
    return {
      backgroundColor: !editable
        ? hexToRgba(Colors[theme].gray100, 0.2)
        : hexToRgba(Colors[theme].gray600, 0.2),
      color: !editable
        ? hexToRgba(Colors[theme].text, 0.5)
        : Colors[theme].text,
      borderColor: Colors[theme].tint,
      display: hidden
        ? ("none" as "none" | "flex" | "contents" | undefined)
        : ("flex" as "none" | "flex" | "contents" | undefined),
    };
  }, [theme, editable, hidden]);

  // Predefined masks
  const MASKS = {
    CPF: "999.999.999-99",
    CNPJ: "99.999.999/9999-99",
    PHONE: ["(99) 9999-9999", "(99) 99999-9999"],
    CEP: "99999-999",
    DATE: "99/99/9999",
    COST: "R$ 999.999,99",
    CARD_NUMBER: "9999 9999 9999 9999",
    EXPIRATION_DATE: "99/99",
    CVV: "999",
  };

  // Get the current mask based on the mask prop
  const getCurrentMask = () => {
    if (!mask) return "";

    if (typeof mask === "string") {
      // Check if it's a predefined mask
      if (mask in MASKS) {
        const predefinedMask = MASKS[mask as keyof typeof MASKS];
        return Array.isArray(predefinedMask)
          ? predefinedMask[currentMaskIndex]
          : predefinedMask;
      }
      return mask;
    }

    // If it's an array of masks, return the current one
    return mask[currentMaskIndex];
  };

  // Determine keyboard type based on mask
  const getKeyboardType = () => {
    if (!mask) return rest.keyboardType;

    const currentMask = getCurrentMask();

    // If mask only contains numbers and special characters
    if (/^[0-9\s\-/().]+$/.test(currentMask.replace(/9/g, "0"))) {
      return "numeric";
    }

    return rest.keyboardType;
  };

  // Handle mask changing based on input length - REFATORADA
  const handleChangeText = (formatted: string, extracted: string) => {
    // Determinar se precisamos mudar o índice da máscara
    let shouldUpdateMaskIndex = false;
    let newMaskIndex = currentMaskIndex;

    if (Array.isArray(mask)) {
      const shouldBeIndex1 = extracted.length > 10;
      if (shouldBeIndex1 && currentMaskIndex === 0) {
        newMaskIndex = 1;
        shouldUpdateMaskIndex = true;
      } else if (!shouldBeIndex1 && currentMaskIndex === 1) {
        newMaskIndex = 0;
        shouldUpdateMaskIndex = true;
      }
    }

    // Processar o texto para entradas numéricas
    let finalFormatted = formatted;
    let finalExtracted = extracted;

    if (getKeyboardType() === "numeric" && extracted !== "") {
      // Remove leading zeros but keep at least one digit
      finalExtracted = extracted.replace(/^0+(?=\d)/, "");

      if (mask) {
        // Para entradas mascaradas, podemos precisar reformatar
        finalFormatted = formatted.replace(/^0+(?=\d)/, "");
      }
    }

    // Atualizar o índice da máscara apenas uma vez, se necessário
    if (shouldUpdateMaskIndex) {
      setCurrentMaskIndex(newMaskIndex);
    }

    // Chamar onChangeText com os valores processados
    if (onChangeText) {
      onChangeText(finalFormatted, finalExtracted);
    }
  };

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && (
        <Text style={[styles.label]}>{setFirstLabelUppercase(label)}</Text>
      )}

      {leftIcon && (
        <MaterialIcons
          name={leftIcon}
          size={iconSize}
          color={Colors[theme].text}
          style={styles.leftIcon}
        />
      )}

      {mask ? (
        <MaskedTextInput
          {...rest}
          editable={editable}
          mask={getCurrentMask()}
          onChangeText={handleChangeText}
          style={[
            styles.input,
            inputCustomStyle,
            style,
            { paddingLeft: leftIcon ? iconSize + 20 : 10 },
          ]}
          keyboardType={getKeyboardType()}
        />
      ) : (
        <TextInput
          {...rest}
          editable={editable}
          style={[
            styles.input,
            inputCustomStyle,
            style,
            { paddingLeft: leftIcon ? iconSize + 20 : 10 },
          ]}
          onChangeText={(text: any) => onChangeText && onChangeText(text, text)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  label: { marginBottom: 5 },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  leftIcon: {
    position: "absolute",
    left: 10,
    top: 35,
    zIndex: 1,
  },
});

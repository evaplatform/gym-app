import { useMemo, useState } from "react";
import { Colors } from "@/shared/constants/Colors";
import { StyleSheet, useColorScheme, TextInputProps, View } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import setFirstLabelUppercase from "@/shared/utils/setFirstLabelUppercase";
import Text from "@/components/custom/Text";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import useCustomStyle from "@/hooks/useCustomStyle";
import Input from "./Input";
import useDebounce from "@/hooks/useDebounce";

type InputProps = Omit<TextInputProps, "onChangeText"> & {
  label?: string;
  onChangeText?: (text: string, rawText: string) => void;
  hidden?: boolean;
  debounceTimeMs?: number;
};

export default function Textarea({
  label,
  style,
  value,
  onChangeText,
  editable = true,
  hidden,
  debounceTimeMs = 0,
  ...rest
}: InputProps) {
  const { colors } = useCustomStyle();
  const [textLength, setTextLength] = useState(
    value ? value.toString().length : 0
  );

  const customStyle = useMemo(() => {
    return {
      inputCustomStyle: {
        backgroundColor: !editable
          ? hexToRgba(colors.gray100, 0.2)
          : hexToRgba(colors.gray600, 0.2),
        color: !editable ? hexToRgba(colors.text, 0.5) : colors.text,
        borderColor: colors.tint,
        display: hidden ? ("none" as "none") : ("flex" as "flex"),
      },
      lengthCounter: {
        color: colors.notification.info,
      },
    };
  }, [colors]);

  const debouncedOnChangeText = useDebounce((text) => {
    onChangeText && onChangeText(text, text);
  }, debounceTimeMs);

  return (
    <View style={styles.inputContainer}>
      {label && (
        <Text style={[styles.label]}>{setFirstLabelUppercase(label)}</Text>
      )}
      <Input
        {...rest}
        multiline
        value={value}
        editable={editable}
        style={[styles.input, customStyle.inputCustomStyle, style]}
        onChangeText={(text: any) => {
          onChangeText && onChangeText(text, text);
          setTextLength(text.length);
          debouncedOnChangeText(text);
        }}
      />
      <Text style={[styles.lengthCounter, customStyle.lengthCounter]}>
        {textLength} / {rest.maxLength || "∞"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    gap: 0,
  },
  label: { marginBottom: 0 },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  lengthCounter: {
    alignSelf: "flex-end",
    padding: 0,
    margin: 0,
  },
});

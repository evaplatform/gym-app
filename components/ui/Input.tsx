import { useMemo } from "react";
import { Colors } from "@/constants/Colors";
import {
  TextInput,
  StyleSheet,
  useColorScheme,
  TextInputProps,
  View,
} from "react-native";
import setFirstLabelUppercase from "@/utils/setFirstLabelUppercase";
import Text from "@/components/ui/Text";

type InputProps = TextInputProps & {
  label?: string;
};

export default function Input({ label, style, ...rest }: InputProps) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const inputCustonStyle = useMemo(() => {
    return {
      borderColor: Colors[theme].tint,
      color: Colors[theme].text,
    };
  }, [theme]);

  return (
    <View style={styles.inputContainer}>
      {label && (
        <Text style={[styles.label]}>{setFirstLabelUppercase(label)}</Text>
      )}
      <TextInput {...rest} style={[styles.input, inputCustonStyle, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  label: {},
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Picker, PickerProps } from "@react-native-picker/picker";
import { useMemo } from "react";
import { Colors } from "@/shared/constants/Colors";
import setFirstLabelUppercase from "@/shared/utils/setFirstLabelUppercase";

export type ItemType = {
  value: string;
  label: string;
};

type DropdownProps = {
  items: ItemType[];
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<any>>;
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
} & PickerProps;

export default function Dropdown({
  label,
  items,
  selectedValue,
  setSelectedValue,
  style,
  containerStyle,
}: DropdownProps) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customLabelStyle = useMemo(() => {
    return {
      color: Colors[theme].text,
    };
  }, [theme]);

  const customPickerStyle = useMemo(() => {
    return {
      color: Colors[theme].text,
      borderWidth: 1,
      borderColor: Colors[theme].tint,
      backgroundColor: Colors[theme].backgroundSecondary,
    };
  }, [theme]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, customLabelStyle]}>
        {setFirstLabelUppercase(label)}
      </Text>
      <View style={[customPickerStyle]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
          style={[styles.picker, customPickerStyle, style]}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // flex: 1,
  },
  label: { width: "100%", marginBottom: 5 },
  picker: {
    height: 50,
    width: "100%",
  },
});

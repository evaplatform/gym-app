import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useMemo } from "react";
import { Colors } from "@/constants/Colors";
import setFirstLabelUppercase from "@/utils/setFirstLabelUppercase";

export type ItemType = {
  value: string;
  label: string;
};

type DropdownProps = {
  items: ItemType[];
  selectedValue: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<any>>;
  label: string;
};

export default function Dropdown({
  label,
  items,
  selectedValue,
  setSelectedLanguage,
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
    <View style={styles.container}>
      <Text style={[styles.label, customLabelStyle]}>
        {setFirstLabelUppercase(label)}
      </Text>
      <View style={[customPickerStyle]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          style={[styles.picker, customPickerStyle]}
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
  container: { width: "100%" },
  label: { width: "100%", marginBottom: 5 },
  picker: {
    height: 50,
    width: "100%",
  },
});

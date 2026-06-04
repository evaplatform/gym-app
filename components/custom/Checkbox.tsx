import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import useCustomStyle from "@/hooks/useCustomStyle";

type CustomCheckboxProps = {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  textStyle?: object;
  containerStyle?: object;
  checkboxStyle?: object;
};

function Checkbox({
  label,
  checked: initialChecked = false,
  onChange,
  disabled = false,
  size = 24,
  textStyle = {},
  containerStyle = {},
  checkboxStyle = {},
}: CustomCheckboxProps) {
  const { colors } = useCustomStyle();
  const [checked, setChecked] = useState<boolean>(false);

  const customStyles = useMemo(() => {
    return {
      checkBoxView: {
        width: size,
        height: size,
        borderColor: disabled ? colors.gray300 : colors.tint,
        backgroundColor: checked ? colors.tint : "transparent",
      },
    };
  }, [colors]);

  const handlePress = () => {
    if (disabled) return;

    const newValue = !checked;
    setChecked(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.checkbox, customStyles.checkBoxView, checkboxStyle]}>
        {checked && (
          <Ionicons
            name="checkmark"
            size={size * 0.7}
            color={colors.text}
            style={styles.checkIcon}
          />
        )}
      </View>
      {label && (
        <Text
          style={[styles.label, { opacity: disabled ? 0.5 : 1 }, textStyle]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkIcon: {
    alignSelf: "center",
  },
});

export default Checkbox;

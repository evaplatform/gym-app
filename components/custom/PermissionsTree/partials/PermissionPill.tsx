import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useCustomStyle from "@/hooks/useCustomStyle";

interface PermissionPillProps {
  isPermitted: boolean;
  onToggle: (value: boolean) => void;
  compact?: boolean;
}

const PermissionPill = ({
  isPermitted,
  onToggle,
  compact = false,
}: PermissionPillProps) => {
  const { colors } = useCustomStyle();

  const customStyles = {};

  const handleToggle = (e: any) => {
    e.stopPropagation && e.stopPropagation();
    onToggle(!isPermitted);
  };

  return (
    <TouchableOpacity
      style={[styles.pill, compact && styles.compactPill]}
      onPress={handleToggle}
    >
      {isPermitted ? (
        <MaterialIcons
          name="check-circle"
          size={24}
          color={colors.notification.success}
        />
      ) : (
        <MaterialIcons
          name="block"
          size={24}
          color={colors.notification.danger}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  compactPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    alignSelf: "flex-start",
  },
});

export default PermissionPill;

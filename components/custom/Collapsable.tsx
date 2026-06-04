import { useState } from "react";
import { StyleSheet } from "react-native";
import useCustomStyle from "@/hooks/useCustomStyle";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import Text from "./Text";
import { hide } from "expo-splash-screen";

export type CollapsableProps = {
  title: string;
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  children: React.ReactNode;
  style?: ViewStyle;
  onlyHideContent?: boolean;
};

export default function Collapsable({
  title,
  isCollapsed = true,
  onToggle,
  children,
  style,
  onlyHideContent = false,
}: CollapsableProps) {
  const { colors } = useCustomStyle();

  const [collapsed, setCollapsed] = useState<boolean>(isCollapsed);

  const handleToggle = () => {
    setCollapsed(!collapsed);
    if (onToggle) {
      onToggle(!collapsed);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}
        onPress={handleToggle}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <FontAwesome
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={16}
          color={colors.text}
        />
      </TouchableOpacity>
      {!collapsed && !onlyHideContent ? (
        <View style={styles.content}>{children}</View>
      ) : null}

      {onlyHideContent && (
        <View
          style={[styles.content, { display: collapsed ? "none" : "flex" }]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 12,
  }
});

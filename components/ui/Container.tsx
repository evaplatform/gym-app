import { Colors } from "@/constants/Colors";
import { useMemo } from "react";
import { View, ViewProps, StyleSheet, useColorScheme } from "react-native";

type ViewProperties = {} & ViewProps;

export default function Container({
  children,
  style,
  ...rest
}: ViewProperties) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      backgroundColor: Colors[theme].background,
    };
  }, [theme]);

  return (
    <View {...rest} style={[styles.container, customStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

import { Colors } from "@/shared/constants/Colors";
import { useMemo } from "react";
import { View, ViewProps, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewProperties = ViewProps & {
  noTopPadding?: boolean;
};


export default function Container({
  children,
  style,
  noTopPadding,
  ...rest
}: ViewProperties) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      backgroundColor: "Colors[theme].background",
    };
  }, [theme]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <View {...rest}  style={[
          styles.container,
          noTopPadding && { paddingTop: 0 },
          customStyle,
          style,
        ]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

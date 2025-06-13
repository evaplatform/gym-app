import { Colors } from "@/constants/Colors";
import { useMemo } from "react";
import {
  Text as NativeText,
  TextProps,
  useColorScheme,
  StyleSheet,
} from "react-native";

type TextProperties = {
  children?: React.ReactNode;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
} & TextProps;

export default function Text({
  children,
  style,
  type  ,
  ...rest
}: TextProperties) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      color: Colors[theme].text,
    };
  }, [theme]);

  return (
    <NativeText
      {...rest}
      style={[
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        ,
        customStyle,
        style,
      ]}
    >
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});

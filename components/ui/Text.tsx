import { Colors } from "@/constants/Colors";
import { useMemo } from "react";
import { Text as NativeText, TextProps, useColorScheme } from "react-native";

type TextProperties = {
  children?: React.ReactNode;
} & TextProps;

export default function Text({ children, style, ...rest }: TextProperties) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      color: Colors[theme].text,
    };
  }, [theme]);

  return (
    <NativeText {...rest} style={[customStyle, style]}>
      {children}
    </NativeText>
  );
}

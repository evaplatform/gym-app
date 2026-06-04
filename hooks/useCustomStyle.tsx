import { Colors } from "@/shared/constants/Colors";
import { useMemo } from "react";
import { useColorScheme } from "react-native";

export default function useCustomStyle() {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  return { colors: Colors[theme], theme };
}

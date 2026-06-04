import { ColorSchemeName } from "react-native";

export type ThemeType = Extract<ColorSchemeName, 'light' | 'dark'>;
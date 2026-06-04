import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeType } from "@/shared/types/ThemeType";
import { Colors } from "@/shared/constants/Colors";

interface SkeletonProps {
  /**
   * Estilos personalizados para o componente Skeleton
   */
  style?: ViewStyle | ViewStyle[];
}

/**
 * Componente Skeleton genérico com gradiente animado
 * 
 * Exemplo de uso:
 * <Skeleton style={{ width: 200, height: 50, borderRadius: 8 }} />
 */
export function Skeleton({ style }: SkeletonProps) {
  const colorScheme = useColorScheme();
  const theme: ThemeType = useMemo(() => colorScheme ?? "light", [colorScheme]);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Estilo base do skeleton
  const defaultStyle = useMemo(() => ({
    backgroundColor: Colors[theme].gray300,
    overflow: "hidden" as "hidden",
    borderRadius: 4,
    minHeight: 20,
    minWidth: 20,
  }), [theme]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  // Interpolação para animar o gradiente
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[defaultStyle, style]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={[Colors[theme].gray300, Colors[theme].gray200, Colors[theme].gray300]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
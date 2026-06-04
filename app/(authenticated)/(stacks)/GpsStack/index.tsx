import Container from "@/components/custom/Container";
import Running from "@/components/custom/Running";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useCallback, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { IExercise } from "@/shared/models/IExercise";

export default function GpsStack() {
  const { exercise: exerciseJson } = useLocalSearchParams();

  const exercise = useMemo(() => {
    return exerciseJson
      ? (JSON.parse(exerciseJson as string) as IExercise)
      : undefined;
  }, [exerciseJson]);

  useFocusEffect(
    useCallback(() => {
      // Função que será chamada quando o botão voltar for pressionado
      const onBackPress = () => {
        // Retornando true, impedimos a navegação padrão para trás
        return true;
      };

      // Adiciona o listener para o evento de botão voltar
      // e armazena a subscription retornada
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      // Função de cleanup - usa o método remove() da subscription
      return () => subscription.remove();
    }, []),
  );

  return (
    <Container>
      <Running exercise={exercise} />
    </Container>
  );
}

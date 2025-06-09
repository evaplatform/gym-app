import { Button } from "@/components/ui/Button";
import { View, StyleSheet, FlatList } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/ui/Card";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";

export default function Page() {
  const router = useRouter();
  const { call } = useApi();
  const [list, setList] = useState<IExercise[]>([]);

  const getExerciseList = useCallback(async () => {
    call({
      try: async () => {
        const data = await ExerciseServices.getAll();
        setList(data);
      },
    });
  }, [call]);

  useFocusEffect(
    useCallback(() => {
      getExerciseList();
    }, [getExerciseList])
  );

  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <FlatList
          showsVerticalScrollIndicator
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <View style={styles.cardWrapper} key={item.item.id}>
              <Card label={item.item.name} />
            </View>
          )}
        />
      </View>

      <Button
        title="Adicionar exercício"
        onPress={() =>
          router.push("/(protected)/(exercisesStacks)/addExercise")
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  view: { flex: 1, width: "100%" },
  cardWrapper: {
    marginBottom: 10,
  },
});

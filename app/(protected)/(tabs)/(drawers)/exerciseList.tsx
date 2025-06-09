import { Button } from "@/components/ui/Button";
import { View, StyleSheet, FlatList } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/ui/Card";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { TouchableOpacity } from "react-native-gesture-handler";

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
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/(protected)/(exercisesStacks)/${(item.item as any)._id}`
                )
              }
            >
              <View style={styles.cardWrapper} key={(item.item as any).id}>
                <Card label={item.item.name} />
              </View>
            </TouchableOpacity>
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

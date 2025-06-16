import { Button } from "@/components/ui/Button";
import { View, StyleSheet, FlatList } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/ui/Card";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { TouchableOpacity } from "react-native-gesture-handler";
import Container from "@/components/ui/Container";

export default function Page() {
  const router = useRouter();
  const { call } = useApi();
  const [list, setList] = useState<IExercise[]>([]);

//   const getExerciseList = useCallback(async () => {
//     call({
//       loading: true,
//       try: async () => {
//         const data = await ExerciseServices.getAll();
//         setList(data);
//       },
//     });
//   }, [call]);

//   useFocusEffect(
//     useCallback(() => {
//       getExerciseList();
//     }, [getExerciseList])
//   );

  return (
    <Container style={styles.container}>
      <View style={styles.view}>
        <FlatList
          showsVerticalScrollIndicator
          data={list}
          keyExtractor={(item) => (item as any)._id}
          renderItem={(item) => (
            <TouchableOpacity
              key={(item.item as any)._id}
              onPress={() =>
                router.push(
                  `/(protected)/(blockExercisesStack)/${(item.item as any)._id}`
                )
              }
            >
              <View style={styles.cardWrapper}>
                <Card label={item.item.name} imageUri={item.item.imagePath} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <Button
        title="Adicionar bloco"
        onPress={() =>
          router.push("/(protected)/(blockExercisesStack)/addBlock")
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  view: { flex: 1, width: "100%" },
  cardWrapper: {
    marginBottom: 10,
  },
});

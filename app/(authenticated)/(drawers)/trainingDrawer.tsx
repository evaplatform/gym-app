import { Button } from "@/components/custom/Button";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { router, useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/custom/Card";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import Container from "@/components/custom/Container";
import { ITraining } from "@/shared/models/ITraining";
import Text from "@/components/custom/Text";
import { TrainingServices } from "@/services/TrainingServices";
import useFetchUser from "@/hooks/useFetchUser";
import { AcademyServices } from "@/services/AcademyServices";
import { IAcademy } from "@/shared/models/IAcademy";
import { IUser } from "@/shared/models/IUser";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import { RootReduxState } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export default function Page() {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const { t } = useTranslation();
  const { getUser: getUserRedux } = useFetchUser();

  const { safe } = useApi();
  const [trainingList, setList] = useState<ITraining[]>([]);
  const [academyList, setAcademyList] = useState<IAcademy[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        safe(TrainingServices.getAll()),
        safe(AcademyServices.getAll()),
        safe(getUserRedux()),
      ]).then((results) => {
        results.forEach((result, i) => {
          if (i === 0 && Array.isArray(result)) {
            const data = result as ITraining[];
            setList(data);
          }
          if (i === 1 && Array.isArray(result)) {
            const data = result as IAcademy[];
            setAcademyList(data);
          }
          if (i === 2) {
            const data = result as IUser;
            setUser(data);
          }
        });
        setIsLoading(false);
      });
    }, []),
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.DRAWER_NO_TRAININGS_FOUND),
    list: trainingList,
    component: (
      <>
        {trainingList && trainingList.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={trainingList}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              const sourceImage = item?.item?.imagePath
                ? { uri: item?.item?.imagePath }
                : require("@/assets/images/default-exercise.jpg");

              return (
                <View style={styles.cardWrapper} key={item.item.id}>
                  <Card
                    onPress={() => {
                      router.push({
                        pathname: `/(authenticated)/(stacks)/(trainingStacks)/updateTrainingStack/${item.item.id}`,
                        params: {
                          academyList: JSON.stringify(academyList),
                          user: JSON.stringify(user),
                          trainingList: JSON.stringify(trainingList),
                        },
                      });
                    }}
                    leftLabel={item.item.name}
                    source={sourceImage}
                    isLoading={isLoading}
                    disabled={
                      !unifiedGroup.drawerMenu.trainings
                      .visualize
                    }
                  />
                </View>
              );
            }}
          />
        )}
      </>
    ),
  });

  return (
    <Container style={styles.container}>
      <ListWithSkeleton />

      <Button
        disabled={isLoading || !unifiedGroup.drawerMenu.trainings.add.permitted}
        title={t(AppMessagesEnum.DRAWER_ADD_TRAINING_BUTTON_TITLE)}
        onPress={() =>
          router.push({
            pathname:
              "/(authenticated)/(stacks)/(trainingStacks)/addTrainingStack",
            params: {
              academyList: JSON.stringify(academyList),
              user: JSON.stringify(user),
              trainingList: JSON.stringify(trainingList),
            },
          })
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  view: { flex: 1, width: "100%" },
  cardWrapper: {
    marginBottom: 10,
  },
});

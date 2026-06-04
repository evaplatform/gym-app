import { Button } from "@/components/custom/Button";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/custom/Card";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import Container from "@/components/custom/Container";
import { AcademyServices } from "@/services/AcademyServices";
import { IAcademy } from "@/shared/models/IAcademy";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import { RootReduxState } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export default function Page() {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);

  const router = useRouter();
  const { t } = useTranslation();
  const { call } = useApi();
  const [list, setList] = useState<IAcademy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      call({
        try: async () => {
          const data = await AcademyServices.getAll();
          setList(data);
        },
        finally: () => {
          setIsLoading(false);
        },
      });
    }, []),
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.DRAWER_NO_ACADEMIES_FOUND),
    list: list,
    component: (
      <>
        {list && list.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              const sourceImage = item?.item?.imagePath
                ? { uri: item?.item?.imagePath }
                : require("@/assets/images/default-logo.png");

              return (
                <View style={styles.cardWrapper} key={item.item.id}>
                  <Card
                    onPress={() => {
                      router.push(
                        `/(authenticated)/(stacks)/(academyStacks)/updateAcademyStack/${item.item.id}`,
                      );
                    }}
                    leftLabel={item.item.name}
                    source={sourceImage}
                    isLoading={isLoading}
                    disabled={
                      !unifiedGroup.drawerMenu.academies.visualize.permitted
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
        disabled={!unifiedGroup.drawerMenu.academies.add.permitted}
        title={t(AppMessagesEnum.ACADEMY_ADD)}
        onPress={() =>
          router.push(
            "/(authenticated)/(stacks)/(academyStacks)/addAcademyStack",
          )
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

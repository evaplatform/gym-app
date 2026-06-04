import { Button } from "@/components/custom/Button";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/custom/Card";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import Container from "@/components/custom/Container";
import { IUser } from "@/shared/models/IUser";
import { UserServices } from "@/services/UserServices";
import { AcademyServices } from "@/services/AcademyServices";
import { IAcademy } from "@/shared/models/IAcademy";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import Input from "@/components/custom/Input";
import { GroupServices } from "@/services/GroupServices";
import { IGroup } from "@/shared/models/IGroup";
import { useSelector } from "react-redux";
import { RootReduxState } from "@reduxjs/toolkit";

export default function Page() {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const router = useRouter();
  const { t } = useTranslation();
  const { safe } = useApi();
  const [userList, setUserList] = useState<IUser[]>([]);
  const [originalUserList, setOriginalUserList] = useState<IUser[]>([]);
  const [academyList, setAcademyList] = useState<IAcademy[]>([]);
  const [groupList, setGroupList] = useState<IGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text;

    if (text.trim() === "") {
      setUserList(originalUserList);
      return;
    }

    const filteredUsers = originalUserList.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase()),
    );

    if (filteredUsers.length === 0) {
      setUserList([]);
      return;
    }

    setUserList(filteredUsers);
  };

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        safe(UserServices.getAll()),
        safe(AcademyServices.getAll()),
        safe(GroupServices.getAll()),
      ]).then((results) => {
        results.forEach((result, i) => {
          if (i === 0 && Array.isArray(result)) {
            const data = result as IUser[];
            setUserList(data);
            setOriginalUserList(data);
          }
          if (i === 1 && Array.isArray(result)) {
            const data = result as IAcademy[];
            setAcademyList(data);
          }
          if (i === 2 && Array.isArray(result)) {
            const data = result as IGroup[];
            setGroupList(data);
          }
        });
        setIsLoading(false);
      });
    }, []),
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.DRAWER_NO_USERS_FOUND),
    list: userList,
    component: (
      <>
        {userList && userList.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={userList}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              const sourceImage = item?.item?.profilePhoto
                ? { uri: item?.item?.profilePhoto }
                : require("@/assets/images/default-profile-photo.png");

              return (
                <View style={styles.cardWrapper} key={item.item.id}>
                  <Card
                    onPress={() =>
                      router.push({
                        pathname: `/(authenticated)/(stacks)/(userStacks)/updateUserStack/${item.item.id}`,
                        params: {
                          academyList: JSON.stringify(academyList),
                          groupList: JSON.stringify(groupList),
                        },
                      })
                    }
                    leftLabel={item.item.name}
                    source={sourceImage}
                    isLoading={isLoading}
                    roundedImage={true}
                    disabled={
                      !unifiedGroup.drawerMenu.users.visualize.permitted
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
      <Input
        leftIcon="search"
        label={t(AppMessagesEnum.SEARCH)}
        style={styles.inputSearch}
        onChange={handleSearch}
        editable={!isLoading}
      />
      <ListWithSkeleton />

      <Button
        disabled={isLoading || !unifiedGroup.drawerMenu.users.permitted}
        title={t(AppMessagesEnum.DRAWER_ADD_USER_BUTTON_TITLE)}
        onPress={() => {
          router.push({
            pathname: "/(authenticated)/(stacks)/(userStacks)/addUserStack",
            params: {
              userList: JSON.stringify(userList),
              academyList: JSON.stringify(academyList),
              groupList: JSON.stringify(groupList),
            },
          });
        }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
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
  inputSearch: {
    marginBottom: 10,
  },
});

import { RootReduxState } from "@/redux";
import { ISubscriptionByUserData } from "@/services/PaymentSubscriptionServices/intefaces";
import { SubscriptionsStatusEnum } from "@/shared/enum/SubscriptionsStatusEnum";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { useSelector } from "react-redux";

const backgroundImg = require("@/assets/images/home-background.png");

export default function HomeScreen() {
  const { user } = useSelector((state: RootReduxState) => state.user);
  const { subscriptionList } = useSelector(
    (state: RootReduxState) => state.subscription,
  );

  const router = useRouter();

  const getSubscriptionStatus = useCallback(
    (subscriptionList: ISubscriptionByUserData[] | null) => {
      if (user && user.isAdmin) {
        return;
      }

      if (!subscriptionList || subscriptionList.length === 0) {
        router.push(
          "/(authenticated)/(stacks)/(subscriptionStacks)/newSubscription/",
        );
        return;
      }

      const hasActiveSubscription = subscriptionList.some((subscription) =>
        [
          SubscriptionsStatusEnum.ACTIVE,
          SubscriptionsStatusEnum.TRIALING,
        ].includes(subscription.status as SubscriptionsStatusEnum),
      );

      if (!hasActiveSubscription) {
        router.push("(drawers)/subscriptionByUserDrawer");
        return;
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      getSubscriptionStatus(subscriptionList);
    }, [subscriptionList]),
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImg}
        resizeMode="cover"
        style={styles.backgroundBlurred}
        blurRadius={10}
      />
      <ImageBackground
        source={backgroundImg}
        resizeMode="contain"
        style={styles.backgroundSharp}
      >
        {/* Seu conteúdo aqui */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundBlurred: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backgroundSharp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

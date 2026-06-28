import React, { useMemo, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import Text from "@/components/custom/Text";
import { PRICE_ID } from "@/shared/constants/envConstants";
import { RootReduxState } from "@/redux";
import { useDispatch, useSelector } from "react-redux";
import { PaymentSubscriptionService } from "@/services/PaymentSubscriptionServices";
import { setSubscriptionListState } from "@/redux/slices/subscriptionSlice";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import useCustomStyle from "@/hooks/useCustomStyle";
import { Button } from "@/components/custom/Button";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { useApi } from "@/hooks/useApi";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { replace } from "expo-router/build/global-state/routing";

export default function CheckoutScreen() {
  const router = useRouter();
  const { call } = useApi();
  const { t } = useTranslation();
  const { colors } = useCustomStyle();
  const { user } = useSelector((state: RootReduxState) => state.user);
  const dispatch = useDispatch();
  const { confirmSetupIntent } = useStripe();

  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [setupData, setSetupData] = useState<{
    clientSecret: string;
    customerId: string;
  } | null>(null);

  const customStyle = useMemo(
    () => ({
      container: {
        backgroundColor: colors.background,
      },
      subtitle: {
        color: colors.gray600,
      },
      card: {
        backgroundColor: colors.gray100,
      },
      hint: {
        color: colors.gray400,
      },
      infoContainer: {
        backgroundColor: colors.gray200,
      },
      infoText: {
        color: colors.notification.info,
      },
      cardField: {
        backgroundColor: colors.background,
        textColor: colors.text,
        borderColor: colors.border,
        placeholderColor: colors.gray300,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 16,
      },
    }),
    [colors],
  );

  // Passo 1: Criar Setup Intent
  const handleCreateSetupIntent = async () => {
    if (!user?.email) {
      Toast.show({
        type: "error",
        text1: t(AppMessagesEnum.ERROR),
        text2: t(AppMessagesEnum.USER_NOT_AUTHENTICATED),
      });
      return;
    }

    setLoading(true);

    call({
      loading: true,
      try: async (toast) => {
        const response = await PaymentSubscriptionService.setupIntent({
          email: user.email,
        });

        setSetupData({
          clientSecret: response.clientSecret,
          customerId: response.customerId,
        });

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.SUBSCRIPTION_SETUP_INTENT_SUCCESS),
        });
      },
      catch: (toast, error: any) => {
        toast.show({
          type: "error",
          text1: t(AppMessagesEnum.ERROR),
          text2:
            error.message ||
            t(AppMessagesEnum.SUBSCRIPTION_SETUP_INTENT_ERROR_MESSAGE),
        });
      },
      finally: () => {
        setLoading(false);
      },
    });
  };

  // Passo 2: Confirmar Setup Intent e Criar Assinatura
  const handleSubscribe = async () => {
    if (!setupData) {
      Toast.show({
        type: "error",
        text1: t(AppMessagesEnum.SUBSCRIPTION_CLICK_START_PAYMENT_FIRST),
      });

      return;
    }

    if (!cardComplete) {
      Toast.show({
        type: "info",
        text1: t(AppMessagesEnum.SUBSCRIPTION_FILL_CARD_DATA),
      });
      return;
    }

    setLoading(true);
    call({
      loading: true,
      try: async (toast) => {
        // 1. Confirmar Setup Intent (coleta do cartão)
        const { setupIntent, error } = await confirmSetupIntent(
          setupData.clientSecret,
          {
            paymentMethodType: "Card",
          },
        );

        if (error) {
          toast.show({
            type: "error",
            text1: t(AppMessagesEnum.SUBSCRIPTION_CARD_ERROR),
            text2: error.message,
          });

          setLoading(false);
          return;
        }

        if (!setupIntent?.paymentMethodId) {
          toast.show({
            type: "error",
            text1: t(AppMessagesEnum.SUBSCRIPTION_NOT_POSSIBLE_TO_PROCESS_CARD),
          });

          setLoading(false);
          return;
        }

        // 2. Criar Assinatura no backend
        const subscription =
          await PaymentSubscriptionService.createFromSetupIntent({
            customerId: setupData.customerId,
            paymentMethodId: setupIntent.paymentMethodId,
            priceId: PRICE_ID,
          });

        if (!user?.email) {
          toast.show({
            type: "error",
            text1: t(AppMessagesEnum.USER_NOT_AUTHENTICATED),
          });
          return;
        }

        const response =
          await PaymentSubscriptionService.listSubscriptionsByUser(user.email);

        dispatch(setSubscriptionListState(response.subscriptions));

        const alertMessage = `${t(AppMessagesEnum.SUBSCRIPTION_CREATED)}\n ${t(AppMessagesEnum.ID)}: ${subscription.subscriptionId}\n${t(AppMessagesEnum.STATUS)}: ${subscription.status}`;

        Alert.alert(`🎉 ${t(AppMessagesEnum.SUCCESS)}!`, alertMessage, [
          {
            text: t(AppMessagesEnum.OK),
            onPress: () => {
              //  router.replace("/(authenticated)/(drawers)/(tabs)/index/");
            },
          },
        ]);
      },
      catch: (toast) => {
        toast.show({
          type: "error",
          text1: t(AppMessagesEnum.SUBSCRIPTION_ERROR_TO_SUBSCRIBE),
        });
      },
      finally: () => {
        setLoading(false);
      },
    });
  };

  return (
    <ScrollView
      style={[styles.container, customStyle.container]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {t(AppMessagesEnum.SUBSCRIPTION_PREMIUM_PLAIN)}
        </Text>
        <Text style={[styles.subtitle, customStyle.subtitle]}>
          R$ 1,00 / {t(AppMessagesEnum.MONTH)}
        </Text>
      </View>

      {/* Passo 1: Iniciar Pagamento */}
      {!setupData && (
        <Button
          title={t(AppMessagesEnum.SUBSCRIPTION_START_PAYMENT)}
          onPress={handleCreateSetupIntent}
          severity={SeverityEnum.PRIMARY}
          disabled={loading}
        />
      )}

      {/* Passo 2: Formulário do Cartão */}
      {setupData && (
        <>
          <View style={styles.cardContainer}>
            <Text style={styles.label}>
              {t(AppMessagesEnum.SUBSCRIPTION_CARD_DATA)}
            </Text>
            <CardField
              postalCodeEnabled={false}
              cardStyle={customStyle.cardField}
              style={styles.cardField}
              onCardChange={(cardDetails) => {
                setCardComplete(cardDetails.complete);
              }}
            />
          </View>

          <Button
            title={`${t(AppMessagesEnum.SUBSCRIPTION_CONFIRM_SUBSCRIPTION)} - R$ 1,00/mês`}
            onPress={handleSubscribe}
            severity={SeverityEnum.PRIMARY}
            disabled={loading || !cardComplete}
          />

          <Text style={[styles.hint, customStyle.hint]}>
            💳 {t(AppMessagesEnum.SUBSCRIPTION_USE_CARD_DATA)}: 4242 4242 4242
            4242
          </Text>
        </>
      )}

      {/* Informações */}
      <View style={[styles.infoContainer, customStyle.infoContainer]}>
        <Text style={styles.infoTitle}>ℹ️ {t(AppMessagesEnum.INFO)}</Text>
        <Text style={[styles.infoText, customStyle.infoText]}>
          • {t(AppMessagesEnum.SUBSCRIPTION_AUTO_RENEW)}
          {"\n"}• {t(AppMessagesEnum.SUBSCRIPTION_CANCEL_ANYTIME)}
          {"\n"}• {t(AppMessagesEnum.SUBSCRIPTION_FIRST_MONTH)}
          {"\n"}• {t(AppMessagesEnum.SUBSCRIPTION_TEST_ENVIRONMENT)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  cardContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  cardField: {
    height: 50,
    marginVertical: 10,
  },
  card: {
    borderRadius: 8,
  },
  hint: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

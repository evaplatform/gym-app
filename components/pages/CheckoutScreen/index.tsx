import React, { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
import { useRouter } from "expo-router";
import BillingDayPicker from "@/components/custom/BillingDayPicker";

export default function CheckoutScreen() {
  const router = useRouter();
  const { call } = useApi();
  const { t } = useTranslation();
  const { colors } = useCustomStyle();
  const { user } = useSelector((state: RootReduxState) => state.user);
  const dispatch = useDispatch();
  const { confirmSetupIntent } = useStripe();

  const [billingDay, setBillingDay] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // ✅ setupData guarda o resultado do Passo 1
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

  // ─────────────────────────────────────────────
  // PASSO 1: Criar Setup Intent
  // ─────────────────────────────────────────────
  const handleCreateSetupIntent = () => {
    if (!user?.email) return;

    call({
      loading: true,
      try: async (toast) => {
        setLoading(true);

        if (!billingDay) {
          toast.show({
            type: "error",
            text1: t(AppMessagesEnum.ATTENTION),
            text2: t(AppMessagesEnum.SUBSCRIPTION_BILLING_DAY_REQUIRED),
          });
          return;
        }

        const response = await PaymentSubscriptionService.setupIntent({
          email: user.email,
        });

        // ✅ Salva para usar no Passo 2
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

  // ─────────────────────────────────────────────
  // PASSO 2: Confirmar cartão e criar assinatura
  // ─────────────────────────────────────────────
  const handleSubscribe = () => {
    // ✅ Usa o setupData do Passo 1 (não cria novo Setup Intent)
    if (!setupData) return;

    call({
      loading: true,
      try: async (toast) => {
        setLoading(true);

        // 1. Confirmar Setup Intent com o cartão digitado no CardField
        const { setupIntent, error } = await confirmSetupIntent(
          setupData.clientSecret,
          { paymentMethodType: "Card" },
        );

        if (error) {
          toast.show({
            type: "error",
            text1: t(AppMessagesEnum.ERROR),
            text2: error.message,
          });
          return;
        }

        if (!setupIntent?.paymentMethodId) {
          toast.show({
            type: "error",
            text1: t(AppMessagesEnum.ERROR),
            text2: t(AppMessagesEnum.SUBSCRIPTION_PAYMENT_METHOD_NOT_FOUND),
          });
          return;
        }

        // 2. Criar assinatura com o billingDay e paymentMethod coletados
        const subscription =
          await PaymentSubscriptionService.createFromSetupIntent({
            customerId: setupData.customerId,
            paymentMethodId: setupIntent.paymentMethodId,
            priceId: PRICE_ID,
            billingDay,
          });

        // 3. Atualizar Redux com a nova assinatura
        dispatch(setSubscriptionListState([subscription as any]));

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.SUCCESS),
          text2: t(AppMessagesEnum.SUBSCRIPTION_CREATED_SUCCESS),
        });

        // router.push(
        //   "/(authenticated)/(stacks)/(subscriptionStacks)/mySubscriptions/",
        // );
      },
      catch: async (toast, error) => {
        toast.show({
          type: "error",
          text1: t(AppMessagesEnum.ERROR),
          text2: error.message,
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {t(AppMessagesEnum.SUBSCRIPTION_PREMIUM_PLAIN)}
        </Text>
        <Text style={[styles.subtitle, customStyle.subtitle]}>
          R$ 1,00 / {t(AppMessagesEnum.MONTH)}
        </Text>
      </View>

      {/* Seletor de dia de cobrança — sempre visível */}
      <BillingDayPicker
        email={user?.email || ""}
        priceId={PRICE_ID}
        selectedDay={billingDay}
        onChange={(day) => {
          setBillingDay(day);
          // ✅ Se trocar o dia depois de já ter criado o setupIntent, resetar
          if (setupData) setSetupData(null);
        }}
      />

      {/* PASSO 1: Botão de iniciar pagamento */}
      {!setupData && (
        <Button
          title={t(AppMessagesEnum.SUBSCRIPTION_START_PAYMENT)}
          onPress={handleCreateSetupIntent}
          severity={SeverityEnum.PRIMARY}
          disabled={loading || !billingDay}
        />
      )}

      {/* PASSO 2: Formulário do cartão */}
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
            style={{ marginBottom: 10 }}
          />

          {/* Botão para voltar e trocar o dia */}
          <Button
            title={t(AppMessagesEnum.BACK)}
            onPress={() => setSetupData(null)}
            severity={SeverityEnum.SECONDARY}
            disabled={loading}
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
    paddingBottom: 40,
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
  hint: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
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

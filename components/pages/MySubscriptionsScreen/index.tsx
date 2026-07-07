import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Text from "@/components/custom/Text";
import { useDispatch, useSelector } from "react-redux";
import { RootReduxState } from "@/redux";
import { PaymentSubscriptionService } from "@/services/PaymentSubscriptionServices";
import { PRICE_ID } from "@/shared/constants/envConstants";
import UpdateCardModal from "@/components/UpdateCardModal";
import {
  getStatusText,
  SubscriptionsStatusEnum,
} from "@/shared/enum/SubscriptionsStatusEnum";
import { setSubscriptionListState } from "@/redux/slices/subscriptionSlice";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import useCustomStyle from "@/hooks/useCustomStyle";
import { Button } from "@/components/custom/Button";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import Toast from "react-native-toast-message";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "expo-router";
import { ISubscriptionByUserData } from "@/services/PaymentSubscriptionServices/interfaces";

export default function MySubscriptionsScreen() {
  const router = useRouter();
  const { call } = useApi();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootReduxState) => state.user);
  const dispatch = useDispatch();
  const { colors } = useCustomStyle();

  const [subscriptions, setSubscriptions] = useState<ISubscriptionByUserData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updateCardModal, setUpdateCardModal] = useState<{
    visible: boolean;
    clientSecret: string;
    subscriptionId: string;
  }>({
    visible: false,
    clientSecret: "",
    subscriptionId: "",
  });

  const treatCanceledSubscription = (
    subscriptions: ISubscriptionByUserData[],
  ) => {
    const allSubscriptionAreCanceled = subscriptions.every(
      (sub) => sub.status === SubscriptionsStatusEnum.CANCELED,
    );

    if (allSubscriptionAreCanceled && subscriptions.length > 0) {
      const canceledSubs = subscriptions.filter(
        (sub): sub is ISubscriptionByUserData & { canceled_at: number } =>
          sub.canceled_at !== null,
      );

      if (canceledSubs.length === 0) {
        return subscriptions; // Retorna todas se nenhuma tem canceled_at
      }

      const latestSubscription = canceledSubs.reduce((latest, current) =>
        current.canceled_at > latest.canceled_at ? current : latest,
      );

      return [latestSubscription];
    }

    return subscriptions.filter(
      (sub) => sub.status !== SubscriptionsStatusEnum.CANCELED,
    );
  };

  const loadSubscriptions = async () => {
    if (!user?.email) return;

    try {
      const response = await PaymentSubscriptionService.listSubscriptionsByUser(
        user.email,
      );

      setSubscriptions(treatCanceledSubscription(response.subscriptions));
      dispatch(setSubscriptionListState(response.subscriptions));
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t(AppMessagesEnum.ERROR),
        text2: t(AppMessagesEnum.SUBSCRIPTION_LOAD_ERROR),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateCard = async (item: ISubscriptionByUserData) => {
    call({
      loading: true,
      try: async () => {
        setLoading(true);

        // 1. Criar Setup Intent
        const setupResponse = await PaymentSubscriptionService.setupIntent({
          email: user?.email || "",
        });

        // 2. Abrir modal com o clientSecret
        setUpdateCardModal({
          visible: true,
          clientSecret: setupResponse.clientSecret,
          subscriptionId: item.id,
        });
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

  const handleCardConfirmed = async (paymentMethodId: string) => {
    call({
      loading: true,
      try: async (toast) => {
        setLoading(true);
        setUpdateCardModal({
          visible: false,
          clientSecret: "",
          subscriptionId: "",
        });

        // Atualizar método de pagamento
        await PaymentSubscriptionService.updatePaymentMethod({
          subscriptionId: updateCardModal.subscriptionId,
          paymentMethodId,
        });

        // Fechar modal

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.SUBSCRIPTION_UPDATE_CARD_SUCCESS),
        });

        loadSubscriptions();
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

  const handleCancelUpdateCard = () => {
    setUpdateCardModal({
      visible: false,
      clientSecret: "",
      subscriptionId: "",
    });
  };

  const retryPayment = async (subscriptionId: string) => {
    call({
      loading: true,
      try: async (toast) => {
        setLoading(true);
        const result =
          await PaymentSubscriptionService.retryPayment(subscriptionId);

        if (result.status === "paid") {
          toast.show({
            type: "success",
            text1: t(AppMessagesEnum.SUCCESS),
            text2: t(AppMessagesEnum.SUBSCRIPTION_PAYMENT_SUCCESS),
          });
        } else {
          toast.show({
            type: "error",
            text1: t(AppMessagesEnum.ATTENTION),
            text2: t(AppMessagesEnum.SUBSCRIPTION_PAYMENT_PENDING),
          });
        }

        loadSubscriptions();
      },
      catch: async (toast, error) => {
        toast.show({
          type: "error",
          text1: t(AppMessagesEnum.ERROR),
          text2:
            error.message ||
            t(AppMessagesEnum.SUBSCRIPTION_NOT_POSSIBLE_TO_PROCESS_PAYMENT),
        });
      },
      finally: () => {
        setLoading(false);
      },
    });
  };

  const handleRetryPayment = async (subscriptionId: string) => {
    Alert.alert(
      t(AppMessagesEnum.TRY_AGAIN),
      t(AppMessagesEnum.SUBSCRIPTION_RETRY_PAYMENT_DESCRIPTION),
      [
        { text: t(AppMessagesEnum.CANCEL), style: "cancel" },
        {
          text: t(AppMessagesEnum.TRY),
          onPress: async () => {
            await retryPayment(subscriptionId);
          },
        },
      ],
    );
  };

  const handleReactivate = async (item: ISubscriptionByUserData) => {
    Alert.alert(
      t(AppMessagesEnum.SUBSCRIPTION_REACTIVATE_TITLE),
      t(AppMessagesEnum.SUBSCRIPTION_REACTIVATE_DESCRIPTION),
      [
        { text: t(AppMessagesEnum.CANCEL), style: "cancel" },
        {
          text: t(AppMessagesEnum.SUBSCRIPTION_REACTIVATE_TITLE),
          onPress: async () => {
            call({
              loading: true,
              try: async (toast) => {
                setLoading(true);

                // Usar mesmo cartão ou pedir novo?
                const customerId = item.customer;
                const paymentMethodId = item.default_payment_method?.id;

                await PaymentSubscriptionService.reactivateSubscription({
                  customerId,
                  priceId: PRICE_ID,
                  paymentMethodId,
                });

                toast.show({
                  type: "success",
                  text1: t(AppMessagesEnum.SUCCESS),
                  text2: t(AppMessagesEnum.SUBSCRIPTION_PAYMENT_SUCCESS),
                });
                loadSubscriptions();
              },
              catch(toast, error) {
                toast.show({
                  type: "error",
                  text1: t(AppMessagesEnum.ERROR),
                  text2: error.message,
                });
              },
              finally: async () => {
                setLoading(false);
              },
            });
          },
        },
      ],
    );
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleCancelSubscription = (subscriptionId: string) => {
    Alert.alert(
      t(AppMessagesEnum.SUBSCRIPTION_CANCEL),
      t(AppMessagesEnum.SUBSCRIPTION_CANCEL_WARNING),
      [
        { text: t(AppMessagesEnum.NOT), style: "cancel" },
        {
          text: t(AppMessagesEnum.YES_CANCEL),
          style: "destructive",
          onPress: async () => {
            call({
              loading: true,
              try: async (toast) => {
                await PaymentSubscriptionService.cancelSubscription(
                  subscriptionId,
                );

                toast.show({
                  type: "success",
                  text1: t(AppMessagesEnum.SUCCESS),
                  text2: t(AppMessagesEnum.SUBSCRIPTION_CANCELED),
                });
                loadSubscriptions();
              },
              catch: async (toast, error) => {
                toast.show({
                  type: "error",
                  text1: t(AppMessagesEnum.ERROR),
                  text2: error.message,
                });
              },
            });
          },
        },
      ],
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case SubscriptionsStatusEnum.ACTIVE:
        return colors.notification.success;
      case SubscriptionsStatusEnum.CANCELED:
        return colors.notification.danger;
      case SubscriptionsStatusEnum.PAST_DUE:
      case SubscriptionsStatusEnum.UNPAID:
        return colors.notification.warn;
      default:
        return colors.notification.info;
    }
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      default:
        return "💳";
    }
  };

  const customStyle = useMemo(() => {
    return {
      container: {
        backgroundColor: colors.background,
      },
      loadingContainer: {
        backgroundColor: colors.background,
      },
      loadingText: {
        color: colors.text,
      },
      emptyContainer: {
        backgroundColor: colors.backgroundSecondary,
      },
      emptyTitle: {
        color: colors.gray700,
      },
      emptyText: {
        color: colors.gray700,
      },
      card: {
        backgroundColor: colors.backgroundSecondary,
        shadowColor: colors.shadow,
      },
      cardTitle: {
        color: colors.text,
      },
      statusText: {
        color: colors.gray300,
      },
      priceText: {
        color: colors.tint,
      },
      intervalText: {
        color: colors.gray600,
      },
      infoLabel: {
        color: colors.gray600,
      },
      infoValue: {
        color: colors.text,
      },
      cancelButton: {
        backgroundColor: colors.notification.danger,
      },
      cancelButtonText: {
        color: colors.text,
      },
      warningText: {
        color: colors.notification.warn,
      },
      primaryButton: {
        backgroundColor: colors.tint,
      },
      secondaryButton: {
        backgroundColor: colors.background,
      },
      warningBox: {
        backgroundColor: colors.notification.warnBackground,
        borderLeftColor: colors.notification.warn,
      },
    };
  }, [colors]);

  const renderSubscription = ({ item }: { item: ISubscriptionByUserData }) => {
    // ✅ Pegar price do primeiro item
    const firstItem = item.items.data[0];
    const price = firstItem?.price;
    const plan = item.plan;

    // ✅ Card
    const card = item.default_payment_method?.card;

    const isActive = item.status === SubscriptionsStatusEnum.ACTIVE;
    const willCancel = item.cancel_at_period_end;
    const isPastDue = item.status === SubscriptionsStatusEnum.PAST_DUE;
    const isCanceled = item.status === SubscriptionsStatusEnum.CANCELED;

    // ✅ Função helper para pegar valor e moeda
    const getPriceInfo = () => {
      if (price) {
        return {
          amount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring.interval,
        };
      }
      // Fallback para plan
      return {
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
      };
    };

    const priceInfo = getPriceInfo();

    if (loading && subscriptions.length === 0) {
      return (
        <View style={[styles.loadingContainer, customStyle.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, customStyle.loadingText]}>
            {t(AppMessagesEnum.LOADING)}...
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.card, customStyle.card]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.cardTitle, customStyle.cardTitle]}>
              {t(AppMessagesEnum.SUBSCRIPTION_PLAN_PREMIUM)}
            </Text>
            <Text style={styles.planId}>
              {t(AppMessagesEnum.ID)}: {item.id.substring(0, 20)}...
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={[styles.statusText, customStyle.statusText]}>
              {getStatusText(item.status, willCancel)}
            </Text>
          </View>
        </View>

        {/* Preço */}
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, customStyle.priceText]}>
            {formatPrice(priceInfo.amount, priceInfo.currency)}
          </Text>
          <Text style={[styles.intervalText, customStyle.intervalText]}>
            /{" "}
            {priceInfo.interval === "month"
              ? t(AppMessagesEnum.MONTH)
              : t(AppMessagesEnum.YEAR)}
          </Text>
        </View>

        {/* Informações */}
        <View style={styles.infoSection}>
          {/* Cartão */}
          {card && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                💳 {t(AppMessagesEnum.CARD)}:
              </Text>
              <Text style={styles.infoValue}>
                {getCardBrandIcon(card.brand)} •••• {card.last4} (
                {card.exp_month}/{card.exp_year})
              </Text>
            </View>
          )}

          {/* Data de início */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              📅 {t(AppMessagesEnum.SUBSCRIPTION_START_DATE)}:
            </Text>
            <Text style={styles.infoValue}>{formatDate(item.start_date)}</Text>
          </View>

          {/* Próxima cobrança */}
          {isActive && !willCancel && firstItem && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                🔄 {t(AppMessagesEnum.SUBSCRIPTION_NEXT_BILLING_DATE)}:
              </Text>
              <Text style={styles.infoValue}>
                {formatDate(firstItem.current_period_end)}
              </Text>
            </View>
          )}

          {/* Válido até (se cancelando) */}
          {willCancel && firstItem && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                ⚠️ {t(AppMessagesEnum.SUBSCRIPTION_VALID_UNTIL)}:
              </Text>
              <Text
                style={[styles.infoValue, { color: colors.notification.warn }]}
              >
                {formatDate(firstItem.current_period_end)}
              </Text>
            </View>
          )}

          {/* Data de cancelamento */}
          {item.canceled_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                ❌ {t(AppMessagesEnum.SUBSCRIPTION_CANCELED_AT)}:
              </Text>
              <Text style={styles.infoValue}>
                {formatDate(item.canceled_at)}
              </Text>
            </View>
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionsContainer}>
          {/* Assinatura ativa - Botões normais */}
          {isActive && !willCancel && (
            <>
              <Button
                title={t(AppMessagesEnum.SUBSCRIPTION_UPDATE_CARD)}
                onPress={() => handleUpdateCard(item)}
                severity={SeverityEnum.SECONDARY}
                disabled={loading}
              />

              <Button
                title={t(AppMessagesEnum.SUBSCRIPTION_CANCEL)}
                onPress={() => handleCancelSubscription(item.id)}
                severity={SeverityEnum.DANGER}
              />
            </>
          )}

          {/* Assinatura vencida - Opções de recuperação */}
          {isPastDue && (
            <>
              <Button
                title={`⚡ ${t(AppMessagesEnum.SUBSCRIPTION_RETRY_PAYMENT)}`}
                onPress={() => handleRetryPayment(item.id)}
                severity={SeverityEnum.SECONDARY}
              />

              <Button
                title={`💳 ${t(AppMessagesEnum.SUBSCRIPTION_UPDATE_CARD)}`}
                onPress={() => handleUpdateCard(item)}
                severity={SeverityEnum.SECONDARY}
              />
            </>
          )}

          {/* Assinatura cancelada - Opção de reativar */}
          {isCanceled && (
            <Button
              title={`♻️ ${t(AppMessagesEnum.SUBSCRIPTION_REACTIVATE)}`}
              onPress={() => handleReactivate(item)}
            />
          )}
        </View>

        {/* Avisos */}
        {isPastDue && (
          <View
            style={[
              styles.warningBox,
              { backgroundColor: colors.notification.dangerBackground },
            ]}
          >
            <Text
              style={[
                styles.warningText,
                { color: colors.notification.danger },
              ]}
            >
              ⚠️ {t(AppMessagesEnum.SUBSCRIPTION_PAST_DUE_WARNING)}
            </Text>
          </View>
        )}

        {willCancel && firstItem && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ {t(AppMessagesEnum.SUBSCRIPTION_WILL_CANCEL_WARNING)}{" "}
              {formatDate(firstItem.current_period_end)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (subscriptions.length === 0) {
    return (
      <View style={[styles.emptyContainer, customStyle.emptyContainer]}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={[styles.emptyTitle, customStyle.emptyTitle]}>
          {t(AppMessagesEnum.SUBSCRIPTION_NO_SUBSCRIPTIONS)}
        </Text>
        <Text style={[styles.emptyText, customStyle.emptyText]}>
          {t(AppMessagesEnum.SUBSCRIPTION_NO_ACTIVE_SUBSCRIPTIONS)}
        </Text>
        <Button
          title={t(AppMessagesEnum.SUBSCRIPTION_SUBSCRIBE_NOW)}
          onPress={() => {
            router.push(
              "/(authenticated)/(stacks)/(subscriptionStacks)/newSubscription/",
            );
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, customStyle.container]}>
      <FlatList
        data={subscriptions}
        renderItem={renderSubscription}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadSubscriptions();
            }}
            tintColor={colors.tint}
          />
        }
      />
      {/* Modal de atualização de cartão */}
      <UpdateCardModal
        visible={updateCardModal.visible}
        clientSecret={updateCardModal.clientSecret}
        onSuccess={handleCardConfirmed}
        onCancel={handleCancelUpdateCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  subscribeButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  listContent: {
    padding: 15,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  planId: {
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  priceText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  intervalText: {
    fontSize: 16,
    marginLeft: 5,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  warningText: {
    fontSize: 13,
  },
  actionsContainer: {
    gap: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  warningBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginTop: 10,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Text from "@/components/custom/Text";
import { useSelector } from "react-redux";
import { RootReduxState } from "@/redux";
import { PaymentSubscriptionService } from "@/services/PaymentSubscriptionServices";
import { ISubscriptionByUserData } from "@/services/PaymentSubscriptionServices/intefaces";
import { useStripe } from "@stripe/stripe-react-native";
import { PRICE_ID } from "@/shared/constants/envConstants";

export default function MySubscriptionsScreen() {
  const { confirmSetupIntent } = useStripe();
  const { user } = useSelector((state: RootReduxState) => state.user);
  const [subscriptions, setSubscriptions] = useState<ISubscriptionByUserData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const treatCanceledSubscription = (
    subscriptions: ISubscriptionByUserData[],
  ) => {
    const allSubscriptionAreCanceled = subscriptions.every(
      (sub) => sub.status === "canceled",
    );

    if (allSubscriptionAreCanceled) {
      const latestSubscription = subscriptions
        .filter(
          (
            subscription,
          ): subscription is ISubscriptionByUserData & {
            canceled_at: number;
          } => subscription.canceled_at !== null,
        )
        .reduce((latest, current) =>
          current.canceled_at > latest.canceled_at ? current : latest,
        );

      return [latestSubscription];
    }

    return subscriptions.filter((sub) => sub.status !== "canceled");
  };

  const loadSubscriptions = async () => {
    if (!user?.email) return;

    try {
      const response = await PaymentSubscriptionService.listSubscriptionsByUser(
        user.email,
      );

      setSubscriptions(treatCanceledSubscription(response.subscriptions));
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar assinaturas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateCard = async (item: ISubscriptionByUserData) => {
    Alert.alert("Atualizar Cartão", "Vamos coletar os dados do novo cartão", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Continuar",
        onPress: async () => {
          try {
            // 1. Criar Setup Intent
            const setupResponse = await PaymentSubscriptionService.setupIntent({
              email: user?.email || "",
            });

            // 2. Confirmar com novo cartão (aqui você pode abrir um modal com CardField)
            // Por simplicidade, vou simular com token de teste
            const { setupIntent } = await confirmSetupIntent(
              setupResponse.clientSecret,
              {
                paymentMethodType: "Card",
              },
            );

            if (!setupIntent?.paymentMethodId) {
              throw new Error("Falha ao processar cartão");
            }

            // 3. Atualizar método de pagamento
            await PaymentSubscriptionService.updatePaymentMethod({
              subscriptionId: item.id,
              paymentMethodId: setupIntent.paymentMethodId,
            });

            Alert.alert("✅ Sucesso", "Cartão atualizado com sucesso!");
            loadSubscriptions();
          } catch (error: any) {
            Alert.alert("Erro", error.message);
          }
        },
      },
    ]);
  };

  const handleRetryPayment = async (subscriptionId: string) => {
    Alert.alert(
      "Tentar Novamente",
      "Vamos tentar processar o pagamento novamente com o cartão atual.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Tentar",
          onPress: async () => {
            try {
              setLoading(true);
              const result =
                await PaymentSubscriptionService.retryPayment(subscriptionId);

              if (result.status === "paid") {
                Alert.alert("✅ Sucesso", "Pagamento processado com sucesso!");
              } else {
                Alert.alert("⚠️ Atenção", "Pagamento ainda pendente");
              }

              loadSubscriptions();
            } catch (error: any) {
              Alert.alert(
                "Erro",
                error.message || "Não foi possível processar o pagamento",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleReactivate = async (item: ISubscriptionByUserData) => {
    Alert.alert(
      "Reativar Assinatura",
      "Deseja reativar sua assinatura premium?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reativar",
          onPress: async () => {
            try {
              setLoading(true);

              // Usar mesmo cartão ou pedir novo?
              const customerId = item.customer;
              const paymentMethodId = item.default_payment_method?.id;

              await PaymentSubscriptionService.reactivateSubscription({
                customerId,
                priceId: PRICE_ID,
                paymentMethodId,
              });

              Alert.alert("✅ Reativada", "Sua assinatura foi reativada!");
              loadSubscriptions();
            } catch (error: any) {
              Alert.alert("Erro", error.message);
            } finally {
              setLoading(false);
            }
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
      "Cancelar Assinatura",
      "Você perderá acesso aos benefícios premium. Tem certeza?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await PaymentSubscriptionService.cancelSubscription(
                subscriptionId,
              );
              Alert.alert("✅ Cancelada", "Sua assinatura foi cancelada");
              loadSubscriptions();
            } catch (error: any) {
              Alert.alert("Erro", error.message);
            }
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
      case "active":
        return "#34C759";
      case "canceled":
        return "#FF3B30";
      case "incomplete":
      case "past_due":
        return "#FF9500";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) return "Cancelando";

    switch (status) {
      case "active":
        return "Ativa";
      case "canceled":
        return "Cancelada";
      case "incomplete":
        return "Incompleta";
      case "past_due":
        return "Vencida";
      default:
        return status;
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

  const renderSubscription = ({ item }: { item: ISubscriptionByUserData }) => {
    // ✅ Pegar price do primeiro item
    const firstItem = item.items.data[0];
    const price = firstItem?.price;
    const plan = item.plan;

    // ✅ Card
    const card = item.default_payment_method?.card;

    const isActive = item.status === "active";
    const willCancel = item.cancel_at_period_end;
    const isPastDue = item.status === "past_due";
    const isCanceled = item.status === "canceled";

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

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Plano Premium</Text>
            <Text style={styles.planId}>ID: {item.id.substring(0, 20)}...</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(item.status, willCancel)}
            </Text>
          </View>
        </View>

        {/* Preço */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {formatPrice(priceInfo.amount, priceInfo.currency)}
          </Text>
          <Text style={styles.intervalText}>
            / {priceInfo.interval === "month" ? "mês" : "ano"}
          </Text>
        </View>

        {/* Informações */}
        <View style={styles.infoSection}>
          {/* Cartão */}
          {card && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>💳 Cartão:</Text>
              <Text style={styles.infoValue}>
                {getCardBrandIcon(card.brand)} •••• {card.last4} (
                {card.exp_month}/{card.exp_year})
              </Text>
            </View>
          )}

          {/* Data de início */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Início:</Text>
            <Text style={styles.infoValue}>{formatDate(item.start_date)}</Text>
          </View>

          {/* Próxima cobrança */}
          {isActive && !willCancel && firstItem && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🔄 Próxima cobrança:</Text>
              <Text style={styles.infoValue}>
                {formatDate(firstItem.current_period_end)}
              </Text>
            </View>
          )}

          {/* Válido até (se cancelando) */}
          {willCancel && firstItem && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⚠️ Válido até:</Text>
              <Text style={[styles.infoValue, { color: "#FF9500" }]}>
                {formatDate(firstItem.current_period_end)}
              </Text>
            </View>
          )}

          {/* Data de cancelamento */}
          {item.canceled_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>❌ Cancelada em:</Text>
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
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleUpdateCard(item)}
              >
                <Text style={styles.secondaryButtonText}>
                  🔄 Atualizar Cartão
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelSubscription(item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancelar Assinatura</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Assinatura vencida - Opções de recuperação */}
          {isPastDue && (
            <>
              <TouchableOpacity
                style={styles.warningButton}
                onPress={() => handleRetryPayment(item.id)}
              >
                <Text style={styles.buttonText}>⚡ Tentar Pagamento</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleUpdateCard(item)}
              >
                <Text style={styles.secondaryButtonText}>💳 Trocar Cartão</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Assinatura cancelada - Opção de reativar */}
          {isCanceled && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleReactivate(item)}
            >
              <Text style={styles.buttonText}>♻️ Reativar Assinatura</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Avisos */}
        {isPastDue && (
          <View style={[styles.warningBox, { backgroundColor: "#FFE5E5" }]}>
            <Text style={[styles.warningText, { color: "#C70000" }]}>
              ⚠️ Pagamento em atraso. Atualize seu cartão ou tente novamente.
            </Text>
          </View>
        )}

        {willCancel && firstItem && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Esta assinatura será cancelada em{" "}
              {formatDate(firstItem.current_period_end)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando assinaturas...</Text>
      </View>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyTitle}>Nenhuma assinatura</Text>
        <Text style={styles.emptyText}>
          Você ainda não possui assinaturas ativas
        </Text>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => {
            // Navegar para tela de checkout
            // navigation.navigate('Checkout');
          }}
        >
          <Text style={styles.subscribeButtonText}>Assinar Agora</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f5f5f5",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  subscribeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  subscribeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
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
    color: "#999",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
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
    color: "#007AFF",
  },
  intervalText: {
    fontSize: 16,
    color: "#666",
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
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  warningText: {
    fontSize: 13,
    color: "#856404",
  },
  actionsContainer: {
    gap: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "600",
  },
  warningButton: {
    backgroundColor: "#FF9500",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  warningBox: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
    marginTop: 10,
  },
});

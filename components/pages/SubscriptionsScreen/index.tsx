import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Text from "@/components/custom/Text";
import { useSelector } from "react-redux";
import { RootReduxState } from "@reduxjs/toolkit";
import { PaymentSubscriptionService } from "@/services/PaymentSubscriptionServices";
import { ISubscriptionByUserData } from "@/services/PaymentSubscriptionServices/intefaces";

export default function MySubscriptionsScreen() {
  const { user } = useSelector((state: RootReduxState) => state.user);
  const [subscriptions, setSubscriptions] = useState<ISubscriptionByUserData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSubscriptions = async () => {
    if (!user?.email) return;

    try {
      const response = await PaymentSubscriptionService.listSubscriptionsByUser(
        user.email,
      );
      setSubscriptions(response.subscriptions);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar assinaturas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleCancelSubscription = (subscriptionId: string) => {
    Alert.alert("Cancelar Assinatura", "Tem certeza que deseja cancelar?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await PaymentSubscriptionService.cancelSubscription(subscriptionId);
            Alert.alert("Sucesso", "Assinatura cancelada");
            loadSubscriptions();
          } catch (error: any) {
            Alert.alert("Erro", error.message);
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("pt-BR");
  };

  const formatPrice = (amount: number, currency: string) => {
    return `${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#34C759";
      case "canceled":
        return "#FF3B30";
      case "incomplete":
        return "#FF9500";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa";
      case "canceled":
        return "Cancelada";
      case "incomplete":
        return "Incompleta";
      default:
        return status;
    }
  };

  const renderSubscription = ({ item }: { item: ISubscriptionByUserData }) => {
    const price = item.items.data[0]?.price;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Plano Premium</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.priceText}>
            {formatPrice(price.unit_amount, price.currency)} /{" "}
            {price.recurring.interval === "month" ? "mês" : "ano"}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Início:</Text>
            <Text style={styles.infoValue}>
              {formatDate(item.items.data[0]?.current_period_start)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Próxima cobrança:</Text>
            <Text style={styles.infoValue}>
              {formatDate(item.items.data[0]?.current_period_end)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={[styles.infoValue, styles.idText]}>{item.id}</Text>
          </View>
        </View>

        {item.status === "active" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelSubscription(item.id)}
          >
            <Text style={styles.cancelButtonText}>Cancelar Assinatura</Text>
          </TouchableOpacity>
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
        <Text style={styles.emptyText}>Você não possui assinaturas ativas</Text>
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
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          loadSubscriptions();
        }}
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
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  subscribeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
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
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    marginBottom: 15,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  idText: {
    fontSize: 12,
    color: "#999",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

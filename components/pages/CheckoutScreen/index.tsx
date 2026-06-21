import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import Text from "@/components/custom/Text";
import { PRICE_ID } from "@/shared/constants/envConstants";
import { RootReduxState } from "@/redux";
import { useSelector } from "react-redux";
import { PaymentSubscriptionService } from "@/services/PaymentSubscriptionServices";
import { log } from "@/shared/utils/log";

export default function CheckoutScreen() {
  const { user } = useSelector((state: RootReduxState) => state.user);
  const { confirmSetupIntent } = useStripe();

  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [setupData, setSetupData] = useState<{
    clientSecret: string;
    customerId: string;
  } | null>(null);

  // Passo 1: Criar Setup Intent
  const handleCreateSetupIntent = async () => {
    if (!user?.email) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    setLoading(true);
    try {
      const response = await PaymentSubscriptionService.setupIntent({
        email: user.email,
      });

      setSetupData({
        clientSecret: response.clientSecret,
        customerId: response.customerId,
      });

      Alert.alert("Sucesso", "Pronto! Agora preencha os dados do cartão.");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao iniciar pagamento");
    } finally {
      setLoading(false);
    }
  };

  // Passo 2: Confirmar Setup Intent e Criar Assinatura
  const handleSubscribe = async () => {
    if (!setupData) {
      Alert.alert("Erro", 'Clique em "Iniciar Pagamento" primeiro');
      return;
    }

    if (!cardComplete) {
      Alert.alert("Atenção", "Preencha todos os dados do cartão");
      return;
    }

    setLoading(true);
    try {
      // 1. Confirmar Setup Intent (coleta do cartão)
      const { setupIntent, error } = await confirmSetupIntent(
        setupData.clientSecret,
        {
          paymentMethodType: "Card",
        },
      );

      if (error) {
        Alert.alert("Erro no Cartão", error.message);
        setLoading(false);
        return;
      }

      if (!setupIntent?.paymentMethodId) {
        Alert.alert("Erro", "Não foi possível processar o cartão");
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

      Alert.alert(
        "🎉 Sucesso!",
        `Assinatura criada!\nID: ${subscription.subscriptionId}\nStatus: ${subscription.status}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Navegar para tela de sucesso ou home
              // navigation.navigate('Home');
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao criar assinatura");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSubscriptions = async () => {
    if (!user?.email) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    setLoading(true);
    try {
      const response = await PaymentSubscriptionService.listSubscriptionsByUser(
        user.email,
      );

      log("Assinaturas do usuário:", response.subscriptions);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao verificar assinaturas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Assinar Plano Premium</Text>
        <Text style={styles.subtitle}>R$ 1,00 / mês</Text>
      </View>

      {/* Passo 1: Iniciar Pagamento */}
      {!setupData && (
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCreateSetupIntent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Pagamento</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Passo 2: Formulário do Cartão */}
      {setupData && (
        <>
          <View style={styles.cardContainer}>
            <Text style={styles.label}>Dados do Cartão</Text>
            <CardField
              postalCodeEnabled={false}
              cardStyle={{
                backgroundColor: "#FFFFFF",
                textColor: "#000000", // ← ADICIONE
                borderColor: "#DDDDDD", // ← ADICIONE
                borderWidth: 1,
                borderRadius: 8,
                fontSize: 16,
                placeholderColor: "#999999", // ← ADICIONE
              }}
              style={styles.cardField}
              onCardChange={(cardDetails) => {
                setCardComplete(cardDetails.complete);
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              styles.successButton,
              !cardComplete && styles.buttonDisabled,
            ]}
            onPress={handleSubscribe}
            disabled={loading || !cardComplete}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Confirmar Assinatura (R$ 1,00/mês)
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            💳 Use o cartão de teste: 4242 4242 4242 4242
          </Text>
        </>
      )}

      <View>
        <TouchableOpacity
          style={[
            styles.button,
            styles.successButton,
            !cardComplete && styles.buttonDisabled,
          ]}
          onPress={handleCheckSubscriptions}
        >
          <Text>Verificar Assinaturas</Text>
        </TouchableOpacity>
      </View>

      {/* Informações */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>
          • Cobrança mensal automática{"\n"}• Cancele quando quiser{"\n"}•
          Primeiro mês: R$ 1,00{"\n"}• Ambiente de teste
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    color: "#666",
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
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  successButton: {
    backgroundColor: "#34C759",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  hint: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
});

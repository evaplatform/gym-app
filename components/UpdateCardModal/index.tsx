import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import Text from "@/components/custom/Text";

interface UpdateCardModalProps {
  visible: boolean;
  clientSecret: string;
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
}

export default function UpdateCardModal({
  visible,
  clientSecret,
  onSuccess,
  onCancel,
}: UpdateCardModalProps) {
  const { confirmSetupIntent } = useStripe();
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!cardComplete) {
      Alert.alert("Atenção", "Preencha todos os dados do cartão");
      return;
    }

    setLoading(true);
    try {
      // Confirmar Setup Intent com os dados do CardField
      const { setupIntent, error } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: "Card",
      });

      if (error) {
        Alert.alert("Erro", error.message);
        setLoading(false);
        return;
      }

      if (!setupIntent?.paymentMethodId) {
        Alert.alert("Erro", "Não foi possível processar o cartão");
        setLoading(false);
        return;
      }

      // Sucesso!
      onSuccess(setupIntent.paymentMethodId);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao processar cartão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Atualizar Cartão</Text>
            <TouchableOpacity onPress={onCancel} disabled={loading}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Digite os dados do novo cartão de crédito
          </Text>

          <View style={styles.cardContainer}>
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={styles.card}
              style={styles.cardField}
              onCardChange={(cardDetails) => {
                setCardComplete(cardDetails.complete);
              }}
            />
          </View>

          <Text style={styles.hint}>💳 Teste: 4242 4242 4242 4242</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmBtn,
                (!cardComplete || loading) && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!cardComplete || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#999",
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  cardContainer: {
    marginBottom: 12,
  },
  cardField: {
    height: 50,
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#007AFF",
  },
  cancelBtnText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#007AFF",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    borderColor: "#ccc",
  },
});

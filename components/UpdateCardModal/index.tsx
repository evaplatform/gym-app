import React, { useMemo, useState } from "react";
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
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import useCustomStyle from "@/hooks/useCustomStyle";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { Button } from "../custom/Button";
import { useCardFieldStyle } from "@/hooks/useCardFieldStyle";

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
  const cardStyle = useCardFieldStyle();
  const { t } = useTranslation();
  const { colors } = useCustomStyle();
  const { confirmSetupIntent } = useStripe();
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const customStyle = useMemo(() => {
    return {
      overlay: {
        backgroundColor: hexToRgba(colors.background, 0.5),
      },
      modalContainer: {
        backgroundColor: colors.gray200,
      },
      title: {
        color: colors.text,
      },
      subtitle: {
        color: colors.gray700,
      },
      card: {
        backgroundColor: colors.backgroundSecondary,
      },
      hint: {
        color: colors.gray700,
      },
      buttonContainer: {
        backgroundColor: colors.background,
      },
      cardField: {
        backgroundColor: colors.gray500,
        color: colors.text,
      },
    };
  }, [colors]);

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
      <View style={[styles.overlay, customStyle.overlay]}>
        <View style={[styles.modalContainer, customStyle.modalContainer]}>
          <View style={styles.header}>
            <Text style={[styles.title, customStyle.title]}>
              {t(AppMessagesEnum.SUBSCRIPTION_UPDATE_CARD)}
            </Text>
            <Button
              disabled={loading}
              title={"✕"}
              style={styles.closeButton}
              onPress={onCancel}
              severity={SeverityEnum.SECONDARY}
            />
          </View>

          <Text style={[styles.subtitle, customStyle.subtitle]}>
            {t(AppMessagesEnum.SUBSCRIPTION_UPDATE_CARD_DESCRIPTION)}
          </Text>

          <View style={styles.cardContainer}>
            <CardField
              postalCodeEnabled={false}
              onCardChange={(cardDetails) => {
                setCardComplete(cardDetails.complete);
              }}
              style={{ height: 50 }}
              cardStyle={cardStyle}
              placeholders={{
                number: "4242 4242 4242 4242",
                expiration: "MM/AA",
                cvc: "CVC",
              }}
            />
          </View>

          <Text style={[styles.hint, customStyle.hint]}>
            💳 Teste: 4242 4242 4242 4242
          </Text>

          <View style={[styles.buttonContainer, customStyle.buttonContainer]}>
            <Button
              disabled={!cardComplete || loading}
              title={t(AppMessagesEnum.CONFIRM_TITLE)}
              onPress={handleConfirm}
              severity={SeverityEnum.PRIMARY}
            />

            <Button
              disabled={loading}
              title={t(AppMessagesEnum.CANCEL)}
              onPress={onCancel}
              severity={SeverityEnum.DANGER}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
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
  },
  closeButton: {
    fontSize: 24,
    width: 40,
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  cardContainer: {
    marginBottom: 12,
  },
  cardField: {
    height: 50,
    marginVertical: 10,
  },
  card: { borderRadius: 8 },
  hint: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

import { View, StyleSheet } from "react-native";

import Input from "../../custom/Input";

import { Skeleton } from "../../custom/Skeleton";
import Text from "../../custom/Text";

export default function PaymentInfoScreen({ isLoading }: any) {
  return (
    <>
      {/* <View
        style={{
          borderBottomColor: "#ccc", // cor da linha
          borderBottomWidth: 1, // espessura
          marginVertical: 10, // espaço acima/abaixo
        }}
      />
      <Text>Opções de pagamento</Text>
      {isLoading ? (
        <Skeleton style={styles.inputWrapper} />
      ) : (
        <View style={styles.inputWrapper}>
          <Input
            label="custo mensal"
            mask={"COST"}
            placeholder="R$ 0,00"
            keyboardType="numeric"
            value={academy.paymentInfo?.monthlyFee.toString()}
            onChangeText={(formatted, raw) =>
              dispatch({ type: "paymentInfo.monthlyFee", payload: raw })
            }
          />
        </View>
      )}
      {isLoading ? (
        <Skeleton style={styles.inputWrapper} />
      ) : (
        <View style={styles.inputWrapper}>
          <Input
            label="conta corrente"
            keyboardType="numeric"
            value={academy.paymentInfo?.checkingAccount.toString()}
            onChange={(e) =>
              dispatch({
                type: "paymentInfo.checkingAccount",
                payload: e.nativeEvent.text,
              })
            }
          />
        </View>
      )}
      {isLoading ? (
        <Skeleton style={styles.inputWrapper} />
      ) : (
        <View style={styles.inputWrapper}>
          <Input
            label="nome do cartão"
            value={academy.paymentInfo?.cardHolderName.toString()}
            onChange={(e) =>
              dispatch({
                type: "paymentInfo.cardHolderName",
                payload: e.nativeEvent.text,
              })
            }
          />
        </View>
      )}
      {isLoading ? (
        <Skeleton style={styles.inputWrapper} />
      ) : (
        <View style={styles.inputWrapper}>
          <Input
            label="n° do cartão"
            mask="CARD_NUMBER"
            placeholder="9999 9999 9999 9999"
            keyboardType="numeric"
            value={academy.paymentInfo?.cardNumber.toString()}
            onChangeText={(formatted, raw) =>
              dispatch({
                type: "paymentInfo.cardNumber",
                payload: raw,
              })
            }
          />
        </View>
      )}
      {isLoading ? (
        <Skeleton style={styles.inputWrapper} />
      ) : (
        <View style={styles.inputWrapper}>
          <Input
            label="data de expiração"
            mask="EXPIRATION_DATE"
            placeholder="99/99"
            keyboardType="numeric"
            value={academy.paymentInfo?.expirationDate.toString()}
            onChangeText={(formatted, raw) =>
              dispatch({
                type: "paymentInfo.expirationDate",
                payload: raw,
              })
            }
          />
        </View> 
      )}*/}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonWrapper: { width: "100%", gap: 5 },
  button: { flex: 1, width: 350, marginHorizontal: 30 },
  inputWrapper: { width: "100%", minHeight: 40 },
  fields: {
    width: "100%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageVideoGroup: {
    width: "90%",
    alignItems: "center",
    gap: 5,
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
});

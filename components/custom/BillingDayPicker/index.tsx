import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "@/components/custom/Text";
import useCustomStyle from "@/hooks/useCustomStyle";
import { PaymentSubscriptionService } from "@/services/PaymentSubscriptionServices";
import { IBillingDayPreviewResponse } from "@/services/PaymentSubscriptionServices/interfaces";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

interface BillingDayPickerProps {
  email: string;
  priceId: string;
  selectedDay: number | undefined;
  onChange: (day: number) => void;
}

// Dias disponíveis: 1-28 (28 é o máximo seguro para todos os meses)
const AVAILABLE_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export default function BillingDayPicker({
  email,
  priceId,
  selectedDay,
  onChange,
}: BillingDayPickerProps) {
  const { colors } = useCustomStyle();
  const { t } = useTranslation();

  const [preview, setPreview] = useState<IBillingDayPreviewResponse | null>(
    null,
  );
  const [loadingPreview, setLoadingPreview] = useState(false);

  const fetchPreview = useCallback(
    async (day: number) => {
      if (!email || !priceId) return;

      try {
        setLoadingPreview(true);
        const result = await PaymentSubscriptionService.previewBillingDay({
          billingDay: day,
          priceId,
          email,
        });
        setPreview(result);
      } catch {
        setPreview(null);
      } finally {
        setLoadingPreview(false);
      }
    },
    [email, priceId],
  );

  useEffect(() => {
    if (selectedDay) {
      fetchPreview(selectedDay);
    }
  }, [selectedDay, fetchPreview]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {t(AppMessagesEnum.SUBSCRIPTION_BILLING_DAY_LABEL)}
      </Text>
      <Text style={[styles.sublabel, { color: colors.gray600 }]}>
        {t(AppMessagesEnum.SUBSCRIPTION_BILLING_DAY_SUBLABEL)}
      </Text>

      {/* Grid de dias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScrollContent}
      >
        {AVAILABLE_DAYS.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => onChange(day)}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected
                    ? colors.tint
                    : colors.backgroundSecondary,
                  borderColor: isSelected ? colors.tint : colors.gray300,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isSelected ? "#fff" : colors.text,
                    fontWeight: isSelected ? "700" : "400",
                  },
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Preview */}
      {selectedDay && (
        <View
          style={[
            styles.previewBox,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          {loadingPreview ? (
            <ActivityIndicator size="small" color={colors.tint} />
          ) : preview ? (
            <>
              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.gray600 }]}>
                  📅 {t(AppMessagesEnum.SUBSCRIPTION_BILLING_DAY_NEXT_DATE)}:
                </Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>
                  {preview.nextBillingDate}
                </Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={[styles.previewLabel, { color: colors.gray600 }]}>
                  ⏳ {t(AppMessagesEnum.SUBSCRIPTION_BILLING_DAY_DAYS_UNTIL)}:
                </Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>
                  {preview.daysUntilBilling}{" "}
                  {t(AppMessagesEnum.SUBSCRIPTION_BILLING_DAY_DAYS)}
                </Text>
              </View>

              <View
                style={[
                  styles.infoBox,
                  { backgroundColor: colors.notification.infoBackground },
                ]}
              >
                <Text
                  style={[
                    styles.infoText,
                    { color: colors.notification.info },
                  ]}
                >
                  ℹ️ {t(AppMessagesEnum.SUBSCRIPTION_BILLING_DAY_NO_PRORATION)}
                </Text>
              </View>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sublabel: {
    fontSize: 13,
    marginBottom: 12,
  },
  daysScrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
  },
  previewBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 13,
    flex: 1,
  },
  previewValue: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  infoBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
  },
});
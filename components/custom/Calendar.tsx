import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Text from "./Text";
import { RootReduxState } from "@/redux";
import Card from "./Card";
import {
  getDaysOfCurrentWeek,
  getWeekdaysList,
  WeekDayDescription,
} from "@/shared/utils/weedaysUtils";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { useCallback, useEffect, useMemo, useRef } from "react"; // Adicione useRef aqui
import { useFocusEffect } from "expo-router";

const currentWeekDays = getDaysOfCurrentWeek();

type CalendarProps = {
  weekdayActive: WeekDayDescription | null;
  setWeekdayActive: React.Dispatch<
    React.SetStateAction<WeekDayDescription | null>
  >;
};

export default function Calendar({
  weekdayActive,
  setWeekdayActive,
}: CalendarProps) {
  const { currentLanguage } = useSelector(
    (state: RootReduxState) => state.language
  );

  // Adicione a referência ao ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  // Referência para controlar se é a primeira renderização
  const isInitialMount = useRef(true);

  const currentDate = useMemo(() => new Date(), []);

  // useEffect para definir o dia ativo como hoje
  useEffect(() => {
    const today = new Date();
    const todayWeekday = getWeekdaysList().find((weekday) => {
      const correspondingDay = currentWeekDays.find(
        (date) =>
          date.toLocaleDateString(currentLanguage, { weekday: "long" }) ===
          weekday.description
      );
      return correspondingDay?.getDate() === today.getDate();
    });

    if (todayWeekday && !weekdayActive) {
      setWeekdayActive(todayWeekday);
    }
  }, [currentLanguage, weekdayActive, setWeekdayActive]);

  // useEffect para fazer o scroll para o dia ativo
  useFocusEffect(
    useCallback(() => {
      if (!weekdayActive) return;

      // Marca que não é mais a primeira renderização
      isInitialMount.current = false;

      // Atrasa o scroll para garantir que o layout já foi calculado
      const timer = setTimeout(() => {
        if (!scrollViewRef.current) return;

        // Encontra o índice do dia ativo
        const activeIndex = getWeekdaysList().findIndex(
          (weekday) => weekday.day === weekdayActive.day
        );

        if (activeIndex >= 0) {
          // Calcula a posição de scroll (72 = largura do card + gap)
          const scrollPosition = activeIndex * 72;
          scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [weekdayActive])
  );

  return (
    <View>
      <Text type="subtitle">
        {currentDate.toLocaleDateString(currentLanguage, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.calendarContainer}>
          {getWeekdaysList().map((weekday) => {
            const correspondingDayOfMonth = currentWeekDays
              .find((date) => {
                return (
                  date.toLocaleDateString(currentLanguage, {
                    weekday: "long",
                  }) === weekday.description
                );
              })
              ?.getDate();

            return (
              <Card
                key={weekday.day}
                onPress={() => setWeekdayActive(weekday)}
                leftLabel={correspondingDayOfMonth?.toString() || ""}
                secondaryLabel={weekday.shortDescription}
                viewStyles={styles.card}
                isActive={weekdayActive?.day === weekday.day}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    gap: 12,
    flexDirection: "row",
    padding: 0,
    paddingVertical: 10,
    marginBottom: 10,
  },
  card: {
    height: 60,
    width: 60,
  },
});

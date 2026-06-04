import Container from "@/components/custom/Container";
import { useTranslation } from "@/hooks/useTranslation";
import Text from "@/components/custom/Text";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

export default function FinancialScreen() {
  const { t } = useTranslation();
  return (
    <Container>
      <Text>{t(AppMessagesEnum.TAB_FINANCIAL)}</Text>
    </Container>
  );
}
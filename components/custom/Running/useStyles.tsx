import useCustomStyle from "@/hooks/useCustomStyle";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import { useMemo } from "react";

export default function useStyles() {
  const { colors } = useCustomStyle();

  const customStyle = useMemo(() => {
    return {
      centerDot: {
        backgroundColor: colors.tint,
      },
      centerButtonInner: {
        backgroundColor: colors.background,
      },
      centerButton: {
        shadowColor: colors.gray900,
      },
      arrowHead: {
        borderBottomColor: colors.tint,
        shadowColor: colors.gray900,
      },
      stopButton: {
        backgroundColor: colors.notification.danger,
      },
      startButton: {
        backgroundColor: colors.notification.success,
      },
      metricsContainer: {
        backgroundColor: hexToRgba(colors.background, 0.7),
      },
      searchContainer: {
        backgroundColor: hexToRgba(colors.background, 0.5),
        shadowColor: colors.gray900,
      },
      searchInput: {
        color: colors.text,
      },
      searchResultsContainer: {
        backgroundColor: hexToRgba(colors.background, 0.95),
        shadowColor: colors.gray900,
      },
      searchResultItem: {
        borderBottomColor: hexToRgba(colors.gray300, 0.5),
      },
      searchResultText: {
        color: colors.text,
      },

      progressContainer: {
        backgroundColor: hexToRgba(colors.background, 0.9),
      },
      loadingContainer: {
        backgroundColor: hexToRgba(colors.gray900, 0.4),
      },
      searchInputContainer: {
        borderColor: hexToRgba(colors.background, 0.1),
        backgroundColor: colors.background,
      },
      progressText: {
        color: colors.text,
      },
      ballHead: {
        backgroundColor: colors.tint,
        borderColor: colors.white,
        shadowColor: colors.black,
      },
    };
  }, [colors]);

  return { customStyle, colors };
}

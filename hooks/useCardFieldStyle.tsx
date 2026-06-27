// hooks/useCardFieldStyle.ts
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import useCustomStyle from './useCustomStyle';
import type { CardFieldInput } from '@stripe/stripe-react-native';

export const useCardFieldStyle = (): CardFieldInput.Styles => {
  const { colors } = useCustomStyle();
  const colorScheme = useColorScheme();

  return useMemo(
    () => ({
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      textColor: colors.text,
      placeholderColor: colors.gray500,
      cursorColor: colors.tint,
      textErrorColor: colors.notification.danger,
      fontSize: 16,
      // Adicione fontFamily se necessário
      // fontFamily: 'YourFont-Regular',
    }),
    [colors, colorScheme]
  );
};
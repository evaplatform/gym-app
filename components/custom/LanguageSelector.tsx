// src/components/LanguageSelector.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { SupportedLanguagesEnum } from '@/shared/enum/SupportedLanguagesEnum';
import { AppMessagesEnum } from '@/shared/enum/AppMessagesEnum';
import Text from './Text'

export const LanguageSelector = () => {
  const { t, currentLanguage, setLanguage } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {t(AppMessagesEnum.LANGUAGE_SELECTOR_LABEL)}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === SupportedLanguagesEnum.PT_BR && styles.activeButton
          ]}
          onPress={() => setLanguage(SupportedLanguagesEnum.PT_BR)}
        >
          <Text style={[
            styles.buttonText,
            currentLanguage === SupportedLanguagesEnum.PT_BR && styles.activeButtonText
          ]}>
            Português
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === SupportedLanguagesEnum.EN && styles.activeButton
          ]}
          onPress={() => setLanguage(SupportedLanguagesEnum.EN)}
        >
          <Text style={[
            styles.buttonText,
            currentLanguage === SupportedLanguagesEnum.EN && styles.activeButtonText
          ]}>
            English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: '#007bff',
    },
    buttonText: {
        fontSize: 14,
        color: '#000',
    },
    activeButtonText: {
        color: '#fff',
    },
});
// src/hooks/useTranslation.ts
import { useSelector, useDispatch } from 'react-redux';
import { changeLanguage } from '@/redux/slices/languageSlice';
import { AppMessagesEnum } from '@/shared/enum/AppMessagesEnum';
import { SupportedLanguagesEnum } from '@/shared/enum/SupportedLanguagesEnum';
import { DEFAULT_LANGUAGE, i18n } from '@/i18n';
import { RootReduxState } from '@/redux';
import { log } from '@/shared/utils/log';
import { isSystemInitialized } from '@/redux/midleware/initializationMiddleware';



export function useTranslation() {
  const dispatch = useDispatch();
  
  // Use try/catch para evitar erros se o estado do Redux ainda não estiver disponível
  let currentLanguage = DEFAULT_LANGUAGE;
  let isLoading = false;
  
  try {
    const languageState = useSelector((state: RootReduxState) => state.language);
    if (languageState) {
      currentLanguage = languageState.currentLanguage || DEFAULT_LANGUAGE;
      isLoading = languageState.isLoading || false;
    }
  } catch (error) {
    log('Erro ao acessar estado de idioma em useTranslation:', error);
  }

  const t = (code: AppMessagesEnum) => {
    try {
      // Verifica se o sistema está inicializado antes de traduzir
      if (!isSystemInitialized() && !isLoading) {
        log(`useTranslation: Sistema não inicializado, usando código bruto para ${code}`);
        return code;
      }
      
      return i18n.translate(code);
    } catch (error) {
      log('Erro ao traduzir em useTranslation:', error);
      return code;
    }
  };

  const setLanguage = (language: SupportedLanguagesEnum) => {
    try {
      log(`useTranslation: Alterando idioma para ${language}`);
      dispatch(changeLanguage(language));
    } catch (error) {
      log('Erro ao mudar idioma em useTranslation:', error);
    }
  };

  // Verificar se o sistema está inicializado
  const systemInitialized = isSystemInitialized();

  return {
    t,
    currentLanguage,
    setLanguage,
    isLoading,
    isInitialized: systemInitialized,
    isPortuguese: currentLanguage === SupportedLanguagesEnum.PT_BR,
    isEnglish: currentLanguage === SupportedLanguagesEnum.EN,
  };
}
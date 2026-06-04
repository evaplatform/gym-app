import { SupportedLanguagesEnum } from "@/shared/enum/SupportedLanguagesEnum";
import { enAppMessages } from "./translations/en";
import { ptBrAppMessages } from "./translations/ptBr";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { store } from "@/redux";
import { log } from "@/shared/utils/log";
import * as Localization from "expo-localization";

const translations: Record<
  SupportedLanguagesEnum,
  Record<AppMessagesEnum, string>
> = {
  en: enAppMessages,
  "pt-BR": ptBrAppMessages,
};

// Idioma padrão para fallback
export const DEFAULT_LANGUAGE = SupportedLanguagesEnum.PT_BR;

export const i18n = {
  translate(code: AppMessagesEnum): string {
    //avoid translate of the moment
    return translations[DEFAULT_LANGUAGE][code] || code;
    
    try {
      // Tenta obter o idioma atual do estado do Redux
      const state = store.getState();

      const systemLanguage = Localization.getLocales()[0]?.languageTag;

      // Verifica se o estado de idioma existe e está inicializado
      let currentLanguage = DEFAULT_LANGUAGE;
      if (state && state.language && state.language.currentLanguage) {
        currentLanguage = state.language
          .currentLanguage as SupportedLanguagesEnum;
      } else if (systemLanguage) {
        currentLanguage = systemLanguage.startsWith("pt")
          ? SupportedLanguagesEnum.PT_BR
          : SupportedLanguagesEnum.EN;
      }

      // Verifica se a tradução existe para o idioma atual
      if (
        translations[currentLanguage] &&
        translations[currentLanguage][code]
      ) {
        return translations[currentLanguage][code];
      }

      // Fallback para o idioma padrão
      if (
        translations[DEFAULT_LANGUAGE] &&
        translations[DEFAULT_LANGUAGE][code]
      ) {
        return translations[DEFAULT_LANGUAGE][code];
      }

      // Se tudo falhar, retorna o código como string
      return code;
    } catch (error) {
      log("Erro ao traduzir:", error);

      // Em caso de erro, tenta usar a tradução do idioma padrão
      try {
        return translations[DEFAULT_LANGUAGE][code] || code;
      } catch {
        // Se mesmo isso falhar, retorna o código
        return code;
      }
    }
  },
};

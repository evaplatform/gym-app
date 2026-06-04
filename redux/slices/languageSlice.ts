// src/redux/reducers/languageReducer.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguagesEnum } from '@/shared/enum/SupportedLanguagesEnum';
import { StoragesEnum } from '@/shared/enum/StoragesEnum';
import * as Localization from 'expo-localization';

// Estado inicial
export interface LanguageState {
  currentLanguage: SupportedLanguagesEnum;
  isLoading: boolean;
  translations: Record<SupportedLanguagesEnum, Record<string, string>>;
}

const initialState: LanguageState = {
  currentLanguage: SupportedLanguagesEnum.EN,
  isLoading: true,
  translations: {
    [SupportedLanguagesEnum.EN]: {},
    [SupportedLanguagesEnum.PT_BR]: {},
  }
};

// Thunk para inicializar o idioma
export const initializeLanguage = createAsyncThunk(
  'language/initialize',
  async () => {
    try {
      // Tentar obter o idioma salvo
      const savedLanguage = await AsyncStorage.getItem(StoragesEnum.LANGUAGE_STORAGE_KEY);

      if (savedLanguage && Object.values(SupportedLanguagesEnum).includes(savedLanguage as SupportedLanguagesEnum)) {
        // Se o idioma salvo for válido, usá-lo
        return savedLanguage as SupportedLanguagesEnum;
      }
      // Caso contrário, detectar o idioma do sistema
      const systemLanguage = Localization.getLocales()[0]?.languageTag as SupportedLanguagesEnum

      await AsyncStorage.setItem(StoragesEnum.LANGUAGE_STORAGE_KEY, systemLanguage);

      return systemLanguage;

    } catch (error) {
      // Fallback para inglês em caso de erro
      return SupportedLanguagesEnum.EN;
    }
  }
);

export const changeLanguage = createAsyncThunk(
  'language/change',
  async (language: SupportedLanguagesEnum) => {
    try {
      // Salvar o novo idioma
      await AsyncStorage.setItem(StoragesEnum.LANGUAGE_STORAGE_KEY, language);
      return language;
    } catch (error) {
      console.error('Erro ao alterar idioma:', error);
      throw error;
    }
  }
);

// Criar o slice
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    // Adicione um reducer síncrono para definir o idioma
    setLanguage: (state, action: PayloadAction<SupportedLanguagesEnum>) => {
      state.currentLanguage = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Inicialização
      .addCase(initializeLanguage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeLanguage.fulfilled, (state, action: PayloadAction<SupportedLanguagesEnum>) => {
        state.currentLanguage = action.payload;
        state.isLoading = false;
      })
      .addCase(initializeLanguage.rejected, (state) => {
        state.currentLanguage = SupportedLanguagesEnum.EN; // Fallback para inglês
        state.isLoading = false;
      })
      // Mudança de idioma
      .addCase(changeLanguage.fulfilled, (state, action: PayloadAction<SupportedLanguagesEnum>) => {
        state.currentLanguage = action.payload;
      });
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
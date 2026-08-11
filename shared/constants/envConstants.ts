import Constants from "expo-constants";

const manifestExtra = (
  Constants.manifest as { extra?: Record<string, string> } | null
)?.extra;

export const NODE_ENV =
  Constants.expoConfig?.extra?.NODE_ENV ?? manifestExtra?.NODE_ENV;

export const IOS_ID =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_IOS_ID ??
  manifestExtra?.EXPO_PUBLIC_IOS_ID;
export const ANDROID_ID =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_ANDROID_ID_PROD ??
  manifestExtra?.EXPO_PUBLIC_ANDROID_ID_PROD;
export const WEB_ID =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_WEB_ID ??
  manifestExtra?.EXPO_PUBLIC_WEB_ID;
export const SECRET_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SECRET_KEY ??
  manifestExtra?.EXPO_PUBLIC_SECRET_KEY;
export const GOOGLE_MAPS_API_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
  manifestExtra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
export const LOG =
  (Constants.expoConfig?.extra?.EXPO_PUBLIC_LOG ??
    manifestExtra?.EXPO_PUBLIC_LOG) === "true";

export const PUBLISH_KEY =
  Constants.expoConfig?.extra?.PUBLISH_KEY ?? manifestExtra?.PUBLISH_KEY;

export const PUBLISH_KEY_TEST =
  Constants.expoConfig?.extra?.PUBLISH_KEY_TEST ??
  manifestExtra?.PUBLISH_KEY_TEST;

export const PRICE_ID =
  Constants.expoConfig?.extra?.PRICE_ID ?? manifestExtra?.PRICE_ID;

export const PRICE_ID_TEST =
  Constants.expoConfig?.extra?.PRICE_ID_TEST ?? manifestExtra?.PRICE_ID_TEST;

export const BASE_URL =
  NODE_ENV === "development"
    ? (Constants.expoConfig?.extra?.EXPO_PUBLIC_BASE_URL_DEV ??
      manifestExtra?.EXPO_PUBLIC_BASE_URL_DEV)
    : (Constants.expoConfig?.extra?.EXPO_PUBLIC_BASE_URL_PROD ??
      manifestExtra?.EXPO_PUBLIC_BASE_URL_PROD);

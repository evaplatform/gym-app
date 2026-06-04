import Constants from "expo-constants";

const manifestExtra = (
  Constants.manifest as { extra?: Record<string, string> } | null
)?.extra;

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

import { useOverlay } from "@/contexts/overlayContext";
import { log } from "@/shared/utils/log";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

type CatchFunctionType = (
  toast: typeof Toast,
  e: any,
  callbackCatch?: (e: any) => Promise<boolean | void> | boolean | void
) => void;

type ApiCallType<T> = {
  try: (toast: typeof Toast) => Promise<T>;
  catch?: CatchFunctionType;
  finally?: () => void;
  loading?: boolean;
};

export function useApi() {
  const state = useOverlay();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const catchFunction = useCallback(
    async (e: any, callbackCatch?: CatchFunctionType) => {
      const error = e as any;
      log("error-log", error);
      let treatOnlyCallback = false;
      if (callbackCatch) {
        treatOnlyCallback = (await callbackCatch(Toast, e)) ?? false;
      }

      if (treatOnlyCallback) return;

      if (error?.response?.data?.error) {
        return Toast.show({
          type: "error",
          text1: "Erro",
          text2: error.response.data.error,
        });
      }

      if (error?.response?.data?.userMessage) {
        return Toast.show({
          type: "error",
          text1: "Hello",
          text2: "This is some something 👋",
        });
      }

      if (error?.message) {
        return Toast.show({
          type: "error",
          text1: "Erro",
          text2: error.message,
        });
      }

      Toast.show({
        type: "error",
        text1: "error",
        text2: "Erro desconhecido",
      });
    },
    []
  );

  const call = useCallback(
    async <T = void,>({
      try: callbackCall,
      finally: callbackFinally,
      catch: callbackCatch,
      loading = false,
    }: ApiCallType<T>) => {
      let res: any;

      if (loading) {
        setIsLoading(true);
        state?.showOverlay();
      }

      try {
        res = await callbackCall(Toast);
        log("finished try");
        if (res) return res;
      } catch (e) {
        catchFunction(e, callbackCatch);
      } finally {
        log("finally ", res);
        callbackFinally?.();

        if (loading) {
          setIsLoading(false);
          state?.hideOverlay();
        }
      }
    },
    [state]
  );

  const safe = <T,>(p: Promise<T>) => p.catch(catchFunction);

  return { call, isLoading, safe };
}

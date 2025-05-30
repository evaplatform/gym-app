import { useCallback } from 'react';
import Toast, { ToastProps } from 'react-native-toast-message';

type ApiCallType = {
    try: (toast: any) => Promise<void>
    catch?: (error: any) => void
    finally?: () => void
}

export function useApi() {
    const call = useCallback(
        async ({
            try: callbackCall,
            finally: callbackFinally,
            catch: callbackCatch,
        }: ApiCallType) => {
            try {
                await callbackCall(Toast)
            } catch (e) {

                if (callbackCatch) {
                    callbackCatch(e)
                }

                // if (axiosError?.response?.data?.userMessage) {
                //     Toast.show({
                //         type: 'error',
                //         text1: 'Hello',
                //         text2: 'This is some something 👋'
                //     });
                // }
            } finally {
                callbackFinally?.()
                // if (loading) dispatch(setIsLoading(false))
            }
        },
        [],
    )

    return { call }
}
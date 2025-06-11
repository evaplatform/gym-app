import { OverlayContext } from '@/contexts/overlayContext';
import { useCallback, useContext } from 'react';
import Toast, { ToastProps } from 'react-native-toast-message';

type ApiCallType = {
    try: (toast: any) => Promise<void>
    catch?: (error: any) => void
    finally?: () => void
    loading?: boolean
}

export function useApi() {
    const state = useContext(OverlayContext);


    const call = useCallback(
        async ({
            try: callbackCall,
            finally: callbackFinally,
            catch: callbackCatch,
            loading = false
        }: ApiCallType) => {
            try {
                if (loading) {
                    state?.showOverlay();
                }

                await callbackCall(Toast)
            } catch (e) {

                if (callbackCatch) {
                    callbackCatch(e)
                }

                if ((e as any).response.data.error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: (e as any).response.data.error
                    });
                }

                if ((e as any)?.response?.data?.userMessage) {
                    Toast.show({
                        type: 'error',
                        text1: 'Hello',
                        text2: 'This is some something 👋'
                    });
                }
            } finally {
                callbackFinally?.()

                if (loading) {
                    state?.hideOverlay();
                }
            }
        },
        [state],
    )

    return { call }
}
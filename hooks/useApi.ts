import { OverlayContext } from '@/contexts/overlayContext';
import { useCallback, useContext } from 'react';
import Toast from 'react-native-toast-message';

type ApiCallType<T> = {
    try: (toast: any) => Promise<T>
    catch?: (error: any) => void
    finally?: () => void
    loading?: boolean
}

export function useApi() {
    const state = useContext(OverlayContext);


    const call = useCallback(
        async <T = void>({
            try: callbackCall,
            finally: callbackFinally,
            catch: callbackCatch,
            loading = false
        }: ApiCallType<T>) => {
            try {
                if (loading) {
                    state?.showOverlay();
                }

                const res = await callbackCall(Toast)
                if (res) return res;
            } catch (e) {

                if (callbackCatch) {
                    callbackCatch(e)
                }

                console.log(e);
                console.error((e as any)?.response?.data?.error || e);

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
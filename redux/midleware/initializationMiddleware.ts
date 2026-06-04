import { } from '@reduxjs/toolkit';
import { RootReduxState } from '@/redux';
 import { log } from '@/shared/utils/log';
import { MiddlewareAPI, Dispatch } from '../../node_modules/redux';


type AnyAction = { type: string; payload?: any };

// Lista de ações que dependem da inicialização
const dependentActions: string[] = [
    'language/change', // Adicione a ação de mudança de idioma
    // Adicione outras ações que dependem do idioma inicializado
];

let isInitialized = false;
const pendingActions: Array<{
    next: Dispatch<AnyAction>;
    action: AnyAction;
}> = [];

export const setInitialized = () => {
    log('Middleware: Marcando sistema como inicializado');
    isInitialized = true;
    // Reprocessar ações pendentes
    if (pendingActions.length > 0) {
        log(`Middleware: Processando ${pendingActions.length} ações pendentes`);
        pendingActions.forEach(action => action.next(action.action));
        pendingActions.length = 0;
    }
};

export const initializationMiddleware: any = (store: MiddlewareAPI<Dispatch, RootReduxState>) => (next: Dispatch) => (action: AnyAction) => {
    // Se a ação é de inicialização bem-sucedida
    if (action.type === 'language/initialize/fulfilled') {
        log('Middleware: Inicialização de idioma concluída');
        const result = next(action);
        setInitialized();
        return result;
    }

    // Se a ação depende da inicialização e ainda não inicializamos
    if (!isInitialized && dependentActions.some(type => action.type.startsWith(type))) {
        log(`Middleware: Ação ${action.type} pendente de inicialização`);
        // Armazenar para processar depois
        pendingActions.push({ next, action });
        return;
    }

    // Ações normais passam direto
    return next(action);
};

// Função auxiliar para verificar se o sistema está inicializado
export const isSystemInitialized = () => isInitialized;
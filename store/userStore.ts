import { ISigninCreateRes } from '@/services/LoginServices/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveUserToStorage = async (data: ISigninCreateRes) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (e) {
        console.error('Erro ao salvar:', e);
    }
};

const getUserFromStorage = async (): Promise<ISigninCreateRes | undefined> => {
    try {
        const value = await AsyncStorage.getItem('userData');
        if (value !== null) {
            const user = JSON.parse(value) as ISigninCreateRes;
            return user;
        }
    } catch (e) {
        console.error('Erro ao ler:', e);
    }
};


export { saveUserToStorage, getUserFromStorage };
import { LocalDatabaseServices } from '@/database/hooks/useLocalDatabase';
import { IExercise } from '@/shared/models/IExercise';
import { createAsyncThunk, RootReduxState } from '@reduxjs/toolkit';


type Input = { dataBase?: LocalDatabaseServices } | void;

type Output = IExercise[] | null;


type State = {
    state: RootReduxState;
    rejectValue: string;
    extra: { databaseService: LocalDatabaseServices, getDatabaseService: () => LocalDatabaseServices | null }
};


// Exemplo de action para buscar dados de usuários
export const fetchExample = createAsyncThunk<Output, Input, State>(
    'exemplos/fetchExample',
    async (input, { getState, rejectWithValue, extra }) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error('Erro ao buscar exemplos');
            }
            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Exemplo de action para criar um novo exemplo
export const createExample = createAsyncThunk(
    'exemplos/createExample',
    async (example: { name: string; email: string }, thunkAPI) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(example),
            });
            if (!response.ok) {
                throw new Error('Erro ao criar exemplo');
            }
            const data = await response.json();
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
import { LOAD_ALL, RESET } from "@/shared/constants/reducerConsts";
import { ActionType } from "@/shared/types/ReducerTypes";

/**
 * A custom hook that provides a reducer function for managing the state of an exercise.
 * The state is based on the `IExercise` interface and includes additional fields for
 * handling old and current paths for images and videos.
 *
 * ### Usage
 *
 * #### Load an exercise:
 * ```typescript
 * dispatch({ type: 'LOAD_ALL', payload: exercise });
 * ```
 *
 * #### Update individual fields:
 * ```typescript
 * dispatch({ type: 'name', payload: 'Novo nome de exercício' });
 * ```
 *
 * @param state - The current state of the exercise, extended from `IExercise`.
 * @param action - The action to perform on the state, including the type and optional payload.
 * @returns The updated state after applying the action.
 */
export function reducerHelper<T>(initialState: T) {
    return (
        state: T,
        action: ActionType<T & (typeof LOAD_ALL | typeof RESET)>
    ) => {
        if (action.type === LOAD_ALL) {
            return { ...state, ...action.payload };
        }

        if (action.type === RESET) {
            return initialState as unknown as T;
        }

        return { ...state, [action.type]: action.payload };
    }
}

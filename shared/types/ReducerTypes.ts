type Action<T> =
    | keyof T
    | "LOAD_ALL"
    | "RESET";

export type ActionType<T> = {
    type: Action<T>;
    payload?: any;
}

export type Dispatch<T> = React.ActionDispatch<[action: ActionType<T>]>

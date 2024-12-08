export type Dictionary<T> = {
    [key: string]: T;
};
export type Override<T, R> = Omit<T, keyof R> & R;

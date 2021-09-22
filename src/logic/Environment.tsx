import React, {Dispatch, SetStateAction} from "react";

export namespace Environment {

    export function usePersistent<T>(defaultValue: T, key: string, category:string = 'public'): [T, Dispatch<SetStateAction<T>>] {
        key = category + ":" + key;
        const [value, setValue] = React.useState(() => {
            const persistentValue = window.localStorage.getItem(key);
            return persistentValue !== null ? JSON.parse(persistentValue) : defaultValue;
        });
        React.useEffect(() => {
            window.localStorage.setItem(key, JSON.stringify(value));
        }, [key, value]);
        return [value, setValue];
    }
}
import React, {Dispatch, SetStateAction} from "react";

export function useStickyState<T>(defaultValue: T, key: string): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = React.useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    });
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}

export function Counter() {
    const [count, setCount] = useStickyState(0, "count");
    const changeCountBy = (off: number) => {
        setCount(prevState => prevState + off);
    };
    return(
        <>
            <button onClick={() => changeCountBy(-10)}>-10</button>
            <button onClick={() => changeCountBy(-1)}>-1</button>
            <span>{count}</span>
            <button onClick={() => changeCountBy(1)}>1</button>
            <button onClick={() => changeCountBy(10)}>10</button>
        </>
    );
}
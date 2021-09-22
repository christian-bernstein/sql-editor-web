import React, {FC, useState} from "react";
import "./Learning.scss"
import {
    Badge,
    createTheme,
    TextField,
    Theme,
    ThemeProvider,
    useMediaQuery
} from "@mui/material";
import {Notifications} from "@mui/icons-material";
import {usePersistent} from "./Context";
import Cache from "./logic/Cache";
import {prependListener} from "cluster";

export const Counter: React.FC = ({}) => {
    const [count, setCount] = usePersistent(0, "count");
    const changeCountBy = (off: number) => {
        setCount(prevState => prevState + off);
    };
    return(
        <div className={"counter"}>
            <button onClick={() => changeCountBy(-100)}>-100</button>
            <button onClick={() => changeCountBy(-10)}>-10</button>
            <button onClick={() => changeCountBy(-1)}>-1</button>
            <Badge badgeContent={count} color={"primary"}>
                <Notifications/>
            </Badge>
            <button onClick={() => changeCountBy(1)}>1</button>
            <button onClick={() => changeCountBy(10)}>10</button>
            <button onClick={() => changeCountBy(100)}>100</button>
        </div>
    );
}

export const Memo: React.FC = ({}) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme: Theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode]
    );

    const [memo, setMemo] = usePersistent("You're memo goes here", "memo")
    return(
        <ThemeProvider theme={theme}>
            <div className={"memo"}>
                <TextField
                    id="memo-text-field"
                    label="Memo"
                    variant="outlined"
                    value={memo}
                    onChange={event => setMemo(event.target.value)}
                    error={false}
                    multiline={true}
                />
            </div>
        </ThemeProvider>
    );
}


class A {

    static a:any;

    static dispatch: React.Dispatch<any>;

    public static sub(dispatch: React.Dispatch<any>) {
        A.dispatch = dispatch;
    }

    public static change(newA: any) {
        A.a = newA;
        A.dispatch(newA);
    }
}

export const StateWatcher: React.FC = ({}) => {
    const [val, setVal] = useState<any>("def");
    A.sub(setVal);

    return(
        <span>{val}</span>
    );
}

export const StateChanger: React.FC = ({}) => {
    return(
        <button onClick={() => A.change("new state")}>Change state</button>
    );
}

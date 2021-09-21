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


export const StateWatcher: React.FC = ({}) => {
    const text = Cache.optCache('public').getOrSet('text', 'This is a placeholder');

    return(
        <span>{text}</span>
    );
}

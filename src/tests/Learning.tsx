import React, {createRef, FC, useRef, useState} from "react";
import "./Learning.scss"
import {
    Badge, Button,
    createTheme, Stack,
    TextField,
    Theme,
    ThemeProvider,
    useMediaQuery
} from "@mui/material";
import {Notifications} from "@mui/icons-material";
import Store from "../logic/Store";
import {Environment} from "../logic/Environment";

export const Counter: React.FC = ({}) => {
    const [count, setCount] = Environment.usePersistent(0, "count");
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
    const [memo, setMemo] = Environment.usePersistent("You're memo goes here", "memo")
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
    const [val, setVal] = useState("default state");
    const store: Store = Store.defStore();
    return(
        <>
            <span>{val}</span>
            <button onClick={() => {
                if (store.isSubscribed("val", setVal)) {
                    store.unsubscribe("val", setVal);
                } else {
                    store.subscribe("val", [val, setVal]);
                }
            }}>{"Toggle subscription"}</button>
        </>
    );
}

export const StateChanger: React.FC = ({}) => {
    const input: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
    return(
        <>
            <input onChange={() => Store.optStore("default").set("val", input.current?.value)} ref={input} type={"text"}/>
            <button onClick={() => Store.optStore("default").set("val", input.current?.value)}>Change state</button>
        </>
    );
}

export type LoginState = {
    username: string,
    password: string,
    connector: Environment.Connector,
    state: boolean
}

export const Login: React.FC = () => {
    const [state, setState] = useState<LoginState>(() => {
        return {
            username: "",
            password: "",
            connector: new Environment.Connector("base").connect("ws:127.0.0.1:30001"),
            state: true
        }
    });

    const submitLogic: () => void = () => {
        state.connector.singleton({
            protocol: "login",
            packetID: "LoginRequestPacketData",
            data: {
                username: state.username,
                password: state.password
            }
        });
    };

    return(
        <Stack className={"login-component"} spacing={2}>
            <TextField
                id="login-username"
                label="Username"
                variant="outlined"
                type={"username"}
                error={!state.state}
                multiline={false}
                onChange={event => state.username = event.target.value}
            />
            <TextField
                id="login-password"
                label="Password"
                variant="outlined"
                type={"password"}
                error={!state.state}
                multiline={false}
                onChange={event => state.password = event.target.value}
            />
            <Button onClick={() => submitLogic()}
                variant={"outlined"}
            >Login</Button>
        </Stack>
    )
}

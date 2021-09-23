import React, {createRef, FC, useRef, useState} from "react";
import "./Learning.scss"
import {
    Badge,
    Button,
    Container,
    createTheme,
    Divider,
    FilledInput,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Skeleton,
    Stack,
    TextField,
    Theme,
    ThemeProvider,
    useMediaQuery
} from "@mui/material";
import {
    AccountBox, ArrowBackIosNew, ArrowForward, ArrowForwardIos, ArrowForwardIosOutlined, ArrowForwardTwoTone,
    ArrowRight,
    ArrowRightAlt, ArrowRightSharp, Fingerprint,
    Notifications,
    Password,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import Store from "../logic/Store";
import {Environment} from "../logic/Environment";
import bg from "../assets/background.gif";

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

export const Gif: React.FC = ({}) => {
    return(
        <img src={bg} alt={"loading..."} />
    );
}

export type LoginState = {
    username: string,
    password: string,
    connector: Environment.Connector,
    state: boolean,
    showPassword: boolean,
}

export const Login: React.FC = () => {
    const [state, setState] = useState<LoginState>(() => {
        return {
            username: "",
            password: "",
            connector: new Environment.Connector("base", "ws:127.0.0.1:30001").connect(),
            state: true,
            showPassword: false
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

    const handleChange = (prop: keyof LoginState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [prop]: event.target.value });
    };

    return(
        <Stack className={"login-component"} spacing={2}>
            {/* Field for username */}
            <FormControl sx={{ m: 0, width: '100%'}} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-username"
                    inputProps={{spellCheck: 'false'}}
                    label="Username"
                    type={"text"}
                    name={"username"}
                    value={state.username}
                    onChange={handleChange('username')}
                />
            </FormControl>
            {/* Field for password */}
            <FormControl sx={{ m: 0, width: '100%'}} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    inputProps={{spellCheck: 'false'}}
                    label="Password"
                    type={state.showPassword ? 'text' : 'password'}
                    name={"current-password"}
                    value={state.password}
                    onChange={handleChange('password')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Stack
                                direction={"row"}
                                spacing={1}
                                divider={<Divider orientation="vertical" flexItem />}
                            >
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {setState(() => {
                                        return ({
                                            ...state,
                                            showPassword: !state.showPassword
                                        })
                                    })}}
                                    onMouseDown={(ev: React.MouseEvent<HTMLButtonElement>) => ev.preventDefault()}
                                    color="success"
                                    edge="start"
                                >
                                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                <IconButton
                                    aria-label="fingerprint"
                                    color="success"
                                    edge="end"
                                >
                                    <Fingerprint />
                                </IconButton>
                            </Stack>

                        </InputAdornment>
                    }
                />
            </FormControl>
            {/* Button to submit */}
            <FormControl sx={{ m: 0, width: '100%'}} variant="outlined">
                <Button onClick={() => submitLogic()}
                        variant={"outlined"}
                        size="large"
                >Login</Button>
            </FormControl>
        </Stack>
    )
}

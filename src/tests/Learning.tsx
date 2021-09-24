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
    Stack, styled, Switch,
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

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.success.main,
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));
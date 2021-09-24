import {createTheme, Theme} from "@mui/material";

export namespace Themes {

    export const darkTheme: Theme = createTheme({
        palette: {
            primary: {
                main: '#238636',
                light: '#2EA043'
            },
            mode: 'dark',
            background: {
                default: "#171717"
            },

        },
        typography: {
            fontFamily: ['JetBrains Mono', 'monospace'].join(',')
        },
    });

    export const lightTheme: Theme = createTheme({
        palette: {
            primary: {
                main: '#238636',
                light: '#2EA043'
            },
            mode: 'light',
            background: {
                default: "#fff"
            }
        },
        typography: {
            fontFamily: "JetBrains Mono, monospace",
        },
    });
}


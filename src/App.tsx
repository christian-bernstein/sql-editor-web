import './App.scss';
import React from "react";
import {createTheme, Theme, ThemeProvider} from "@mui/material";
import {Login} from "./tests/Learning";

const theme: Theme = createTheme({
    palette: {
        primary: {
            main: '#238636',
            light: '#2EA043'
        },
        mode: 'dark'
    }
});

const App: React.FC = props => {
    return(
        <div className={"App"}>
            <ThemeProvider theme={theme}>
                <Login/>
            </ThemeProvider>
        </div>
    );
}

export default App;

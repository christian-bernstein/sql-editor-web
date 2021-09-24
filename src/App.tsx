import './App.scss';
import React, {Dispatch, useState} from "react";
import {CssBaseline, Link, Theme, ThemeProvider} from "@mui/material";
import {Login, MaterialUISwitch} from "./tests/Learning";
import debugImage from "./assets/debug/login-screen.png";
import SwipeableDebugDrawer from "./tests/SwipeableDebugDrawer";
import Store from "./logic/Store";
import {Environment} from "./logic/Environment";

const App: React.FC = props => {

    const [visualData, setVisualData] = useState<Environment.EnvironmentVisualData>({
        activeTheme: "light"
    });

    Store.defStore().subscribe("visual-config", [visualData, setVisualData]);

    const changeTheme: () => void = () => {
        const store: Store = Store.defStore();
        const visualData: Environment.EnvironmentVisualData = store.get("visual-config") as Environment.EnvironmentVisualData;
        if (visualData.activeTheme === "light") {
            visualData.activeTheme = "dark";
            store.set("visual-config", visualData);
        } else {
            visualData.activeTheme = "light";
            store.set("visual-config", visualData);
        }
    };

    // <img src={debugImage} alt={"Debug image"} height={"100%"} className={"debug-overlay"}/>

    return(
        <div className={"App"}>
            <ThemeProvider theme={Environment.constants.themes.get(visualData.activeTheme) as Theme}>
                <div className={""}>

                </div>
                <CssBaseline />
                <MaterialUISwitch onClick={() => changeTheme()}/>
                <Login/>
                <Link href={"#"} underline="none">Need help?</Link>

                <SwipeableDebugDrawer/>
            </ThemeProvider>
        </div>
    );
}

export default App;

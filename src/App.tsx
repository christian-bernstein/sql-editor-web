import './App.scss';
import React, {Dispatch, useState} from "react";
import {Button, CssBaseline, Link, Theme, ThemeProvider} from "@mui/material";
import {Login, MaterialUISwitch} from "./tests/Learning";
import debugImage from "./assets/debug/login-screen.png";
import SwipeableDebugDrawer from "./tests/SwipeableDebugDrawer";
import Store from "./logic/Store";
import {Environment} from "./logic/Environment";

const App: React.FC = props => {

    console.log("render app component")

    const [visualData, setVisualData] = useState<Environment.EnvironmentVisualData>({
        activeTheme: "light"
    });

    Store.defStore().subscribe("visual-config", [visualData, setVisualData]);

    const changeTheme: () => void = () => {
        console.log("change theme")
        const store: Store = Store.defStore();
        const storedVisualData: Environment.EnvironmentVisualData | undefined = store.get("visual-config");
        if (storedVisualData !== undefined) {
            if (storedVisualData.activeTheme === "light") {
                storedVisualData.activeTheme = "dark";
                store.set("visual-config", storedVisualData);
            } else {
                storedVisualData.activeTheme = "light";
                store.set("visual-config", storedVisualData);
            }
        } else {
            console.error("Undefined state of visual data: " + visualData)
        }
    };

    // <img src={debugImage} alt={"Debug image"} height={"100%"} className={"debug-overlay"}/>

    return(
        <div className={"App"}>
            <ThemeProvider theme={Environment.constants.themes.get(Store.defStore()?.get<Environment.EnvironmentVisualData>("visual-config")?.activeTheme as string) as Theme}>
                <div className={""}>
                    <Button variant={"outlined"} onClick={() => {
                        setVisualData(prevState => {
                            console.log("manually switch themes")
                            if (prevState.activeTheme === "light") {
                                prevState.activeTheme = "dark";
                            } else {
                                prevState.activeTheme = "light";
                            }
                            return prevState;
                        });
                    }}>
                        switch theme
                    </Button>
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

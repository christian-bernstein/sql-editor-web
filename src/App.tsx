import './App.scss';
import React, {Dispatch, useState} from "react";
import {Button, CssBaseline, Link, Theme, ThemeProvider} from "@mui/material";
import {Login, LightDarkThemeSwitch} from "./tests/Learning";
import debugImage from "./assets/debug/login-screen.png";
import SwipeableDebugDrawer from "./tests/SwipeableDebugDrawer";
import Store from "./logic/Store";
import {Environment} from "./logic/Environment";

export class App extends React.Component {

    constructor(props: {} | Readonly<{}>) {
        super(props);
        Store.defStore().subscribe<Environment.EnvironmentVisualData>("visual-config", Environment.constants.defaultEnvironmentVisualData, this);
        Store.defStore().subscribe<Environment.EnvironmentDebugData>("debug-config", Environment.constants.defaultEnvironmentDebugData, this);

        Store.defStore().set("app", this)
    }

    // <img src={debugImage} alt={"Debug image"} height={"100%"} className={"debug-overlay"}/>
    render() {
        return (
            <>
                <div className={"App"}>
                    <ThemeProvider theme={Environment.constants.themes.get(Store.defStore()?.get<Environment.EnvironmentVisualData>("visual-config")?.activeTheme as string) as Theme}>
                        <CssBaseline />
                        <Login/>
                        {Store.defStore().get<Environment.EnvironmentDebugData>("debug-config")?.showDebugPanel ? <div className={"debug-overlay-base"}><SwipeableDebugDrawer/></div> : []}
                    </ThemeProvider>
                </div>

            </>
        );
    }

    private static changeTheme(): void {
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
        }
    }
}

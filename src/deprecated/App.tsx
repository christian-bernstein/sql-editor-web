import '../styles/App.scss';
import React, {Dispatch, useState} from "react";
import {Button, CssBaseline, Link, Theme, ThemeProvider} from "@mui/material";
import {Login, LightDarkThemeSwitch} from "../tests/Learning";
import debugImage from "../assets/filaments/overlays/login-screen.png";
import SwipeableDebugDrawer from "../tests/SwipeableDebugDrawer";
import Store from "../logic/misc/Store";
import {Environment} from "../logic/Environment";

export class App extends React.Component {

    constructor(props: {} | Readonly<{}>) {
        super(props);
        Store.defStore().subscribe<Environment.EnvironmentVisualData>("visual-config", Environment.constants.defaultEnvironmentVisualData, this);
        Store.defStore().subscribe<Environment.EnvironmentDebugData>("overlays-config", Environment.constants.defaultEnvironmentDebugData, this);
        Store.defStore().set("app", this)
    }

    render() {
        // return (
        //     <>
        //         <div className={"App"}>
        //             {Store.defStore().get<Environment.EnvironmentDebugData>("overlays-config")?.showOverlays ? <img src={debugImage} alt={"Debug images"} height={"100%"} className={"debug-overlay"}/> : []}
        //             <ThemeProvider theme={Environment.constants.themes.get(Store.defStore()?.get<Environment.EnvironmentVisualData>("visual-config")?.activeTheme as string) as Theme}>
        //                 <CssBaseline />
        //                 <Login/>
        //                 {Store.defStore().get<Environment.EnvironmentDebugData>("overlays-config")?.showDebugPanel ? <div className={"debug-overlay-base"}><SwipeableDebugDrawer/></div> : []}
        //             </ThemeProvider>
        //         </div>
        //     </>
        // );
        return(<></>);
    }
}

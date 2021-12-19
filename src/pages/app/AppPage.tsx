import React from "react";
import "../../styles/pages/AppPage.scss";
import "../../utils.scss";
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import {DefaultSpecialPages} from "../../logic/DefaultSpecialPages";
import {BoardingPage} from "../boarding/BoardingPage";
import {LoginPage} from "../login/LoginPage";
import DashboardPage from "../dashboard/DashboardPage";
import MenuPage from "../menu/MenuPage";
import {App} from "../../logic/App";
import {Environment} from "../../logic/Environment";
import {Themeable} from "../../Themeable";
import {ChartPage} from "../../tests/task/ChartPage";
import {AppConfig} from "../../logic/AppConfig";
import {ControlPanelComponent} from "../../tests/panel/ControlPanel";
import {Monaco} from "../../tests/editor/Monaco";

export type AppPageProps = {
}

export type AppPageState = {
    showMenu: boolean
}

export class AppPage extends React.Component<AppPageProps, AppPageState> {

    private readonly specialPageRenderers: Map<string, () => JSX.Element> = new Map<string, () => JSX.Element>([
        [DefaultSpecialPages.BOARDING, () => <></>]
    ]);

    constructor(props: AppPageProps) {
        super(props);
        this.state = {
            showMenu: false
        };

        App.appOrCreate({
            appTitle: "SQL Editor",
            debugMode: true,
            defaultAppRoute: "/boarding",
            defaultDebugAppRoute: "/chart",
            themes: new Map<string, Themeable.Theme>([["dark-green", Themeable.defaultTheme]]),
            defaultTheme: "dark-green",
            connectorConfig: {
                protocol: "login",
                address: "ws:192.168.2.100:80",
                // address: "ws:172.16.119.70:80",
                id: "ton",
                maxConnectAttempts: 50,
                connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3),
                packetInterceptor: (packet: Environment.Packet) => {
                    console.log(packet);
                }
            }
        });
    }

    public renderSpecialPage(id: string): JSX.Element | undefined {
        if (this.specialPageRenderers.has(id)) {
            return (this.specialPageRenderers.get(id) as () => JSX.Element)();
        } else return undefined;
    }

    render() {
        return (
            <div className={"app"}>
                <BrowserRouter>
                    <MenuPage showMenuInitially={false}>
                        {this.getRouts()}
                    </MenuPage>
                </BrowserRouter>
            </div>
        );
    }

    private getRouts(): JSX.Element[] {
        const config: AppConfig = App.app().config;
        const routs: JSX.Element[] = [];
        routs.push(
            <Route exact path={"/"} render={() => <Redirect push to={config.debugMode ? config.defaultDebugAppRoute : config.defaultAppRoute}/>}/>,
            <Route path={"/boarding"} render={() => <BoardingPage/>}/>,
            <Route path={"/login"} render={() => <LoginPage/>}/>,
            <Route path={"/dashboard"} render={() => <DashboardPage/>}/>
        );
        if (config.debugMode) {
            routs.push(
                <Route path={"/chart"} render={() => <ChartPage/>}/>,
                <Route path={"/monaco"} render={() => <Monaco/>}/>,
                <Route path={"/panel"} render={() => <ControlPanelComponent
                    address={"ws:192.168.2.100:30001"}
                    connectorID={"panel"}
                />}/>,
            )
        }
        return routs;
    }
}

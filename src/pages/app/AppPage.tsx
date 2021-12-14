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
            defaultAppRoute: "/boarding",
            themes: new Map<string, Themeable.Theme>([["default", Themeable.defaultTheme]]),
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
                        <Route path={"/"} render={() => <Redirect push to={App.app().config.defaultAppRoute}/>}/>
                        <Route path={"/boarding"} render={() => <BoardingPage/>}/>
                        <Route path={"/login"} render={() => <LoginPage/>}/>
                        <Route path={"/dashboard"} render={() => <DashboardPage/>}/>
                    </MenuPage>
                </BrowserRouter>
            </div>
        );
    }
}

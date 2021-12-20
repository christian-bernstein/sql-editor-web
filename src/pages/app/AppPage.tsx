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
import {SelectAppConfigPage} from "../../debug/pages/selectAppConfig/SelectAppConfigPage";
import {AppConfigSelectionData, AppConfigSelectorProps} from "../../debug/components/AppConfigSelector";

export type AppPageProps = {
}

export type AppPageState = {
    showMenu: boolean,
    currentSpecialPage?: string,
    paramSupplier?: () => any
}

export class AppPage extends React.Component<AppPageProps, AppPageState> {

    private readonly specialPageRenderers: Map<string, (params: any) => JSX.Element> = new Map<string, (params: any) => JSX.Element>([
        [DefaultSpecialPages.BOARDING, () => <></>],
        [DefaultSpecialPages.SELECT_APP_CONFIG, (params) => <SelectAppConfigPage onSelection={data => {
            this.init(data.config);
            this.deactivateSpecialPage();
            console.log("lol");
        }} configs={params as AppConfigSelectionData[]}/>],
    ]);

    constructor(props: AppPageProps) {
        super(props);
        this.state = {
            showMenu: false
        };
    }

    componentDidMount() {
        this.activateSpecialPage(DefaultSpecialPages.SELECT_APP_CONFIG, () => [{
            title: "DESKTOP-1D80A0M",
            description: "",
            config: {
                appTitle: "SQL Editor (DESKTOP-1D80A0M)",
                debugMode: true,
                defaultAppRoute: "/boarding",
                defaultDebugAppRoute: "/chart",
                themes: new Map<string, Themeable.Theme>([["dark-green", Themeable.defaultTheme]]),
                defaultTheme: "dark-green",
                rootRerenderHook: (callback) => this.forceUpdate(callback),
                connectorConfig: {
                    protocol: "login",
                    address: "ws:192.168.2.100:80",
                    id: "ton",
                    maxConnectAttempts: 50,
                    connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3),
                    packetInterceptor: (packet: Environment.Packet) => {
                        console.log(packet);
                    }
                }
            } as AppConfig,
        }, {
            title: "Central Server (release)",
            description: "Current release server, wrapped in a **reactor** server3.cwies.de",
            config: {
                appTitle: "SQL Editor",
                debugMode: true,
                defaultAppRoute: "/boarding",
                defaultDebugAppRoute: "/chart",
                themes: new Map<string, Themeable.Theme>([["dark-green", Themeable.defaultTheme]]),
                defaultTheme: "dark-green",
                rootRerenderHook: (callback) => this.forceUpdate(callback),
                connectorConfig: {
                    protocol: "login",
                    address: "ws:192.168.2.100:80",
                    id: "ton",
                    maxConnectAttempts: 50,
                    connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3),
                    packetInterceptor: (packet: Environment.Packet) => {
                        console.log(packet);
                    }
                }
            } as AppConfig,
        }] as AppConfigSelectionData[]);
    }

    public activateSpecialPage(id: string, paramSupplier: () => any): AppPage {
        this.setState({
            currentSpecialPage: id,
            paramSupplier: paramSupplier
        });
        return this;
    }

    public deactivateSpecialPage(): AppPage {
        this.setState({
            currentSpecialPage: undefined,
            paramSupplier: undefined
        });
        return this;
    }

    public renderSpecialPage(): JSX.Element {
        const page: string = this.state.currentSpecialPage as string;
        const paramSupplier: () => any = this.state.paramSupplier as () => any;
        return this.specialPageRenderers.get(page)?.(paramSupplier()) as JSX.Element;
    }

    render() {
        return (
            <div className={"app"}>
                {this.state.currentSpecialPage !== undefined? this.renderSpecialPage() : this.renderDefaultPage()}
            </div>
        );
    }

    private renderDefaultPage(): JSX.Element {
        if (App.isInitiated()) {
            return (
                <BrowserRouter>
                    <MenuPage showMenuInitially={false}>
                        {this.getRouts()}
                    </MenuPage>
                </BrowserRouter>
            );
        } else return <>App not initiated</>;
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

    private init(config?: AppConfig) {
        App.appOrCreate(config ? config : {
            appTitle: "SQL Editor",
            debugMode: true,
            defaultAppRoute: "/boarding",
            defaultDebugAppRoute: "/chart",
            themes: new Map<string, Themeable.Theme>([["dark-green", Themeable.defaultTheme]]),
            defaultTheme: "dark-green",
            rootRerenderHook: (callback) => this.forceUpdate(callback),
            connectorConfig: {
                protocol: "login",
                address: "ws:192.168.2.100:80",
                id: "ton",
                maxConnectAttempts: 50,
                connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3),
                packetInterceptor: (packet: Environment.Packet) => {
                    console.log(packet);
                }
            }
        });
    }
}

import React from "react";
import "../../styles/pages/AppPage.scss";
import "../../utils.scss";
import {BrowserRouter, Redirect, Route} from "react-router-dom";
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
import {SelectAppConfigPageV2} from "../../debug/pages/selectAppConfig/SelectAppConfigPage";
import {AppConfigSelectionData} from "../../debug/components/AppConfigSelector";
import {CommandPallet} from "../../components/CommandPallet";
import {Button} from "../../components/Button";
import {DebugEditor} from "../editor/debug/DebugEditor";
import {DBSessionCacheShard} from "../../shards/DBSessionCacheShard";
import {arrayFactory} from "../../logic/Utils";
import {RegexPage} from "../../tests/regex/RegexPage";

export type AppPageProps = {
}

export type AppPageState = {
    showMenu: boolean,
    currentSpecialPage?: string,
    paramSupplier?: () => any,
    updateSlave: number,
    showCommandPallet: boolean
}

let hook: undefined | (() => void);

let instance: AppPage | undefined = undefined;

export class AppPage extends React.Component<AppPageProps, AppPageState> {

    private mounted: boolean = false;

    private readonly specialPageRenderers: Map<string, (params: any) => JSX.Element> = new Map<string, (params: any) => JSX.Element>([
        [DefaultSpecialPages.BOARDING, () => <></>],
        [DefaultSpecialPages.SELECT_APP_CONFIG, (params) => <SelectAppConfigPageV2 onSelection={data => {
            this.init(data.config);
            this.deactivateSpecialPage();
        }} configs={params as AppConfigSelectionData[]}/>],
    ]);

    constructor(props: AppPageProps) {
        super(props);
        this.state = {
            showMenu: false,
            updateSlave: 0,
            showCommandPallet: false
        };
        this.init();
    }

    componentDidMount() {
        hook = () => this.setState({
            updateSlave: this.state.updateSlave + 1
        });
        this.mounted = true;

        // this.activateSpecialPage(DefaultSpecialPages.SELECT_APP_CONFIG, () => arrayFactory<AppConfigSelectionData>(i => {
        //     return {
        //         title: String(i),
        //         description: "",
        //         config: {
        //             logSaveSize: 1000,
        //             logInterceptors: [],
        //             appTitle: "",
        //             debugMode: false,
        //             defaultAppRoute: "",
        //             rootRerenderHook: () => {},
        //             themes: new Map<string, Themeable.Theme>(),
        //             defaultTheme: "",
        //             defaultDebugAppRoute: "",
        //             connectorConfig: {
        //                 protocol: "",
        //                 id: "",
        //                 packetInterceptor: () => {},
        //                 maxConnectAttempts: 0,
        //                 address: "",
        //                 connectionRetryDelayFunc: () => 1,
        //                 onConnectionFailed: () => {}
        //             }
        //         }
        //     };
        // }, 10));

        console.log("app page mounted")
    }

    componentWillUnmount() {
        console.log("app page will unmount")

        this.mounted = false;
        hook = undefined;
        instance = undefined;
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

    public rerender() {
        if (this.mounted) {
            if (hook) {
                hook();
            } else console.error("Trying to rerender globally, but hook is undefined");
        } else console.error("Trying to rerender globally, but app-page isn't mounted");
    }

    render() {
        return (
            <div className={"app"}>
                <CommandPallet isOpen={this.state.showCommandPallet}/>
                {this.state.currentSpecialPage !== undefined ? this.renderSpecialPage() : this.renderDefaultPage()}
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
        const routs: JSX.Element[] = [
            <Route path={"/"} exact render={() => <Redirect push to={config.debugMode ? config.defaultDebugAppRoute : config.defaultAppRoute}/>}/>,
            <Route path={"/boarding"} render={() => <BoardingPage/>}/>,
            <Route path={"/login"} render={() => <LoginPage/>}/>,
            <Route path={"/dashboard"} render={() => <DashboardPage/>}/>
        ];
        if (config.debugMode) {
            routs.push(
                <Route path={"/chart"} render={() => <ChartPage/>}/>,
                <Route path={"/regex"} render={() => <RegexPage/>}/>,
                <Route path={"/d-editor"} component={() => <DebugEditor/>}/>,
                <Route path={"/monaco"} render={() => <Monaco/>}/>,
                <Route path={"/panel"} render={() => <ControlPanelComponent address={"ws:192.168.2.100:30001"} connectorID={"panel"}/>}/>
            );
        }
        return routs;
    }

    private init(config?: AppConfig) {
        instance = this;
        App.appOrCreate(config ? config : {
            // appTitle: "SQL Editor",
            appTitle: "Regex Viewer",
            debugMode: true,
            defaultAppRoute: "/boarding",
            defaultDebugAppRoute: "/boarding",
            rootRerenderHook: (callback) => this.rerender.bind(this)(),
            logInterceptors: [],
            logSaveSize: 1000,
            defaultTheme: "dark-green",
            themes: new Map<string, Themeable.Theme>([
                ["dark-green", Themeable.defaultTheme],
                ["light-green", Themeable.lightTheme]
            ]),
            connectorConfig: {
                protocol: "login",
                // address: "ws://192.168.2.100:80",
                address: "ws://localhost:80",
                id: "ton",
                maxConnectAttempts: 10,
                connectionRetryDelayFunc: () => 0,
                packetInterceptor: (packet: Environment.Packet) => {
                    console.log("received packet from server", packet);
                }
            }
        }, app => {
            app.shard("db-session-cache", new DBSessionCacheShard());

            // Opens the command pallet
            app.registerAction("open-command-pallet", () => {
                if (instance) {
                    if (instance.mounted) {
                        instance.setState({
                            showCommandPallet: true
                        });
                    } else console.error("Can't execute open-command-pallet, because component not mounted.");
                }
            });

            // CLoses the command pallet
            app.registerAction("close-command-pallet", () => {
                if (instance) {
                    if (instance.mounted) {
                        instance.setState({
                            showCommandPallet: false
                        });
                    } else console.error("Can't execute close-command-pallet, because component not mounted.");
                }
            });

            // Open the command pallet when ctrl + k is pressed
            document.addEventListener("keydown", ev => {
                if (ev.ctrlKey && ev.key === "k") {
                    ev.preventDefault();
                    app.callAction("open-command-pallet");
                }
            });


            // Open the menu when ctrl + m is pressed
            document.addEventListener("keydown", ev => {
                if (instance) {
                    if (ev.ctrlKey && ev.key === "m") {
                        ev.preventDefault();
                        app.callAction("toggle-menu");
                    }
                }
            });
        });
    }
}

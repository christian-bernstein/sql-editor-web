import React, {ForwardedRef} from "react";
import "../../styles/pages/AppPage.scss";
import "../../utils.scss";
import "react-tiger-transition/styles/main.min.css";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {DefaultSpecialPages} from "../../logic/DefaultSpecialPages";
import {BoardingPage} from "../boarding/BoardingPage";
import {LoginPage} from "../login/LoginPage";
import DashboardPage from "../dashboard/DashboardPage";
import MenuPage from "../menu/MenuPage";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {Environment} from "../../logic/Environment";
import {Themeable} from "../../Themeable";
import {ChartPage} from "../../tests/task/ChartPage";
import {AppConfig} from "../../logic/AppConfig";
import {ControlPanelComponent} from "../../tests/panel/ControlPanel";
import {Monaco} from "../../tests/editor/Monaco";
import {SelectAppConfigPageV2} from "../../debug/pages/selectAppConfig/SelectAppConfigPage";
import {AppConfigSelectionData} from "../../debug/components/AppConfigSelector";
import {CommandPallet} from "../../components/CommandPallet";
import {DebugEditor} from "../editor/debug/DebugEditor";
import {DBSessionCacheShard} from "../../shards/DBSessionCacheShard";
import {RegexPage} from "../../tests/regex/RegexPage";
import {Assembly} from "../../logic/Assembly";
import {Dialog, Slide} from "@mui/material";
import {TransitionProps} from "@mui/material/transitions";
import {PageV2} from "../../components/Page";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Icon} from "../../components/Icon";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {PosInCenter} from "../../components/PosInCenter";
import {InformationBox} from "../../components/InformationBox";
import {Text} from "../../components/Text";
import {Align} from "../../logic/Align";
import {Justify} from "../../logic/style/Justify";
import {Constants} from "../../Constants";
import {ProjectCreationDialog} from "../createProject/ProjectCreationDialog";
import {SignupPage} from "../signup/SignupPage";
import {Editor} from "../editor/Editor";
import {LogPage} from "../log/LogPage";
import {v4} from "uuid";
import {EpicureSearchPage} from "../../tests/epicure/EpicureSearchPage";
import {DeleteProjectDialog} from "../deleteProject/DeleteProjectDialog";
import {OpenMainDialogWithParamsProps} from "../../logic/OpenMainDialogWithParamsProps";
import {ServerInfoDialog} from "../serverInfo/ServerInfoDialog";
import {RoadmapDialog} from "../roadmap/RoadmapDialog";
import {ClientDisplayPlaygroundDialog} from "../../debug/pages/clientDisplay/ClientDisplayPlaygroundDialog";
import {MenuPageV2} from "../menu/v2/MenuPageV2";
import {If} from "../../components/If";
import {Shard} from "../../logic/Shard";
import {QuickActionShard} from "../../shards/QuickActionShard";

export type AppPageProps = {
}

export type AppPageState = {
    showMenu: boolean,
    currentSpecialPage?: string,
    paramSupplier?: () => any,
    updateSlave: number,
    showCommandPallet: boolean,
    showDialog: boolean,
    dialogAssembly?: string,
    dialogProps?: any
}

let hook: undefined | (() => void);

let instance: AppPage | undefined = undefined;

export class AppPage extends React.Component<AppPageProps, AppPageState> {

    private readonly DialogTransition = React.forwardRef((props: TransitionProps & {children?: React.ReactElement<any, any>}, ref: ForwardedRef<unknown>) => {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    private mounted: boolean = false;

    private readonly assembly: Assembly;

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
            // todo remove variable
            updateSlave: 0,
            showCommandPallet: false,
            showDialog: false
        };
        this.assembly = new Assembly();
    }

    componentDidMount() {
        hook = () => this.setState({
            updateSlave: this.state.updateSlave + 1
        });
        this.mounted = true;

        this.activateSpecialPage(DefaultSpecialPages.SELECT_APP_CONFIG, () => [
            {
                title: "SQL Editor - Local debug",
                description: "Profile used for local debugging. (This profile can only be used, if the browser is running on the same device as the server is running.)",
                config: {
                    appTitle: "SQL Editor",
                    debugMode: true,
                    defaultAppRoute: "/boarding",
                    defaultDebugAppRoute: "/boarding",
                    rootRerenderHook: (callback) => this.rerender.bind(this)(),
                    logInterceptors: [],
                    logSaveSize: 1000,
                    defaultTheme: "dark-green",
                    appAssembly: this.assembly,
                    shards: new Map<string, (app: App) => Shard>([
                        ["db-session-cache", () => new DBSessionCacheShard()],
                        ["quick-actions-shard", () => new QuickActionShard()]
                    ]),
                    themes: new Map<string, Themeable.Theme>([
                        ["dark-green", Themeable.defaultTheme],
                        ["light-green", Themeable.lightTheme]
                    ]),
                    connectorConfig: {
                        protocol: "login",
                        // address: "ws://192.168.2.100:80",
                        address: "ws://192.168.178.20:25574",
                        id: "ton",
                        maxConnectAttempts: 1,
                        connectionRetryDelayFunc: () => 0,
                        packetInterceptor: this.getLogPacketInterceptor()
                    }
                }
            },
            {
                title: "SQL Editor **(wss protocol)**",
                description: "SQL Editor Panel live version with *wss* protocol",
                config: {
                    appTitle: "SQL Editor",
                    debugMode: false,
                    defaultAppRoute: "/boarding",
                    defaultDebugAppRoute: "/boarding",
                    rootRerenderHook: (callback) => this.rerender.bind(this)(),
                    logInterceptors: [],
                    logSaveSize: 1000,
                    defaultTheme: "dark-green",
                    appAssembly: this.assembly,
                    shards: new Map<string, (app: App) => Shard>([
                        ["db-session-cache", () => new DBSessionCacheShard()],
                        ["quick-actions-shard", () => new QuickActionShard()]
                    ]),
                    themes: new Map<string, Themeable.Theme>([
                        ["dark-green", Themeable.defaultTheme],
                        ["light-green", Themeable.lightTheme]
                    ]),
                    connectorConfig: {
                        protocol: "login",
                        ssl: true,
                        // address: "ws://192.168.2.100:80",
                        address: "wss://server3.cwies.de:25574",
                        id: "ton",
                        maxConnectAttempts: 1,
                        connectionRetryDelayFunc: () => 0,
                        packetInterceptor: this.getLogPacketInterceptor()
                    }
                }
            },
            {
                title: "SQL Editor Test-Version 03. MAR 2022 **(wss protocol)**",
                description: "SQL Editor Panel test version (v2.29-alpha.0) with *wss* protocol",
                config: {
                    appTitle: "SQL Editor",
                    debugMode: true,
                    defaultAppRoute: "/boarding",
                    defaultDebugAppRoute: "/boarding",
                    rootRerenderHook: () => this.rerender.bind(this)(),
                    logInterceptors: [],
                    logSaveSize: 1000,
                    defaultTheme: "dark-green",
                    appAssembly: this.assembly,
                    shards: new Map<string, (app: App) => Shard>([
                        ["db-session-cache", () => new DBSessionCacheShard()],
                        ["quick-actions-shard", () => new QuickActionShard()]
                    ]),
                    themes: new Map<string, Themeable.Theme>([
                        ["dark-green", Themeable.defaultTheme],
                        ["light-green", Themeable.lightTheme]
                    ]),
                    connectorConfig: {
                        protocol: "login",
                        address: "wss://server3.cwies.de:25574",
                        id: "ton",
                        ssl: true,
                        maxConnectAttempts: 1,
                        connectionRetryDelayFunc: () => 0,
                        packetInterceptor: this.getLogPacketInterceptor()
                    }
                }
            },
            // {
            //     title: "Epicure",
            //     description: "Profile used for local debugging. (This profile can only be used, if the browser is running on the same device as the server is running.)",
            //     config: {
            //         appTitle: "Epicure",
            //         debugMode: true,
            //         defaultAppRoute: "/epicure",
            //         defaultDebugAppRoute: "/epicure",
            //         rootRerenderHook: (callback) => this.rerender.bind(this)(),
            //         logInterceptors: [],
            //         logSaveSize: 1000,
            //         defaultTheme: "dark-green",
            //         appAssembly: this.assembly,
            //         themes: new Map<string, Themeable.Theme>([
            //             ["dark-green", Themeable.defaultTheme],
            //             ["light-green", Themeable.lightTheme]
            //         ]),
            //         connectorConfig: {
            //             protocol: "login",
            //             // address: "ws://192.168.2.100:80",
            //             address: "ws://192.168.2.104:80",
            //             id: "ton",
            //             maxConnectAttempts: 1,
            //             connectionRetryDelayFunc: () => 0,
            //             packetInterceptor: this.getLogPacketInterceptor()
            //         }
            //     }
            // }
        ] as AppConfigSelectionData[]);
    }

    componentWillUnmount() {
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

    private openDialog(dialogComponent: string, params: any = undefined) {
        this.setState({
            showDialog: true,
            dialogAssembly: dialogComponent,
            dialogProps: params
        });
    }

    private closeDialog() {
        this.setState({
            showDialog: false,
            dialogAssembly: undefined,
            dialogProps: undefined
        });
    }

    private renderDialog(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        return (
            // id={"main-dialog"}
            <Dialog open={this.state.showDialog} onClose={() => this.setState({
                showDialog: false
            })} TransitionComponent={this.DialogTransition} fullScreen={true} sx={{
                '& .MuiDialog-paper': {
                    // todo make configurable
                    background: "transparent",
                    // backgroundColor: theme.colors.backgroundColor.css()
                }
            }} children={
                <If condition={this.state.showDialog && this.state.dialogAssembly !== undefined} ifTrue={
                    this.assembly.render({
                        // todo create fallback
                        component: this.state.dialogAssembly as string,
                        param: this.state.dialogProps,
                        errorComponent: e => {
                            return (
                                <PageV2>
                                    <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} justifyContent={Justify.FLEX_END} height={percent(100)}>
                                        <PosInCenter fullHeight>
                                            <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
                                                <Text text={`**[DEBUG]** No assembly found\n'${e}'`}/>
                                            </InformationBox>
                                        </PosInCenter>
                                        <Icon icon={<CloseIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored onClick={() => App.app().callAction("close-main-dialog")}/>
                                    </FlexBox>
                                </PageV2>
                            );
                        }
                    })
                } ifFalse={<></>}
                />
            }/>
        );

        // if (this.state.showDialog && this.state.dialogAssembly !== undefined) {
        //     return (
        //         <Dialog keepMounted={true} id={"main-dialog"} open={this.state.showDialog} onClose={() => this.setState({
        //             showDialog: false
        //         })} TransitionComponent={this.DialogTransition} fullScreen={true} sx={{
        //             '& .MuiDialog-paper': {
        //                 // todo make configurable
        //                 background: "transparent"
        //                 // backgroundColor: theme.colors.backgroundColor.css()
        //             }
        //         }} children={
        //             <If condition={this.state.showDialog && this.state.dialogAssembly !== undefined} ifTrue={
        //                 this.assembly.render({
        //                     // todo create fallback
        //                     component: this.state.dialogAssembly as string,
        //                     param: this.state.dialogProps,
        //                     errorComponent: e => {
        //                         return (
        //                             <PageV2>
        //                                 <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} justifyContent={Justify.FLEX_END} height={percent(100)}>
        //                                     <PosInCenter fullHeight>
        //                                         <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
        //                                             <Text text={`**[DEBUG]** No assembly found\n'${e}'`}/>
        //                                         </InformationBox>
        //                                     </PosInCenter>
        //                                     <Icon icon={<CloseIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored onClick={() => App.app().callAction("close-main-dialog")}/>
        //                                 </FlexBox>
        //                             </PageV2>
        //                         );
        //                     }
        //                 })
        //             } ifFalse={<></>}
        //             />
        //         }/>
        //     );
        // } else return <></>
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
                {this.renderDialog()}
                <CommandPallet isOpen={this.state.showCommandPallet}/>
                {this.state.currentSpecialPage !== undefined ? this.renderSpecialPage() : this.renderDefaultPage()}
            </div>
        );
    }

    private renderDefaultPage(): JSX.Element {
        if (App.isInitiated()) {
            return (
                <BrowserRouter>
                    <MenuPage showMenuInitially={false} doubleClickMenuOpen={false}>
                        <MenuPageV2 children={
                            <Switch>
                                {this.getRouts()}

                                {App.app().screenManager.renderRoutes()}
                            </Switch>
                        }/>
                    </MenuPage>
                </BrowserRouter>
            );
        } else return <>App not initiated</>;
    }

    private getRouts(): JSX.Element[] {
        const config: AppConfig = App.app().config;
        const routs: JSX.Element[] = [
            // <Route path={"/"} exact={false} render={() => <Redirect push to={config.debugMode ? config.defaultDebugAppRoute : config.defaultAppRoute}/>}/>,
            // <Route path={"/boarding"} render={() => <BoardingPage/>}/>,
            <Route path={"/register"} render={() => <SignupPage callingFrom={"/boarding"}/>}/>,
            <Route path={"/login"} render={() => <LoginPage/>}/>,
            <Route path={"/dashboard"} render={() => <DashboardPage/>}/>,
            <Route path={"/editor"} component={() => <Editor/>}/>
        ];
        if (config.debugMode) {
            routs.push(
                <Route path={"/chart"} render={() => <ChartPage/>}/>,
                <Route path={"/regex"} render={() => <RegexPage/>}/>,
                <Route path={"/d-editor"} component={() => <DebugEditor/>}/>,
                <Route path={"/monaco"} render={() => <Monaco/>}/>,
                <Route path={"/epicure"} render={() => <EpicureSearchPage/>}/>,
                <Route path={"/panel"} render={() => <ControlPanelComponent address={"ws:192.168.2.104:30001"} connectorID={"panel"}/>}/>,
            );
        }
        return routs;
    }

    // todo use DialogData instead
    private initDialogs(app: App) {
        if (app.config.debugMode) {
            this.assembly.assembly("client-display-playground-dialog", (theme, props) => <ClientDisplayPlaygroundDialog/>);
        }
        this.assembly.assembly(Constants.createProjectDialog, (theme, props) => <ProjectCreationDialog/>);
        this.assembly.assembly(Constants.logDialog, (theme, props) => <LogPage/>);
        this.assembly.assembly(Constants.deleteProjectDialog, (theme, props) => <DeleteProjectDialog project={props}/>);
        this.assembly.assembly(Constants.serverConnectionDialog, (theme, props) => <ServerInfoDialog/>);
        this.assembly.assembly(Constants.roadmapDialog, (theme, props) => <RoadmapDialog/>);
    }

    private init(config?: AppConfig) {
        instance = this;
        App.appOrCreate(config ? config : {
            appTitle: "SQL Editor",
            debugMode: true,
            defaultAppRoute: "/boarding",
            defaultDebugAppRoute: "/boarding",
            rootRerenderHook: (callback) => this.rerender.bind(this)(),
            logInterceptors: [],
            logSaveSize: 1000,
            defaultTheme: "dark-green",
            appAssembly: this.assembly,
            themes: new Map<string, Themeable.Theme>([
                ["dark-green", Themeable.defaultTheme],
                ["light-green", Themeable.lightTheme]
            ]),
            connectorConfig: {
                protocol: "login",
                address: "ws://192.168.2.104:80",
                id: "ton",
                maxConnectAttempts: 10,
                connectionRetryDelayFunc: () => 0,
                packetInterceptor: this.getLogPacketInterceptor()
            }
        }, app => {
            // app.shard("db-session-cache", new DBSessionCacheShard());

            this.initDialogs(app);

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

            // Closes the command pallet
            app.registerAction("close-command-pallet", () => {
                if (instance) {
                    if (instance.mounted) {
                        instance.setState({
                            showCommandPallet: false
                        });
                    } else console.error("Can't execute close-command-pallet, because component not mounted.");
                }
            });

            // Open the main dialog
            app.registerAction("open-main-dialog", (parameters) => {
                if (instance) {
                    if (instance.mounted) {
                        try {
                            const dialog = parameters as string;
                            instance.openDialog(dialog);
                        } catch (e) {
                            console.error(`open-main-dialog action: parameter ${parameters} isn't assignable to type: string`)
                        }
                    } else console.error("Can't execute close-command-pallet, because component not mounted.");
                }
            });

            app.registerAction(Constants.openMainDialogWithParamsAction, (parameters) => {
                if (instance) {
                    if (instance.mounted) {
                        const params = parameters as OpenMainDialogWithParamsProps;
                        instance.openDialog(params.dialog, params.parameters);
                    } else console.error("Can't execute close-command-pallet, because component not mounted.");
                }
            });

            // Close the main dialog
            app.registerAction("close-main-dialog", () => {
                if (instance) {
                    if (instance.mounted) {
                        instance.closeDialog();
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

            // Toggle the dialog page when ctrl + d is pressed
            // Important: The dialog component gets re-rendered
            document.addEventListener("keydown", ev => {
                if (instance) {
                    if (ev.ctrlKey && ev.key === "d") {
                        ev.preventDefault();
                        if (instance.state.showDialog) {
                            app.callAction("close-main-dialog");
                        } else {
                            app.callAction("open-main-dialog");
                        }
                    }
                }
            });
        });
    }

    private getLogPacketInterceptor(): (packet: Environment.Packet, connector: Environment.Connector) => void {
        return (packet, connector) => {
            App.app().baseLog({
                id: v4(),
                creator: "network",
                level: "TRACE",
                timestamp: new Date(),
                message: `Received packet from server '*${connector.config.address}*' in protocol '*${connector.currentProtocol}*'`,
                appendices: [{
                    type: "packet",
                    data: packet
                }]
            })
        }
    }
}

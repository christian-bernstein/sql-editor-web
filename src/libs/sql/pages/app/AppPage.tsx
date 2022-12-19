import React, {ForwardedRef} from "react";
import "../../styles/pages/AppPage.scss";
import "../../styles/utils.scss";
import "react-tiger-transition/styles/main.min.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {DefaultSpecialPages} from "../../logic/misc/DefaultSpecialPages";
import {LoginPage} from "../login/LoginPage";
import MenuPage from "../menu/MenuPage";
import {App, utilizeGlobalTheme} from "../../logic/app/App";
import {Environment} from "../../logic/Environment";
import {Themeable} from "../../logic/style/Themeable";
import {ChartPage} from "../../../../tests/task/ChartPage";
import {AppConfig} from "../../logic/app/AppConfig";
import {ControlPanelComponent} from "../../../../tests/panel/ControlPanel";
import {Monaco} from "../../../../tests/editor/Monaco";
import {SelectAppConfigPageV2} from "../../debug/pages/selectAppConfig/SelectAppConfigPage";
import {AppConfigSelectionData} from "../../debug/components/AppConfigSelector";
import {CommandPallet} from "../../components/ho/commandPallet/CommandPallet";
import {DebugEditor} from "../editor/debug/DebugEditor";
import {DBSessionCacheShard} from "../../shards/dbSessionCache/DBSessionCacheShard";
import {RegexPage} from "../../../regex/RegexPage";
import {Assembly} from "../../logic/assembly/Assembly";
import {Slide, SwipeableDrawer, ThemeProvider} from "@mui/material";
import {TransitionProps} from "@mui/material/transitions";
import {Screen} from "../../components/lo/Page";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {DimensionalMeasured, percent, px} from "../../logic/style/DimensionalMeasured";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as CloseIcon} from "../../../../assets/icons/ic-20/ic20-close.svg";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Centered} from "../../components/lo/PosInCenter";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {Text} from "../../components/lo/Text";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {Constants} from "../../logic/misc/Constants";
import {ProjectCreationDialog} from "../createProject/ProjectCreationDialog";
import {SignupPage} from "../signup/SignupPage";
import {Editor} from "../editor/Editor";
import {LogPage} from "../log/LogPage";
import {v4} from "uuid";
import {EpicureSearchPage} from "../../../epicure/EpicureSearchPage";
import {DeleteProjectDialog} from "../deleteProject/DeleteProjectDialog";
import {OpenMainDialogWithParamsProps} from "../../logic/misc/OpenMainDialogWithParamsProps";
import {ServerInfoDialog} from "../serverInfo/ServerInfoDialog";
import {RoadmapDialog} from "../roadmap/RoadmapDialog";
import {ClientDisplayPlaygroundDialog} from "../../debug/pages/clientDisplay/ClientDisplayPlaygroundDialog";
import {MenuPageV2} from "../menu/v2/MenuPageV2";
import {If} from "../../components/logic/If";
import {Shard} from "../../logic/misc/Shard";
import {QuickActionShard} from "../../shards/quickAction/QuickActionShard";
import {LogPageDisplayVersion} from "../log/LogPageDisplayVersion";
import {ProjectPreview, ProjectPreviewProps} from "../../components/ho/projectPreview/ProjectPreview";
import {AppPageMode} from "./AppPageMode";
import {ImportDatasetDialog, ImportDatasetDialogProps} from "../importDatasets/ImportDatasetDialog";
import {NetworkShard} from "../../shards/network/NetworkShard";
import {LocalStorageShard} from "../../shards/localStorage/LocalStorageShard";
import {UnitTestPage} from "../unit/UnitTestPage";
import {MenuState} from "../menu/v2/MenuState";
import {BernieComponent} from "../../logic/BernieComponent";
import {QuickActionPanel} from "../../components/ho/quickPanel/QuickActionPanel";
import {StaticDrawerMenu} from "../../components/lo/StaticDrawerMenu";
import {Dimension} from "../../logic/style/Dimension";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Box} from "../../components/lo/Box";
import {AF} from "../../components/logic/ArrayFragment";
import {MobileNavigation} from "../../components/ho/bottomNavigation/MobileNavigation";
import {Mobile} from "../../components/logic/Media";
import {SettingsShard} from "../../shards/settings/SettingsShard";
import {FirstJoinIntroductionLauncher} from "../../components/ho/firstJoinIntroduction/FirstJoinIntroductionLauncher";

export type AppPageProps = {
    mode?: AppPageMode
}

export type AppPageState = {
    showMenu: boolean,
    currentSpecialPage?: string,
    paramSupplier?: () => any,
    updateSlave: number,
    showCommandPallet: boolean,
    showDialog: boolean,
    dialogAssembly?: string,
    dialogProps?: any,
}

let hook: undefined | (() => void);

let instance: AppPage | undefined = undefined;

export function getInstance(): AppPage | undefined {
    return instance;
}

export class AppPage extends BernieComponent<AppPageProps, AppPageState, any> {

    private readonly DialogTransition = React.forwardRef((props: TransitionProps & {children?: React.ReactElement<any, any>}, ref: ForwardedRef<unknown>) => {
        return <Slide direction="up" mountOnEnter ref={ref} {...props} />;
    });

    private mounted: boolean = false;

    private readonly specialPageRenderers: Map<string, (params: any) => JSX.Element> = new Map<string, (params: any) => JSX.Element>([
        [DefaultSpecialPages.UNIT_TEST, () => <UnitTestPage/>],
        [DefaultSpecialPages.BOARDING, () => <></>],
        [DefaultSpecialPages.SELECT_APP_CONFIG, (params) => <SelectAppConfigPageV2 onSelection={data => {
            this.appInit(data.config);
            this.deactivateSpecialPage();
        }} configs={params as AppConfigSelectionData[]}/>],
    ]);

    constructor(props: AppPageProps) {
        super(props, {
            showMenu: false,
            // todo remove variable
            updateSlave: 0,
            showCommandPallet: false,
            showDialog: false
        }, undefined, {
            enableLocalDialog: true
        });
    }

    componentDidMount() {
        hook = () => this.setState({
            updateSlave: this.state.updateSlave + 1
        });

        this.mounted = true;

        switch (this.props.mode) {
            case AppPageMode.UNIT_TEST:
                this.activateSpecialPage(DefaultSpecialPages.UNIT_TEST, () => undefined);
                return;
            case AppPageMode.DEVELOPMENT:
                this.openAppConfigSelector();
                return;
            case AppPageMode.RELEASE:
                this.appInit({
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
                        ["quick-actions-shard", () => new QuickActionShard()],
                        ["network-shard", () => new NetworkShard()],
                        ["local-storage-shard", () => new LocalStorageShard()],
                        ["settings-shard", () => new SettingsShard()],
                    ]),
                    themes: Themeable.getAllThemes(),
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
                });
        }
    }

    private openAppConfigSelector() {
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
                        ["quick-actions-shard", () => new QuickActionShard()],
                        ["network-shard", () => new NetworkShard()],
                        ["local-storage-shard", () => new LocalStorageShard()],
                        ["settings-shard", () => new SettingsShard()],
                    ]),
                    themes: Themeable.getAllThemes(),
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
                        ["quick-actions-shard", () => new QuickActionShard()],
                        ["network-shard", () => new NetworkShard()],
                        ["local-storage-shard", () => new LocalStorageShard()],
                        ["settings-shard", () => new SettingsShard()],
                    ]),
                    themes: Themeable.getAllThemes(),
                    connectorConfig: {
                        protocol: "login",
                        ssl: true,
                        // address: "ws://192.168.2.100:80",
                        address: "wss://server3.cwies.de:25574",
                        id: "ton",
                        // todo display in server telemetry page
                        recordLatency: false,
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
                        ["quick-actions-shard", () => new QuickActionShard()],
                        ["network-shard", () => new NetworkShard()],
                        ["local-storage-shard", () => new LocalStorageShard()],
                        ["settings-shard", () => new SettingsShard()],
                    ]),
                    themes: Themeable.getAllThemes(),
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
            <SwipeableDrawer anchor={"bottom"} open={this.state.showDialog} keepMounted onOpen={() => this.setState({
                showDialog: true
            })} onClose={() => this.setState({
                showDialog: false
            })} sx={{
                '& .MuiDialog-paper': {
                    background: "transparent",
                    maxHeight: "100vh !important",
                    maxWidth: "100vw !important",
                    margin: "0 !important",
                    borderRadius: "0 !important"
                }
            }} children={
                <If condition={this.state.showDialog && this.state.dialogAssembly !== undefined} ifTrue={
                    this.assembly.render({
                        component: this.state.dialogAssembly as string,
                        param: this.state.dialogProps,
                        errorComponent: e => {
                            return (
                                <Screen>
                                    <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} justifyContent={Justify.FLEX_END} height={percent(100)}>
                                        <Centered fullHeight>
                                            <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
                                                <Text text={`**[DEBUG]** No assembly found\n'${e}'`}/>
                                            </InformationBox>
                                        </Centered>
                                        <Icon icon={<CloseIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored onClick={() => App.app().callAction("close-main-dialog")}/>
                                    </FlexBox>
                                </Screen>
                            );
                        }
                    })
                } ifFalse={<></>}
                />
            }/>
        );

        // return (
        //     // id={"main-dialog"}
        //     <Dialog open={this.state.showDialog} keepMounted onClose={() => this.setState({
        //         showDialog: false
        //     })} TransitionComponent={this.DialogTransition} fullScreen={false} sx={{
        //         '& .MuiDialog-paper': {
        //             background: "transparent",
        //             maxHeight: "100vh !important",
        //             maxWidth: "100vw !important",
        //             margin: "0 !important",
        //             borderRadius: "0 !important"
        //         }
        //     }} children={
        //         <If condition={this.state.showDialog && this.state.dialogAssembly !== undefined} ifTrue={
        //             this.assembly.render({
        //                 // todo create fallback
        //                 component: this.state.dialogAssembly as string,
        //                 param: this.state.dialogProps,
        //                 errorComponent: e => {
        //                     return (
        //                         <Screen>
        //                             <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} justifyContent={Justify.FLEX_END} height={percent(100)}>
        //                                 <Centered fullHeight>
        //                                     <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
        //                                         <Text text={`**[DEBUG]** No assembly found\n'${e}'`}/>
        //                                     </InformationBox>
        //                                 </Centered>
        //                                 <Icon icon={<CloseIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored onClick={() => App.app().callAction("close-main-dialog")}/>
        //                             </FlexBox>
        //                         </Screen>
        //                     );
        //                 }
        //             })
        //         } ifFalse={<></>}
        //         />
        //     }/>
        // );
    }

    public rerender() {
        if (this.mounted) {
            if (hook) {
                hook();
            } else console.error("Trying to rerender globally, but hook is undefined");
        } else console.error("Trying to rerender globally, but app-page isn't mounted");
    }

    componentRender(p: AppPageProps, s: AppPageState, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <div className={"app"}>
                {this.renderModals()}
                {this.renderDialog()}
                <CommandPallet isOpen={this.state.showCommandPallet}/>
                {this.state.currentSpecialPage !== undefined ? this.renderSpecialPage() : this.renderDefaultPage()}

            </div>
        );
    }

    private renderModals(): JSX.Element {
        return (
            <></>
        );
    }

    private renderDefaultPage(): JSX.Element {
        if (App.isInitiated()) {
            const theme = utilizeGlobalTheme();

            return (
                <ThemeProvider theme={theme.muiTheme} children={
                    <AF elements={[
                        /**
                         * Launchers (Might show content, but not necessarily)
                         */
                        <FirstJoinIntroductionLauncher/>,

                        /**
                         * Visible content
                         */
                        <BrowserRouter children={
                            <MenuPage showMenuInitially={false} doubleClickMenuOpen={false} children={
                                <MenuPageV2 children={
                                    <FlexBox id={"app-content-wrapper"} gap={px()} style={{backgroundColor: theme.colors.backgroundColor.css()}} height={DimensionalMeasured.of(100, Dimension.vh)} width={percent(100)} children={
                                        <AF elements={[
                                            /**
                                             * Main content
                                             * TODO: Add element id to flexbox properties
                                             */
                                            <FlexBox id={"app-switch-wrapper"} width={percent(100)} style={{flex: "1 1 auto"}} overflowYBehaviour={OverflowBehaviour.SCROLL} children={
                                                <Switch children={
                                                    <AF elements={[
                                                        this.getRouts(),
                                                        App.app().screenManager.renderRoutes()
                                                    ]}/>
                                                }/>
                                            }/>,

                                            /**
                                             * Bottom navigation menu
                                             * TODO: Only show on mobile devices
                                             */
                                            <Mobile children={
                                                <FlexBox id={"app-mobile-navigation-wrapper"} padding={false} width={percent(100)} style={{flex: "0 1 auto", backgroundColor: theme.colors.backgroundHighlightColor.css()}} children={
                                                    <MobileNavigation/>
                                                }/>
                                            }/>
                                        ]}/>
                                    }/>
                                }/>
                            }/>
                        }/>
                    ]}/>
                }/>
            );
        } else return (
            <Text text={"App not initiated"}/>
        );
    }

    private getRouts(): JSX.Element[] {
        const config: AppConfig = App.app().config;
        const routs: JSX.Element[] = [
            // <Route path={"/"} exact={false} render={() => <Redirect push to={config.debugMode ? config.defaultDebugAppRoute : config.defaultAppRoute}/>}/>,
            // <Route path={"/boarding"} render={() => <BoardingPage/>}/>,
            <Route path={"/register"} render={() => <SignupPage callingFrom={"/boarding"}/>}/>,
            <Route path={"/login"} render={() => <LoginPage/>}/>,
            // <Route path={"/dashboard"} render={() => <DashboardPage/>}/>,
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
        this.assembly.assembly(Constants.logDialog, (theme, props) => <LogPage enableClipboard={false} version={LogPageDisplayVersion.V2}/>);
        this.assembly.assembly(Constants.deleteProjectDialog, (theme, props) => <DeleteProjectDialog project={props}/>);
        this.assembly.assembly(Constants.serverConnectionDialog, (theme, props) => <ServerInfoDialog/>);
        this.assembly.assembly(Constants.roadmapDialog, (theme, props) => <RoadmapDialog/>);
        this.assembly.assembly(Constants.jsonDatasetInsertDialog, (theme, props: ImportDatasetDialogProps) => <Centered fullHeight children={<ImportDatasetDialog {...props}/>}/>);
        this.assembly.assembly(Constants.projectPreviewDialog, (theme, props: ProjectPreviewProps) => <Centered fullHeight children={<ProjectPreview {...props}/>}/>);
    }

    private appInit(config?: AppConfig) {
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

            app.registerAction("open-qa-panel", () => {
                if (getInstance()) {
                    if (getInstance()?.mounted) {
                        console.log("opening qa panel")
                        getInstance()?.dialog(
                            <StaticDrawerMenu justifyContent={Justify.CENTER} body={() => (
                                <QuickActionPanel noPadding/>
                            )}/>
                        );
                    }
                }
            })

            // Open the command pallet when ctrl + k is pressed
            document.addEventListener("keydown", ev => {
                if (ev.ctrlKey && ev.key === "k") {
                    ev.preventDefault();
                    app.callAction("open-command-pallet");
                }
            });

            // Open the quick action pallet when ctrl + q is pressed
            document.addEventListener("keydown", ev => {
                if (ev.ctrlKey && ev.key === "q") {
                    ev.preventDefault();
                    app.callAction("open-qa-panel");
                }
            });

            // Open the menu when ctrl + m is pressed
            document.addEventListener("keydown", ev => {
                if (instance) {
                    if (ev.ctrlKey && ev.key === "m") {
                        ev.preventDefault();
                        app.callAction("toggle-menu");
                    } else if (ev.altKey && ev.key === "m") {
                        ev.preventDefault();
                        const menu = MenuPageV2.instance;
                        if (menu !== undefined) {
                            const newState = menu.local.state.state === MenuState.HIDDEN ? MenuState.EXTENDED : MenuState.HIDDEN;
                            console.log(`Set menu state to '${newState}'.`)
                            MenuPageV2.setMenuState(newState);

                        }
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

        this.rerender();
    }

    private getLogPacketInterceptor(): (packet: Environment.Packet, connector: Environment.Connector) => void {
        return (packet, connector) => {
            if (App.enablePacketLogging) {
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
                });
            }
        }
    }
}

import React from "react";
import {cs, State} from "./state/State";
import {RenderController} from "../tests/regex/RenderController";
import {RenderExecutor} from "../tests/regex/RenderExecutor";
import {v4} from "uuid";
import {Themeable} from "./style/Themeable";
import {App, utilizeGlobalTheme} from "./app/App";
import {Redirect} from "react-router-dom";
import {getOr} from "./Utils";
import {Assembly} from "./assembly/Assembly";
import {SwipeableDrawer} from "@mui/material";
import {If} from "../components/logic/If";
import {Screen} from "../components/lo/Page";
import {Centered} from "../components/lo/PosInCenter";
import {ObjectVisualMeaning} from "./style/ObjectVisualMeaning";
import {Text} from "../components/lo/Text";

export type BernieComponentConfig = {
    enableLocalDialog: boolean
}

export class BernieComponent<RProps, RState, LState extends object> extends React.Component<RProps, RState> {

    private static readonly defaultConfig: BernieComponentConfig = {
        enableLocalDialog: false
    };

    private readonly _local: State<LState>;

    private readonly _controller: RenderController;

    private readonly _assembly: Assembly = new Assembly();

    private readonly config: BernieComponentConfig;

    private redirectTo: string | undefined;

    private redirect: boolean;

    private componentActive: boolean;

    private renderLocalForegroundDialog: boolean;

    private renderLocalForegroundDialogGenerator?: (component: BernieComponent<RProps, RState, LState>) => JSX.Element;

    constructor(props: RProps, state: RState, local: LState, config?: BernieComponentConfig) {
        super(props);
        this.config = getOr(config, BernieComponent.defaultConfig);
        this.state = state;
        this._local = cs(local);
        this._controller = new RenderController();
        this.redirectTo = undefined;
        this.redirect = false;
        this.componentActive = false;
        this.renderLocalForegroundDialog = false;
        this.local.on((state, value) => {
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });
        this.init();
    }

    public rerender(...channels: string[]) {
        this.controller.rerender(...channels);
    }

    get assembly(): Assembly {
        return this._assembly;
    }

    get local(): State<LState> {
        return this._local;
    }

    get controller(): RenderController {
        return this._controller;
    }

    public _component(channels: string[], renderFactory: (local: State<LState>) => JSX.Element): JSX.Element {
        return this.component(renderFactory, ...channels);
    }

    public component(renderFactory: (local: State<LState>) => JSX.Element, ...channels: string[]): JSX.Element {
        return (
            <RenderExecutor
                id={v4()}
                componentFactory={() => renderFactory(this.local)}
                channels={channels}
                componentDidMountRelay={bridge => this.controller.register(bridge)}
            />
        );
    }

    public goto(to: string, callback?: () => void) {
        this.redirectTo = to;
        this.redirect = true;
        this.forceUpdate(() => {
            // todo make more performant solution
            // this doesn't rerender yet
            this.redirectTo = undefined;
            this.redirect = false;
            this.forceUpdate();

            callback?.();
        });
    }

    public renderRedirect(): JSX.Element {
        App.app().baseLog({
            id: v4(),
            level: "TRACE",
            message: `Try to redirect to *${this.redirectTo}* (redirect: *${this.redirect}*)`,
            creator: "bernie-component",
            timestamp: new Date(),
            appendices: []
        })

        return (
            <Redirect to={this.redirectTo as string} push/>
        );
    }

    public init() {
    }

    public _openLocalDialog(component: JSX.Element) {
        this.openLocalDialog(() => component);
    }

    public closeLocalDialog() {
        this.renderLocalForegroundDialog = false;
        this.rerender("foreground-dialog");
    }

    public openLocalDialog(generator: (component: BernieComponent<RProps, RState, LState>) => JSX.Element) {
        if (this.config.enableLocalDialog) {
            this.renderLocalForegroundDialog = true;
            this.renderLocalForegroundDialogGenerator = generator;
            this.rerender("foreground-dialog");
        } else throw new Error("Cannot call / open a local dialog if 'enableLocalDialog' is disabled in the (Bernie)-Components config");
    }

    public componentRender(p: RProps, s: RState, l: LState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return undefined;
    }

    public ifActive(handler: (component: BernieComponent<RProps, RState, LState>) => void) {
        if (this.componentActive) {
            handler(this);
        }
    }

    a(assembly: string, param?: any): JSX.Element {
        return this.assembly.render({
            component: assembly,
            param: param
        });
    }

    private renderForegroundDialog(): JSX.Element {
        return (
            <SwipeableDrawer
                id={"bernie-component-local-foreground-dialog"}
                key={"bernie-component-local-foreground-dialog"}
                anchor={"bottom"}
                open={this.renderLocalForegroundDialog}
                keepMounted
                onOpen={() => {
                    this.renderLocalForegroundDialog = true;
                    this.rerender("foreground-dialog");
                }}
                onClose={() => {
                    this.renderLocalForegroundDialog = false;
                    this.rerender("foreground-dialog");
                }} sx={{
                    '& .MuiDialog-paper': {
                        background: "transparent",
                        maxHeight: "100vh !important",
                        maxWidth: "100vw !important",
                        margin: "0 !important",
                        borderRadius: "0 !important"
                    }
                }} children={
                    this.renderLocalForegroundDialogGenerator === undefined ? (
                        <Screen children={
                            <Centered fullHeight children={
                                <Text coloredText visualMeaning={ObjectVisualMeaning.ERROR} text={"Cannot render component-local foreground dialog"}/>
                            }/>
                        }/>
                    ) : (
                        this.renderLocalForegroundDialogGenerator(this)
                    )
                }
            />
        );
    }

    componentDidMount() {
        this.componentActive = true;
    }

    componentWillUnmount() {
        this.componentActive = false;
    }

    render() {
        if (this.redirect) {
            return this.renderRedirect();
        } else {
            return (
                <>
                    {
                        this.config.enableLocalDialog ? (
                            this.component((local) => this.renderForegroundDialog(), "foreground-dialog")
                        ) : undefined
                    }
                    {
                        this.componentRender(
                            this.props,
                            this.state,
                            this.local.state,
                            utilizeGlobalTheme(),
                            this.assembly
                        )
                    }
                </>
            );
        }
    }
}

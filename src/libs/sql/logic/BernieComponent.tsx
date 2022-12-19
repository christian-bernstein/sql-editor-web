import React, {PropsWithChildren} from "react";
import {cs, State} from "./state/State";
import {RenderController} from "../../regex/RenderController";
import {RenderExecutor} from "../../regex/RenderExecutor";
import {v4} from "uuid";
import {Themeable} from "./style/Themeable";
import {App, utilizeGlobalTheme} from "./app/App";
import {Redirect} from "react-router-dom";
import {getOr} from "./Utils";
import {Assembly} from "./assembly/Assembly";
import {InputBase, styled, SwipeableDrawer} from "@mui/material";
import {Screen} from "../components/lo/Page";
import {Centered} from "../components/lo/PosInCenter";
import {ObjectVisualMeaning, VM} from "./style/ObjectVisualMeaning";
import {Text} from "../components/lo/Text";
import {CoMuxProps} from "../components/props/CoMuxProps";
import {MuxRenderer} from "./MuxRenderer";
import {ComponentHelper} from "./ComponentHelper";

export type BernieComponentConfig<T extends BernieComponent<any, any, any> = any> = {
    enableLocalDialog: boolean,
    componentID?: string,
    deviceRenderSeparation?: boolean,
    renderers?: Map<string, MuxRenderer<T>>
}

export type BernieComponentBaseProps<T> = T & CoMuxProps & {}

export type GenericBC = BernieComponent<any, any, any>;

export class BernieComponent<RProps, RState, LState extends object, Implementation extends BernieComponent<any, any, any> = any> extends React.Component<BernieComponentBaseProps<RProps>, RState> {

    get helper(): ComponentHelper<RProps, RState, LState, Implementation> {
        return this._helper;
    }

    private readonly _local: State<LState>;

    private readonly _controller: RenderController;

    private readonly _assembly: Assembly = new Assembly();

    private readonly config: BernieComponentConfig;

    private readonly _helper: ComponentHelper<RProps, RState, LState, Implementation>

    private redirectTo: string | undefined;

    private redirect: boolean;

    private componentActive: boolean;

    private renderLocalForegroundDialog: boolean;

    private renderLocalForegroundDialogGenerator?: (component: BernieComponent<RProps, RState, LState>) => JSX.Element;

    private localForegroundDialogClosingListener?: () => void;

    constructor(props: BernieComponentBaseProps<RProps>, state: RState, local: LState, config?: Partial<BernieComponentConfig<Implementation>>) {
        super(props);

        this._helper = new ComponentHelper<RProps, RState, LState, Implementation>(() => this);

        // todo test
        this.config = {
            ...{
                deviceRenderSeparation: false,
                enableLocalDialog: true,
            },
            ...config
        };

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

    /**
     * pd = persist data
     */
    public pd<T>(key: string, value: T): T {
        window.localStorage.setItem(`cp-${getOr(this.config.componentID, "generic")}-${key}`, JSON.stringify(value));
        return value;
    }

    /**
     * rd = read data
     */
    public rd<T>(key: string, def: T): T {
        let item = window.localStorage.getItem(`cp-${getOr(this.config.componentID, "generic")}-${key}`);
        if (item === null) {
            return def;
        } else {
            return JSON.parse(item);
        }
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

    public ls(): LState {
        return this.local.state;
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

    public dialog(component: JSX.Element, onClose?: () => void) {
        this.openLocalDialog(() => component);

        // TODO: Make more versatile solution
        if (onClose !== undefined && this.localForegroundDialogClosingListener === undefined) {
            this.localForegroundDialogClosingListener = onClose;
        }
    }

    public closeLocalDialog() {
        this.renderLocalForegroundDialog = false;
        this.rerender("foreground-dialog");
    }

    public openLocalDialog(generator: (component: BernieComponent<RProps, RState, LState>) => JSX.Element) {
        const openRoutine = () => {
            if (this.config.enableLocalDialog) {
                this.renderLocalForegroundDialog = true;
                this.renderLocalForegroundDialogGenerator = generator;
                this.rerender("foreground-dialog");
            } else {
                throw new Error("Cannot call / open a local dialog if 'enableLocalDialog' is disabled in the (Bernie)-Components config");
            }
        }

        if (this.renderLocalForegroundDialog) {
            this.closeLocalDialog();
            setTimeout(() => {
                openRoutine();
            }, 50);
        } else {
            openRoutine();
        }
    }

    public componentRender(p: RProps, s: RState, l: LState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return undefined;
    }

    public ifActive(handler: (component: BernieComponent<RProps, RState, LState>) => void) {
        if (this.componentActive) {
            handler(this);
        }
    }

    a<T>(assembly: string, param?: T): JSX.Element {
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

                    // TODO: Make more versatile solution
                    if (this.localForegroundDialogClosingListener !== undefined) {
                        this.localForegroundDialogClosingListener();
                        this.localForegroundDialogClosingListener = undefined;
                    }
                }} sx={{
                    '& .MuiPaper-root': {
                        background: "transparent",
                        // backdropFilter: "blur(10px)",
                        boxShadow: "none"
                    },
                    '& .MuiDialog-paper': {
                        // background: "transparent",
                        background: "red",
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
                        this.config.deviceRenderSeparation ? (
                            <>
                                {
                                    // <Default children={
                                    //     this.renderDefault(this.props, this.state, this.local.state, utilizeGlobalTheme(), this.assembly)
                                    // }/>
                                }
                                {
                                    // <Mobile children={
                                    //     this.renderMobile(this.props, this.state, this.local.state, utilizeGlobalTheme(), this.assembly)
                                    // }/>
                                }
                            </>
                        ) : (
                            this.componentRender(
                                this.props,
                                this.state,
                                this.local.state,
                                utilizeGlobalTheme(),
                                this.assembly
                            )
                        )
                    }
                </>
            );
        }
    }
}

export {
    BernieComponent as Component,
    BernieComponent as BC
}

/**
 * todo implement!
 */
export type CProps<T, S, V extends object> = {
    render?: ((i: BernieComponent<T, S, V>, p: T, s: S, l: V) => (JSX.Element | undefined))
}

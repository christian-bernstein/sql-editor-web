import React from "react";
import {Environment} from "../../logic/Environment";
import "./style.scss";
import "./spinners.scss";
import "./Chart.scss";
import "./Keyboard.scss";
import {Utils} from "../../logic/Utils";
import {ReactComponent as FullscreenIcon} from "../../assets/icons/ic-16/ic16-refresh.svg";

export enum KeyPressType {
    PRESS = ("PRESS"),
    RELEASE = ("RELEASE"),
    CLICK = ("CLICK")
}

export enum TimeUnit {
    NANOSECONDS = ("NANOSECONDS"),
    MICROSECONDS = ("MICROSECONDS"),
    MILLISECONDS = ("MILLISECONDS"),
    SECONDS = ("SECONDS"),
    MINUTES = ("MINUTES"),
    HOURS = ("HOURS"),
    DAYS = ("DAYS")
}

export type KeyPress = {
    key: number,
    type: KeyPressType
}

export type Micro = {
    type: string,
    delayAmount: number,
    delayUnit: TimeUnit,
    data: {
        [key: string]: any
    }
}

export type Macro = {
    micros: Micro[]
}

const micro: (key: KeyPress, delayAmount?: number, delayUnit?: TimeUnit) => Micro = (key: KeyPress, delayAmount?: number, delayUnit?: TimeUnit) => {
    const macro: Micro = {
        type: "key",
        delayAmount: delayAmount === undefined ? 0 : delayAmount,
        delayUnit: delayUnit === undefined ? TimeUnit.MILLISECONDS : delayUnit,
        data: {
            data: {
                wrapped: key
            }
        }
    }
    return macro;
}

export type MicroDescription = {
    type: string,
    key: number,
    display: string
}

export type GlobalKeyEvent = {
    virtualKeyCode: number,
    transitionState: 0 | 1,
    keyChar: string,
    menuPressed: boolean,
    shiftPressed: boolean,
    controlPressed: boolean,
    winPressed: boolean,
    extendedKey: boolean,
    deviceHandle: number
}

export interface Hook {
    run(): void
}

export type BasicButtonData = {
    color: string,
    needConnection: boolean,
    header: string,
    key: number,
}

export type GenericWidgetData = {
    positioning: boolean,
    gridRow?: string,
    gridColumn?: string,
    type: string,
    classes: Array<string>
    data: {
        data: {
            [key: string]: any
        }
    }
}

// todo replace
export type WidgetData = {
    type: string,
    active: boolean,
    stator: boolean,
    header?: string,
    description?: string
    ids: Array<string>,
    [key: string]: any
}

export class Widget {

    private readonly _data: WidgetData

    private readonly rerenderHook: Hook;

    constructor(data: WidgetData, rerenderHook: Hook) {
        this._data = data;
        this.rerenderHook = rerenderHook;
    }

    get data(): WidgetData {
        return this._data;
    }

    public call(autoRender: boolean = false): Widget {
        if (this.data.active) {
            this.data.active = false;
        } else {
            this.data.active = true;
        }
        if (this.data.active && !this.data.stator) {
            this.deactivateAfterDelay(1500, autoRender).then(() => this.rerenderHook.run());
        }
        if (autoRender) {
            this.rerenderHook.run();
        }
        return this;
    }

    private async deactivateAfterDelay(timeout: number, autoRender: boolean) {
        new Promise(resolve => setTimeout(resolve, timeout)).then(() => {
            this.data.active = false;
            if (autoRender) {
                this.rerenderHook.run();
            }
        });
    }
}

export type WidgetStorageData = {
    widgets: Map<string, Array<Widget>>
}

// todo implement usage
export class WidgetStorage {

    private _data: WidgetStorageData;

    constructor(data: WidgetStorageData = {
        widgets: new Map<string, Array<Widget>>()
    }) {
        this._data = data;
    }

    public getContainer(id: string): Array<Widget> {
        return this.data.widgets.has(id) ? this.data.widgets.get(id) as Array<Widget> : new Array<Widget>();
    }

    get data(): WidgetStorageData {
        return this._data;
    }

    set data(value: WidgetStorageData) {
        this._data = value;
    }
}

export type ControlPanelProps = {
    connectorID: string,
    address: string
}

export interface WidgetRenderer {
    render(widget: Widget | undefined, panel: ControlPanelComponent, ...optionalProps: any[]): JSX.Element;
}

export type ControlPanelState = {
    connector: Environment.Connector,
    widgets: Array<Widget>,
    advWidgets: WidgetStorage,
    widgetRenderers: Map<string, WidgetRenderer>,
    isometric: boolean
}

export class ControlPanelComponent extends React.Component<ControlPanelProps, ControlPanelState> {

    private static readonly buttonWidgetRenderer: WidgetRenderer = {
        render(widget: Widget, panel: ControlPanelComponent, ...optionalProps): JSX.Element {
            return (
                <div
                    className={
                        [
                            "button",
                            panel.state.connector.socket?.readyState === WebSocket.OPEN ? "action-primary" : "action-tertiary",
                            widget.data.active ? "button-active" : ""
                        ].join(" ")}
                    onMouseDown={() => {
                        if (widget.data.type === "key") {
                            panel.execute(
                                micro({
                                    key: (widget.data.micro as MicroDescription).key,
                                    type: KeyPressType.PRESS
                                })
                            );
                        }
                    }}
                    onMouseUp={() => {
                        if (widget.data.type === "key") {
                            panel.execute(
                                micro({
                                    key: (widget.data.micro as MicroDescription).key,
                                    type: KeyPressType.RELEASE
                                })
                            );
                        }
                    }}
                    onTouchStart={(event) => {
                        if (widget.data.type === "key") {
                            panel.execute(
                                micro({
                                    key: (widget.data.micro as MicroDescription).key,
                                    type: KeyPressType.PRESS
                                })
                            );
                        }
                    }}
                    onTouchEnd={() => {
                        if (widget.data.type === "key") {
                            panel.execute(
                                micro({
                                    key: (widget.data.micro as MicroDescription).key,
                                    type: KeyPressType.RELEASE
                                })
                            );
                        }
                    }}
                >
                    <div className="content">
                        <h3>{widget.data.header}</h3>
                        {/*<p>{widget.data.description}</p>*/}
                        <p>{(widget.data.micro as MicroDescription).key}</p>
                    </div>
                </div>
            );
        }
    }

    private static readonly buttonSpinnerWidgetRenderer: WidgetRenderer = {
        render(widget: Widget, panel: ControlPanelComponent, ...optionalProps): JSX.Element {
            return (
                <div id="shift"
                     className={["button", "action-special", widget.data.active ? "button-active" : ""].join(" ").trim()}>
                    <div className="container">
                        <div className="container-slider">
                            <div className="content">
                                <h3>{widget.data.header}</h3>
                                <p>{String(widget.data.active)}</p>
                            </div>
                            <div className="content">
                                <div className="spinner">
                                    <div className="lds-dual-ring"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    private static readonly buttonFullscreenWidgetRenderer: WidgetRenderer = {
        render(widget: Widget, panel: ControlPanelComponent, ...optionalProps): JSX.Element {
            return (
                <div id="fullscreen"
                     className={["button", "action-yellow", document.fullscreenElement == null ? "" : "button-active"].join(" ").trim()}
                     onClick={() => panel.handleFullscreenButtonPress()}>
                    <div className="content">
                        <h3>
                            Fullscreen</h3>
                        <p>{document.fullscreenElement == null ? "Disabled" : "Enabled"}</p>
                    </div>
                </div>
            );
        }
    }

    constructor(props: ControlPanelProps) {
        super(props);
        this.state = {
            connector: this.getConnector(),
            widgets: new Array<Widget>(),
            // todo introduce packet update
            // todo map new packet to the widget store
            advWidgets: new WidgetStorage(),
            widgetRenderers: new Map<string, WidgetRenderer>([
                ["button", ControlPanelComponent.buttonWidgetRenderer],
                ["buttonSpinnerWidgetRenderer", ControlPanelComponent.buttonSpinnerWidgetRenderer],
                ["buttonFullscreenWidgetRenderer", ControlPanelComponent.buttonFullscreenWidgetRenderer]
            ]),
            isometric: false
        };
    }

    private handleFullscreenButtonPress(): void {
        Utils.toggleFullScreen(() => {
            this.forceUpdate();
        });
    }

    public getWidget(id: string): Widget | undefined {
        const widget: Array<Widget> = this.state.widgets.filter(widget => widget.data.ids.includes(id));
        return widget.length < 1 ? undefined : widget[0];
    }

    private load() {
        // Register the handler for the key press packet (key down & up)
        this.state.connector.registerProtocolPacketHandlerOnCurrentProtocol("KeyPressedPacketData", {
            handle: (con, packet) => {
                const event: GlobalKeyEvent = packet.data.event as GlobalKeyEvent;
                this.state.widgets?.filter(widget => widget.data.ids.includes(String(event.virtualKeyCode))).forEach(widget => {
                    widget.call(true);
                })
                this.forceUpdate();
            }
        });

        this.state.connector.registerSocketEventHandler(Environment.SocketEventTypes.ONOPEN, {
            stator: true,
            handle: ev => this.forceUpdate()
        })

        this.state.connector.registerSocketEventHandler(Environment.SocketEventTypes.ONCLOSE, {
            stator: true,
            handle: ev => this.forceUpdate()
        })

        this.state.connector.registerSocketEventHandler(Environment.SocketEventTypes.ONOPEN, {
            stator: true,
            handle: ev => {
                this.state.connector.call({
                    protocol: "core",
                    packetID: "SocketPingDataPacket",
                    data: {
                        timestamp: new Date().getTime()
                    },
                    callback: {
                        handle: (connector, packet) => {
                            console.log("Latency is: " + packet.data.latency);
                        }
                    }
                })
            }
        })

        // Call the server for the widgets to display
        const instance: ControlPanelComponent = this;
        this.state.connector.call({
            protocol: "stream",
            packetID: "WidgetRequestPacketData",
            data: {},
            callback: {
                handle: (connector1, packet) => {
                    this.setState({
                        // todo replace by advances widget storage
                        widgets: (packet.data.micros as Array<MicroDescription>).map(micro => {
                            return new Widget({
                                active: false,
                                stator: true, // todo set from micro
                                ids: [String(micro.key), micro.display],
                                header: micro.display,
                                description: micro.display,
                                type: "key",
                                micro: micro
                            }, {
                                run() {
                                    instance.forceUpdate();
                                }
                            });
                        })
                    });
                }
            }
        });
    }

    private getConnector(): Environment.Connector {
        return Environment.Connector.useConnector(this.props.connectorID, () => new Environment.Connector({
            protocol: "stream",
            address: this.props.address,
            id: this.props.connectorID,
            maxConnectAttempts: 50,
            connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3)
        }));
    }

    private execute(...micros: Micro[]): ControlPanelComponent {
        if (this.state.connector !== undefined) {
            const data: Macro = {
                micros: micros
            };
            this.state.connector.singleton({
                protocol: "stream",
                packetID: "MacroPacketData",
                data: data
            });
        }
        return this;
    };

    private getRenderer(id: string): WidgetRenderer {
        if (this.state.widgetRenderers.has(id)) {
            return this.state.widgetRenderers.get(id) as WidgetRenderer;
        } else {
            throw new Error("WidgetRenderer cannot be undefined : " + id);
        }
    }

    componentDidMount() {
        this.load();
    }

    render() {
        return (
            <>
                <div className={["calculator", this.state.isometric ? "isometric" : ""].join(" ").trim()}>
                    <div className="lower">
                        <div className="specials">
                            {
                                <>
                                    {(() => {
                                        const widget: Widget | undefined = this.getWidget("Greater");
                                        if (widget === undefined) {
                                            return <></>;
                                        } else {
                                            return this.getRenderer("buttonSpinnerWidgetRenderer").render(widget as Widget, this);
                                        }
                                    })()}
                                    {(() => {
                                        const widget: Widget | undefined = this.getWidget("Right Brace");
                                        if (widget === undefined) {
                                            return <></>;
                                        } else {
                                            return this.getRenderer("buttonSpinnerWidgetRenderer").render(widget as Widget, this);
                                        }
                                    })()}
                                    {(() => {
                                        const widget: Widget | undefined = this.getWidget("Close Bracket");
                                        if (widget === undefined) {
                                            return <></>;
                                        } else {
                                            return this.getRenderer("buttonSpinnerWidgetRenderer").render(widget as Widget, this);
                                        }
                                    })()}
                                    {(() => {
                                        return this.getRenderer("buttonFullscreenWidgetRenderer").render(undefined, this);
                                    })()}
                                </>

                            }

                            {/*<div className="spacer"/>*/}
                            <div className="spacer"/>
                            <div id="iso" className="button action-tertiary special static" onClick={event => {
                                const newState: ControlPanelState = this.state;
                                newState.isometric = !newState.isometric;
                                this.setState(newState);
                            }}>
                                <div className="content">
                                    <h3>Iso</h3>
                                    <p/>
                                </div>
                            </div>
                            <div id="reload"
                                 className={["button", "special", "action-tertiary", "static"].join(" ").trim()}
                                 onClick={() => Utils.reloadPage()}
                            >
                                <div className="content">
                                    <h3>Reload</h3>
                                    <p>F5</p>
                                </div>
                            </div>

                            <div className="spacer"/>

                            <div id="reboot" className={
                                [
                                    "button",
                                    this.state.connector.socket?.readyState === WebSocket.OPEN ? "action-special" : "action-tertiary",
                                    "double",
                                    "static",
                                ].join(" ").trim()}
                                 onClick={() => {
                                     this.state.connector.singleton({
                                         packetID: "PartialServerResetPacketData",
                                         protocol: "stream",
                                         data: {}
                                     });
                                 }}
                            >
                                <div className="content">
                                    <h3>Reboot</h3>
                                    <p>Partial server reset</p>
                                </div>
                            </div>

                            {
                                (() => {
                                    // "action-success"
                                    return (
                                        <div id="connect"
                                             className={["button", this.state.connector.socket?.readyState === WebSocket.OPEN ? "action-secondary" : "action-tertiary", "double", "static",
                                                 this.state.connector.socket?.readyState === WebSocket.OPEN ? "button-active" : ""
                                             ].join(" ").trim()}
                                             onClick={event => {
                                                 if (this.state.connector.socket?.readyState === WebSocket.OPEN) {
                                                     this.state.connector.requestServersideShutdownRoutine();
                                                 } else {
                                                     this.state.connector.connect();
                                                 }
                                             }}
                                        >
                                            <div className="container">
                                                <div className="container-slider">
                                                    <div className="content">
                                                        <h3>Connect</h3>
                                                        <p>{this.state.connector.socket?.readyState}</p>
                                                    </div>
                                                    <div className="content">
                                                        <div className="spinner">
                                                            <div className="lds-dual-ring"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()
                            }
                        </div>

                        <div className="button-layout-container">
                            <div className="button-layout">
                                <div className={"keyboard"}>
                                    {
                                        (() => {
                                            const keyMap: number[] = [
                                                27, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 8,
                                                9, 81, 87, 69, 82, 84, 90, 85, 73, 79, 80, 46,
                                                20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 192, 222,
                                                160, 226, 89, 88, 67, 86, 66, 78, 77, 44, 38, 161,
                                                162, 524, 91, 32, 162, 0, 93, 0, 0, 37, 40, 39
                                            ];
                                            const widgets: Array<Widget | undefined> = new Array<Widget | undefined>();
                                            const copy: Widget[] = this.state.widgets;
                                            keyMap.forEach(key => {
                                                if (key === 0) {
                                                    widgets.push(undefined);
                                                } else {
                                                    const find: Widget | undefined = copy.find(widget => (widget.data.micro as MicroDescription).key == key);
                                                    if (find === undefined) {
                                                        widgets.push(undefined)
                                                    } else {
                                                        widgets.push(find);
                                                    }
                                                }
                                            });

                                            return widgets.map((widget) => {
                                                if (widget === undefined) {
                                                    return <div className="spacer"/>;
                                                } else {
                                                    return this.getRenderer("button").render(widget, this);
                                                }
                                            });
                                        })()
                                    }
                                </div>

                            </div>


                            <div className="button-layout">
                                {
                                    (() => {
                                        if (this.state !== null) {
                                            return this.state.widgets?.map((widget, index, array) => {
                                                return this.getRenderer("button").render(widget, this);
                                            });
                                        } else {
                                            console.log("state is null") // todo remove
                                        }
                                    })()
                                }
                            </div>
                            <div className="button-layout">
                                <div id="toggle-lights" className="button action-tertiary double static">
                                    <div className="container">
                                        <div className="container-slider">
                                            <div className="content">
                                                <h3>F1</h3>
                                                <p>Connect</p>
                                            </div>
                                            <div className="content no-padding">
                                                <div className="progress">
                                                    <div className="progress-outline">
                                                        <div className="progress-bar">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="plus" className="button action-primary double static">
                                    <div className="content">
                                        <h3>V</h3>
                                        <p>Decoupled Mode Toggle</p>
                                    </div>
                                </div>
                                <div id="plus" className="button action-primary double static">
                                    <div className="content">
                                        <h3>C</h3>
                                        <p>Cruise Control</p>
                                    </div>
                                </div>
                                <div id="plus" className="button action-primary double static">
                                    <div className="content">
                                        <h3>N</h3>
                                        <p>Landing Mode Toggle</p>
                                    </div>
                                </div>
                                <div id="plus" className="button action-primary double static">
                                    <div className="content">
                                        <h3>ALT + B + C</h3>
                                        <p>CPU boost mode</p>
                                    </div>
                                </div>
                                <div id="plus" className="button action-primary double static">
                                    <div className="content">
                                        <h3>ALT + B + G</h3>
                                        <p>GPU boost mode</p>
                                    </div>
                                </div>
                                <div id="plus" className="button action-primary double static">
                                    <div className="content">
                                        <h3>ALT + A</h3>
                                        <p>Panel Access</p>
                                    </div>
                                </div>
                                <div id="reset" className="button action-primary double static">
                                    <div className="content">
                                        <h3>R</h3>
                                        <p>reset</p>
                                    </div>
                                </div>
                                <div id="plus" className="button action-secondary static">
                                    <div className="content">
                                        <h3>ALT + F4</h3>
                                        <p>OS Shutdown</p>
                                    </div>
                                </div>
                                <div id="plus" className="button action-secondary static">
                                    <div className="content">
                                        <h3>Shift</h3>
                                        <p>Afterburner</p>
                                    </div>
                                </div>
                                <div className="widget switch double">
                                    <div className="button radio-label action-secondary static">
                                        <div className="content">
                                            <h3>X</h3>
                                            <p>Spacebrake</p>
                                        </div>
                                    </div>
                                    <div className="button radio-label action-secondary static">
                                        <div className="content">
                                            <h3>X</h3>
                                            <p>Spacebrake</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="plus" className="button action-secondary double">
                                    <div className="container">
                                        <div className="container-slider">
                                            <div className="content">
                                                <h3>Shift</h3>
                                                <p>Afterburner</p>
                                            </div>
                                            <div className="content">
                                                <div className="spinner">
                                                    <div className="lds-dual-ring"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="shift" className="button action-secondary double static">
                                    <div className="container">
                                        <div className="container-slider">
                                            <div className="content">
                                                <h3>Shift</h3>
                                                <p>Afterburner</p>
                                            </div>
                                            <div className="content">
                                                <div className="spinner">
                                                    <div className="lds-dual-ring"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

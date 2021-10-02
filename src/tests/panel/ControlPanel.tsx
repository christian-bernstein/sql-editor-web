import React from "react";
import {Environment} from "../../logic/Environment";
import "./style.scss";
import "./spinners.scss";

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
        this.data.active = !this.data.active;
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

export type ControlPanelProps = {
    connectorID: string,
    address: string
}

export type ControlPanelState = {
    connector: Environment.Connector,
    widgets: Array<Widget>,
}

export class ControlPanelComponent extends React.Component<ControlPanelProps, ControlPanelState> {

    constructor(props: ControlPanelProps) {
        super(props);
        this.state = {
            connector: this.getConnector(),
            widgets: new Array<Widget>()
        };
    }

    private load() {
        console.log("loading")

        // Register the handler for the key press packet (key down & up)
        this.state.connector.registerProtocolPacketHandlerOnCurrentProtocol("KeyPressedPacketData", {
            handle: (con, packet) => {
                const event: GlobalKeyEvent = packet.data.event as GlobalKeyEvent;
                console.log("keypress event registered")
                this.state.widgets?.filter(widget => widget.data.ids.includes(String(event.virtualKeyCode))).forEach(widget => {
                    console.log(widget)
                    widget.call();
                })
                this.forceUpdate();
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
                    console.log("WidgetRequestPacketData response delivered");
                    console.log((packet.data.micros as Array<MicroDescription>));

                    this.setState({
                        widgets: (packet.data.micros as Array<MicroDescription>).map(micro => {
                            return new Widget({
                                active: false,
                                stator: true, // todo set from micro
                                ids: [String(micro.key)],
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

    componentDidMount() {
        this.load();
    }

    private getConnector(): Environment.Connector {
        return Environment.Connector.useConnector(this.props.connectorID, () => new Environment.Connector("stream", this.props.address, this.props.connectorID));
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

    render() {
        console.log("drawing ui");
        return(
           <>
               <div className="calculator">
                   <div className="lower">
                       <div className="specials">
                           <div id="alpha" className="button action-special special static">
                               <div className="content">
                                   <h3>U</h3>
                                   <p>Internet</p>
                               </div>
                           </div>
                           <div id="" className="button action-special special static">
                               <div className="content">
                                   <h3>I</h3>
                                   <p>Engines</p>
                               </div>
                           </div>
                           <div id="" className="button action-special special static">
                               <div className="content">
                                   <h3>O</h3>
                                   <p>Sound</p>
                               </div>
                           </div>
                           <div id="" className="button action-special special static">
                               <div className="content">
                                   <h3>P</h3>
                                   <p>Mic</p>
                               </div>
                           </div>
                           <div className="spacer"/>
                           <div id="iso" className="button action-tertiary special static">
                               <div className="content">
                                   <h3>Iso</h3>
                                   <p/>
                               </div>
                           </div>
                           <div id="fullscreen" className="button action-tertiary special">
                               <div className="content">
                                   <h3>F11</h3>
                                   <p>fullscreen</p>
                               </div>
                           </div>
                           <div id="connect" className="button action-tertiary static">
                               <div className="container">
                                   <div className="container-slider">
                                       <div className="content">
                                           <h3>F1</h3>
                                           <p>Connect</p>
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

                       <div className="button-layout-container">
                           <div className="button-layout">
                               {
                                   (() => {
                                       if (this.state !== null) {

                                           console.log("state is defined")

                                           return this.state.widgets?.map((widget, index, array) => {
                                               return (
                                                   <div className={["button", "action-primary", widget.data.active ? "button-active" : ""].join(" ")} onClick={() => {
                                                       if (widget.data.type === "key") {
                                                           this.execute(
                                                               micro({
                                                                   key: (widget.data.micro as MicroDescription).key,
                                                                   type: KeyPressType.CLICK
                                                               })
                                                           );
                                                       }

                                                   }}>
                                                       <div className="content">
                                                           <h3>{widget.data.header}</h3>
                                                           <p>{widget.data.description}</p>
                                                       </div>
                                                   </div>
                                               );
                                           });
                                       } else {
                                           console.log("state is null")
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

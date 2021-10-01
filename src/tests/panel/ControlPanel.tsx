import React, {useState} from "react";
import {Environment} from "../../logic/Environment";
import {Button} from "@mui/material";

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
    type: KeyPressType,
    // delayAmount: number,
    // delayUnit: TimeUnit
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

export type ControlPanelState = {
    connector: Environment.Connector
}

export const ControlPanel: React.FC = () => {
    const [state, setState] = useState<ControlPanelState>(() => {
        return {
            connector: Environment.Connector.useConnector("panel", () => new Environment.Connector("v1", "ws:192.168.2.102:30001", "panel").connect())
        }
    })

    const execute: (...micros: Micro[]) => void = (...micros: Micro[]) => {
        if (state.connector !== undefined) {
            const data: Macro = {
                micros: micros
            };
            state.connector.singleton({
                protocol: "stream",
                packetID: "MacroPacketData",
                data: data
            });
        }
    };

    return (
        <>
            <Button
                onClick={() => {
                    execute(
                        // todo set correct key code
                        micro({key: 0x10, type: KeyPressType.CLICK})
                    );
                }}
                variant={"outlined"}>
                W
            </Button>
            <Button
                onClick={() => {
                    execute(
                        micro({key: 0x41, type: KeyPressType.CLICK})
                    );
                }}
                variant={"outlined"}>
                A
            </Button>
            <Button
                onClick={() => {
                    execute(
                        micro({key: 0x10, type: KeyPressType.PRESS}),
                        micro({key: 0x41, type: KeyPressType.CLICK}),
                        micro({key: 0x10, type: KeyPressType.RELEASE}),
                    )
                }}
                variant={"outlined"}>
                SHIFT + A
            </Button>
            <Button
                onClick={() => {
                    execute(
                        {
                            delayAmount: 0,
                            delayUnit: TimeUnit.NANOSECONDS,
                            type: "hello",
                            data: {
                                data: {
                                    wrapped: "Hello world"
                                }
                            }
                        }
                    )
                }}
                variant={"outlined"}>
                HELLO
            </Button>
        </>
    );
}

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
        data: Map<string, object>
    }
}

export type Macro = {
    micros: Micro[]
}

const basicWrap: (wrap: Micro, ...micro: Micro[]) => Micro[] = (wrap: Micro, ...micro: Micro[]) => {

    return [
        {
            key: 0x10,
            type: KeyPressType.PRESS
        },
        ...keyPresses,
        {
            key: 0x10,
            type: KeyPressType.RELEASE
        }
    ]
}

const basicWrap: (wrap: number, ...keyPresses: KeyPress[]) => KeyPress[] = (wrap, ...keyPresses) => {
    return [
        {
            key: 0x10,
            type: KeyPressType.PRESS
        },
        ...keyPresses,
        {
            key: 0x10,
            type: KeyPressType.RELEASE
        }
    ]
}

const shiftWrap: (...keyPresses: KeyPress[]) => KeyPress[] = (...keyPresses) => {
    return basicWrap(0x10, ...keyPresses);
}

const micro: (key: KeyPress, delayAmount?: number, delayUnit?: TimeUnit) => Micro = (key: KeyPress, delayAmount?: number, delayUnit?: TimeUnit) => {
    const macro: Micro = {
        type: "key",
        delayAmount: delayAmount === undefined ? 0 : delayAmount,
        delayUnit: delayUnit === undefined ? TimeUnit.MILLISECONDS : delayUnit,
        data: {
            data: new Map<string, object>([["wrapped", {
                key: 0x10,
                type: KeyPressType.PRESS
            }]])
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
            connector: new Environment.Connector("v1", "ws:192.168.2.102:30001").connect()
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
                    execute(micro({
                        key: 0x10,
                        type: KeyPressType.PRESS
                    }));
                }}
                variant={"outlined"}>
                W
            </Button>
            <Button
                onClick={() => {
                    execute(micro({
                        key: 0x41,
                        type: KeyPressType.CLICK
                    }));
                }}
                variant={"outlined"}>
                A
            </Button>
            <Button
                onClick={() => {
                    execute(
                        ...basicWrap(0x10, {
                            key: 0x41,
                            type: KeyPressType.CLICK
                        })
                    )
                }}
                variant={"outlined"}>
                SHIFT + A
            </Button>
        </>
    );
}

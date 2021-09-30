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
    delayAmount: number,
    delayUnit: TimeUnit
}

export type KeyPressesData = {
    keys: KeyPress[]
}

export type ControlPanelState = {
    connector: Environment.Connector
}

const basicWrap: (wrap: number, ...keyPresses: KeyPress[]) => KeyPress[] = (wrap, ...keyPresses) => {
    return [
        {
            key: 0x10,
            type: KeyPressType.PRESS,
            delayAmount: 0,
            delayUnit: TimeUnit.NANOSECONDS
        },
        ...keyPresses,
        {
            key: 0x10,
            type: KeyPressType.RELEASE,
            delayAmount: 0,
            delayUnit: TimeUnit.NANOSECONDS
        }
    ]
}

const shiftWrap: (...keyPresses: KeyPress[]) => KeyPress[] = (...keyPresses) => {
    return basicWrap(0x10, ...keyPresses);
}

const fnWrap: (...keyPresses: KeyPress[]) => KeyPress[] = (...keyPresses) => {
    return basicWrap(0x10, ...keyPresses);
}

export const ControlPanel: React.FC = () => {
    const [state, setState] = useState<ControlPanelState>(() => {
        return {
            connector: new Environment.Connector("v1", "ws:192.168.2.102:30001").connect()
        }
    })

    const handleClick: (...keys: KeyPress[]) => void = (...keys: KeyPress[]) => {
        if (state.connector !== undefined) {
            const data: KeyPressesData = {
                keys: keys
            };
            state.connector.singleton({
                protocol: "stream",
                packetID: "ButtonPressedPacketData",
                data: data
            });
        }
    };

    return (
        <>
            <Button
                onClick={() => {
                    handleClick({
                        key: 0x57,
                        type: KeyPressType.CLICK,
                        delayAmount: 0,
                        delayUnit: TimeUnit.NANOSECONDS
                    })
                }}
                variant={"outlined"}>
                W
            </Button>
            <Button
                onClick={() => {
                    handleClick({
                        key: 0x41,
                        type: KeyPressType.CLICK,
                        delayAmount: 0,
                        delayUnit: TimeUnit.NANOSECONDS
                    })
                }}
                variant={"outlined"}>
                A
            </Button>
            <Button
                onClick={() => {
                    handleClick(
                        ...basicWrap(0x10, {
                            key: 0x41,
                            type: KeyPressType.CLICK,
                            delayAmount: 0,
                            delayUnit: TimeUnit.NANOSECONDS
                        })
                    )
                }}
                variant={"outlined"}>
                SHIFT + A
            </Button>
        </>
    );
}

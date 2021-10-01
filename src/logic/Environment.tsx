import React, {Dispatch, SetStateAction} from "react";
import {v4} from "uuid";
import {Theme} from "@mui/material";
import {Themes} from "./Themes";

export namespace Environment {

    export function main(): boolean {

        return true;
    }

    interface EnvironmentConstants {
        themes: Map<string, Theme>;
        defaultEnvironmentVisualData: EnvironmentVisualData;
        defaultEnvironmentDebugData: EnvironmentDebugData;
    }

    export const constants: EnvironmentConstants = {
        themes: new Map<string, Theme>([
            ["light", Themes.lightTheme],
            ["dark", Themes.darkTheme]
        ]),
        defaultEnvironmentVisualData: {
            activeTheme: "dark"
        },
        defaultEnvironmentDebugData: {
            showDebugPanel: false,
            showOverlays: false
        }
    }

    export type EnvironmentVisualData = {
        activeTheme: string
    }

    export type EnvironmentDebugData = {
        showDebugPanel: boolean,
        showOverlays: boolean
    }

    export function usePersistent<T>(defaultValue: T, key: string, category:string = 'public'): [T, Dispatch<SetStateAction<T>>] {
        key = category + ":" + key;
        const [value, setValue] = React.useState(() => {
            const persistentValue = window.localStorage.getItem(key);
            return persistentValue !== null ? JSON.parse(persistentValue) : defaultValue;
        });
        React.useEffect(() => {
            window.localStorage.setItem(key, JSON.stringify(value));
        }, [key, value]);
        return [value, setValue];
    }

    export enum PacketType {
        REQUEST = "REQUEST",
        RESPONSE = "RESPONSE",
        SINGLETON = "SINGLETON"
    }

    export interface Handler {
        handle: (connector: Connector, packet: Packet) => void;
    }

    export type Packet = {
        protocol: string,
        timestamp: Date,
        packetID: string,
        id: string,
        type: PacketType,
        data: object
    }

    export type Protocol = {
        handlers: Map<string, Array<Handler>>
    }

    export class Connector {

        private static connectors: Array<Connector> = new Array<Environment.Connector>();

        public static useConnector(id: string, factory: () => Connector): Connector {
            const filter: Array<Connector> = Connector.connectors.filter(value => value.id === id);
            if (filter.length === 0) {
                // No connector found, create new one
                const connector: Connector = factory();
                Connector.connectors.push(connector)
                return connector;
            } else {
                return filter[0];
            }
        }

        private _socket: WebSocket | undefined;

        private _protocol: string;

        private _responseMap: Map<string, Handler> = new Map<string, Handler>();

        private _protocols: Map<string, Protocol> = new Map<string, Environment.Protocol>();

        private _id: string;

        private readonly address: string;

        constructor(protocol: string, address: string, id: string = v4()) {
            this._protocol = protocol;
            this.address = address;
            this._id = id;
            Connector.connectors.push(this);
        }

        private baseSend(payload: string): void {

            console.log("perform base-send routine")

            if (this.socket !== undefined) {
                if (this.socket.readyState === WebSocket.OPEN) {
                    // Websocket is ready, message can be send.

                    console.log("websocket already in ready state")

                    this.saveSend(payload).then();
                } else if (this.socket.readyState !== WebSocket.OPEN) {
                    // Websocket is closing or closed, it may be required to reconnect.
                    this.connect();
                    this.saveSend(payload).then();
                }
            } else {

                console.log("websocket is undefined, connect")

                this.connect();
                this.saveSend(payload).then();
            }
        }

        private async saveSend(payload: string): Promise<void> {
            if (this.socket?.readyState === WebSocket.OPEN) {
                // Websocket is already connected and open for messages
                this.socket?.send(payload);
            } else {
                // Websocket is still loading

                console.log("websocket isn't ready, wait for ready state OPEN (1)")

                try {
                    // await this.waitForOpenConnection();

                    this.waitForOpenConnection().then(() => {
                        console.log("websocket connection now in ready state")
                        this.socket?.send(payload);
                    })

                    // console.log("websocket connection now in ready state")
                    // this.socket?.send(payload);
                } catch (err) {
                    console.error(err)
                }
            }
        }

        private waitForOpenConnection(): Promise<void> {

            console.log("waiting for websocket connection to open")

            return new Promise<void>((resolve, reject) => {
                const maxNumberOfAttempts: number = 10;
                const intervalTime: number = 200; //ms

                let currentAttempt: number = 0;
                const interval: NodeJS.Timeout = setInterval(() => {

                    console.log("check websocket connection");

                    if (currentAttempt > maxNumberOfAttempts - 1) {
                        clearInterval(interval);
                        reject(new Error('Maximum number of attempts exceeded'))
                    } else if (this.socket?.readyState === WebSocket.OPEN) {
                        clearInterval(interval);
                        resolve();
                    }

                    console.log("couldn't resolve opened websocket connection");

                    currentAttempt++;
                }, intervalTime);
            })
        }

        public singleton(config: {protocol: string, packetID: string, data: any}): Connector {
            const uuid: string = v4();
            const packet: string = JSON.stringify({
                protocol: config.protocol,
                timestamp: Date,
                packetID: config.packetID,
                id: v4(),
                type: PacketType.REQUEST,
                data: config.data
            });

            console.log(packet);

            this.baseSend(packet);
            return this;
        }

        public call(config: {protocol: string, packetID: string, data: any, callback: Handler}): Connector {

            console.log("calling server with: " + config.packetID);

            const uuid: string = v4();
            const packet: string = JSON.stringify({
                protocol: config.protocol,
                timestamp: Date,
                packetID: config.packetID,
                id: v4(),
                type: PacketType.REQUEST,
                data: config.data
            });
            this.baseSend(packet);
            this._responseMap.set(uuid, config.callback);
            return this;
        }

        public respond(config: {protocol: string, packetID: string, data: any, id: string}): Connector {
            const packet: string = JSON.stringify({
                protocol: config.protocol,
                timestamp: Date,
                packetID: config.packetID,
                id: config.id,
                type: PacketType.REQUEST,
                data: config.data
            });
            this.baseSend(packet);
            return this;
        }

        public connect(): Connector {

            console.log("Connect to: " + this.address)

            this._socket = new WebSocket(this.address);
            this._socket.onmessage = ev => {

                console.log(ev)

                const packet: Packet = JSON.parse(ev.data) as Packet;
                if (packet.type === PacketType.RESPONSE) {
                    // It's a return packet
                    const callback: Handler | undefined = this._responseMap.get(packet.id);
                    callback?.handle(this, packet);
                } else {
                    // It's a singleton or request packet
                    const protocol: Protocol | undefined = this._protocols.get(this._protocol);
                    const handlerArray: Array<Handler> | undefined = protocol?.handlers.get(packet.packetID);
                    if (handlerArray !== undefined) {
                        for (const value of handlerArray) {
                            try {
                                value.handle(this, packet);
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    }
                }
            };
            return this;
        }

        get id(): string {
            return this._id;
        }

        set id(value: string) {
            this._id = value;
        }

        get socket(): WebSocket | undefined {
            return this._socket;
        }

        set socket(value: WebSocket | undefined) {
            this._socket = value;
        }

        get protocol(): string {
            return this._protocol;
        }

        set protocol(value: string) {
            this._protocol = value;
        }

        get responseMap(): Map<string, Environment.Handler> {
            return this._responseMap;
        }

        set responseMap(value: Map<string, Environment.Handler>) {
            this._responseMap = value;
        }

        get protocols(): Map<string, Environment.Protocol> {
            return this._protocols;
        }
    }
}

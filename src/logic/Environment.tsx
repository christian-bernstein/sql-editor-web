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
        data: any
    }

    export type Protocol = {
        handlers: Map<string, Array<Handler>>
    }

    export type SocketEventHandler = {
        handle: (ev: Event) => void,
        stator: boolean,
        usagesLeft?: number
    }

    export enum SocketEventTypes {
        ONOPEN, ONCLOSE
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

        private readonly socketEventHandlers: Map<SocketEventTypes, Array<SocketEventHandler>> = new Map<SocketEventTypes, Array<SocketEventHandler>>([
            [SocketEventTypes.ONOPEN, new Array<SocketEventHandler>()]
        ]);

        private readonly address: string;

        constructor(protocol: string, address: string, id: string = v4()) {
            this._protocol = protocol;
            this.address = address;
            this._id = id;
            Connector.connectors.push(this);
        }

        private baseSend(payload: string): void {
            if (this.socket !== undefined) {
                if (this.socket.readyState === WebSocket.OPEN) {
                    // Websocket is ready, message can be send.
                    this.saveSend(payload);
                } else if (this.socket.readyState !== WebSocket.OPEN) {
                    // Websocket is closing or closed, it may be required to reconnect.
                    this.saveSend(payload);
                    this.connect();
                }
            } else {
                this.saveSend(payload);
                this.connect();
            }
        }

        private saveSend(payload: string): void {
            if (this.socket?.readyState === WebSocket.OPEN) {
                // Websocket is already connected and open for messages
                this.socket?.send(payload);
            } else {
                // Websocket is still loading
                try {
                    this.registerSocketEventHandler(SocketEventTypes.ONOPEN, {
                        stator: false,
                        handle: ev => {
                            (ev.target as WebSocket).send(payload);
                        }
                    });
                } catch (err) {
                    console.error(err)
                }
            }
        }

        public registerSocketEventHandler(type: SocketEventTypes, handler: SocketEventHandler): Connector {
            this.socketEventHandlers.get(type)?.push(handler);
            return this;
        }

        public singleton(config: {protocol: string, packetID: string, data: any}): Connector {
            const packet: string = JSON.stringify({
                protocol: config.protocol,
                timestamp: Date,
                packetID: config.packetID,
                id: v4(),
                type: PacketType.REQUEST,
                data: config.data
            });
            this.baseSend(packet);
            return this;
        }

        public call(config: {protocol: string, packetID: string, data: any, callback: Handler}): Connector {
            const uuid: string = v4();
            const packet: string = JSON.stringify({
                protocol: config.protocol,
                timestamp: Date,
                packetID: config.packetID,
                id: uuid,
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

        private fireSocketEvent(type: SocketEventTypes, ev: Event) {
            if (this.socketEventHandlers.has(type)) {
                const handlers: Array<SocketEventHandler> = this.socketEventHandlers.get(type) as Array<SocketEventHandler>;
                handlers.forEach((handler, index, array) => {
                    try {
                        handler.handle(ev);
                    } catch (e) {
                        console.error(e);
                    }
                    if (!handler.stator) {
                        if (handler.usagesLeft !== undefined) {
                            (handler.usagesLeft as number)--;
                            if ((handler.usagesLeft as number) < 1) {
                                array.splice(index, 1);
                            }
                        } else {
                            array.splice(index, 1);
                        }
                    }
                });
            }
        }

        public connect(): Connector {
            if (this._socket?.readyState !== WebSocket.OPEN && this._socket?.readyState !== WebSocket.CONNECTING) {
                this._socket = new WebSocket(this.address);
                this._socket.onopen = ev => this.fireSocketEvent(SocketEventTypes.ONOPEN, ev);
                this._socket.onclose = ev => this.fireSocketEvent(SocketEventTypes.ONCLOSE, ev);
                this._socket.onmessage = ev => {
                    // console.log(ev);

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
            }
            return this;
        }

        public registerProtocolPacketHandler(protocolID: string, packetID: string, handler: Handler): Connector {
            if (!this.protocols.has(protocolID)) {
                this.protocols.set(protocolID, {
                    handlers: new Map<string, Array<Environment.Handler>>()
                });
            }
            const protocol: Protocol = this.protocols.get(protocolID) as Protocol;
            if (!protocol.handlers.has(packetID)) {
                protocol.handlers.set(packetID, new Array<Environment.Handler>());
            }
            protocol.handlers.get(packetID)?.push(handler);
            return this;
        }

        public registerProtocolPacketHandlerOnCurrentProtocol(packetID: string, handler: Handler): Connector {
            return this.registerProtocolPacketHandler(this.protocol, packetID, handler);
        }

        public getCurrentProtocol(): Protocol {
            return this.protocols.get(this.protocol) as Protocol;
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

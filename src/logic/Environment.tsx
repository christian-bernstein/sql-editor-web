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

    export enum SocketShutdownReason {
        DEPLETION = ("DEPLETION"),
        CORE_SHUTDOWN = ("CORE_SHUTDOWN")
    }

    export type SocketClosingPacketData = {
        activateReconnectLock: boolean,
        reason: SocketShutdownReason
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
        id: string,
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

    export type ConnectorConfig = {
        maxConnectAttempts: number,
        protocol: string,
        address: string,
        id: string
    }

    export class Connector {

        private static connectors: Array<Connector> = new Array<Environment.Connector>();

        public static useConnector(id: string, factory: () => Connector): Connector {
            const filter: Array<Connector> = Connector.connectors.filter(value => value.config.id === id);
            if (filter.length === 0) {
                // No connector found, create new one
                const connector: Connector = factory();
                Connector.connectors.push(connector)
                return connector;
            } else {
                return filter[0];
            }
        }

        public static coreProtocol: Protocol = {
            id: "core",
            handlers: new Map<string, Array<Environment.Handler>>([
                ["SocketClosingPacketData", new Array<Environment.Handler>({
                    handle: (connector, packet) => {
                        const data: SocketClosingPacketData = packet.data as SocketClosingPacketData;
                        // If the server wants to stop any attempt of automatic reconnection,
                        // Set reconnect lock to true
                        console.log("set the lock to: " + data.activateReconnectLock);
                        connector.reconnectLock = data.activateReconnectLock;
                    }
                })]
            ])
        }

        private readonly _baseProtocols: Array<Protocol> = new Array<Environment.Protocol>(Connector.coreProtocol);

        private _socket: WebSocket | undefined;

        private _protocols: Map<string, Protocol> = new Map<string, Environment.Protocol>();

        private _responseMap: Map<string, Handler> = new Map<string, Handler>();

        private _currentProtocol: string;

        private config: ConnectorConfig;

        // todo reconnect lock
        private _reconnectLock: boolean;

        private connectionAttempts: number;

        private readonly socketEventHandlers: Map<SocketEventTypes, Array<SocketEventHandler>> = new Map<SocketEventTypes, Array<SocketEventHandler>>([
            [SocketEventTypes.ONOPEN, new Array<SocketEventHandler>()]
        ]);

        constructor(config: ConnectorConfig) {
            this.config = config;
            this._reconnectLock = false;
            this.connectionAttempts = 0;
            this._currentProtocol = config.protocol;
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

        public connect(reconnect: boolean = false): Connector {
            if (this._socket?.readyState !== WebSocket.OPEN && this._socket?.readyState !== WebSocket.CONNECTING) {
                this._socket = new WebSocket(this.config.address);
                this._socket.onopen = ev => {
                    // Reset variables
                    this.connectionAttempts = 0;
                    this._reconnectLock = false;
                    // Fire 'open' event
                    this.fireSocketEvent(SocketEventTypes.ONOPEN, ev)
                };
                this._socket.onclose = ev => {
                    this.fireSocketEvent(SocketEventTypes.ONCLOSE, ev)
                    if (this.connectionAttempts < this.config.maxConnectAttempts) {
                        if (!this._reconnectLock){
                            this.connect(true);
                        }
                    }
                };
                this._socket.onmessage = ev => {
                    const packet: Packet = JSON.parse(ev.data) as Packet;
                    if (packet.type === PacketType.RESPONSE) {
                        // It's a return packet
                        const callback: Handler | undefined = this._responseMap.get(packet.id);
                        callback?.handle(this, packet);
                    } else {
                        // It's a singleton or request packet
                        // Call base protocols
                        this.baseProtocols.forEach((protocol: Protocol) => {
                            this.handlePacketForProtocol({
                                packet: packet,
                                protocol: protocol,
                                errorHandler: console.error
                            });
                        })
                        // Call current protocol
                        const protocol: Protocol | undefined = this._protocols.get(this.config.protocol);
                        if (protocol !== undefined) {
                            this.handlePacketForProtocol({
                                packet: packet,
                                protocol: protocol,
                                errorHandler: console.error
                            });
                        }
                    }
                };
            }
            this.connectionAttempts++;
            return this;
        }

        private handlePacketForProtocol(config: {packet: Packet, protocol?: Protocol, errorHandler?: (message?: any, ...optionalParams: any[]) => void}): void {
            if (config.protocol !== undefined) {
                const handlerArray: Array<Handler> | undefined = config.protocol.handlers.get(config.packet.packetID);
                if (handlerArray !== undefined) {
                    for (const value of handlerArray) {
                        try {
                            value.handle(this, config.packet);
                        } catch (e) {
                            config.errorHandler?.(e);
                        }
                    }
                }
            } else {
                console.error()
                config.errorHandler?.(new Error("Protocol cannot be undefined"));
            }
        }

        public registerProtocolPacketHandler(protocolID: string, packetID: string, handler: Handler): Connector {
            if (!this.protocols.has(protocolID)) {
                this.protocols.set(protocolID, {
                    id: protocolID,
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
            return this.registerProtocolPacketHandler(this.config.protocol, packetID, handler);
        }

        public getCurrentProtocol(): Protocol {
            return this.protocols.get(this.config.protocol) as Protocol;
        }

        get baseProtocols(): Array<Environment.Protocol> {
            return this._baseProtocols;
        }

        get currentProtocol(): string {
            return this._currentProtocol;
        }

        set currentProtocol(value: string) {
            this._currentProtocol = value;
        }

        get socket(): WebSocket | undefined {
            return this._socket;
        }

        set socket(value: WebSocket | undefined) {
            this._socket = value;
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

        get reconnectLock(): boolean {
            return this._reconnectLock;
        }

        set reconnectLock(value: boolean) {
            this._reconnectLock = value;
        }
    }
}

import React, {Dispatch, SetStateAction} from "react";
import {v4} from "uuid";
import {ConnectorConfig} from "./network/ConnectorConfig";
import {App} from "./app/App";
import {SocketSwitchProtocolDataPacket} from "../packets/in/SocketSwitchProtocolDataPacket";
import {LatencySnapshot} from "./network/LatencySnapshot";
import {PingPacketData} from "../packets/out/PingPacketData";
import {PongPacketData} from "../packets/in/PongPacketData";
import {getOr} from "./Utils";
import {NetChannelConfig} from "./network/NetChannelConfig";

export namespace Environment {

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

    export interface EnvironmentConstants {
        defaultEnvironmentVisualData: EnvironmentVisualData;
        defaultEnvironmentDebugData: EnvironmentDebugData;
    }

    export const constants: EnvironmentConstants = {
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
        handle: (ev?: Event) => void,
        stator: boolean,
        usagesLeft?: number
    }

    export enum SocketEventTypes {
        ON_OPEN, ON_CLOSE, ON_INBOUND_MESSAGE, ON_OUTBOUND_MESSAGE,


        ON_IN_SINGLETON_MESSAGE, ON_IN_RESPONSE_MESSAGE, ON_IN_CALL_MESSAGE,

        ON_OUT_SINGLETON_MESSAGE, ON_OUT_CALL_MESSAGE, ON_OUT_RESPONSE_MESSAGE
    }

    export class Connector {
        get outboundDelayMS(): number {
            return this._outboundDelayMS;
        }

        set outboundDelayMS(value: number) {
            this._outboundDelayMS = value;
        }
        get inboundDelayMS(): number {
            return this._inboundDelayMS;
        }

        set inboundDelayMS(value: number) {
            this._inboundDelayMS = value;
        }

        get latencyCacheUpdateCallbacks(): Array<(con: Environment.Connector) => void> {
            return this._latencyCacheUpdateCallbacks;
        }
        get latencyRecords(): Array<LatencySnapshot> {
            return this._latencyRecords;
        }

        private static connectors: Array<Connector> = new Array<Environment.Connector>();

        public static useConnector(id: string, factory: () => Connector): Connector {
            const filter: Array<Connector> = Connector.connectors.filter(value => value._config.id === id);
            if (filter.length === 0) {
                // No connector found, create new one
                const connector: Connector = factory();
                Connector.connectors.push(connector)
                return connector;
            } else {
                return filter[0];
            }
        }

        public static readonly coreProtocol: Protocol = {
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
                })],
                ["SocketSwitchProtocolDataPacket", new Array<Environment.Handler>({
                    handle: (connector, packet) => {
                        const data: SocketSwitchProtocolDataPacket = packet.data as SocketSwitchProtocolDataPacket;
                        // todo fire some sort of event
                        console.log(`Switching protocols from '${connector.currentProtocol}' to '${data.newProtocol}'`);
                        connector.currentProtocol = data.newProtocol;

                        connector.protocolChangeHandlers.forEach(handler => {
                            try {
                                handler(connector, data);
                            } catch (e) {
                                App.app().baseLog({
                                    id: v4(),
                                    appendices: [e, handler],
                                    timestamp: new Date(),
                                    level: "ERROR",
                                    creator: "network",
                                    message: `Exception in protocol change handler.`
                                })
                            }
                        });
                    }
                })]
            ])
        }

        private readonly _baseProtocols: Array<Protocol> = new Array<Environment.Protocol>(Connector.coreProtocol);

        private readonly socketEventHandlers: Map<SocketEventTypes, Array<SocketEventHandler>> = new Map<SocketEventTypes, Array<SocketEventHandler>>([
            [SocketEventTypes.ON_OPEN, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_CLOSE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_INBOUND_MESSAGE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_OUTBOUND_MESSAGE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_OUT_SINGLETON_MESSAGE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_OUT_CALL_MESSAGE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_OUT_RESPONSE_MESSAGE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_IN_SINGLETON_MESSAGE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_OUT_CALL_MESSAGE, new Array<SocketEventHandler>()],
            [SocketEventTypes.ON_IN_RESPONSE_MESSAGE, new Array<SocketEventHandler>()],

        ]);

        private readonly netChannelConfigs: Map<string, NetChannelConfig> = new Map<string, NetChannelConfig>();

        private readonly _config: ConnectorConfig;

        private readonly _latencyRecords: Array<LatencySnapshot>;

        private readonly _latencyCacheUpdateCallbacks: Array<(con: Connector) => void>

        private _inboundDelayMS: number;

        private _outboundDelayMS: number;

        private _socket: WebSocket | undefined;

        private protocolChangeHandlers: Map<string, (connector: Environment.Connector, switchData: SocketSwitchProtocolDataPacket) => void> = new Map<string, (connector: Environment.Connector, switchData: SocketSwitchProtocolDataPacket) => void>();

        private _protocols: Map<string, Protocol> = new Map<string, Environment.Protocol>();

        private _responseMap: Map<string, Handler> = new Map<string, Handler>();

        private _reconnectLock: boolean;

        private _currentProtocol: string;

        private _connectionAttempts: number;

        private latencyRecordTimeout: any

        constructor(config: ConnectorConfig) {
            this._config = config;
            this._reconnectLock = false;
            this._connectionAttempts = 0;
            this._currentProtocol = config.protocol;
            this._latencyRecords = new Array<LatencySnapshot>();
            this._latencyCacheUpdateCallbacks = new Array<(con: Environment.Connector) => void>();
            this._inboundDelayMS = 0;
            this._outboundDelayMS = 0;
            Connector.connectors.push(this);
            this.init();
        }

        public stop() {
            if (this.latencyRecordTimeout !== undefined) {
                clearInterval(this.latencyRecordTimeout);
            }
        }

        private init() {
            if (getOr(this.config.recordLatency, true)) {
                this.latencyRecordTimeout = setInterval(() => {
                    this.call({
                        protocol: "core",
                        packetID: "PingPacketData",
                        data: {
                            outboundTimestamp: Date.now()
                        } as PingPacketData,
                        callback: {
                            handle: (connector1, packet) => {
                                const pong: PongPacketData = packet.data as PongPacketData;
                                // todo fix... negative latency shouldn't be a thing c.c
                                // const latency = Math.max(0, pong.inboundTimestamp - pong.outboundTimestamp);
                                const latency = pong.outboundTimestamp - pong.inboundTimestamp;
                                this.latencyRecords.push({
                                    latency: latency,
                                    timestamp: new Date()
                                });
                                if (this.latencyRecords.length > getOr(this.config.latencyRecordCacheSize, 30)) {
                                    this.latencyRecords.splice(0, 1);
                                }
                                this._latencyCacheUpdateCallbacks.forEach(callback => callback(this));
                            }
                        }
                    });
                }, getOr(this.config.pingInterval, 1500))
            }
        }

        public getLatestLatencyRecord(): LatencySnapshot | undefined {
            return this.latencyRecords.length > 0 ? this.latencyRecords[this.latencyRecords.length - 1] : undefined;
        }

        public registerOnProtocolChangeHandler(id: string, handler: (connector: Environment.Connector, switchData: SocketSwitchProtocolDataPacket) => void) {
            if (this.protocolChangeHandlers.has(id)) {
                return;
            }
            this.protocolChangeHandlers.set(id, handler);
        }

        public unregisterOnProtocolChangeHandler(id: string) {
            this.protocolChangeHandlers.delete(id);
        }

        public requestServersideShutdownRoutine(): Connector {
            this.singleton({
                protocol: "core",
                data: {},
                packetID: "SocketClientShutdownRequestPacketData"
            });
            return this;
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

                this.fireSocketEvent(SocketEventTypes.ON_OUTBOUND_MESSAGE, undefined);
            } else {
                // Websocket is still loading
                try {
                    this.registerSocketEventHandler(SocketEventTypes.ON_OPEN, {
                        stator: false,
                        handle: ev => {
                            (ev?.target as WebSocket).send(payload);

                            this.fireSocketEvent(SocketEventTypes.ON_OUTBOUND_MESSAGE, undefined);
                        }
                    });
                } catch (err) {
                    console.error(err);
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

            this.fireSocketEvent(SocketEventTypes.ON_OUT_SINGLETON_MESSAGE, undefined);

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

            if (this.outboundDelayMS > 0) {
                this.fireSocketEvent(SocketEventTypes.ON_OUT_CALL_MESSAGE, undefined);
                setTimeout(() => {
                    this.baseSend(packet);
                    this._responseMap.set(uuid, config.callback);
                }, this.outboundDelayMS);
            } else {
                this.baseSend(packet);
                this._responseMap.set(uuid, config.callback);
                this.fireSocketEvent(SocketEventTypes.ON_OUT_CALL_MESSAGE, undefined);
            }

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

            this.fireSocketEvent(SocketEventTypes.ON_OUT_RESPONSE_MESSAGE, undefined);

            return this;
        }

        private fireSocketEvent(type: SocketEventTypes, ev?: Event) {
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
            try {
                if (this._socket?.readyState !== WebSocket.OPEN && this._socket?.readyState !== WebSocket.CONNECTING) {
                    this._socket = new WebSocket(this._config.address);
                    this._socket.onopen = ev => {
                        // Reset variables
                        this._connectionAttempts = 0;
                        this._reconnectLock = false;
                        // Fire 'open' event
                        this.fireSocketEvent(SocketEventTypes.ON_OPEN, ev);

                        // todo connector can be used without
                        if (App.isInitiated()) {
                            App.app().rerenderGlobally();
                        }

                    };
                    this._socket.onclose = ev => {
                        this.fireSocketEvent(SocketEventTypes.ON_CLOSE, ev)
                        if (this._connectionAttempts < this._config.maxConnectAttempts) {
                            if (!this._reconnectLock){
                                let timeout: number = 0;
                                try {
                                    timeout = Math.max(this._config.connectionRetryDelayFunc(this._connectionAttempts), 0);
                                } catch (e) {
                                    console.error(e);
                                }
                                setTimeout(() => {
                                    this.connect(true);
                                }, timeout);
                            } else {
                                console.log("Cannot reopen socket, lock is active");
                            }
                        } else {
                            console.error("Socket was unable to connect");
                            this._config.onConnectionFailed?.();
                        }
                    };
                    this._socket.onmessage = ev => {
                        if (this.inboundDelayMS > 0) {
                            setTimeout(() => {
                                this.onMessage(ev);
                            }, this.inboundDelayMS);
                        } else {
                            this.onMessage(ev);
                        }
                    };
                    this._socket.onerror = ev => {
                        this._config.onError?.();
                    }
                    App.app().rerenderGlobally();
                }
            } catch (e) {
                // todo info the client -> console / ui
                // console.error(e);
            }
            this._connectionAttempts++;
            return this;
        }

        private onMessage(ev: MessageEvent) {
            const packet: Packet = JSON.parse(ev.data) as Packet;
            this._config.packetInterceptor(packet, this);
            // console.log(packet)
            // this.fireSocketEvent(SocketEventTypes.ON_INBOUND_MESSAGE, ev);
            if (packet.type === PacketType.RESPONSE) {
                // It's a return packet
                const callback: Handler | undefined = this._responseMap.get(packet.id);
                callback?.handle(this, packet);

                this.fireSocketEvent(SocketEventTypes.ON_IN_RESPONSE_MESSAGE, ev);

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
                // const protocol: Protocol | undefined = this._protocols.get(this._config.protocol);
                const protocol: Protocol | undefined = this._protocols.get(this.currentProtocol);
                if (protocol !== undefined) {
                    this.handlePacketForProtocol({
                        packet: packet,
                        protocol: protocol,
                        errorHandler: console.error
                    });
                } else {
                    console.error(`No protocol instance available: '${this.currentProtocol}'`);
                }

                if (packet.type === PacketType.REQUEST) {
                    this.fireSocketEvent(SocketEventTypes.ON_IN_RESPONSE_MESSAGE, ev);
                } else {
                    this.fireSocketEvent(SocketEventTypes.ON_IN_SINGLETON_MESSAGE, ev);
                }
            }

            this.fireSocketEvent(SocketEventTypes.ON_INBOUND_MESSAGE, ev);
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
            return this.registerProtocolPacketHandler(this._config.protocol, packetID, handler);
        }

        public getCurrentProtocol(): Protocol {
            return this.protocols.get(this._config.protocol) as Protocol;
        }

        get connectionAttempts(): number {
            return this._connectionAttempts;
        }
        get config(): ConnectorConfig {
            return this._config;
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

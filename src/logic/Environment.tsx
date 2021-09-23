import React, {Dispatch, SetStateAction} from "react";
import {v4} from "uuid";

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

        private _socket: WebSocket | undefined;

        private _protocol: string;

        private _responseMap: Map<string, Handler> = new Map<string, Handler>();

        private _protocols: Map<string, Protocol> = new Map<string, Environment.Protocol>();

        private readonly address: string;

        constructor(protocol: string, address: string) {
            this._protocol = protocol;
            this.address = address;
        }

        public singleton(config: {protocol: string, packetID: string, data: object}): Connector {
            const uuid: string = v4();
            const baseSend: () => void = () => {
                this.socket?.send(JSON.stringify({
                    protocol: config.protocol,
                    timestamp: Date,
                    packetID: config.packetID,
                    id: v4(),
                    type: PacketType.REQUEST,
                    data: config.data
                }));
            };
            if (this.socket !== undefined) {
                if (this.socket.readyState === WebSocket.OPEN) {
                    // Websocket is ready, message can be send.
                    baseSend();
                } else if (this.socket.readyState > WebSocket.OPEN) {
                    // Websocket is closing or closed, it may be required to reconnect.
                    this.connect();
                    baseSend();
                }
            } else {
                this.connect();
                baseSend();
            }
            return this;
        }

        public call(config: {protocol: string, packetID: string, data: object, callback: Handler}): Connector {
            const uuid: string = v4();
            this._socket?.send(JSON.stringify({
                protocol: config.protocol,
                timestamp: Date,
                packetID: config.packetID,
                id: v4(),
                type: PacketType.REQUEST,
                data: config.data
            }));
            this._responseMap.set(uuid, config.callback);
            return this;
        }

        public respond(config: {protocol: string, packetID: string, data: object, id: string, callback: Handler}): Connector {
            this._socket?.send(JSON.stringify({
                protocol: config.protocol,
                timestamp: Date,
                packetID: config.packetID,
                id: config.id,
                type: PacketType.REQUEST,
                data: config.data
            }));
            return this;
        }

        public connect(): Connector {
            this._socket = new WebSocket(this.address);
            this._socket.onmessage = ev => {
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

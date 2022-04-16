import {Environment} from "../Environment";
import Packet = Environment.Packet;

export type ConnectorConfig = {
    maxConnectAttempts: number,
    protocol: string,
    address: string,
    id: string,
    connectionRetryDelayFunc: (i: number) => number,
    onConnectionFailed?: () => void,
    packetInterceptor: (packet: Packet, connector: Environment.Connector) => void,
    onError?: () => void,
    ssl?: boolean
}

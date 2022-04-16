import {ConnectorConfig} from "../../logic/network/ConnectorConfig";

export type SocketShardConfig = {
    centralConnectorConfigs: ConnectorConfig[],
    roundRobinOnError: boolean
}

export const def: SocketShardConfig = {
    centralConnectorConfigs: [{
        address: "ws:192.168.2.102:30001",
        id: "central",
        connectionRetryDelayFunc: () => 1,
        maxConnectAttempts: 10,
        protocol: "blanc",
        packetInterceptor: () => {}
    }],
    roundRobinOnError: true
}

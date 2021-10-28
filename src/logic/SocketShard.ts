import {Shard} from "./Shard";
import {SocketShardConfig} from "./SocketShardConfig";
import {Environment} from "./Environment";
import Connector = Environment.Connector;
import {ConnectorConfig} from "./ConnectorConfig";

export class SocketShard extends Shard {

    private config: SocketShardConfig;

    private connectors: Map<string, Connector> = new Map<string, Environment.Connector>();

    constructor(config: SocketShardConfig) {
        super();
        this.config = config;
    }

    public connector(id: string = "central"): Connector | undefined {
        return this.connectors.get(id);
    }
}

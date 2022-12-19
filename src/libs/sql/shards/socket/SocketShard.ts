import {Shard} from "../../../../logic/misc/Shard";
import {SocketShardConfig} from "./SocketShardConfig";
import {Environment} from "../../../../logic/Environment";
import Connector = Environment.Connector;
import {ConnectorConfig} from "../../../../logic/network/ConnectorConfig";

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

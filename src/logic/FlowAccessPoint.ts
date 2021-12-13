import {App} from "./App";
import {FlowResponsePacketData} from "../packets/in/FlowResponsePacketData";

export class FlowAccessPoint {

    private readonly app: App;

    constructor(app: App) {
        this.app = app;
    }

    public call(name: string, parameters: Map<string, any> | undefined = undefined): Promise<FlowResponsePacketData> {
        if (parameters === undefined) {
            parameters = new Map<string, any>();
        }
        return new Promise<FlowResponsePacketData>((resolve, reject) => {
            this.app.connector(connector1 => {
                connector1.call({
                    protocol: "main",
                    packetID: "FlowRequestPacketData",
                    data: {
                        name: name,
                        parameters: parameters
                    },
                    callback: {
                        handle: (connector2, packet) => {
                            resolve(packet.data as FlowResponsePacketData);
                        }
                    }
                });
            })
        });
    }
}

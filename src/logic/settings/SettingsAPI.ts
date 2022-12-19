import {App} from "../app/App";
import {SettingsRequestPacketData} from "../../libs/sql/packets/out/SettingsRequestPacketData";
import {SettingsResponsePacketData} from "../../libs/sql/packets/in/SettingsResponsePacketData";
import {ISettingsAPI} from "./ISettingsAPI";

export class SettingsAPI implements ISettingsAPI {

    public request<T>(...id: Array<string>): Promise<T> {
        const finalID = id.join("-");
        return new Promise<T>((resolve, reject) => {
            App.app().getConnector().call({
                protocol: "base",
                packetID: "SettingsRequestPacketData",
                data: {
                    compoundID: finalID
                } as SettingsRequestPacketData,
                callback: {
                    handle: (connector, packet) => {
                        const data: SettingsResponsePacketData = packet.data;
                        try {
                            console.log(JSON.stringify(data.payload));

                            const obj: T = new Map(Object.entries(data.payload)).get("value");
                            resolve(obj);
                        } catch (e) {
                            // todo return a 'reason'-object
                            reject(e);
                        }
                    }
                }
            });
        });
    }

    public requestCompound<T extends object>(...compoundID: Array<string>): Promise<T> {
        const finalID = compoundID.join("-");
        return new Promise<T>((resolve, reject) => {
            App.app().getConnector().call({
                protocol: "base",
                packetID: "SettingsRequestPacketData",
                data: {
                    compoundID: finalID
                } as SettingsRequestPacketData,
                callback: {
                    handle: (connector, packet) => {
                        const data: SettingsResponsePacketData = packet.data;
                        try {
                            // const obj: T = Object.fromEntries(data.payload) as T;
                            const obj: T = data.payload as T;
                            resolve(obj);
                        } catch (e) {
                            // todo return a 'reason'-object
                            reject(e);
                        }
                    }
                }
            });
        });
    }
}

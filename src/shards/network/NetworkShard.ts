import {Shard} from "../../logic/misc/Shard";
import {NetRequestContext} from "./NetRequestContext";
import {IntrinsicCommandPacketData} from "../../libs/sql/packets/out/IntrinsicCommandPacketData";
import {App} from "../../logic/app/App";
import {SQLCommandUpdateResponsePacketData} from "../../libs/sql/packets/in/SQLCommandUpdateResponsePacketData";
import {SQLCommandQueryResponsePacketData} from "../../libs/sql/packets/in/SQLCommandQueryResponsePacketData";

export class NetworkShard extends Shard {

    public intrinsicSQLUpdate(ctx: NetRequestContext<IntrinsicCommandPacketData, SQLCommandUpdateResponsePacketData>) {
        App.app().connector(async connector => {
            ctx.onStart?.();
            if (ctx.simulateDelay && ctx.simulatedDelay !== undefined) {
                await new Promise(r => setTimeout(r, ctx.simulatedDelay?.()));
            }
            connector.call({
                protocol: "main",
                data: ctx.packet,
                packetID: "IntrinsicCommandPacketData",
                callback: {
                    handle: (con, packet) => {
                        ctx.onBaseCallback?.handle(con, packet);
                        ctx.onCallback?.(packet.data as SQLCommandUpdateResponsePacketData);
                    }
                }
            })
        })
    }

    public intrinsicSQLQuery(ctx: NetRequestContext<IntrinsicCommandPacketData, SQLCommandQueryResponsePacketData>) {
        App.app().connector(async connector => {
            ctx.onStart?.();
            if (ctx.simulateDelay && ctx.simulatedDelay !== undefined) {
                await new Promise(r => setTimeout(r, ctx.simulatedDelay?.()));
            }
            connector.call({
                protocol: "main",
                data: ctx.packet,
                packetID: "IntrinsicCommandPacketData",
                callback: {
                    handle: (con, packet) => {
                        ctx.onBaseCallback?.handle(con, packet);
                        ctx.onCallback?.(packet.data as SQLCommandQueryResponsePacketData);
                    }
                }
            })
        })
    }
}

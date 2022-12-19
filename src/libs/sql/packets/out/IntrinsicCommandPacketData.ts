import {SessionCommandType} from "../../../../logic/data/SessionCommandType";

export type IntrinsicCommandPacketData = {
    type: SessionCommandType,
    raw: string,
    attributes: Map<string, string>,
    dbID: string
}

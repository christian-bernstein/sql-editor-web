import {Client} from "../../../../logic/data/Client";
import {Column} from "../../../../logic/data/Column";
import {EditorCommandError} from "../../pages/editor/EditorCommandError";

export type SQLCommandUpdateResponsePacketData = {
    sql: string,
    databaseID: string,
    success: boolean,
    errormessage: string,
    client: Client,
    timestamp: Date,
    error?: EditorCommandError,
    durationMS: number,
    code: number
    affected: number
}

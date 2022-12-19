import {Client} from "../../logic/data/Client";
import {Column} from "../../logic/data/Column";
import {EditorCommandError} from "../../pages/editor/EditorCommandError";

export type SQLCommandQueryResponsePacketData = {
    sql: string,
    databaseID: string,
    success: boolean,
    errormessage: string,
    client: Client,
    rows: Map<string, any>[],
    columns: Column[],
    timestamp: Date,
    error?: EditorCommandError,
    durationMS: number
}

import {Client} from "../../../../logic/data/Client";
import {SerializedException} from "../../../../logic/misc/SerializedException";

export type EditorCommandError = {
    message: string,
    timestamp: Date,
    title: string,
    success: boolean,
    commandType: "PULL" | "PUSH",
    data: Map<string, any>,
    id: string,
    client: Client,
    exceptions: SerializedException[]
}

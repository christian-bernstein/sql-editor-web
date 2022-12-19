import {Client} from "../../logic/data/Client";

export type HistoryEntry = {
    id: string,
    type: string,
    staticData: Map<string, any>,
    dynamicData: Map<string, any>,
    client: Client,
    title: string,
    timestamp: Date,
    status: "SUCCESS" | "ERROR" | "RUNNING",
}

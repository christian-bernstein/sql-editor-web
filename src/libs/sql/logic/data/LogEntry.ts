import {LogEntryAppendix} from "./LogEntryAppendix";

export type LogEntry = {
    level: "ERROR" | "INFO" | "DEBUG" | "TRACE" | "SEVERE" | "WARN",
    id: string,
    timestamp: Date,
    message: string,
    creator: string,
    appendices: LogEntryAppendix[]
}

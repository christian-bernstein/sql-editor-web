import {Attributed} from "../misc/Attributed";
import {SessionCommandType} from "./SessionCommandType";

export type SessionCommand = Attributed<string> & {
    raw: string,
    type: SessionCommandType
}

import {Attributed} from "../Attributed";
import {SessionCommandType} from "./SessionCommandType";

export type SessionCommand = Attributed<string> & {
    raw: string,
    type: SessionCommandType
}

import {Attributed} from "../Attributed";

export type SessionCommand = Attributed<string> & {
    raw: string,
    type: string
}

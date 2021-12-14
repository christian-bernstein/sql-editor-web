import {Attributed} from "./Attributed";

export type TaskPiece = Attributed<any> & {
    title: string,
    description: string,
    renderer: string
}

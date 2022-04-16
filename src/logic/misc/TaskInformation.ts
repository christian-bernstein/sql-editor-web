import {Attributed} from "./Attributed";
import {TaskPiece} from "./TaskPiece";

export type TaskInformation = Attributed<any> & {
    id: string,
    title: string,
    description: string,
    pieces: Array<TaskPiece>,
    renderer: string
}

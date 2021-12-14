import {TaskSpecific} from "./TaskSpecific";
import {Attributed} from "./Attributed";

export type TaskInformation = TaskSpecific & Attributed<any> & {
    title: string,
    description: string,
    currentPosition: number
    renderer: string
}

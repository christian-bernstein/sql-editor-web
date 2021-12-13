import {LoadState} from "./LoadState";

export type ProjectInfoData = {
    title: string,
    state: LoadState,
    stator: boolean,
    // contributorIDs: Array<string>,
    lastEdited: Date,
    rows: number,
    edits: number
}

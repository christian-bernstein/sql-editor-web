import {LoadState} from "./LoadState";

export type ProjectInfoData = {
    id: string,
    title: string,
    state: LoadState,
    stator: boolean,
    // contributorIDs: Array<string>,
    creatorUserID: string,
    lastEdited: Date,
    description: string
    // rows: number,
    edits: number
}

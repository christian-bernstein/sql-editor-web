import {LoadState} from "../misc/LoadState";

export type ProjectInfoData = {
    id: string,
    title: string,
    state: LoadState,
    stator: boolean,
    // contributorIDs: Array<string>,
    creatorUserID: string,
    lastEdited: Date,
    description: string
    edits: number,
    internalTags: string[]
}

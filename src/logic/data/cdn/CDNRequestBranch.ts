import {Attributed} from "../../Attributed";

export type CDNRequestBranch = Attributed<any> & {
    branch: string,
    accessToken?: string,
    targetID?: string,
    requestID?: string
}

import {Attributed} from "../../misc/Attributed";

export type CDNRequestBranch = Attributed<any> & {
    branch: string,
    accessToken?: string,
    targetID?: string,
    requestID?: string
}

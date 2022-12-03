import {IconLookup} from "../icons/IconLookup";

export type AtlasEntity = {
    creationDate?: string,
    title?: string,
    description?: string,
    creator?: string,
    tags?: Array<string>,
    note?: string,
    iconColorHEX?: string
    icon?: IconLookup,
}

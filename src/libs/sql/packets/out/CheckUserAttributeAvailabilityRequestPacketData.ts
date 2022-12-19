import {UserAttributeType} from "../../logic/data/UserAttributeType";

export type CheckUserAttributeAvailabilityRequestPacketData = {
    type: UserAttributeType,
    attribute: string
}

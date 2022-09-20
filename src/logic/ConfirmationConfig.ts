import {VM} from "./style/ObjectVisualMeaning";
import {BC} from "./BernieComponent";

export enum ConfirmationType {
    CONFIRM_OR_CANCEL,
    CONFIRM_ONLY
}

export interface ConfirmationActions {
    onConfirm(component: BC<any, any, any>): void,
    onCancel(component: BC<any, any, any>): void
}

export type ConfirmationConfig = {
    title: string,
    description: string,
    text?: string,
    vm: VM,
    actions: ConfirmationActions,
    type: ConfirmationType
}

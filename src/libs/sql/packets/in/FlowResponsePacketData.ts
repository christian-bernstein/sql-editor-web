import {FlowExecutionResultType} from "../../../../logic/misc/FlowExecutionResultType";

// todo make exception not any
export type FlowResponsePacketData = {
    results: Map<string, any>,
    type: FlowExecutionResultType,
    exception: any
}

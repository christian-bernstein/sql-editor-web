import {GloriaCommandDefinition} from "./GloriaCommandDefinition";
import {Gloria} from "./Gloria";

export type GloriaCommandExecutorContext = {
    parameter: any,
    arguments: Map<string, string>,
    gloria: Gloria,
    definition: GloriaCommandDefinition
}

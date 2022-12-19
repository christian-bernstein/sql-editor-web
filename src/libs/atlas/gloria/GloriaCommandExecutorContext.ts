import {GloriaCommandDefinition} from "./GloriaCommandDefinition";
import {Gloria} from "./Gloria";
import {GenericBC} from "../../sql/logic/BernieComponent";

export type GloriaCommandExecutorContext = {
    parameter: any,
    arguments: Map<string, string>,
    gloria: Gloria,
    definition: GloriaCommandDefinition,
    dialogEntry: GenericBC | undefined
}

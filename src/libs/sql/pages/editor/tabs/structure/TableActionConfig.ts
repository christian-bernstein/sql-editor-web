import {StructureTab} from "./StructureTab";
import NumberRange from "../../../../../../logic/data/NumberRange";

export type TableActionConfig = {
    actionButtonRenderer: (instance: StructureTab, config: TableActionConfig) => JSX.Element,
    allowedRange?: NumberRange,
    run: (instance: StructureTab, tables: Array<string>) => void
}

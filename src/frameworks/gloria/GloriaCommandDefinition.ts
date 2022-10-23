import {GloriaDataSupplier} from "./GloriaDataSupplier";
import {GloriaCommandExecutor} from "./GloriaCommandExecutor";

export type GloriaCommandDefinition = {
    id: string,
    title: GloriaDataSupplier<string>,
    executor: GloriaCommandExecutor
} & Partial<{
    description: GloriaDataSupplier<string>,
}>

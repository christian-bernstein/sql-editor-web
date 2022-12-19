import {GloriaCommandExecutorContext} from "./GloriaCommandExecutorContext";

export type GloriaCommandExecutor = (ctx: GloriaCommandExecutorContext) => Promise<any>

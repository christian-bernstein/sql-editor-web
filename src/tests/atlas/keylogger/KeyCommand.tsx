import {CommandOrchestratorContext} from "./CommandOrchestratorContext";
import {CommandOrchestrator} from "./CommandOrchestrator";
import {KeyCommandOption} from "./KeyCommandOption";

export type KeyCommand = {
    initKey: string,
    title: string,
    helpText: string,
    keyHintGenerator: (cache: Array<string>) => Array<string>,
    executor?: (ctx: CommandOrchestratorContext, orchestrator: CommandOrchestrator) => Promise<void>
    keyOptionsGenerator?: (ctx: CommandOrchestratorContext) => Array<KeyCommandOption>,
}

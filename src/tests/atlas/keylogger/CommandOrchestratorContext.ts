import {CommandOrchestrationActionMode} from "./CommandOrchestrationActionMode";
import {CommandOrchestrationFinishState} from "./CommandOrchestrationFinishState";

export type CommandOrchestratorContext = {
    command?: string,
    parameters: Array<string>,
    mode: CommandOrchestrationActionMode,
    finishState?: CommandOrchestrationFinishState

}

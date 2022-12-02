import {CommandOrchestrationActionMode} from "./CommandOrchestrationActionMode";
import {CommandOrchestrationFinishState} from "./CommandOrchestrationFinishState";
import {KeyCommand} from "./KeyCommand";

export type CommandOrchestratorContext = {
    command?: string,
    parameters: Array<string>,
    mode: CommandOrchestrationActionMode,
    finishState?: CommandOrchestrationFinishState
    keyCommand?: KeyCommand,
    selectedOptionIndex: number
}

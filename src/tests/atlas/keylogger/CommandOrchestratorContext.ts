import {CommandOrchestrationActionMode} from "./CommandOrchestrationActionMode";

export type CommandOrchestratorContext = {
    command?: string,
    parameters: Array<string>,
    mode: CommandOrchestrationActionMode

}
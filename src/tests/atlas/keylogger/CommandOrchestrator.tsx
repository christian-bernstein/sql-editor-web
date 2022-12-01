import {KeyCommand} from "./KeyCommand";
import {CommandOrchestratorContext} from "./CommandOrchestratorContext";
import {CommandOrchestrationActionMode} from "./CommandOrchestrationActionMode";

export class CommandOrchestrator {

    private keyCommands: Array<KeyCommand> = [];

    private context?: CommandOrchestratorContext;

    private contextUpdateSubscribers: Array<Subscriber> = [];

    public registerCommand(...keyCommand: Array<KeyCommand>) {
        this.keyCommands.push(...keyCommand);
    }

    public engage() {
        this.context = {
            parameters: [],
            mode: CommandOrchestrationActionMode.NONE
        }
        this.triggerContextUpdate();
    }

    public disengage() {
        // Execute function


        // Reset context
        this.context = undefined;
        this.triggerContextUpdate();
    }

    public subscribe(subscriber: Subscriber) {
        this.contextUpdateSubscribers.push(subscriber);
    }

    private triggerContextUpdate() {
        this.contextUpdateSubscribers.forEach(sub => sub(this.context, this));
    }
}

type Subscriber = (ctx: CommandOrchestratorContext | undefined, orchestrator: CommandOrchestrator) => void;
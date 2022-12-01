import {KeyCommand} from "./KeyCommand";
import {CommandOrchestratorContext} from "./CommandOrchestratorContext";
import {CommandOrchestrationActionMode} from "./CommandOrchestrationActionMode";
import {IUpdater} from "../utils/IUpdater";

export class CommandOrchestrator {

    private keyCommands: Array<KeyCommand> = [];

    private context?: CommandOrchestratorContext;

    private contextUpdateSubscribers: Array<Subscriber> = [];

    public registerCommand(...keyCommand: Array<KeyCommand>) {
        this.keyCommands.push(...keyCommand);
    }

    public isEngaged(): boolean {
        return this.context !== undefined;
    }

    public engage() {
        console.log("engage")
        this.triggerContextUpdate(() => ({
            parameters: [],
            mode: CommandOrchestrationActionMode.NONE
        }));
    }

    public disengage() {
        console.log("disengage")
        // Execute function


        // Reset context
        this.triggerContextUpdate(ctx => undefined);
    }

    public appendKey(key: string) {
        if (!this.isEngaged()) return;
        if (this.context?.command === undefined) {
            this.context!!.command = key;
        } else {
            this.context.parameters.push(key);
        }
    }

    public subscribe(subscriber: Subscriber) {
        this.contextUpdateSubscribers.push(subscriber);
    }

    private triggerContextUpdate(updater: (ctx: CommandOrchestratorContext | undefined) => CommandOrchestratorContext | undefined) {
        const prev = structuredClone(this.context);
        this.context = updater(this.context);
        this.contextUpdateSubscribers.forEach(sub => sub(prev, this.context, this));
    }
}

type Subscriber = (fromCtx: CommandOrchestratorContext | undefined, toCtx: CommandOrchestratorContext | undefined, orchestrator: CommandOrchestrator) => void;
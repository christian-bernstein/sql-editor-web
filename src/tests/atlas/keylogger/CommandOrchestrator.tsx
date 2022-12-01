import {KeyCommand} from "./KeyCommand";
import {CommandOrchestratorContext} from "./CommandOrchestratorContext";
import {CommandOrchestrationActionMode} from "./CommandOrchestrationActionMode";
import {CommandOrchestrationFinishState} from "./CommandOrchestrationFinishState";

export class CommandOrchestrator {

    private readonly keyCommands: Array<KeyCommand> = [];

    private _context?: CommandOrchestratorContext;

    private contextUpdateSubscribers: Array<Subscriber> = [];

    public registerCommand(...keyCommand: Array<KeyCommand>) {
        this.keyCommands.push(...keyCommand);
    }

    public isEngaged(): boolean {
        return this._context !== undefined;
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
        const reset = () => this.triggerContextUpdate(ctx => undefined);
        const command = this.getMatchingCommand();
        if (command !== undefined && command.executor !== undefined) {
            this.triggerContextUpdate(ctx => {
                if (ctx === undefined) return ctx;
                ctx.mode = CommandOrchestrationActionMode.EXECUTING;
                return ctx;
            })
            command.executor(this.context as CommandOrchestratorContext, this).then(r => {
                // Command execution completed successfully / .resolve()
                this.triggerContextUpdate(ctx => {
                    if (ctx === undefined) return ctx;
                    ctx.mode = CommandOrchestrationActionMode.FINISHED;
                    ctx.finishState = CommandOrchestrationFinishState.SUCCESS;
                    return ctx;
                });
            }).catch(reason => {
                // Command execution completed with error / .rejected()
                this.triggerContextUpdate(ctx => {
                    if (ctx === undefined) return ctx;
                    ctx.mode = CommandOrchestrationActionMode.FINISHED;
                    ctx.finishState = CommandOrchestrationFinishState.ERROR;
                    return ctx;
                });
            }).finally(() => {
                if (this.context?.finishState === CommandOrchestrationFinishState.ERROR) {
                    setTimeout(() => reset(), 1500);
                } else {
                    setTimeout(() => reset(), 500);
                }
            });
        } else reset();
    }

    public appendKey(key: string) {
        if (!this.isEngaged()) {
            console.warn("append-key called, but orchestrator is not engaged")
        }

        this.triggerContextUpdate(ctx => {
            if (ctx?.command === undefined) {
                ctx!!.command = key;
            } else {
                ctx.parameters.push(key);
            }
            return ctx;
        });
    }

    public getMatchingCommand(): KeyCommand | undefined {
        if (!this.isEngaged() || this.context === undefined) return undefined;
        return this.keyCommands.filter(kc => kc.initKey === this.context?.command)[0] ?? undefined;
    }

    public deleteKey() {
        if (!this.isEngaged()) {
            console.warn("append-key called, but orchestrator is not engaged")
        }
        this.triggerContextUpdate(ctx => {
            if (ctx !== undefined) {
                if (ctx!!.parameters.length > 0) {
                    ctx.parameters.pop()
                } else {
                    ctx.command = undefined;
                }
            }
            return ctx;
        });
    }

    public subscribe(subscriber: Subscriber) {
        this.contextUpdateSubscribers.push(subscriber);
    }

    private triggerContextUpdate(updater: (ctx: CommandOrchestratorContext | undefined) => CommandOrchestratorContext | undefined) {
        console.warn("triggerContextUpdate");
        const prev = structuredClone(this._context);
        this._context = updater(this._context);
        this.contextUpdateSubscribers.forEach(sub => sub(prev, this._context, this));
    }

    get context(): CommandOrchestratorContext | undefined {
        return this._context;
    }
}

type Subscriber = (fromCtx: CommandOrchestratorContext | undefined, toCtx: CommandOrchestratorContext | undefined, orchestrator: CommandOrchestrator) => void;

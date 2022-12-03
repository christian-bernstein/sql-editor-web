import {KeyCommand} from "./KeyCommand";
import {CommandOrchestratorContext} from "./CommandOrchestratorContext";
import {CommandOrchestrationActionMode} from "./CommandOrchestrationActionMode";
import {CommandOrchestrationFinishState} from "./CommandOrchestrationFinishState";
import {KeyCommandOption} from "./KeyCommandOption";
import {KeyCommandHintUpdateOptions} from "./KeyCommandHintUpdateOptions";

export class CommandOrchestrator {

    public static readonly OPTION_INDEX_UPDATE_CHANNEL = "key-command-hint-option-index";

    private readonly keyCommands: Array<KeyCommand> = [];

    private _context?: CommandOrchestratorContext;

    private contextUpdateSubscribers: Array<Subscriber> = [];

    public registerCommand(...keyCommand: Array<KeyCommand>) {
        this.keyCommands.push(...keyCommand);
    }

    public isEngaged(): boolean {
        return this._context !== undefined;
    }

    public moveOptionIndex(delta: number) {
        if (!this.isEngaged()) return;
        const command: KeyCommand = this.getMatchingCommand() as KeyCommand;
        const ctx: CommandOrchestratorContext = this.context as CommandOrchestratorContext;
        const options: KeyCommandOption[] = command.keyOptionsGenerator?.(ctx) ?? [];
        let nI = ctx.selectedOptionIndex + delta;
        if (nI < 0) nI = 0;
        if (nI >= options.length) nI = options.length - 1;
        if (ctx.selectedOptionIndex !== nI) {
            this.triggerContextUpdate((ctxU) => {
                if (ctxU === undefined) return ctxU;
                ctxU.selectedOptionIndex = nI;
                return ctxU;
            }, {
                useChannelizedRerender: true,
                channels: [CommandOrchestrator.OPTION_INDEX_UPDATE_CHANNEL]
            });
        }
    }

    public engage() {
        console.log("engage")
        this.triggerContextUpdate(() => ({
            parameters: [],
            mode: CommandOrchestrationActionMode.NONE,
            selectedOptionIndex: 0
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
                    // setTimeout(() => reset(), 500);
                    reset();
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
                ctx!!.keyCommand = this.getMatchingCommand();
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
                    ctx.keyCommand = undefined;
                }
            }
            return ctx;
        });
    }

    public subscribe(subscriber: Subscriber) {
        this.contextUpdateSubscribers.push(subscriber);
    }

    private triggerContextUpdate(updater: (ctx: CommandOrchestratorContext | undefined) => CommandOrchestratorContext | undefined, rerenderOptions: KeyCommandHintUpdateOptions = {
        useChannelizedRerender: false,
        channels: []
    }) {
        const prev: CommandOrchestratorContext | undefined = this._context === undefined ? undefined : {...this._context};
        this._context = updater(this._context);
        this.contextUpdateSubscribers.forEach(sub => sub(prev, this._context, this, rerenderOptions));
    }

    get context(): CommandOrchestratorContext | undefined {
        return this._context;
    }
}

type Subscriber = (fromCtx: CommandOrchestratorContext | undefined, toCtx: CommandOrchestratorContext | undefined, orchestrator: CommandOrchestrator, options: KeyCommandHintUpdateOptions) => void;

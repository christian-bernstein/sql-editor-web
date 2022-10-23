import {GloriaCommandDefinition} from "./GloriaCommandDefinition";

export class Gloria {

    private readonly _commands: Array<GloriaCommandDefinition> = new Array<GloriaCommandDefinition>();

    public registerCommand(definition: GloriaCommandDefinition): Gloria {
        // TODO definition already present: return
        this._commands.push(definition);
        return this;
    }

    public run(id: string, args?: Map<string, string>, parameter?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const cd = this.commands.filter(cd => cd.id === id)[0];
            if (cd === undefined) reject();
            try {
                const result: any = await cd.executor({
                    gloria: this,
                    arguments: args ?? new Map<string, string>(),
                    parameter: parameter,
                    definition: cd
                });
                resolve(result);
            } catch (e) {
                console.error("Error while executing command", e);
                reject();
            }
        });
    }

    get commands(): Array<GloriaCommandDefinition> {
        return this._commands;
    }
}

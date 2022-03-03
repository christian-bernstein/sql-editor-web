import {AssemblyRequest} from "./AssemblyRequest";
import React from "react";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "./App";

export class Assembly {

    private readonly _components: Map<string, (theme: Themeable.Theme, props: any) => JSX.Element> = new Map<string, (theme: Themeable.Theme, props: any) => JSX.Element>();

    public assembly(component: string, factory: (theme: Themeable.Theme, props: any) => JSX.Element): Assembly {
        this._components.set(component, factory);
        return this;
    }

    public liteRender(component: string): JSX.Element {
        return this.render({
            component: component
        });
    }

    public render(request: AssemblyRequest): JSX.Element {
        if (!this._components.has(request.component)) {
            const e: Error = new Error(`Assembly line ${request.component} doesn't exist.`);
            if (request.errorComponent) {
                return request.errorComponent(e);
            } else {
                return (
                    <p>
                        {e.message}
                    </p>
                );
            }
        } else {
            try {
                return (this._components.get(request.component) as (theme: Themeable.Theme, props: any) => JSX.Element)(utilizeGlobalTheme(), request.param);
            } catch (e) {
                return (
                    <p>
                        {e.message}
                    </p>
                );
            }
        }
    }

    get components(): Map<string, (theme: Themeable.Theme, props: any) => JSX.Element> {
        return this._components;
    }
}

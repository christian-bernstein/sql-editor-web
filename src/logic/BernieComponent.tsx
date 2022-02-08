import React from "react";
import {cs, State} from "./state/State";
import {RenderController} from "../tests/regex/RenderController";
import {RenderExecutor} from "../tests/regex/RenderExecutor";
import {v4} from "uuid";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "./App";
import {Redirect} from "react-router-dom";
import {getOr} from "./Utils";

export class BernieComponent<RProps, RState, LState extends object> extends React.Component<RProps, RState> {

    private readonly _local: State<LState>;

    private readonly _controller: RenderController;

    private redirectTo: string | undefined;

    private redirect: boolean;

    constructor(props: RProps, state: RState, local: LState) {
        super(props);
        this.state = state;
        this._local = cs(local);
        this._controller = new RenderController();
        this.redirectTo = undefined;
        this.redirect = false;
    }

    get local(): State<LState> {
        return this._local;
    }

    get controller(): RenderController {
        return this._controller;
    }

    public _component(channels: string[], renderFactory: (state: State<LState>) => JSX.Element): JSX.Element {
        return this.component(renderFactory, ...channels);
    }

    public component(renderFactory: (state: State<LState>) => JSX.Element, ...channels: string[]): JSX.Element {
        return (
            <RenderExecutor
                id={v4()}
                componentFactory={() => renderFactory(this.local)}
                channels={channels}
                componentDidMountRelay={bridge => this.controller.register(bridge)}
            />
        );
    }

    public goto(to: string, callback?: () => void) {
        this.redirectTo = to;
        this.redirect = true;
        this.forceUpdate(callback);
    }

    public renderRedirect(): JSX.Element {
        if (this.redirect && this.redirectTo) {
            return (
                <Redirect to={this.redirectTo} push/>
            );
        } else return <></>;
    }

    public componentRender(p: RProps, s: RState, l: LState, t: Themeable.Theme): JSX.Element | undefined {
        return undefined;
    }

    render() {
        if (this.redirect) {
            return this.renderRedirect();
        } else {
            return this.componentRender(
                this.props,
                this.state,
                this.local.state,
                utilizeGlobalTheme()
            );
        }
    }
}

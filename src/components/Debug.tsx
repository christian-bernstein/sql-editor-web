import {BernieComponent} from "../logic/BernieComponent";
import {If} from "./If";
import {App} from "../logic/App";
import {Assembly} from "../logic/Assembly";
import {Themeable} from "../Themeable";
import React from "react";

export class Debug extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <If condition={App.app().config.debugMode} ifTrue={
                <>{this.props.children}</>
            }/>
        );
    }
}

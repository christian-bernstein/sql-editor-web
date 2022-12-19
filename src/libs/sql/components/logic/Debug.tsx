import {BernieComponent} from "../../logic/BernieComponent";
import {If} from "./If";
import {App} from "../../logic/app/App";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
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

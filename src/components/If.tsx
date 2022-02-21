import React from "react";
import {BernieComponent} from "../logic/BernieComponent";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {getOr} from "../logic/Utils";
import {App} from "../logic/App";

export type IfProps = {
    condition: boolean,
    ifTrue?: JSX.Element,
    ifTrueGen?: () => JSX.Element,
    ifFalse?: JSX.Element,
    ifFalseGen?: () => JSX.Element,
}

export class If extends BernieComponent<IfProps, any, any> {

    private static loadElement(ifVal?: JSX.Element, ifGen?: () => JSX.Element): JSX.Element | undefined {
        if (ifVal !== undefined) {
            return ifVal;
        }
        ifGen?.();
    }

    componentRender(p: IfProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.condition) {
            return getOr(If.loadElement(p.ifTrue, p.ifTrueGen), <></>);
        } else {
            return getOr(If.loadElement(p.ifFalse, p.ifFalseGen), <></>);
        }
    }
}

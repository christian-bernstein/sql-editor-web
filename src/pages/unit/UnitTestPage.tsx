import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React from "react";
import {DatabaseScriptingTab} from "../editor/tabs/scripting/DatabaseScriptingTab";

export class UnitTestPage extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return <DatabaseScriptingTab />
    }
}

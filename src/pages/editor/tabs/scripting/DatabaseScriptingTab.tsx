import {BernieComponent} from "../../../../logic/BernieComponent";
import {ProjectInfoData} from "../../../../logic/data/ProjectInfoData";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {Text} from "../../../../components/lo/Text";
import {DimensionalMeasured, percent} from "../../../../logic/style/DimensionalMeasured";
import {Screen} from "../../../../components/lo/Page";
import {Centered} from "../../../../components/lo/PosInCenter";
import Editor from "@monaco-editor/react";
import {FormDataHub} from "../../../../tests/epicure/components/FormDataHub";
import _ from "lodash";
import {getOr} from "../../../../logic/Utils";
import {Button} from "../../../../components/lo/Button";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {Dimension} from "../../../../logic/style/Dimension";

export type DatabaseScriptingTabProps = {
}

export type DatabaseScriptingTabLocalState = {

    fdh: FormDataHub,
    onChange: (val: string | undefined) => void


}

export class DatabaseScriptingTab extends BernieComponent<DatabaseScriptingTabProps, any, DatabaseScriptingTabLocalState> {

    constructor(props: DatabaseScriptingTabProps) {
        super(props, undefined, {
            fdh: new FormDataHub("_example").loadFromLocalStore(),
            onChange: _.debounce((val: string | undefined) => {
                this.local.state.fdh.set("code", getOr(val, ""), true);
            }, 500)
        });
    }

    componentRender(p: DatabaseScriptingTabProps, s: any, l: DatabaseScriptingTabLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox height={percent(100)} width={percent(100)}>
                <Button children={
                    <Text text={"execute"}/>
                } onClick={() => {
                    const code: string = l.fdh.get("code", "");
                    if (code.length > 0) {
                        new Function("editor", code)(this);
                    }
                }}/>
                <FlexBox width={percent(100)} style={{
                    flexGrow: 2
                }}>
                    <Editor
                        saveViewState
                        beforeMount={monaco => {
                            monaco.editor.defineTheme("ses-x-dark-tritanopia", {
                                base: "vs-dark",
                                inherit: true,
                                rules: [
                                    {
                                        background: t.colors.backgroundColor.toHex(),
                                        token: ""
                                    },
                                ],
                                colors: {
                                    "editor.background": t.colors.backgroundColor.toHex(),
                                    "editor.lineHighlightBackground":  t.colors.backgroundHighlightColor200.toHex(),
                                }
                            });


                            // monaco.languages.typescript.typescriptDefaults.addExtraLib(readFileSync("../../logic/scripting/TestAPI.ts", "utf-8"))
                        }}
                        theme={"ses-x-dark-tritanopia"}
                        defaultLanguage="typescript"
                        defaultValue={l.fdh.get("code", "// fallback")}
                        onChange={l.onChange}
                        options={{
                            fontFamily: "JetBrains Mono",
                            fontLigatures: true
                        }}
                    />
                </FlexBox>
            </FlexBox>
        );
    }
}

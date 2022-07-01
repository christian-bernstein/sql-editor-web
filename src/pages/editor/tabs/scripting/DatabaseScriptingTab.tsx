import {BernieComponent} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {Text} from "../../../../components/lo/Text";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import Editor from "@monaco-editor/react";
import {FormDataHub} from "../../../../tests/epicure/components/FormDataHub";
import _ from "lodash";
import {getOr} from "../../../../logic/Utils";
import {Button} from "../../../../components/lo/Button";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {TabProps} from "../TabProps";
import {ScriptingAPI} from "../../../../logic/scripting/ScriptingAPI";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {ReactComponent as RunIcon} from "../../../../assets/icons/ic-16/ic16-play.svg";
import {Icon} from "../../../../components/lo/Icon";

export type DatabaseScriptingTabProps = TabProps & {
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
                <Button visualMeaning={ObjectVisualMeaning.INFO} opaque children={
                    <Text text={"run"} enableRightAppendix rightAppendix={
                        <Icon icon={<RunIcon/>} size={px(18)}/>
                    }/>
                } onClick={() => {
                    const code: string = l.fdh.get("code", "");
                    if (code.length > 0) {
                        new Function("api", code)(
                            new ScriptingAPI(p.editor, p.projectInfo)
                        );
                    }
                }}/>
                <FlexBox width={percent(100)} style={{
                    flexGrow: 2
                }}>
                    <Editor
                        saveViewState
                        onMount={(editor, monaco) => {
                            editor.addCommand(monaco.KeyCode.F8, () => {
                                const code: string = l.fdh.get("code", "");
                                if (code.length > 0) {
                                    new Function("api", code)(
                                        new ScriptingAPI(p.editor, p.projectInfo)
                                    );
                                }
                            }, "")
                        }}
                        beforeMount={monaco => {
                            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                                noSemanticValidation: true,
                                noSyntaxValidation: false
                            });

                            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                                target: monaco.languages.typescript.ScriptTarget.Latest,
                                allowNonTsExtensions: true
                            });

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

                            const libUri = 'ts:filename/facts.d.ts';

                            const libSource = [
                                'declare class ScriptingAPI {',
                                'public push(sql: string, internal: boolean = true): void',
                                '/* Hello world */ public pull(sql: string, internal: boolean = true): Promise<object>',
                                '}',
                                'declare const api: ScriptingAPI;',
                            ].join('\n');

                            monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);

                            try {
                                monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
                            } catch (e) {
                            }
                        }}
                        theme={"ses-x-dark-tritanopia"}
                        defaultLanguage="typescript"
                        defaultValue={l.fdh.get("code", "// fallback")}
                        onChange={l.onChange}
                        options={{
                            // fontFamily: "JetBrains Mono",
                            fontLigatures: true
                        }}
                    />
                </FlexBox>
            </FlexBox>
        );
    }
}

import {BernieComponent} from "../../../../logic/BernieComponent";
import {Text, TextType} from "../../../../components/lo/Text";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import Editor from "@monaco-editor/react";
import {FormDataHub} from "../../../../tests/epicure/components/FormDataHub";
import _ from "lodash";
import {getOr} from "../../../../logic/Utils";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {TabProps} from "../TabProps";
import {ScriptingAPI} from "../../../../logic/scripting/ScriptingAPI";
import {Console, Decode, Hook} from "console-feed";
import {RunningState} from "./RunningState";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {CodeEditor} from "../../../../components/lo/CodeEditor";
import {oneDark} from "@codemirror/theme-one-dark";
import {HighlightStyle, tags} from "@codemirror/highlight";
import React from "react";
import {javascript} from "@codemirror/lang-javascript";
import {CodeEditorType} from "../../CodeEditorType";
import {Justify} from "../../../../logic/style/Justify";
import {Box} from "../../../../components/lo/Box";
import {Themeable} from "../../../../logic/style/Themeable";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Align} from "../../../../logic/style/Align";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {Button} from "../../../../components/lo/Button";
import {Icon} from "../../../../components/lo/Icon";
import {Select} from "../../../../components/lo/Select";
import {ReactComponent as RunIcon} from "../../../../assets/icons/ic-16/ic16-play.svg";
import {ReactComponent as SettingsIcon} from "../../../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as CheckIcon} from "../../../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as HelpIcon} from "../../../../assets/icons/ic-20/ic20-help.svg";
import {ReactComponent as ErrorIcon} from "../../../../assets/icons/ic-20/ic20-bug.svg";
import {ReactComponent as DeleteIcon} from "../../../../assets/icons/ic-20/ic20-delete.svg";
import {utilizeGlobalTheme} from "../../../../logic/app/App";
import {Screen} from "../../../../components/lo/Page";
import {CustomTooltip} from "../../../../components/lo/CustomTooltip";
import {CircularProgress} from "@mui/material";
import {If} from "../../../../components/logic/If";
import {ScriptResult} from "./ScriptResult";
import {Centered} from "../../../../components/lo/PosInCenter";
import {ObjectJSONDisplay} from "../../../../components/ho/objectJSONDisplay/ObjectJSONDisplay";
import {AF} from "../../../../components/logic/ArrayFragment";
import {Desktop, Mobile} from "../../../../components/logic/Media";
import {Cursor} from "../../../../logic/style/Cursor";

export type DatabaseScriptingTabProps = TabProps & {
}

export type DatabaseScriptingTabLocalState = {
    fdh: FormDataHub,
    onChange: (val: string | undefined) => void,
    consoleFeed: any[],
    runningState: RunningState,
    scriptResult?: ScriptResult
}

export class DatabaseScriptingTab extends BernieComponent<DatabaseScriptingTabProps, any, DatabaseScriptingTabLocalState> {

    constructor(props: DatabaseScriptingTabProps) {
        super(props, undefined, {
            fdh: new FormDataHub("database-scripting-tab").loadFromLocalStore(),
            onChange: _.debounce((val: string | undefined) => {
                this.local.state.fdh.set("code", getOr(val, ""), true);
            }, 500),
            consoleFeed: [],
            runningState: RunningState.READY
        }, {
            enableLocalDialog: true
        });
    }

    init() {
        super.init();
        this.editorAssembly();
        this.monacoAssembly();
        this.codemirrorAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        Hook(window.console, (log) => {
            this.local.setStateWithChannels({
                consoleFeed: [...this.local.state.consoleFeed, Decode(log)]
            }, ["log"]);
        })
    }

    private monacoAssembly() {
        this.assembly.assembly(CodeEditorType.MONACO, t => {
            const l = this.local.state;
            const p = this.props;
            return (
                <Editor
                    saveViewState
                    onMount={(editor, monaco) => {
                        editor.addCommand(monaco.KeyCode.F8, () => {
                            this.execute();
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

                        const libUri = 'ts:filename/api.d.ts';

                        const libSource = [
                            'declare class ScriptingAPI {',
                            '   public push(sql: string, internal: boolean = true): ScriptingAPI;',
                            '   public pull(sql: string, internal: boolean = true): Promise<object>;',
                            '   public yield(result: ScriptResult): ScriptingAPI;',
                            '   public input(config: SimpleInputConfig)',
                            '}',

                            'declare const api: ScriptingAPI;',

                            'declare type ScriptResult {',
                            '   code?: number,',
                            '   message?: string,',
                            '   data?: any',
                            '}',

                            'declare type SimpleInputConfig = {',
                            '   title?: string,',
                            '   description?: string,',
                            '   placeholder?: string,',
                            '   defaultValue?: string,',
                            '}'
                        ].join('\n');

                        monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);

                        try {
                            monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
                        } catch (e) {
                        }
                    }}
                    theme={"ses-x-dark-tritanopia"}
                    defaultLanguage="typescript"
                    defaultValue={l.fdh.get("code", "")}
                    onChange={l.onChange}
                    options={{
                        fontFamily: "JetBrains Mono",
                        fontLigatures: true
                    }}
                />
            );
        })
    }

    private codemirrorAssembly() {
        this.assembly.assembly(CodeEditorType.CODEMIRROR, theme => {
            const l = this.local.state;
            const p = this.props;
            return (
                <CodeEditor
                    width={percent(100)}
                    height={percent(100)}
                    theme={oneDark}
                    classnames={["cm"]}
                    debounce={true}
                    debounceMS={300}
                    fullSizeMode={true}
                    value={l.fdh.get("code", "")}
                    extensions={[
                        javascript({
                            typescript: true,
                            jsx: true
                        }),
                        HighlightStyle.define([
                            {tag: tags.keyword, class: "keyword"},
                            {tag: tags.local, class: "local"},
                            {tag: tags.color, class: "color"},
                            {tag: tags.comment, class: "comment"},
                            {tag: tags.function, class: "function"},
                            {tag: tags.string, class: "string"},
                            {tag: tags.content, class: "content"},
                            {tag: tags.arithmeticOperator, class: "arithmeticOperator"},
                        ])
                    ]}
                    onKeyDown={event => {
                        if (event.ctrlKey && event.key === "r") {
                            this.execute();
                        }
                    }}
                    upstreamHook={value => {
                        this.local.state.onChange(value)
                    }}
                />
            );
        });
    }

    private editorAssembly() {
        this.assembly.assembly("editor", t => {
            const l = this.local.state;
            const p = this.props;

            switch (l.fdh.get("editor-type", CodeEditorType.CODEMIRROR)) {
                case CodeEditorType.MONACO: {
                    return this.a(CodeEditorType.MONACO);
                }
                case CodeEditorType.CODEMIRROR: {
                    return this.a(CodeEditorType.CODEMIRROR);
                }
                default: {
                    return (
                        <Text text={"Error"}/>
                    );
                }
            }
        });
    }

    private execute() {
        const l = this.local.state;
        const p = this.props;

        const setError = () => {
            this.local.setStateWithChannels({
                runningState: RunningState.ERROR
            }, ["exe"], () => {
                setTimeout(() => {
                    this.local.setStateWithChannels({
                        runningState: RunningState.READY
                    }, ["exe"])
                }, 5000);
            });
        }

        this.local.setStateWithChannels({
            runningState: RunningState.PREPARING
        }, ["exe"], () => {
            try {
                const code: string = l.fdh.get("code", "");
                if (code.trim().length > 0) {
                    // const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
                    const f = new Function("api", code);

                    this.local.setStateWithChannels({
                        runningState: RunningState.RUNNING
                    }, ["exe"], () => {
                        try {
                            const api = new ScriptingAPI(p.editor, p.projectInfo);
                            const result = f(api) as object;
                            const apiResult = api.result;

                            if (typeof result === 'object' && !Array.isArray(result) && result !== null) {
                                this._openLocalDialog(
                                    <Screen style={{backgroundColor: "transparent"}} children={
                                        <Centered fullHeight children={
                                            <AF elements={[
                                                <Mobile children={
                                                    <ObjectJSONDisplay defaultCollapsed={false} pure={false} enableClipboard showControls title={"Script result"} object={result}/>
                                                }/>,
                                                <Desktop children={
                                                    <FlexBox width={percent(50)} children={
                                                        <ObjectJSONDisplay defaultCollapsed={false} pure={false} enableClipboard showControls title={"Script result"} object={result}/>
                                                    }/>
                                                }/>
                                            ]}/>
                                        }/>
                                    }/>
                                );
                            } else if (result !== undefined) {
                                this._openLocalDialog(
                                    <Screen style={{backgroundColor: "transparent"}} children={
                                        <Centered fullHeight children={
                                            <Box children={
                                                <Text text={JSON.stringify(result)}/>
                                            }/>
                                        }/>
                                    }/>
                                );
                            }

                            this.local.setStateWithChannels({
                                runningState: RunningState.SUCCESS,
                                scriptResult: apiResult
                            }, ["exe"], () => {
                                setTimeout(() => {
                                    this.local.setStateWithChannels({
                                        runningState: RunningState.READY
                                    }, ["exe"])
                                }, 5000);
                            })
                        } catch (e) {
                            console.error(e);
                            setError()
                        }
                    });
                } else {
                    console.error("Cannot execute a blank script")
                    setError();
                }
            } catch (e) {
                console.error(e);
                setError()
            }
        });
    }

    private openSettingsDialog() {
        const t = utilizeGlobalTheme();
        this._openLocalDialog(
            <Screen deactivatePadding style={{backgroundColor: "transparent"}} children={
                <FlexBox width={percent(100)} height={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} justifyContent={Justify.FLEX_END} children={
                    <Box minHeight={percent(50)} borderless borderRadiiConfig={{
                        enableCustomBorderRadii: true,
                        bottomLeft: px(),
                        bottomRight: px()
                    }} width={percent(100)}>
                        <FlexBox width={percent(100)}>
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)} margin={{bottom: px(50)}}>
                                <FlexBox gap={t.gaps.smallGab}>
                                    <Text text={"Scripting Tab preferences"} type={TextType.smallHeader}/>
                                    <Text text={"Change settings for the scripting tab"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                </FlexBox>
                                <Button opaque onClick={() => this.closeLocalDialog()} visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT} children={
                                    <Text text={"Done"} coloredText visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT} enableRightAppendix rightAppendix={
                                        <Icon icon={<CheckIcon/>} colored visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT}/>
                                    }/>
                                }/>
                            </FlexBox>
                            <FlexBox width={percent(100)}>
                                <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                    <Text text={"Select a code editor"} type={TextType.secondaryDescription}/>
                                    <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                        <CustomTooltip arrow noBorder children={
                                            <span children={
                                                <Icon icon={<HelpIcon/>}/>
                                            }/>
                                        } title={
                                            <Text text={"Codemirror is the recommended code editor for mobile devices. *Different code editors might malfunction while being used on a mobile device*"}/>
                                        }/>
                                    </FlexBox>
                                </FlexBox>
                                <Select
                                    elements={() => [
                                        {value: CodeEditorType.CODEMIRROR},
                                        {value: CodeEditorType.MONACO}
                                    ]}
                                    onChange={value => {
                                        this.local.state.fdh.set("editor-type", value, true);
                                        this.rerender("editor");
                                    }}
                                    initialValue={this.local.state.fdh.get("editor-type", CodeEditorType.MONACO)}
                                />
                            </FlexBox>
                        </FlexBox>
                    </Box>
                }/>
            }/>
        );
    }

    componentRender(p: DatabaseScriptingTabProps, s: any, l: DatabaseScriptingTabLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox height={percent(100)} width={percent(100)}>
                <FlexBox width={percent(100)} justifyContent={Justify.SPACE_BETWEEN} gap={t.gaps.smallGab} overflowXBehaviour={OverflowBehaviour.SCROLL} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                    <FlexBox justifyContent={Justify.SPACE_BETWEEN} gap={t.gaps.smallGab} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                        <Button onClick={() => this.openSettingsDialog()} children={
                            <Icon icon={<SettingsIcon/>}/>
                        }/>

                        {
                            this.component(local => (
                                <If condition={this.local.state.consoleFeed.length > 0} ifTrue={
                                    <Button onClick={() => {
                                        this.local.setStateWithChannels({
                                            consoleFeed: []
                                        }, ["log"]);
                                    }} children={
                                        <Icon icon={<DeleteIcon/>}/>
                                    }/>
                                } ifFalse={
                                    <Button cursor={Cursor.notAllowed} children={
                                        <Icon icon={<DeleteIcon/>} colored/>
                                    }/>
                                }/>
                            ), "log")
                        }
                    </FlexBox>

                    {
                        this.component(local => {
                            switch (local.state.runningState) {
                                case RunningState.READY: {
                                    return (
                                        <Button visualMeaning={ObjectVisualMeaning.INFO} opaque children={
                                            <Text text={"Run"} enableRightAppendix rightAppendix={
                                                <Icon icon={<RunIcon/>} size={px(18)}/>
                                            }/>
                                        } onClick={() => {
                                            this.execute();
                                        }}/>
                                    );
                                }
                                case RunningState.PREPARING: {
                                    return (
                                        <Button visualMeaning={ObjectVisualMeaning.INFO} opaque children={
                                            <Text text={"Preparing"} enableRightAppendix rightAppendix={
                                                <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} width={px(20)} height={px(20)}>
                                                    <CircularProgress variant={"indeterminate"} size={16} sx={{
                                                        color: t.colors.primaryHighlightColor.css()
                                                    }}/>
                                                </FlexBox>
                                            }/>
                                        }/>
                                    );
                                }
                                case RunningState.RUNNING: {
                                    return (
                                        <Button visualMeaning={ObjectVisualMeaning.INFO} opaque children={
                                            <Text text={"Running"} enableRightAppendix rightAppendix={
                                                <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} width={px(20)} height={px(20)}>
                                                    <CircularProgress variant={"indeterminate"} size={16} sx={{
                                                        color: t.colors.primaryHighlightColor.css()
                                                    }}/>
                                                </FlexBox>
                                            }/>
                                        }/>
                                    );
                                }
                                case RunningState.ERROR: {
                                    return (
                                        <Button visualMeaning={ObjectVisualMeaning.ERROR} opaque children={
                                            <Text text={"Error"} enableRightAppendix rightAppendix={
                                                <Icon icon={<ErrorIcon/>} size={px(18)}/>
                                            }/>
                                        } onClick={() => {
                                            this.execute();
                                        }}/>
                                    );
                                }
                                case RunningState.SUCCESS: {
                                    return (
                                        <Button visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT} opaque children={
                                            <Text text={""} texts={[`Success`, local.state.scriptResult?.code !== undefined ? ` (**${local.state.scriptResult?.code}**)` : ""]} delimiter={""} enableRightAppendix rightAppendix={
                                                <Icon icon={<CheckIcon/>} size={px(18)}/>
                                            }/>
                                        } onClick={() => {
                                            this.execute();
                                        }}/>
                                    );
                                }
                            }

                            return (
                                <Button visualMeaning={ObjectVisualMeaning.INFO} opaque children={
                                    <Text text={String(local.state.runningState)} enableRightAppendix rightAppendix={
                                        <Icon icon={<RunIcon/>} size={px(18)}/>
                                    }/>
                                } onClick={() => {
                                    this.execute();
                                }}/>
                            );
                        }, "exe")
                    }
                </FlexBox>

                <FlexBox width={percent(100)} style={{flexGrow: 2}} children={
                    this.component(() => this.a("editor"), "editor")
                }/>

                {
                    this.component(local => (
                        <If condition={this.local.state.consoleFeed.length > 0} ifTrue={
                            <Box width={percent(100)} height={percent(25)} overflowYBehaviour={OverflowBehaviour.SCROLL} noPadding children={
                                this.component(local => (
                                    <Console variant={"dark"} logs={local.state.consoleFeed}/>
                                ), "log")
                            }/>
                        }/>
                    ), "log")
                }
            </FlexBox>
        );
    }
}

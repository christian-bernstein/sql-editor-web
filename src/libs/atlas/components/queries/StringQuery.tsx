import {BernieComponent} from "../../../sql/logic/BernieComponent";
import {Flex} from "../../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../../sql/components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {FlexDirection} from "../../../sql/logic/style/FlexDirection";
import {percent, px} from "../../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../../sql/components/lo/Button";
import Editor from "@monaco-editor/react";
import {Text, TextType} from "../../../sql/components/lo/Text";
import {StaticDrawerMenu} from "../../../sql/components/lo/StaticDrawerMenu";
import React from "react";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import _ from "lodash";

export type StringQueryProps = {
    onSubmit: (string: string) => void,
    defaultValue?: string,
    title: string,
    description?: string
}

export type StringQueryLocalState = {
    string: string
    stringReRenderer: () => void
}

export class StringQuery extends BernieComponent<StringQueryProps, any, StringQueryLocalState> {

    constructor(props: StringQueryProps) {
        super(props, undefined, {
            string: props.defaultValue ?? "",
            stringReRenderer: _.debounce(() => {
                this.rerender("string-companions");
            }, 500)
        });
    }

    componentRender(p: StringQueryProps, s: any, l: StringQueryLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={() => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={p.title}
                        description={p.description}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Query / Interrupt"}
                    />,

                    <Flex fw padding flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} paddingX={px(25)} elements={[
                        <Button width={percent(100)} text={"Back"} onClick={() => {
                            // TODO: Implement
                        }}/>,
                        this.component(local => {
                            if (local.state.string.trim().length === 0) {
                                return (
                                    <Button width={percent(100)} text={"Submit empty"} onClick={() => {
                                        p.onSubmit(local.state.string);
                                    }}/>
                                );
                            } else {
                                return (
                                    <Button width={percent(100)} opaque visualMeaning={ObjectVisualMeaning.INFO} text={"Submit"} onClick={() => {
                                        p.onSubmit(local.state.string);
                                    }}/>
                                );
                            }
                        }, "string-companions")
                    ]}/>,
                    <Editor
                        height={"20px"}
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
                                    // "editor.background": t.colors.backgroundColor.toHex(),
                                    "editor.background": t.colors.backgroundHighlightColor.toHex(),
                                    "editor.lineHighlightBackground":  t.colors.backgroundHighlightColor200.toHex(),
                                }
                            });
                        }}
                        onMount={(editor, monaco) => {
                            editor.onKeyDown(e => {
                                if (e.keyCode == monaco.KeyCode.Enter) {
                                    p.onSubmit(this.local.state.string);
                                    e.preventDefault();
                                }
                            });
                            editor.onDidPaste(e => {
                                if (e.range.endLineNumber > 1) {
                                    editor.setValue(editor.getValue().replaceAll('\n', ''));
                                }
                            });

                            editor.focus();

                            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, args => {
                                p.onSubmit(this.local.state.string);
                            });
                        }}
                        theme={"ses-x-dark-tritanopia"}
                        defaultValue={l.string}
                        onChange={(value, ev) => {
                            this.local.setState({
                                string: value
                            }, new Map<string, any>(), () => {
                                this.local.state.stringReRenderer();
                            });
                        }}
                        options={{
                            wordWrap: 'off',
                            lineNumbers: 'off',
                            lineDecorationsWidth: 0,
                            hideCursorInOverviewRuler: true,
                            renderValidationDecorations: "off",
                            overviewRulerBorder: false,
                            renderLineHighlight: "none",
                            cursorStyle: "block",
                            codeLens: false,
                            scrollbar: {
                                vertical: "hidden",
                            },
                            minimap: {
                                enabled: false
                            },
                            fontLigatures: true
                        }}
                    />,

                    <Text text={"Change by pressing `Enter`"} fontSize={px(11)} type={TextType.secondaryDescription}/>
                ]}/>
            )}/>
        );
    }
}

import React from "react";
import Editor, {useMonaco} from "@monaco-editor/react";
import styled from "styled-components";
import {Themeable} from "../../Themeable";
import {app, App} from "../../logic/App";
import {PositionDeltaMoveParams} from "./PositionDeltaMoveParams";
import {v4} from "uuid";
import {Button} from "./Button";
import {ReactComponent as ReloadIcon} from "../../assets/icons/ic-20/ic20-refresh.svg";
import {ReactComponent as RunIcon} from "../../assets/icons/ic-20/ic20-play.svg";
import {ReactComponent as ClearIcon} from "../../assets/icons/ic-20/ic20-file-remove.svg";
import {ReactComponent as RenameIcon} from "../../assets/icons/ic-20/ic20-file-edit.svg";
import {ReactComponent as TabIcon} from "../../assets/icons/ic-20/ic20-horizontal-align-right.svg";
import {ReactComponent as DownIcon} from "../../assets/icons/ic-20/ic20-arrow-down.svg";
import {ReactComponent as UpIcon} from "../../assets/icons/ic-20/ic20-arrow-up.svg";
import {ReactComponent as ThemeIcon} from "../../assets/icons/ic-20/ic20-brightness-auto.svg";

export type MonacoState = {
    theme: string,
    completerInitCompleted: boolean
}

export class Monaco extends React.Component<any, MonacoState> {

    private readonly hooks: Map<string, (params: any) => void> = new Map<string, (params: any) => void>();

    constructor(props: any) {
        super(props);
        this.state = {
            theme: "vs-dark",
            completerInitCompleted: false
        };
    }

    private hook<T>(name: string, params?: T) {
        this.hooks.get(name)?.(params);
    }

    render() {
        const theme: Themeable.Theme = app().getGlobalTheme();
        const Page = styled.div`
          background-color: ${theme.colors.backgroundColor.css()};
          height: 100%;
          display: grid;
          grid-template-rows: minmax(68px, 1fr) auto;
          
          .keyboard-controls {
            box-sizing: border-box;
            padding: 7px;
            display: grid;
            grid-gap: 5px;
            width: 100%;
            grid-template-columns: repeat(8, 1fr) 2fr;
          }
        `;

        return (
            <Page>
                <Editor
                    keepCurrentModel={true}
                    className={"editor"}
                    theme={this.state.theme}
                    height={"100%"}
                    path={"console.sql"}
                    options={{
                        minimap: {
                            enabled: false
                        },
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        scrollBeyondLastLine: false,
                        lineNumbers: "off",
                        selectionHighlight: true,
                        fontLigatures: true,
                        showFoldingControls: "always",
                        accessibilitySupport: "on",
                        codeLens: false,
                        cursorBlinking: "smooth",
                        contextmenu: true,
                        extraEditorClassName: "generic-monaco-classname",
                        smoothScrolling: true,
                        quickSuggestionsDelay: 0,
                        renderWhitespace: "selection"
                    }}
                    defaultLanguage={"sql"}
                    defaultValue={""}
                    onMount={(editor, monaco) => {
                        // Register hooks
                        (() => {
                            this.hooks.set("tab", () => {
                                editor.trigger(null, "tab", {});
                            });

                            this.hooks.set("command-pallet", () => {
                                editor.trigger('', "editor.action.quickCommand", {});
                            });

                            this.hooks.set("replace", () => {
                                editor.trigger('', "editor.action.startFindReplaceAction", {});
                            });

                            this.hooks.set("clear", () => {
                                editor.setValue("");
                            });

                            this.hooks.set("next-suggestion", () => {
                                editor.trigger('', 'selectNextSuggestion', {});
                            });

                            this.hooks.set("prev-suggestion", () => {
                                editor.trigger('', 'selectFirstSuggestion', {});
                            });

                            this.hooks.set("change-position", (params => {
                                const delta: PositionDeltaMoveParams = params as PositionDeltaMoveParams;
                                const x = delta.x ? delta.x : 0;
                                const y = delta.y ? delta.y : 0;
                                const position = editor.getPosition();
                                const curX = position?.column ? position?.column: 0;
                                const curY = position?.lineNumber ? position?.lineNumber: 0;
                                const dx = curX + x;
                                const dy = curY + y;
                                editor.setPosition({
                                    column: dx,
                                    lineNumber: dy
                                })
                            }));
                        })();

                        if (!this.state.completerInitCompleted) {
                            monaco.languages.registerCompletionItemProvider('sql', {
                                provideCompletionItems: (model, position, context, token) => {
                                    const word = model.getWordUntilPosition(position);
                                    const range = {
                                        startLineNumber: position.lineNumber,
                                        endLineNumber: position.lineNumber,
                                        startColumn: word.startColumn,
                                        endColumn: word.endColumn
                                    };
                                    return {
                                        suggestions: [
                                            {
                                                label: 'select_all',
                                                kind: monaco.languages.CompletionItemKind.Function,
                                                documentation: 'The Lodash library exported as Node.js modules.',
                                                insertText: 'select * from ${1:};',
                                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                                range: range
                                            },{
                                                label: 'select_sum',
                                                kind: monaco.languages.CompletionItemKind.Function,
                                                documentation: 'The Lodash library exported as Node.js modules.',
                                                insertText: 'select sum(${1:column_name})\n from ${2:table_name}\n where ${3:condition};',
                                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                                range: range
                                            },
                                        ]
                                    }
                                }
                            });
                            this.setState({
                                completerInitCompleted: true
                            });
                        }



                        document.documentElement.addEventListener("click", ev => {
                            editor.focus();
                        });
                    }}
                />

                <div className={"keyboard-controls"}>
                    <Button onClick={event => {
                        document.location.reload();
                    }}>
                        <ReloadIcon/>
                    </Button>
                    <Button onClick={() => this.hook("command-pallet")}>
                        <RunIcon/>
                    </Button>
                    <Button onClick={() => this.hook("replace")}>
                        <RenameIcon/>
                    </Button>
                    <Button onClick={() => this.hook("tab")}>
                        <TabIcon/>
                    </Button>
                    <Button onClick={() => {
                        this.setState({
                            theme: this.state.theme === "vs-dark" ? "vs-light" : "vs-dark"
                        });
                    }}>
                        <ThemeIcon/>
                    </Button>
                    <Button onClick={() => this.hook("next-suggestion")}>
                        <UpIcon/>
                    </Button>
                    <Button onClick={() => this.hook("prev-suggestion")}>
                        <DownIcon/>
                    </Button>
                    <Button onClick={() => this.hook("clear")}>
                        <ClearIcon/>
                    </Button>
                    <Button highlight>
                        RUN
                        <RunIcon/>
                    </Button>


                    {/*
                    <button style={{width: "100%", height: "30px"}} onClick={event => {
                        this.hook("change-position", {
                            x: -1,
                            stayAtEnd: true
                        });
                    }}>left</button>

                    <button style={{width: "100%", height: "30px"}} onClick={event => {
                        this.hook("change-position", {
                            x: 1,
                            stayAtEnd: true
                        });
                    }}>right</button>

                    <button style={{width: "100%", height: "30px"}} onClick={event => {
                        this.hook("change-position", {
                            y: -1,
                            stayAtEnd: true
                        });
                    }}>up</button>

                    <button style={{width: "100%", height: "30px"}} onClick={event => {
                        this.hook("change-position", {
                            y: 1,
                            stayAtEnd: true
                        });
                    }}>down</button>
                    */}
                </div>
            </Page>

        );
    }

}

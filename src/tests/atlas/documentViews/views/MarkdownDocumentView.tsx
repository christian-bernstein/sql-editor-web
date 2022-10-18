import {DocumentView} from "../DocumentView";
import React from "react";
import {DocumentViewRenderContext} from "../DocumentViewRenderContext";
import {BC} from "../../../../logic/BernieComponent";
import {Themeable} from "../../../../logic/style/Themeable";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {DocumentState} from "../../data/DocumentState";
import {VFSFolderView} from "../../components/VFSFolderView";
import {OverflowWithHeader} from "../../../../components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import {Box} from "../../../../components/lo/Box";
import {Flex} from "../../../../components/lo/FlexBox";
import {Align} from "../../../../logic/style/Align";
import {Text, TextType} from "../../../../components/lo/Text";
import {Tooltip} from "../../../../components/ho/tooltip/Tooltip";
import {Separator} from "../../../../components/lo/Separator";
import {Orientation} from "../../../../logic/style/Orientation";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import Editor from "@monaco-editor/react";
import {DocumentSaveState} from "../../data/DocumentSaveState";
import {Icon} from "../../../../components/lo/Icon";
import {ReactComponent as SavedIcon} from "../../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as PendingIcon} from "../../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {VM} from "../../../../logic/style/ObjectVisualMeaning";
import {Dot} from "../../../../components/lo/Dot";
import {MarkdownDocumentArchetype} from "../../data/documentArchetypes/MarkdownDocumentArchetype";
import styled from "styled-components";

export const markdownDocumentView: DocumentView = {
    renderer: (context) => {
        return (
            <MarkdownDocumentView context={context}/>
        );
    }
}

type MarkdownDocumentViewProps = {
    context: DocumentViewRenderContext
}

type MarkdownDocumentViewLocalState = {
    sourceMirror: string
}

class MarkdownDocumentView extends BC<MarkdownDocumentViewProps, any, MarkdownDocumentViewLocalState> {

    constructor(props: MarkdownDocumentViewProps) {
        super(props, undefined, {
            sourceMirror: ""
        });
    }

    public onSourceChange(newSource: string) {
        const newBody = JSON.stringify({
            source: newSource ?? ""
        } as MarkdownDocumentArchetype);

        this.props.context.data.bodyUpdater.update({
            newBody: newBody
        });

        this.local.setStateWithChannels({
            sourceMirror: newSource
        }, ["source-updated"]);
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.setStateWithChannels({
            sourceMirror: (JSON.parse(this.props.context.data.documentGetter().body as string) as MarkdownDocumentArchetype).source ?? "Cannot load.."
        }, ["source-updated"]);
    }

    init() {
        super.init();
        this.editorAssembly();
        this.markdownDisplayAssembly();
    }

    private editorAssembly() {
        this.assembly.assembly("editor", t => {
            return (
                <Flex
                    fw
                    fh
                    overflowYBehaviour={OverflowBehaviour.SCROLL}
                    padding={false}
                    // padding={true}
                    paddingX={px()}
                    style={{
                        backgroundColor: t.colors.backgroundHighlightColor.toHex(),
                        paddingRight: t.gaps.defaultGab.css()
                    }}
                    gap={px()}
                    flexDir={FlexDirection.ROW}
                    elements={[
                        <Editor
                            saveViewState
                            onMount={(editor, monaco) => {
                                editor.addCommand(monaco.KeyCode.F8, () => {
                                    // this.execute();
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
                                        // "editor.background": t.colors.backgroundColor.toHex(),
                                        "editor.background": t.colors.backgroundHighlightColor.toHex(),
                                        "editor.lineHighlightBackground": t.colors.backgroundHighlightColor200.toHex(),
                                    }
                                });
                            }}
                            theme={"ses-x-dark-tritanopia"}
                            defaultValue={this.getSource()}
                            onChange={(value, ev) => {
                                this.onSourceChange(value ?? "");
                            }}
                            options={{
                                hideCursorInOverviewRuler: true,
                                lineDecorationsWidth: 0,
                                renderValidationDecorations: "off",
                                overviewRulerBorder: false,
                                renderLineHighlight: "none",
                                codeLens: false,
                                scrollbar: {
                                    vertical: "hidden",
                                },
                                minimap: {
                                    enabled: false
                                },
                                fontLigatures: true
                            }}
                        />
                    ]}
                />
            );
        })
    }

    private markdownDisplayAssembly() {
        this.assembly.assembly("markdown-display", t => {
            return (
                <Flex
                    fw
                    fh
                    overflowYBehaviour={OverflowBehaviour.SCROLL}
                    style={{backgroundColor: t.colors.backgroundHighlightColor.toHex()}}
                    elements={[
                        <Flex
                            fw
                            fh
                            style={{backgroundColor: t.colors.backgroundHighlightColor.toHex()}}
                            elements={[
                                this.component(local => {
                                    const MarkdownWrapper = styled.span`
                                      padding: 0 ${t.gaps.defaultGab.css()};
                                      padding-top: ${t.gaps.defaultGab.css()};
                                      width: 100%;
                                      flex: 1 1 auto;
                                      background-color: #0d1117;
                                      overflow-y: scroll;

                                      .md {
                                        background-color: #0d1117;
                                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
                                        font-size: 16px;
                                        line-height: 1.5;
                                        word-wrap: break-word;
                                        white-space: normal !important;

                                        display: flex !important;
                                        flex-direction: column;
                                        gap: 0 !important;
                                        
                                        h1 {
                                          margin-block-start: 0.67em;
                                          margin-block-end: 0.67em;
                                          margin-inline-start: 0;
                                          margin-inline-end: 0;
                                          padding-bottom: 0.3em;
                                          font-size: 2em;
                                          border-bottom: 1px solid #21262d;
                                          margin-top: 24px;
                                          margin-bottom: 16px;
                                          font-weight: 600;
                                          line-height: 1.25;
                                          word-wrap: break-word;
                                        }

                                        h2 {
                                          padding-bottom: 0.3em;
                                          font-size: 1.5em;
                                          border-bottom: 1px solid #21262d;
                                          margin-top: 24px;
                                          margin-bottom: 16px;
                                          font-weight: 600;
                                          line-height: 1.25;
                                          margin-block-start: 0.83em;
                                          margin-block-end: 0.83em;
                                          margin-inline-start: 0;
                                          margin-inline-end: 0;
                                          word-wrap: break-word;
                                        }

                                        h3 {
                                          margin-top: 24px;
                                          margin-bottom: 16px;
                                          font-weight: 600;
                                          line-height: 1.25;
                                          margin-block-start: 1em;
                                          margin-block-end: 1em;
                                          margin-inline-start: 0;
                                          margin-inline-end: 0;
                                          word-wrap: break-word;
                                        }

                                        p {
                                          margin-top: 0 !important;
                                          margin-bottom: 16px;
                                          margin-block-start: 1em;
                                          margin-block-end: 1em;
                                          margin-inline-start: 0;
                                          margin-inline-end: 0;
                                        }

                                        hr {
                                          height: 1px !important;
                                          background-color: #21262d;
                                          border: none;
                                        }

                                        code {
                                          padding: 0.2em 0.4em;
                                          margin: 0;
                                          font-size: 85%;
                                          background-color: rgba(110, 118, 129, .4);
                                          border-radius: 6px;
                                          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
                                        }

                                        ul {
                                          padding-left: 2em;
                                          margin-top: 0 !important;
                                          margin-bottom: 16px;
                                          list-style-type: disc;
                                          margin-block-start: 1em;
                                          margin-block-end: 1em;
                                          margin-inline-start: 0;
                                          margin-inline-end: 0;
                                          padding-inline-start: 40px;
                                          font-size: 16px;
                                          line-height: 1.5;
                                          word-wrap: break-word;

                                          display: flex;
                                          flex-direction: column;
                                        }

                                        li {
                                          display: list-item;
                                          text-align: -webkit-match-parent;
                                        }

                                        table {
                                          width: max-content;
                                          max-width: 100%;
                                          overflow-x: scroll;
                                          border-spacing: 0;
                                          border-collapse: collapse;

                                          tr:nth-child(2n) {
                                            background-color: #161b22;
                                          }
                                        ;
                                          
                                          th, td {
                                            padding: 6px 13px;
                                            border: 1px solid #30363d;
                                          }
                                          
                                          thead {
                                            display: table-header-group;
                                            vertical-align: middle;
                                            border-color: inherit;
                                            border-spacing: 0;
                                            border-collapse: collapse;
                                            
                                            tr {
                                              background-color: #0d1117;
                                              border-top: 1px solid #21262d;
                                            }
                                          }
                                        }
                                      }
                                    `;

                                    return (
                                        <MarkdownWrapper children={
                                            <Text text={local.state.sourceMirror}/>
                                        }/>
                                    );
                                }, "source-updated")
                            ]}
                        />
                    ]}
                />
            );
        })
    }

    private getSource(): string {
        try {
            const document = this.props.context.data.documentGetter();
            return (JSON.parse(document.body as string) as MarkdownDocumentArchetype).source ?? "Cannot load..";
        } catch (e) {
            return `Error: ${e}`
        }
    }

    componentRender(p: MarkdownDocumentViewProps, s: any, l: MarkdownDocumentViewLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const document = p.context.data.documentGetter();
        const docState: DocumentState = p.context.data.documentStateGetter();
        const view: VFSFolderView = p.context.data.view;

        let source: string = "";
        try {
            source = (JSON.parse(document.body as string) as MarkdownDocumentArchetype).source ?? "Cannot load..";
        } catch (e) {
            console.error(e);
        }

        return (
            <OverflowWithHeader
                height={percent(100)}
                dir={FlexDirection.COLUMN_REVERSE}
                staticContainer={{
                    gap: px(),
                    elements: [
                        <Box
                            fw
                            borderless
                            borderRadiiConfig={{enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(0)}}
                            paddingY={t.paddings.defaultButtonPadding}
                            elements={[
                                <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} fw gap={t.gaps.smallGab}
                                      elements={[
                                          <Text text={"Toolbox"} fontSize={px(11)}
                                                type={TextType.secondaryDescription}/>
                                      ]}/>
                            ]}
                        />,
                        <Separator orientation={Orientation.HORIZONTAL}/>
                    ]
                }}
                overflowContainer={{
                    elements: [
                        <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} flexDir={FlexDirection.ROW} gap={px()}
                              elements={[
                                  this.component(() => this.a("editor"), "editor"),
                                  this.component(() => this.a("markdown-display"), "markdown-display"),
                              ]}/>
                    ]
                }}
                staticContainerHeader={{
                    gap: px(),
                    elements: [
                        <Separator orientation={Orientation.HORIZONTAL}/>,
                        <Box
                            fw
                            borderless
                            borderRadiiConfig={{enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(0)}}
                            elements={[
                                <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} elements={[
                                    p.context.data.view.component(l => {
                                        switch (docState.saveState) {
                                            case DocumentSaveState.SAVED:
                                                return (
                                                    <Tooltip title={"Saved"} children={
                                                        <Icon icon={<SavedIcon/>} size={px(16)}/>
                                                    }/>
                                                );
                                            case DocumentSaveState.PENDING:
                                                return (
                                                    <Tooltip title={"Pending changes are getting saved"} children={
                                                        <Icon icon={<PendingIcon/>} colored visualMeaning={VM.WARNING}
                                                              size={px(16)}/>
                                                    }/>
                                                );
                                            default:
                                                return <></>
                                        }
                                    }, view.toDocumentSpecificChannel(document.id, "persistence-sync-state")),

                                    view.component(
                                        () => {
                                            const note = this.local.state.sourceMirror;
                                            const charCount = note.length;
                                            const wordCount = note.trim().split(/\s+/).length;
                                            const byteLength = Buffer.byteLength(note, 'utf16le');

                                            return (
                                                <Flex flexDir={FlexDirection.ROW} align={Align.CENTER}
                                                      gap={t.gaps.smallGab} elements={[
                                                    <Text text={`${wordCount} words`} fontSize={px(11)}
                                                          type={TextType.secondaryDescription}/>,
                                                    <Dot/>,
                                                    <Text text={`${charCount} characters`} fontSize={px(11)}
                                                          type={TextType.secondaryDescription}/>,
                                                    <Dot/>,
                                                    <Text text={`${byteLength} bytes (utf-16-le)`} fontSize={px(11)}
                                                          type={TextType.secondaryDescription}/>,
                                                ]}/>
                                            );
                                        },
                                        view.toDocumentSpecificChannel(document.id, "persistence-sync-state")
                                    )
                                ]}/>,
                            ]}
                        />
                    ]
                }}
            />
        );
    }
}

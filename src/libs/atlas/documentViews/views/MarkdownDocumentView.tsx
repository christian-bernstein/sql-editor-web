import {DocumentView} from "../DocumentView";
import React from "react";
import {DocumentViewRenderContext} from "../DocumentViewRenderContext";
import {BC} from "../../../sql/logic/BernieComponent";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {DocumentState} from "../../data/DocumentState";
import {VFSFolderView} from "../../components/VFSFolderView";
import {OverflowWithHeader} from "../../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../sql/logic/style/FlexDirection";
import {percent, px} from "../../../sql/logic/style/DimensionalMeasured";
import {Box} from "../../../sql/components/lo/Box";
import {Flex, FlexBox} from "../../../sql/components/lo/FlexBox";
import {Align} from "../../../sql/logic/style/Align";
import {Text, TextType} from "../../../sql/components/lo/Text";
import {Tooltip} from "../../../sql/components/ho/tooltip/Tooltip";
import {Separator} from "../../../sql/components/lo/Separator";
import {Orientation} from "../../../sql/logic/style/Orientation";
import {OverflowBehaviour} from "../../../sql/logic/style/OverflowBehaviour";
import Editor from "@monaco-editor/react";
import {DocumentSaveState} from "../../data/DocumentSaveState";
import {Icon} from "../../../sql/components/lo/Icon";
import {ReactComponent as SavedIcon} from "../../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as PendingIcon} from "../../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {ReactComponent as DebounceIcon} from "../../../../assets/icons/ic-20/ic20-stopwatch.svg";
import {VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {Dot} from "../../../sql/components/lo/Dot";
import {MarkdownDocumentArchetype} from "../../data/documentArchetypes/MarkdownDocumentArchetype";
import styled from "styled-components";
import _ from "lodash";
import {MarkdownViewerReloadPolicyMenu} from "../../components/menus/MarkdownViewerReloadPolicyMenu";
import {ContextCompound} from "../../../sql/components/ho/contextCompound/ContextCompound";
import {ConfigManager} from "../../config/ConfigManager";
import {LocalStorageConfigManagerPersistentAdapter} from "../../config/LocalStorageConfigManagerPersistentAdapter";
import {MarkdownViewerReloadPolicyConfig} from "../../config/configurations/MarkdownViewerReloadPolicyConfig";

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
    sourceMirror: string,
    updateRenderedMarkdownViewer: () => void,
    configManager: ConfigManager
}

class MarkdownDocumentView extends BC<MarkdownDocumentViewProps, any, MarkdownDocumentViewLocalState> {

    constructor(props: MarkdownDocumentViewProps) {
        super(props, undefined, {
            sourceMirror: "",
            updateRenderedMarkdownViewer: _.debounce(() => {
                this.rerender("markdown-display");
            }, 1000),
            configManager: new ConfigManager(new LocalStorageConfigManagerPersistentAdapter())
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
        }, ["source-updated"], () => {
            this.local.state.updateRenderedMarkdownViewer();
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.setStateWithChannels({
            sourceMirror: (JSON.parse(this.props.context.data.documentGetter().body as string) as MarkdownDocumentArchetype).source ?? "Cannot load.."
        }, ["source-updated"]);

        this.updateRenderedMarkdownViewer();
    }

    private getMarkdownViewerReloadPolicyConfig(): MarkdownViewerReloadPolicyConfig{
        return this.local.state.configManager.loadConfig<MarkdownViewerReloadPolicyConfig>("MarkdownViewerReloadPolicyConfig");
    }

    private updateRenderedMarkdownViewer(config?: MarkdownViewerReloadPolicyConfig) {
        if (config === undefined) {
            config = this.getMarkdownViewerReloadPolicyConfig();
            if (config === undefined) {
                throw new Error("updateRenderedMarkdownViewer: config cannot be resolved");
            }
        }
        this.local.setState({
            updateRenderedMarkdownViewer: config.enableDebounce ? _.debounce(() => {
                this.rerender("markdown-display");
            }, config.debounceMS) : () => {
                this.rerender("markdown-display");
            }
        });

        this.rerender("MarkdownViewerReloadPolicyConfig-change");
    }

    init() {
        super.init();
        this.editorAssembly();
        this.markdownDisplayAssembly();
        this.local.state.configManager.init(manager => {
            manager.registerChangeListener<MarkdownViewerReloadPolicyConfig>("MarkdownViewerReloadPolicyConfig", (config) => {
                this.updateRenderedMarkdownViewer(config);
            });
            manager.loadConfig<MarkdownViewerReloadPolicyConfig>("MarkdownViewerReloadPolicyConfig", {
                enableDebounce: false,
                debounceMS: 1000
            });
        });
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

                                editor.focus();
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
                                }, "markdown-display")
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
                                <FlexBox
                                    flexDir={FlexDirection.ROW}
                                    width={percent(100)}
                                    elements={[
                                        <FlexBox
                                            gap={t.gaps.smallGab}
                                            padding={false}
                                            flexDir={FlexDirection.ROW}
                                            style={{ flex: "0 1 auto" }}
                                            elements={[
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
                                                ),
                                            ]}
                                        />,

                                        <FlexBox
                                            flexDir={FlexDirection.ROW}
                                            gap={t.gaps.smallGab}
                                            style={{ flex: "1 1 auto" }}
                                            overflowYBehaviour={OverflowBehaviour.SCROLL}
                                            elements={[]}
                                        />,

                                        <FlexBox
                                            flexDir={FlexDirection.ROW}
                                            gap={t.gaps.smallGab}
                                            padding={false}
                                            style={{ flex: "0 1 auto" }}
                                            elements={[
                                                <ContextCompound wrapMenu={false} children={
                                                    this.component((local) => {
                                                        const config = this.getMarkdownViewerReloadPolicyConfig();

                                                        return (
                                                            <Tooltip title={"Viewer debounce settings"} children={
                                                                config.enableDebounce ? (
                                                                    <Icon icon={<DebounceIcon/>} size={px(16)}/>
                                                                ) : (
                                                                    <Icon icon={<DebounceIcon/>} colored visualMeaning={VM.UI_NO_HIGHLIGHT} size={px(16)}/>
                                                                )

                                                            }/>
                                                        );
                                                    }, "MarkdownViewerReloadPolicyConfig-change")
                                                } menu={
                                                    <MarkdownViewerReloadPolicyMenu
                                                        parent={this}
                                                        getConfig={() => this.local.state.configManager.loadConfig("MarkdownViewerReloadPolicyConfig")}
                                                        updater={{
                                                            update: callback => {
                                                                this.local.state.configManager.updateConfig<MarkdownViewerReloadPolicyConfig>("MarkdownViewerReloadPolicyConfig", config => {
                                                                    return callback(config);
                                                                })
                                                            }
                                                        }}
                                                    />
                                                }/>,
                                            ]}
                                        />
                                    ]}
                                />
                            ]}
                        />
                    ]
                }}
            />
        );
    }
}

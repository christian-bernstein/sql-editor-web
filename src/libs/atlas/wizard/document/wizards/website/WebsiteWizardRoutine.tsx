import {WizardRoutine} from "../../WizardRoutine";
import {WizardRoutineCard} from "../../../../components/documentWizard/WizardRoutineCard";
import React from "react";
import {Button} from "../../../../../sql/components/lo/Button";
import {AtlasDocument} from "../../../../data/AtlasDocument";
import {Flex} from "../../../../../sql/components/lo/FlexBox";
import {BC} from "../../../../../sql/logic/BernieComponent";
import {Themeable} from "../../../../../sql/logic/style/Themeable";
import {Assembly} from "../../../../../sql/logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../../../../sql/components/lo/StaticDrawerMenu";
import Editor from "@monaco-editor/react";
import {DrawerHeader} from "../../../../../sql/components/lo/DrawerHeader";
import {percent, px} from "../../../../../sql/logic/style/DimensionalMeasured";
import {ObjectVisualMeaning, VM} from "../../../../../sql/logic/style/ObjectVisualMeaning";
import _ from "lodash";
import {FlexDirection} from "../../../../../sql/logic/style/FlexDirection";
import {WizardSubRoutine} from "../../WizardSubRoutine";
import {DefaultWizardEngine} from "../../engines/DefaultWizardEngine";
import {WebsiteDocumentArchetype} from "../../../../data/documentArchetypes/WebsiteDocumentArchetype";
import {Text, TextType} from "../../../../../sql/components/lo/Text";
import {DocumentType} from "../../../../data/DocumentType";

export const websiteWizardRoutine: WizardRoutine = {
    title: "Save website",
    description: "Save website",
    tags: ["Save", "Website"],
    previewCard: (onSelectCallback) => (
        <WizardRoutineCard
            title={"Save website"}
            description={"Save website"}
            tooltip={"Save website"}
            onSelect={() => onSelectCallback()}
        />
    ),
    run: (view, currentFolder, component, onSetupComplete) => {
        return new DefaultWizardEngine().run({
            view: view,
            component: component,
            currentFolder: currentFolder,
            onSetupComplete: onSetupComplete,
            wizardEngineID: "default",
            subRoutines: new Array<WizardSubRoutine>({
                run: (document, context) => {
                    return new Promise<Partial<AtlasDocument>>((resolve, reject) => {
                        context.component.dialog(
                            <WebsiteWizardForm onSubmit={url => {
                                resolve({
                                    documentType: DocumentType.WEBSITE,
                                    body: JSON.stringify({
                                        url: url
                                    } as WebsiteDocumentArchetype)
                                });
                            }}/>
                        );
                    });
                }
            })
        });
    }
}

export type WebsiteWizardFormProps = {
    onSubmit: (url: string) => void
}

export type WebsiteWizardFormLocalState = {
    url: string
    urlReRenderer: () => void
}

class WebsiteWizardForm extends BC<WebsiteWizardFormProps, any, WebsiteWizardFormLocalState> {

    constructor(props: WebsiteWizardFormProps) {
        super(props, undefined, {
            url: "",
            urlReRenderer: _.debounce(() => {
                this.rerender("url-companions");
            }, 500)
        });
    }

    componentRender(p: WebsiteWizardFormProps, s: any, l: WebsiteWizardFormLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={() => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={"What's your website?"}
                        description={"Set the initial text of the note on the text editor below. You can leave this empty if you want."}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Wizard"}
                    />,

                    <Flex fw padding flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} paddingX={px(25)} elements={[
                        <Button width={percent(100)} text={"Back"} onClick={() => {
                            // TODO: Implement
                        }}/>,
                        this.component(local => {
                            if (local.state.url.trim().length === 0) {
                                return (
                                    <Button width={percent(100)} text={"Skip & Create"} onClick={() => {
                                        p.onSubmit(local.state.url);
                                    }}/>
                                );
                            } else {
                                return (
                                    <Button width={percent(100)} opaque visualMeaning={ObjectVisualMeaning.INFO} text={"Create"} onClick={() => {
                                        p.onSubmit(local.state.url);
                                    }}/>
                                );
                            }

                        }, "note-companions")
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
                                    p.onSubmit(this.local.state.url);
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
                                p.onSubmit(this.local.state.url);
                            });
                        }}
                        theme={"ses-x-dark-tritanopia"}
                        defaultValue={l.url}
                        onChange={(value, ev) => {
                            this.local.setState({
                                url: value
                            }, new Map<string, any>(), () => {
                                this.local.state.urlReRenderer();
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

import {WizardRoutine} from "../../WizardRoutine";
import {WizardRoutineCard} from "../../../../components/documentWizard/WizardRoutineCard";
import React from "react";
import {Button} from "../../../../../../components/lo/Button";
import {DocumentSetupDialog} from "../../../../components/DocumentSetupDialog";
import {AtlasDocument} from "../../../../data/AtlasDocument";
import {NoteDocumentArchetype} from "../../../../data/documentArchetypes/NoteDocumentArchetype";
import {Flex} from "../../../../../../components/lo/FlexBox";
import {BC} from "../../../../../../logic/BernieComponent";
import {Themeable} from "../../../../../../logic/style/Themeable";
import {Assembly} from "../../../../../../logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../../../../../components/lo/StaticDrawerMenu";
import Editor from "@monaco-editor/react";
import {DrawerHeader} from "../../../../../../components/lo/DrawerHeader";
import {DimensionalMeasured, percent, px} from "../../../../../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning, VM} from "../../../../../../logic/style/ObjectVisualMeaning";
import _ from "lodash";
import {FlexDirection} from "../../../../../../logic/style/FlexDirection";
import {Dimension} from "../../../../../../logic/style/Dimension";
import {WizardSubRoutine} from "../../WizardSubRoutine";
import {DefaultWizardEngine} from "../../engines/DefaultWizardEngine";

export const noteWizardRoutine: WizardRoutine = {
    title: "Create note",
    description: "Create empty note",
    tags: ["Note", "Blank"],
    previewCard: (onSelectCallback) => (
        <WizardRoutineCard
            title={"Create note"}
            description={"Create empty note"}
            tooltip={"Create empty note"}
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
                            <NoteWizardNoteForm onSubmit={note => {
                                resolve({
                                    body: JSON.stringify({
                                        note: note
                                    } as NoteDocumentArchetype)
                                });
                            }}/>
                        );
                    });
                }
            })
        });
    }
}

export type NoteWizardNoteFormProps = {
    onSubmit: (note: string) => void
}

export type NoteWizardNoteFormLocalState = {
    note: string
    noteReRenderer: () => void
}

class NoteWizardNoteForm extends BC<NoteWizardNoteFormProps, any, NoteWizardNoteFormLocalState> {

    constructor(props: NoteWizardNoteFormProps) {
        super(props, undefined, {
            note: "",
            noteReRenderer: _.debounce(() => {
                this.rerender("note-companions");
            }, 500)
        });
    }

    componentRender(p: NoteWizardNoteFormProps, s: any, l: NoteWizardNoteFormLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={() => (
                <Flex height={DimensionalMeasured.of(70, Dimension.vh)} fw elements={[
                    <DrawerHeader
                        header={"What's your note?"}
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
                            if (local.state.note.trim().length === 0) {
                                return (
                                    <Button width={percent(100)} text={"Skip & Create"} onClick={() => {
                                        p.onSubmit(local.state.note);
                                    }}/>
                                );
                            } else {
                                return (
                                    <Button width={percent(100)} opaque visualMeaning={ObjectVisualMeaning.INFO} text={"Create"} onClick={() => {
                                        p.onSubmit(local.state.note);
                                    }}/>
                                );
                            }

                        }, "note-companions")
                    ]}/>,
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
                                    // "editor.background": t.colors.backgroundColor.toHex(),
                                    "editor.background": t.colors.backgroundHighlightColor.toHex(),
                                    "editor.lineHighlightBackground":  t.colors.backgroundHighlightColor200.toHex(),
                                }
                            });
                        }}
                        onMount={(editor, monaco) => {
                            editor.focus();


                            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, args => {
                                p.onSubmit(this.local.state.note);
                            });
                        }}
                        theme={"ses-x-dark-tritanopia"}
                        defaultValue={l.note}
                        onChange={(value, ev) => {
                            this.local.setState({
                                note: value
                            }, new Map<string, any>(), () => {
                                this.local.state.noteReRenderer();
                            });
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
                ]}/>
            )}/>
        );
    }
}

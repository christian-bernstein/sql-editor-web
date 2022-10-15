import {DocumentView} from "../DocumentView";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {DrawerHeader} from "../../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {Flex} from "../../../../components/lo/FlexBox";
import React from "react";
import Editor from "@monaco-editor/react";
import {utilizeGlobalTheme} from "../../../../logic/app/App";
import {NoteDocumentArchetype} from "../../data/documentArchetypes/NoteDocumentArchetype";

export const inDevDocumentView: DocumentView = {
    renderer: (document, updateBody) => {
        const t = utilizeGlobalTheme();

        let note = undefined;
        try {
            note = (JSON.parse(document.body ?? "") as NoteDocumentArchetype).note;
        } catch (e) {
            console.error(e);
        }

        return (
            <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} padding={false} elements={[
                // <DrawerHeader
                //     header={"inDevDocumentView"}
                //     badgeText={"Note"}
                //     enableBadge
                //     badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                //     description={"All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager"}
                // />,

                // <iframe
                //     id="inlineFrameExample"
                //     title="Inline Frame Example"
                //     width="100%"
                //     height="100%"
                //     src={url}
                //     style={{ border: "none" }}
                // />,

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
                                "editor.background": t.colors.backgroundColor.toHex(),
                                "editor.lineHighlightBackground":  t.colors.backgroundHighlightColor200.toHex(),
                            }
                        });
                    }}
                    theme={"ses-x-dark-tritanopia"}
                    defaultValue={note ?? ""}
                    onChange={(value, ev) => {
                        updateBody(JSON.stringify({
                            note: value ?? ""
                        } as NoteDocumentArchetype));
                    }}
                    options={{
                        fontLigatures: true
                    }}
                />
            ]}/>
        );
    }
}

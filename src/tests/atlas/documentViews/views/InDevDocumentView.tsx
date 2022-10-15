import {DocumentView} from "../DocumentView";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {DrawerHeader} from "../../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {Flex} from "../../../../components/lo/FlexBox";
import React from "react";
import Editor from "@monaco-editor/react";
import {utilizeGlobalTheme} from "../../../../logic/app/App";

export const inDevDocumentView: DocumentView = {
    renderer: document => {
        const t = utilizeGlobalTheme();

        return (
            <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} padding elements={[
                <DrawerHeader
                    header={"inDevDocumentView"}
                    badgeText={"DEV"}
                    enableBadge
                    badgeVM={ObjectVisualMeaning.BETA}
                    description={"All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager"}
                />,

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
                    // defaultLanguage="typescript"
                    defaultValue={"Hello world!"}
                    // onChange={l.onChange}
                    options={{
                        // fontFamily: "JetBrains Mono",
                        fontLigatures: true
                    }}
                />
            ]}/>
        );
    }
}

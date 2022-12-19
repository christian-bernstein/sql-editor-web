import {DocumentView} from "../DocumentView";
import {OverflowBehaviour} from "../../../sql/logic/style/OverflowBehaviour";
import {Flex} from "../../../sql/components/lo/FlexBox";
import React from "react";
import Editor from "@monaco-editor/react";
import {NoteDocumentArchetype} from "../../data/documentArchetypes/NoteDocumentArchetype";
import {OverflowWithHeader} from "../../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../sql/logic/style/FlexDirection";
import {px} from "../../../sql/logic/style/DimensionalMeasured";
import {Separator} from "../../../sql/components/lo/Separator";
import {Orientation} from "../../../sql/logic/style/Orientation";
import {Align} from "../../../sql/logic/style/Align";
import {Text, TextType} from "../../../sql/components/lo/Text";
import {Box} from "../../../sql/components/lo/Box";
import {BC} from "../../../sql/logic/BernieComponent";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Dot} from "../../../sql/components/lo/Dot";
import {DocumentSaveState} from "../../data/DocumentSaveState";
import {Tooltip} from "../../../sql/components/ho/tooltip/Tooltip";
import {Icon} from "../../../sql/components/lo/Icon";
import {ReactComponent as SavedIcon} from "../../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as PendingIcon} from "../../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {DocumentState} from "../../data/DocumentState";
import {Button} from "../../../sql/components/lo/Button";
import EmojiPicker, {Emoji, EmojiStyle, SuggestionMode, Theme} from "emoji-picker-react";
import {ContextCompound} from "../../../sql/components/ho/contextCompound/ContextCompound";
import styled from "styled-components";
import {DocumentViewRenderContext} from "../DocumentViewRenderContext";
import {VFSFolderView} from "../../components/VFSFolderView";

export const inDevDocumentView: DocumentView = {
    renderer: (context) => {
        return (
            <InDevDocumentView context={context}/>
        );
    }
}

type InDevDocumentViewProps = {
    context: DocumentViewRenderContext
}

type InDevDocumentViewLocalState = {
    noteMirror: string
}

class InDevDocumentView extends BC<InDevDocumentViewProps, any, InDevDocumentViewLocalState> {

    constructor(props: InDevDocumentViewProps) {
        super(props, undefined, {
            noteMirror: ""
        });
    }

    componentRender(p: InDevDocumentViewProps, s: any, l: InDevDocumentViewLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        // const docState: DocumentState = view.getDocumentState(document.id);
        const document = p.context.data.documentGetter();
        const docState: DocumentState = p.context.data.documentStateGetter();
        const view: VFSFolderView = p.context.data.view;

        let note: string = "";
        try {
            note = (JSON.parse(document.body as string) as NoteDocumentArchetype).note ?? "Cannot load..";
        } catch (e) {
            console.error(e);
        }

        return (
            <OverflowWithHeader
                dir={FlexDirection.COLUMN_REVERSE}
                staticContainer={{
                    gap: px(),
                    elements: [
                        // <Box
                        //     fw
                        //     borderless
                        //     borderRadiiConfig={{enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(0)}}
                        //     paddingY={t.paddings.defaultButtonPadding}
                        //     elements={[
                        //         <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                        //             <Text text={"Toolbox"} fontSize={px(11)} type={TextType.secondaryDescription}/>,
                        //             // <ContextCompound wrapMenu={false} menu={
                        //             //     (() => {
                        //             //         const Wrapper = styled.div`
                        //             //           .EmojiPickerReact {
                        //             //             background-color: ${t.colors.backgroundHighlightColor.withAlpha(.9).css()};
                        //             //             border: none !important;
                        //             //
                        //             //             * {
                        //             //               font-family: "OperatorMono", "Consolas", monospace !important;
                        //             //             }
                        //             //
                        //             //             .epr-emoji-category-label {
                        //             //               background-color: ${t.colors.backgroundHighlightColor.css()} !important;
                        //             //             }
                        //             //           }
                        //             //         `;
                        //             //         return (
                        //             //             <Wrapper children={
                        //             //                 <EmojiPicker suggestedEmojisMode={SuggestionMode.FREQUENT} autoFocusSearch theme={Theme.DARK} emojiStyle={EmojiStyle.TWITTER} onEmojiClick={(emoji, event) => {
                        //             //                     this.dialog(
                        //             //                         <>
                        //             //                             {emoji.unified}
                        //             //                             <Emoji emojiStyle={EmojiStyle.TWITTER} unified={emoji.unified}/>
                        //             //                         </>
                        //             //                     );
                        //             //                 }}/>
                        //             //             }/>
                        //             //         );
                        //             //     })()
                        //             // } children={
                        //             //     <Tooltip title={"Open Emoji Picker"} children={
                        //             //         <Button children={<Emoji emojiStyle={EmojiStyle.TWITTER} unified={"1f389"} size={16} lazyLoad/>} onClick={(event) => {
                        //             //             if (event.ctrlKey) {
                        //             //                 this.dialog(
                        //             //                     <EmojiPicker lazyLoadEmojis suggestedEmojisMode={SuggestionMode.FREQUENT} autoFocusSearch theme={Theme.DARK} emojiStyle={EmojiStyle.TWITTER} onEmojiClick={(emoji, event) => {
                        //             //                         this.dialog(
                        //             //                             <Emoji emojiStyle={EmojiStyle.TWITTER} unified={emoji.unified}/>
                        //             //                         );
                        //             //                     }}/>
                        //             //                 )
                        //             //             };
                        //             //         }}/>
                        //             //     }/>
                        //             // }/>,
                        //         ]}/>,
                        //     ]}
                        // />,
                        // <Separator orientation={Orientation.HORIZONTAL}/>
                    ]
                }}
                overflowContainer={{
                    elements: [
                        <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} padding={true} paddingX={px()} style={{ backgroundColor: t.colors.backgroundHighlightColor.toHex() }} elements={[
                            <Editor
                                saveViewState
                                onMount={(editor, monaco) => {
                                    editor.addCommand(monaco.KeyCode.F8, () => {
                                        // this.execute();
                                    }, "");

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

                                    monaco.languages.register({ id: "notes-lang" })

                                    monaco.languages.setMonarchTokensProvider("notes-lang", {
                                        tokenizer: {
                                            root: [
                                                [/->/, "arrow-right"],
                                                [/=>/, "arrow-right"],
                                                [/-/, "bullet-point"],
                                                [/:/, "double-point"],
                                                [/;/, "semicolon"],
                                                [/#.*/, "default-comment"],

                                                [/TODO\(.*\)/, "todo"],

                                                [/FOREACH/, "method"],

                                                [/RETURN/, "keyword"],
                                                [/FUNCTION/, "keyword"],
                                                [/FUNC/, "keyword"],
                                                [/FOR/, "keyword"],
                                                [/IF/, "keyword"],
                                                [/FALSE/, "keyword"],
                                                [/AS/, "keyword"],
                                                [/TO/, "keyword"],
                                                [/WITH/, "keyword"],
                                                [/WHILE/, "keyword"],
                                                [/THEN/, "keyword"],
                                                [/".*"/, "string"],
                                                [/'.*'/, "string"],

                                                // Values
                                                [/ELSE/, "keyword"],
                                                [/TRUE/, "keyword"],
                                                [/NULL/, "keyword"],
                                                [/UNDEFINED/, "keyword"],

                                                // Logic
                                                [/AND/, "keyword"],
                                                [/OR/, "keyword"],

                                                // Imaginary data types: basics
                                                [/INT/, "keyword"],
                                                [/BOOLEAN/, "keyword"],
                                                [/BOOL/, "keyword"],
                                                [/BYTE/, "keyword"],
                                                [/BIT/, "keyword"],
                                                [/DOUBLE/, "keyword"],
                                                [/LONG/, "keyword"],
                                                [/FLOAT/, "keyword"],

                                                // Imaginary data types: advanced structures
                                                [/ARRAY/, "keyword"],
                                                [/SET/, "keyword"],
                                                [/MAP/, "keyword"],

                                                // Imaginary functions
                                                [/MAP/, "method"],
                                                [/MAX/, "method"],
                                                [/MIN/, "method"],
                                                [/AVG/, "method"],
                                                [/FILTER/, "method"],
                                                [/LEN/, "method"],
                                                [/EMPTY/, "method"],
                                                [/LENGTH/, "method"],

                                                // Conception highlights
                                                [/CONCEPT/, "keyword"],
                                                [/BUG/, "keyword"],
                                                [/ERROR/, "keyword"],
                                                [/DEBUG/, "keyword"],

                                                // TODO Make better
                                                [/LAMBDA/, "keyword"],
                                                [/DO/, "keyword"],
                                                [/IN/, "keyword"],
                                                [/(\d|\.)+/, "number"],
                                            ]
                                        }
                                    })

                                    monaco.editor.defineTheme("ses-x-dark-tritanopia-notes", {
                                        base: "vs-dark",
                                        inherit: true,
                                        rules: [
                                            { token: "", background: t.colors.backgroundColor.toHex() },
                                            { token: "arrow-right", foreground: "#A782BB" },
                                            { token: "bullet-point", foreground: "#585858" },
                                            { token: "double-point", foreground: "#585858" },
                                            { token: "default-comment", foreground: "#585858" },
                                            { token: "number", foreground: "#6796BA" },
                                            { token: "todo", foreground: "#A7BE23" },
                                            { token: "keyword", foreground: "#CA7732" },
                                            { token: "semicolon", foreground: "#CA7732" },
                                            { token: "method", foreground: "#FFC66D" },
                                            { token: "string", foreground: "#8EA765" },
                                        ],
                                        colors: {
                                            // "editor.background": t.colors.backgroundColor.toHex(),
                                            "editor.background": t.colors.backgroundHighlightColor.toHex(),
                                            "editor.lineHighlightBackground":  t.colors.backgroundHighlightColor200.toHex(),
                                        }
                                    });
                                }}
                                theme={"ses-x-dark-tritanopia-notes"}
                                language={"notes-lang"}
                                defaultValue={note ?? ""}
                                onChange={(value, ev) => {
                                    const newBody = JSON.stringify({
                                        note: value ?? ""
                                    } as NoteDocumentArchetype);
                                    p.context.data.bodyUpdater.update({
                                        newBody: newBody
                                    });
                                    this.local.setState({
                                        noteMirror: value
                                    });
                                }}
                                options={{
                                    hideCursorInOverviewRuler: true,
                                    lineDecorationsWidth: 0,
                                    renderValidationDecorations: "off",
                                    overviewRulerBorder: false,
                                    renderLineHighlight: "none",
                                    codeLens: false,
                                    cursorStyle: "underline",
                                    matchBrackets: "always",
                                    autoClosingBrackets: "always",
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
                                                        <Icon icon={<PendingIcon/>} colored visualMeaning={VM.WARNING} size={px(16)}/>
                                                    }/>
                                                );
                                            default:
                                                return <></>
                                        }
                                    }, view.toDocumentSpecificChannel(document.id, "persistence-sync-state")),

                                    view.component(
                                        () => {
                                            const note = this.local.state.noteMirror;
                                            const charCount = note.length;
                                            const wordCount = note.trim().split(/\s+/).length;
                                            const byteLength = Buffer.byteLength(note, 'utf16le');

                                            return (
                                                <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                                    <Text text={`${wordCount} words`} fontSize={px(11)} type={TextType.secondaryDescription}/>,
                                                    <Dot/>,
                                                    <Text text={`${charCount} characters`} fontSize={px(11)} type={TextType.secondaryDescription}/>,
                                                    <Dot/>,
                                                    <Text text={`${byteLength} bytes (utf-16-le)`} fontSize={px(11)} type={TextType.secondaryDescription}/>,
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

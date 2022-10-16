import {DocumentView} from "../DocumentView";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {Flex} from "../../../../components/lo/FlexBox";
import React from "react";
import Editor from "@monaco-editor/react";
import {utilizeGlobalTheme} from "../../../../logic/app/App";
import {NoteDocumentArchetype} from "../../data/documentArchetypes/NoteDocumentArchetype";
import {OverflowWithHeader} from "../../../../components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {px} from "../../../../logic/style/DimensionalMeasured";
import {Separator} from "../../../../components/lo/Separator";
import {Orientation} from "../../../../logic/style/Orientation";
import {Align} from "../../../../logic/style/Align";
import {Text, TextType} from "../../../../components/lo/Text";
import {Box} from "../../../../components/lo/Box";
import {BC} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {VFSFolderView} from "../../components/VFSFolderView";
import {AtlasDocument} from "../../data/AtlasDocument";
import {Dot} from "../../../../components/lo/Dot";
import {DocumentSaveState} from "../../data/DocumentSaveState";
import {Tooltip} from "../../../../components/ho/tooltip/Tooltip";
import {Icon} from "../../../../components/lo/Icon";
import {ReactComponent as SavedIcon} from "../../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as PendingIcon} from "../../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {VM} from "../../../../logic/style/ObjectVisualMeaning";
import {DocumentState} from "../../data/DocumentState";

export const inDevDocumentView: DocumentView = {
    renderer: (view, document, updateBody) => {
        const t = utilizeGlobalTheme();

        let note: string = "";
        try {
            note = (JSON.parse(document.body as string) as NoteDocumentArchetype).note ?? "Cannot load..";
        } catch (e) {
            console.error(e);
        }

        return (
            <InDevDocumentView view={view} document={document} updateBody={updateBody}/>
        );
    }
}

type InDevDocumentViewProps = {
    view: VFSFolderView,
    document: AtlasDocument,
    updateBody: (body: string) => void
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
        const view = p.view;
        const document = p.document;
        const updateBody = p.updateBody
        const docState: DocumentState = view.getDocumentState(document.id);

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
                        <Box
                            fw
                            borderless
                            borderRadiiConfig={{enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(0)}}
                            elements={[
                                <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} elements={[
                                    <Text text={"Toolbox"} fontSize={px(11)} type={TextType.secondaryDescription}/>
                                ]}/>,
                            ]}
                        />,
                        <Separator orientation={Orientation.HORIZONTAL}/>
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
                                    this.local.setState({
                                        noteMirror: value
                                    });
                                }}
                                // options={{
                                //     fontLigatures: true
                                // }}

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
                                    view.component(l => {
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

import {BernieComponent} from "../../../logic/BernieComponent";
import React from "react";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import styled from "styled-components";
import {Icon} from "../../lo/Icon";
import {CheckRounded, DeleteRounded, FilePresentRounded, UploadFileRounded} from "@mui/icons-material";
import {AF} from "../../logic/ArrayFragment";
import {Description} from "../../lo/Description";
import {FlexRow} from "../../lo/FlexBox";
import {Box} from "../../lo/Box";
import {Align} from "../../../logic/style/Align";
import {Cursor} from "../../../logic/style/Cursor";
import {Separator} from "../../lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {px} from "../../../logic/style/DimensionalMeasured";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {Utils} from "../../../logic/Utils";
import {FileInputSubmissionMode} from "./FileInputSubmissionMode";
import {If} from "../../logic/If";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Document, pdfjs} from "react-pdf";
import {FileInputSubmissionContext} from "./FileInputSubmissionContext";

export type FileInputProps = {
    submissionMode?: FileInputSubmissionMode,
    onSubmit?: (ctx: FileInputSubmissionContext) => void
}

export type FileInputLocalState = {
    files?: FileList,
}

export class FileInput extends BernieComponent<FileInputProps, any, FileInputLocalState> {

    private static readonly defaultProps: FileInputProps = {
        submissionMode: FileInputSubmissionMode.AUTO_SUBMIT
    }

    constructor(props: FileInputProps) {
        super({...FileInput.defaultProps, ...props}, undefined, {});
    }

    private clearFiles() {
        this.local.setStateWithChannels({
            files:  undefined
        }, ["files"]);
    }

    private areFilesSelected(): boolean {
        const ls = this.ls();
        return ls.files !== undefined && ls.files.length > 0;
    }


    componentRender(p: FileInputProps, s: any, l: FileInputLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const Label = styled.label``;
        const Input = styled.input`
          &[type="file"] {
            display: none;
          }
        `;

        return (
            <Label children={
                <Box cursor={Cursor.pointer} paddingY={t.gaps.smallGab} paddingX={t.gaps.smallGab} elements={[
                    <FlexRow gap={t.gaps.smallGab} fh align={Align.CENTER} elements={[

                        <Input multiple={false} autoFocus type={"file"} onChange={ev => {
                            this.local.setStateWithChannels({
                                files: ev.target.files !== null ? ev.target.files : undefined
                            }, ["files"]);

                            if (ev.target.files !== null) {
                                const file: File = ev.target.files[0];
                                const reader: FileReader = new FileReader();
                                reader.onload = async (event: ProgressEvent<FileReader>) => {
                                    const src = event.target?.result;
                                    p.onSubmit?.({
                                        file: file,
                                        dataURL: src as string
                                    });
                                }
                                reader.readAsDataURL(file);
                            }
                        }}/>,

                        <Icon icon={<UploadFileRounded/>}/>,

                        this.component(() => {
                            const ls = this.ls();
                            if (this.areFilesSelected()) {
                                const files = ls.files as FileList;
                                const mappable = [];
                                for (let i = 0; i < files.length; i++) mappable.push(files[i]);
                                return (
                                    <AF elements={[
                                        <Separator style={{ height: "20px" }} orientation={Orientation.VERTICAL} width={px(1)} />,
                                        mappable.map(file => {
                                            return (
                                                <FlexRow gap={t.gaps.smallGab} elements={[
                                                    <Description
                                                        renderMarkdown={false}
                                                        cursor={Cursor.pointer}
                                                        text={`${file.name} *${Utils.humanFileSize(file.size)}*; ${file.type}`}
                                                    />
                                                ]}/>
                                            );
                                        }),
                                        <Icon
                                            uiNoHighlightOnDefault={true}
                                            coloredOnDefault={false}
                                            icon={<DeleteRounded/>}
                                            colored
                                            visualMeaning={VM.ERROR}
                                            tooltip={"Remove"}
                                            onClick={(event) => {
                                                this.clearFiles();
                                                event.preventDefault();
                                                event.stopPropagation();
                                            }}
                                        />,
                                        <If condition={p.submissionMode === FileInputSubmissionMode.MANUAL_SUBMIT} ifTrue={
                                            <Icon
                                                coloredOnDefault={false}
                                                icon={<CheckRounded/>}
                                                colored
                                                visualMeaning={VM.SUCCESS}
                                                tooltip={"Submit"}
                                                onClick={(event) => {
                                                    // TODO: Add submission logic
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                            />
                                        }/>
                                    ]}/>
                                );
                            }

                            return (
                                <></>
                            );
                        }, "files")
                    ]}/>
                ]}/>
            }/>
        );
    }
}

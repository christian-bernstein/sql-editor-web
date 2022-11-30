import {BernieComponent} from "../../../logic/BernieComponent";
import React from "react";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import styled from "styled-components";
import {Icon} from "../../lo/Icon";
import {
    AttachFileRounded,
    DeleteForeverRounded, DeleteRounded,
    FilePresentRounded, RemoveCircleOutlineRounded,
    RemoveRounded,
    UploadFileRounded
} from "@mui/icons-material";
import {Tooltip} from "../tooltip/Tooltip";
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

export type FileInputLocalState = {
    files?: FileList
}

export class FileInput extends BernieComponent<any, any, FileInputLocalState> {

    constructor() {
        super(undefined, undefined, {
        });
    }

    private clearFiles() {
        this.local.setStateWithChannels({
            files:  undefined
        }, ["files"]);
    }

    componentRender(p: any, s: any, l: FileInputLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

        const Label = styled.label`
          width: 100%;
          height: 100%;
        `;

        const Input = styled.input`
          &[type="file"] {
            display: none;
          }
        `;

        return (
            <Box cursor={Cursor.pointer} paddingY={t.gaps.smallGab} paddingX={t.gaps.smallGab} elements={[
                <FlexRow gap={t.gaps.smallGab} fh align={Align.CENTER} elements={[
                    <Tooltip arrow title={"Upload file"} children={
                        <Label>
                            <Input multiple={false} autoFocus type={"file"} onChange={ev => {
                                this.local.setStateWithChannels({
                                    files: ev.target.files !== null ? ev.target.files : undefined
                                }, ["files"]);
                            }}/>
                            <Icon icon={<UploadFileRounded/>}/>
                        </Label>
                    }/>,


                    <AF elements={[
                        this.component(() => {
                            if (this.ls().files !== undefined) {
                                const files = this.ls().files as FileList;
                                const mappable = [];
                                for (let i = 0; i < files.length; i++) mappable.push(files[i]);
                                return (
                                    <AF elements={[
                                        <Separator style={{ height: "20px" }} orientation={Orientation.VERTICAL} width={px(1)} />,
                                        mappable.map(file => {
                                            return (
                                                <FlexRow gap={t.gaps.smallGab} elements={[
                                                    // <Icon icon={<FilePresentRounded/>}/>,
                                                    <Description
                                                        cursor={Cursor.pointer}
                                                        text={`${file.name} *${Utils.humanFileSize(file.size)}*`}
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
                                            onClick={() => this.clearFiles()}
                                        />
                                    ]}/>
                                );
                            }

                            return (
                                <></>
                            );
                        }, "files")
                    ]}/>
                ]}/>
            ]}/>
        );
    }
}

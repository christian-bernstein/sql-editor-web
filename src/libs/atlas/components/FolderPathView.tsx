import {BC} from "../../sql/logic/BernieComponent";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Folder} from "../data/Folder";
import {FlexBox} from "../../sql/components/lo/FlexBox";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {Tooltip} from "../../sql/components/ho/tooltip/Tooltip";
import {Icon} from "../../sql/components/lo/Icon";
import {ObjectVisualMeaning, VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {Align} from "../../sql/logic/style/Align";
import {Text, TextType} from "../../sql/components/lo/Text";
import {OverflowBehaviour} from "../../sql/logic/style/OverflowBehaviour";
import React from "react";
import {Map} from "../../sql/components/logic/Map";
import {array} from "../../sql/logic/Utils";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {Cursor} from "../../sql/logic/style/Cursor";
import {ReactComponent as BackIcon} from "../../../assets/icons/ic-16/ic16-chevron-left.svg";
import {Button} from "../../sql/components/lo/Button";

export type FolderPathViewProps = {
    path: Array<Folder>;
    gotoFolder: (selectedFolder: Folder) => void
}

export class FolderPathView extends BC<FolderPathViewProps, any, any> {

    init() {
        super.init();
        this.prependAssembly();
        this.foldersAssembly();
    }

    private prependAssembly() {
        this.assembly.assembly("prepend", theme => {
            const path = this.props.path;
            if (path.length > 1) {
                // Can go back
                return (
                    <Button border={false} cursor={Cursor.pointer} onClick={() => {
                        this.props.gotoFolder(path[path.length - 2]);
                    }} children={
                        <Icon icon={<BackIcon/>} size={px(16)}/>
                    }/>
                );
            } else {
                // Already at the root
                return (
                    <Button border={false} cursor={Cursor.notAllowed} children={
                        <Icon icon={<BackIcon/>} size={px(16)} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                    }/>
                );
            }
        });
    }

    private foldersAssembly() {
        this.assembly.assembly("folders", theme => {
            return (
                <Map<Folder>
                    data={this.props.path}
                    renderer={(folder, data, index) => {
                        const isLast = !(index < array.length);
                        return (
                            <AF elements={[
                                <Tooltip title={`Go to ${folder.id}`} arrow children={
                                    <Text
                                        whitespace={"nowrap"}
                                        text={`${folder.title}`}
                                        cursor={Cursor.pointer}
                                        highlight={isLast}
                                        coloredText={isLast}
                                        visualMeaning={isLast ? VM.INFO : VM.UI_NO_HIGHLIGHT}
                                        onClick={() => {
                                            console.log(!isLast, index)
                                            if (!isLast) {
                                                this.props.gotoFolder(folder);
                                            }
                                        }
                                    }/>
                                }/>,
                                <Text text={"/"} type={TextType.secondaryDescription}/>
                            ]}/>
                        );
                    }}
                />
            );
        });
    }

    componentRender(p: FolderPathViewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox
                flexDir={FlexDirection.ROW}
                width={percent(100)}
                align={Align.CENTER}
                gap={t.gaps.smallGab}
                elements={[
                    <FlexBox
                        gap={t.gaps.smallGab}
                        padding={false}
                        flexDir={FlexDirection.ROW}
                        style={{ flex: "0 1 auto" }}
                        elements={[this.a("prepend")]}
                    />,

                    <FlexBox
                        flexDir={FlexDirection.ROW}
                        gap={t.gaps.smallGab}
                        style={{ flex: "1 1 auto" }}
                        overflowYBehaviour={OverflowBehaviour.SCROLL}
                        elements={[this.a("folders")]}
                    />
                ]}
            />
        );
    }
}

import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Folder} from "../data/Folder";
import {FlexBox} from "../../../components/lo/FlexBox";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {Icon} from "../../../components/lo/Icon";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {Align} from "../../../logic/style/Align";
import {Text, TextType} from "../../../components/lo/Text";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import React from "react";
import {Map} from "../../../components/logic/Map";
import {array} from "../../../logic/Utils";
import {AF} from "../../../components/logic/ArrayFragment";
import {Cursor} from "../../../logic/style/Cursor";
import {ReactComponent as BackIcon} from "../../../assets/icons/ic-16/ic16-chevron-left.svg";
import {Button} from "../../../components/lo/Button";

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
            return (
                <Button children={
                    <Icon icon={<BackIcon/>} size={px(16)}/>
                }/>
            );
        });
    }

    private foldersAssembly() {
        this.assembly.assembly("folders", theme => {
            return (
                <Map<Folder>
                    data={this.props.path.reverse()}
                    renderer={(folder, data, index) => {
                        const isLast = !(index + 1 < array.length);
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
                                            if (!isLast) {

                                            }
                                        }
                                    }/>
                                }/>,
                                // !isLast ? <Dot/> : undefined
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

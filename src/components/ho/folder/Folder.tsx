import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Box} from "../../lo/Box";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {FlexBox} from "../../lo/FlexBox";
import {Justify} from "../../../logic/style/Justify";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {Icon} from "../../lo/Icon";
import {ReactComponent as ContextIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ContextCompound} from "../contextCompound/ContextCompound";
import {ContextMenuElement} from "../../lo/ContextMenuElement";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {ReactComponent as FolderIcon} from "../../../assets/icons/ic-20/ic20-folder.svg";
import React from "react";
import {Text} from "../../lo/Text";
import {Cursor} from "../../../logic/style/Cursor";
import {FolderData} from "../../../logic/data/FolderData";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";

export type FolderProps = {
    data: FolderData,
    onSelect?: (data: FolderData) => void
}

export class Folder extends BernieComponent<FolderProps, any, any> {

    constructor(props: FolderProps) {
        super(props, undefined, undefined);
    }

    init() {
        super.init();
        this.desktopMenuAssembly();
    }

    private desktopMenuAssembly() {
        this.assembly.assembly("desktop-menu", theme => (
            <FlexBox gap={px(1)} height={percent(100)}>
                <ContextMenuElement title={"Modify folder"}/>
                <ContextMenuElement visualMeaning={ObjectVisualMeaning.ERROR} opaque title={"Delete folder"}/>
            </FlexBox>
        ));
    }

    private onWrapperClick() {
        this.props?.onSelect?.(this.props.data);
    }

    componentRender(p: FolderProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box highlight cursor={Cursor.pointer} width={percent(100)} onClick={this.onWrapperClick} children={
                <FlexBox width={percent(100)} align={Align.CENTER} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                    <Icon icon={<FolderIcon/>}/>

                    <FlexBox width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                        <FlexBox overflowXBehaviour={OverflowBehaviour.SCROLL}>
                            <Text text={p.data.title} whitespace={"nowrap"}/>
                        </FlexBox>
                    </FlexBox>

                    <FlexBox flexDir={FlexDirection.ROW_REVERSE} align={Align.CENTER}>
                        <ContextCompound menu={this.a("desktop-menu")} children={
                            <Icon icon={<ContextIcon/>}/>
                        }/>
                    </FlexBox>
                </FlexBox>
            }/>
        );
    }
}

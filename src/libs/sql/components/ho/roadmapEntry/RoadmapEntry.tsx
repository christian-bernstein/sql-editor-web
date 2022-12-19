import {BernieComponent} from "../../../logic/BernieComponent";
import {FlexBox} from "../../lo/FlexBox";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import React from "react";
import {ElementHeader} from "../../lo/ElementHeader";
import {Box} from "../../lo/Box";
import {Text, TextType} from "../../lo/Text";
import {InformationBox} from "../informationBox/InformationBox";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {ReactComponent as DownloadIcon} from "../../../../../assets/icons/ic-16/ic16-download.svg";
import {ReactComponent as CheckIcon} from "../../../../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as FutureIcon} from "../../../../../assets/icons/ic-16/ic16-play.svg";
import {Button} from "../../lo/Button";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Separator} from "../../lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {CircularProgress} from "@mui/material";
import {Icon} from "../../lo/Icon";
import {utilizeGlobalTheme} from "../../../logic/app/App";

export type RoadmapEntryProps = {
    status: "completed" | "working" | "future",
}

export class RoadmapEntry extends BernieComponent<RoadmapEntryProps, any, any> {

    constructor(props: RoadmapEntryProps) {
        super(props, undefined, undefined);
    }

    private renderAnchor(): JSX.Element {
        const theme = utilizeGlobalTheme();

        switch (this.props.status) {
            case "completed":
                return (
                    <Icon icon={<CheckIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                );
            case "working":
                return (
                    <CircularProgress size={20} sx={{
                        color: theme.colors.backgroundHighlightColor200.css(),
                    }}/>
                );
            case "future":
                return (
                    <Icon icon={<FutureIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored/>
                );
        }
    }

    // <Icon icon={<DownloadIcon/>}/>
    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox flexDir={FlexDirection.ROW} width={percent(100)}>
                <FlexBox height={percent(100)} align={Align.CENTER}>
                    {this.renderAnchor()}
                    <Separator orientation={Orientation.VERTICAL} borderRadius={px(9999)} width={px(3)}/>
                </FlexBox>
                <FlexBox width={percent(100)}>
                    <ElementHeader title={"**Test**"} beta appendix={
                        <FlexBox flexDir={FlexDirection.ROW_REVERSE} width={percent(100)} align={Align.CENTER}>
                            <Text text={new Date().toLocaleTimeString()} fontSize={px(12)}/>
                        </FlexBox>
                    }/>
                    <Box gapY={t.gaps.smallGab} width={percent(100)} children={this.props.children}/>
                </FlexBox>
            </FlexBox>
        );
    }
}

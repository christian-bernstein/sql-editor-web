import {BernieComponent} from "../logic/BernieComponent";
import {FlexBox} from "./FlexBox";
import {Assembly} from "../logic/Assembly";
import {Themeable} from "../Themeable";
import React from "react";
import {ElementHeader} from "./ElementHeader";
import {Box} from "./Box";
import {Text, TextType} from "./Text";
import {InformationBox} from "./InformationBox";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {ReactComponent as DownloadIcon} from "../assets/icons/ic-16/ic16-download.svg";
import {ReactComponent as CheckIcon} from "../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as FutureIcon} from "../assets/icons/ic-16/ic16-play.svg";
import {Button} from "./Button";
import {percent, px} from "../logic/DimensionalMeasured";
import {Separator} from "./Separator";
import {Orientation} from "../logic/Orientation";
import {FlexDirection} from "../logic/FlexDirection";
import {Align} from "../logic/Align";
import {CircularProgress} from "@mui/material";
import {Icon} from "./Icon";
import {utilizeGlobalTheme} from "../logic/App";

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
            <FlexBox flexDir={FlexDirection.ROW}>
                <FlexBox height={percent(100)} align={Align.CENTER}>
                    {this.renderAnchor()}
                    <Separator orientation={Orientation.VERTICAL} borderRadius={px(9999)} width={px(3)}/>
                </FlexBox>
                <FlexBox>
                    <ElementHeader title={"**Test**"} beta appendix={
                        <FlexBox flexDir={FlexDirection.ROW_REVERSE} width={percent(100)} align={Align.CENTER}>
                            <Text text={new Date().toLocaleTimeString()} fontSize={px(12)}/>
                        </FlexBox>
                    }/>
                    <Box gapY={t.gaps.smallGab}>
                        <ElementHeader
                            icon={<DownloadIcon/>}
                            appendix={
                                <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque padding={px(4)}>
                                    <Text text={"View roadmap"}/>
                                </Button>
                            }
                            wrapIcon
                            title={"Download data"}
                            beta={false}
                        />
                        <Separator/>
                        <Text text={"Export data to a downloadable file. \nAllowed file formats: **.dat**, **.csv**, **.xls** *(Excel spreadsheet)*."}/>
                        <InformationBox visualMeaning={ObjectVisualMeaning.BETA}>
                            <Text type={TextType.secondaryDescription} text={"As of version **v16** *(19. Feb 2022)*, this feature is still in development and will be accessible to beta mode in a couple of weeks."}/>
                        </InformationBox>
                    </Box>
                </FlexBox>
            </FlexBox>
        );
    }
}

import React from "react";
import {Desktop, Mobile} from "../../components/logic/Media";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {ReactComponent as NewIcon} from "../../assets/icons/ic-20/ic20-book.svg";
import {Input} from "../../components/lo/Input";
import {Text} from "../../components/lo/Text";
import {Icon} from "../../components/lo/Icon";
import {Align} from "../../logic/style/Align";
import {Button} from "../../components/lo/Button";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Box} from "../../components/lo/Box";
import {Justify} from "../../logic/style/Justify";
import {CircularProgress} from "@mui/material";
import {App, utilizeGlobalTheme} from "../../logic/app/App";
import {ReactComponent as QuickIcon} from "../../assets/icons/ic-20/ic20-bolt.svg";
import {If} from "../../components/logic/If";
import {createMargin} from "../../logic/style/Margin";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Constants} from "../../logic/misc/Constants";

export const DashboardToolbox: React.FC = props => {
    const theme = utilizeGlobalTheme();

    return (
        <>
            <Desktop>
                <FlexBox align={Align.CENTER} height={percent(100)} flexDir={FlexDirection.ROW} width={percent(100)}>

                    <Box overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN} noPadding height={percent(100)} width={percent(100)}>
                        <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                            <If condition={true} ifTrue={
                                <FlexBox margin={createMargin(0, 0, 0, theme.paddings.defaultObjectPadding.measurand)} width={px(20)} height={px(20)} align={Align.CENTER} justifyContent={Justify.CENTER} children={
                                    <Icon size={px(16)} icon={
                                        <CircularProgress variant={"indeterminate"} size={16} sx={{
                                            color: utilizeGlobalTheme().colors.iconColor.css()
                                        }}/>
                                    }/>
                                }/>

                            } ifFalse={
                                <Icon icon={<QuickIcon/>}/>
                            }/>
                            <Input paddingLeft={false} styledBorder={false} height={percent(100)} minHeightBoundary={false} placeholder={"Find a project…"} width={percent(100)}/>
                        </FlexBox>
                    </Box>




                    <Button visualMeaning={ObjectVisualMeaning.INFO} onClick={() => App.app().callAction("open-main-dialog", Constants.createProjectDialog)} children={
                        <Text text={"New"} enableLeftAppendix leftAppendix={
                            <Icon icon={<NewIcon/>}/>
                        }/>
                    }/>
                </FlexBox>
            </Desktop>
            <Mobile>
                mobile
            </Mobile>
        </>
    );
}

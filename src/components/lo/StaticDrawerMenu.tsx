import React, {useEffect} from "react";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/style/Align";
import {Default, Mobile} from "../logic/Media";
import {Box} from "./Box";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Flex} from "./FlexBox";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {getOr} from "../../logic/Utils";
import {shouldVibrate, VibrationSettingsProps} from "../props/VibrationSettingsProps";
import {If} from "../logic/If";
import {Screen} from "./Page";
import {DrawerProps} from "../props/DrawerProps";

export type StaticDrawerMenuProps = DrawerProps & {
    body: (props: StaticDrawerMenuProps) => JSX.Element,
    vibration?: VibrationSettingsProps,
    enableBlurredBackground?: boolean
}

export const StaticDrawerMenu: React.FC<StaticDrawerMenuProps> = props => {
    const theme = utilizeGlobalTheme();

    useEffect(() => {
        shouldVibrate("appear", props.vibration, pattern => {
            if (window.navigator.vibrate !== undefined) {
                window.navigator.vibrate(pattern);
            }
        });
    });

    const body = (
        <Flex height={percent(100)} justifyContent={Justify.FLEX_END} align={Align.CENTER}>
            <Mobile children={
                <Box borderless width={percent(100)} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                    enableCustomBorderRadii: true,
                    bottomRight: px(),
                    bottomLeft: px()
                }} children={props.body(props)}/>
            }/>
            <Default children={
                <Box borderless width={percent(30)} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                    enableCustomBorderRadii: true,
                    bottomRight: px(),
                    bottomLeft: px()
                }} children={props.body(props)}/>
            }/>
        </Flex>
    );

    return (
        <If condition={getOr(props.enableBlurredBackground, false)} ifTrue={
            <Screen
                style={{backgroundColor: "transparent"}}
                deactivatePadding
                children={body}
            />
        } ifFalse={
            body
        }/>
    );
}
import React, {useEffect, useState} from "react";
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
import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";

export type StaticDrawerMenuProps<T> = DrawerProps<T> & {
    body: (props: StaticDrawerMenuProps<T>) => JSX.Element,
    vibration?: VibrationSettingsProps,
    enableBlurredBackground?: boolean
}

export class StaticDrawerMenu<T> extends BernieComponent<StaticDrawerMenuProps<T>, any, any> {

    componentDidMount() {
        super.componentDidMount();
        shouldVibrate("appear", this.props.vibration, pattern => {
            if (window.navigator.vibrate !== undefined) {
                window.navigator.vibrate(pattern);
            }
        });
    }

    componentRender(p: StaticDrawerMenuProps<T>, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const theme = utilizeGlobalTheme();

        const body = (
            <Flex height={percent(100)} justifyContent={Justify.FLEX_END} align={Align.CENTER}>
                <Mobile children={
                    <Box borderless width={percent(100)} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                        enableCustomBorderRadii: true,
                        bottomRight: px(),
                        bottomLeft: px()
                    }} children={this.props.body(this.props)}/>
                }/>
                <Default children={
                    <Box borderless width={percent(30)} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                        enableCustomBorderRadii: true,
                        bottomRight: px(),
                        bottomLeft: px()
                    }} children={this.props.body(this.props)}/>
                }/>
            </Flex>
        );

        return (
            <If condition={getOr(this.props.enableBlurredBackground, false)} ifTrue={
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

}
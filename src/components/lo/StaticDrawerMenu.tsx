import React from "react";
import {DimensionalMeasured, percent, px} from "../../logic/style/DimensionalMeasured";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/style/Align";
import {Default, Desktop, Mobile, Tablet} from "../logic/Media";
import {Box} from "./Box";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Flex} from "./FlexBox";
import {getOr} from "../../logic/Utils";
import {shouldVibrate, VibrationSettingsProps} from "../props/VibrationSettingsProps";
import {If} from "../logic/If";
import {Screen} from "./Page";
import {DrawerProps} from "../props/DrawerProps";
import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import styled from "styled-components";
import {AF} from "../logic/ArrayFragment";
import {createMargin} from "../../logic/style/Margin";

export type StaticDrawerMenuProps<T> = DrawerProps<T> & {
    body: (props: StaticDrawerMenuProps<T>) => JSX.Element,
    vibration?: VibrationSettingsProps,
    enableBlurredBackground?: boolean,
    width?: DimensionalMeasured,
    align?: Align,
    justifyContent?: Justify,
    componentDidMount?: (drawer: StaticDrawerMenu<T>) => void
}

export class StaticDrawerMenu<T> extends BernieComponent<StaticDrawerMenuProps<T>, any, any> {

    constructor(props: StaticDrawerMenuProps<T>) {
        super(props, undefined, undefined);
    }

    componentDidMount() {
        super.componentDidMount();
        shouldVibrate("appear", this.props.vibration, pattern => {
            if (window.navigator.vibrate !== undefined) {
                window.navigator.vibrate(pattern);
            }
        });
        this.props.componentDidMount?.(this);
    }

    componentRender(p: StaticDrawerMenuProps<T>, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const Puller = styled.div`
          width: 25%;
          height: 6px;
          border-radius: 50px;
          background-color: ${t.colors.backgroundHighlightInputColor.css()};
        `;

        const body = (
            <AF elements={[
                <Mobile children={
                    <Flex margin={createMargin(0, 0, 10, 0)} padding paddingY={px()} paddingX={px(10)} height={percent(100)} justifyContent={Justify.FLEX_END} align={Align.CENTER}>
                        <Box borderless width={percent(100)} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                            enableCustomBorderRadii: false,
                            bottomRight: px(),
                            bottomLeft: px()
                        }} children={
                            <Flex width={percent(100)} align={Align.CENTER} children={
                                <AF elements={[
                                    <Puller/>,
                                    this.props.body(this.props)
                                ]}/>
                            }/>
                        }/>
                    </Flex>
                }/>,

                <Tablet children={
                    <Flex padding paddingY={px()} paddingX={px(10)} height={percent(100)} justifyContent={getOr(p.justifyContent, Justify.FLEX_END)} align={getOr(p.align, Align.CENTER)}>
                        <Box borderless width={getOr(p.width, percent(75))} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                            enableCustomBorderRadii: true,
                            bottomRight: px(),
                            bottomLeft: px()
                        }} children={this.props.body(this.props)}/>
                    </Flex>
                }/>,

                <Desktop children={
                    <Flex padding paddingY={px()} paddingX={px(10)} height={percent(100)} justifyContent={getOr(p.justifyContent, Justify.FLEX_END)} align={getOr(p.align, Align.CENTER)}>
                        <Box borderless width={getOr(p.width, percent(30))} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                            enableCustomBorderRadii: true,
                            bottomRight: px(),
                            bottomLeft: px()
                        }} children={this.props.body(this.props)}/>
                    </Flex>
                }/>
            ]}/>
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

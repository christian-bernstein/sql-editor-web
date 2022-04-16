import React from "react";
import {LiteGrid} from "./LiteGrid";
import {FlexBox} from "./FlexBox";
import {Text, TextType} from "./Text";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/style/Align";
import {percent} from "../../logic/style/DimensionalMeasured";
import {FlexDirection} from "../../logic/style/FlexDirection";

export type AppHeaderProps = {
    title: string
    left?: JSX.Element,
    right?: JSX.Element,
    footer?: JSX.Element
}

export const AppHeader: React.FC<AppHeaderProps> = React.memo(props => {
    return (
        <FlexBox width={percent(100)}>
            <LiteGrid columns={3}>
                <FlexBox justifyContent={Justify.FLEX_START} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                    {props.left}
                </FlexBox>
                <FlexBox justifyContent={Justify.CENTER} align={Align.CENTER}>
                    <Text text={props.title} whitespace={"nowrap"} uppercase={true} align={Align.CENTER} type={TextType.smallHeader}/>
                </FlexBox>
                <FlexBox justifyContent={Justify.FLEX_START} flexDir={FlexDirection.ROW_REVERSE} align={Align.CENTER}>
                    {props.right}
                </FlexBox>
            </LiteGrid>
            {props.footer}
        </FlexBox>
    );
});

import {BC} from "../../../logic/BernieComponent";
import {CommandHighlightMode} from "../CommandHighlightMode";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Justify} from "../../../logic/style/Justify";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Text, TextType} from "../../../components/lo/Text";
import {Box} from "../../../components/lo/Box";
import {Color} from "../../../logic/style/Color";
import React from "react";
import {GloriaCommandDefinition} from "../GloriaCommandDefinition";
import {Gloria} from "../Gloria";
import {Align} from "../../../logic/style/Align";
import {Badge} from "../../../components/lo/Badge";
import {VM} from "../../../logic/style/ObjectVisualMeaning";

export type CommandSelectorProps = {
    gloria: Gloria,
    command: GloriaCommandDefinition,
    highlightMode: CommandHighlightMode,
    // todo implement
    // onSelect: () => void
}

export class CommandSelector extends BC<CommandSelectorProps, any, any> {

    componentRender(p: CommandSelectorProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.highlightMode === CommandHighlightMode.SELECTED) {
            return (
                <Flex style={{ cursor: "pointer", position: "relative", backgroundColor: "#FFFFFF0D" }} fw height={px(35)} justifyContent={Justify.CENTER} elements={[
                    <Flex fw flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} padding paddingX={px(19)} paddingY={px(13)} elements={[
                        <Text
                            text={p.command.title(p.gloria)}
                            type={TextType.secondaryDescription}
                            fontSize={px(12)}
                        />,
                        <FlexRow align={Align.CENTER} elements={[
                            Badge.badge("run", { visualMeaning: VM.UI_NO_HIGHLIGHT })
                        ]}/>
                    ]}/>,

                    <Box bgColor={Color.ofHex("#FFCE61")} width={px(3)} fh noPadding borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px() }} borderless style={{
                        position: "absolute"
                    }}/>
                ]}/>
            );
        }

        return (
            <Flex style={{ position: "relative" }} fw height={px(35)} justifyContent={Justify.CENTER} elements={[
                <Flex fw flexDir={FlexDirection.ROW} padding paddingX={px(19)} paddingY={px(13)} elements={[
                    <Text
                        text={p.command.title(p.gloria)}
                        type={TextType.secondaryDescription}
                        fontSize={px(12)}
                    />
                ]}/>,
            ]}/>
        );
    }
}

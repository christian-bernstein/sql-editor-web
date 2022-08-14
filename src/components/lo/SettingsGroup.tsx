import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Text, TextType} from "./Text";
import {Align} from "../../logic/style/Align";
import {Group} from "./Group";
import {Orientation} from "../../logic/style/Orientation";
import {Flex} from "./FlexBox";
import React from "react";

export type SettingsGroupProps = {
    title?: string,
    elements: Array<JSX.Element>
}

export class SettingsGroup extends BernieComponent<SettingsGroupProps, any, any> {

    componentRender(p: SettingsGroupProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.title !== undefined) {
            return (
                <Flex gap={t.gaps.smallGab} width={percent(100)}>
                    <Text text={p.title} uppercase bold type={TextType.secondaryDescription} fontSize={px(12)} align={Align.START}/>
                    <Group width={percent(100)} orientation={Orientation.VERTICAL} removeChildBorders elements={p.elements}/>
                </Flex>
            );
        } else {
            return (
                <Group width={percent(100)} orientation={Orientation.VERTICAL} removeChildBorders elements={p.elements}/>
            );
        }
    }
}

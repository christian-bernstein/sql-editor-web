import {BC} from "../../../../logic/BernieComponent";
import {Button} from "../../../../components/lo/Button";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import {Flex} from "../../../../components/lo/FlexBox";
import {Align} from "../../../../logic/style/Align";
import {Icon} from "../../../../components/lo/Icon";
import {ReactComponent as FileIcon} from "../../../../assets/icons/ic-20/ic20-file.svg";
import {Text, TextType} from "../../../../components/lo/Text";
import {Tooltip} from "../../../../components/ho/tooltip/Tooltip";
import React from "react";
import {Themeable} from "../../../../logic/style/Themeable";
import {Assembly} from "../../../../logic/assembly/Assembly";

export type WizardRoutineCardProps = {
    tooltip: string,
    title: string,
    description: string,
    onSelect: () => void,
    icon?: JSX.Element
}

export class WizardRoutineCard extends BC<WizardRoutineCardProps, any, any> {

    componentRender(p: WizardRoutineCardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Tooltip arrow title={p.tooltip} children={
                <Button
                    shrinkOnClick
                    width={percent(100)}
                    onClick={() => p.onSelect()}
                    children={
                        <Flex gap={px(3)} align={Align.CENTER} fw elements={[
                            <Icon icon={p.icon ?? <FileIcon/>} size={px(25)}/>,
                            <Text
                                bold
                                text={p.title}
                            />,
                            <Text
                                align={Align.CENTER}
                                text={p.description}
                                type={TextType.secondaryDescription}
                                fontSize={px(11)}
                            />,
                        ]}/>
                    }
                />
            }/>
        );
    }
}

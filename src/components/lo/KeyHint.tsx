import {BC} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Box} from "./Box";
import {FlexRow} from "./FlexBox";
import {Text, TextType} from "./Text";
import {px} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {createMargin} from "../../logic/style/Margin";

export type KeyHintProps = {
    keys: Array<string>,
} & Partial<{
    label: string,
    separator: string
}>

export class KeyHint extends BC<KeyHintProps, any, any> {

    componentRender(p: KeyHintProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexRow gap={px(4)} align={Align.CENTER} elements={[
                p.label === undefined ? <></> : (
                    <Text
                        whitespace={"nowrap"}
                        text={p.label}
                        type={TextType.secondaryDescription}
                        fontSize={px(11)}
                        margin={createMargin(0, 4, 0, 0)}
                    />
                ),
                ...p.keys.map(key => (
                    <Box paddingY={px(2)} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(6) }} opaque paddingX={px(6)} elements={[
                        <Text
                            whitespace={"nowrap"}
                            text={key}
                            renderMarkdown={false}
                            key={key}
                            type={TextType.secondaryDescription}
                            fontSize={px(11)}
                        />
                    ]}/>
                ))
            ]}/>
        );
    }
}

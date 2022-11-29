import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Text, TextProps, TextType} from "./Text";
import {px} from "../../logic/style/DimensionalMeasured";

export type DescriptionProps = TextProps & {}

export class Description extends BernieComponent<DescriptionProps, any, any> {

    componentRender(p: DescriptionProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Text
                {...p}
                fontSize={px(11)}
                type={TextType.secondaryDescription}
            />
        );
    }
}

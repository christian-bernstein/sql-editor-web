import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {FlexBox} from "./FlexBox";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {AF} from "../logic/ArrayFragment";
import {VM} from "../../logic/style/ObjectVisualMeaning";
import {If} from "../logic/If";
import {Badge} from "./Badge";
import {getOr} from "../../logic/Utils";
import {Text, TextType} from "./Text";

export type DrawerHeaderProps = {
    enableBadge?: boolean,
    badgeText?: string,
    badgeVM?: VM
    header: string,
    description?: string
}

export class DrawerHeader extends BernieComponent<DrawerHeaderProps, any, any> {

    componentRender(p: DrawerHeaderProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox width={percent(100)} align={Align.CENTER} children={
                <AF elements={[
                    <If condition={p.enableBadge} ifTrue={
                        Badge.badge(getOr(p.badgeText, ""), {
                            visualMeaning: p.badgeVM
                        })
                    }/>,
                    <FlexBox width={percent(100)} gap={t.gaps.smallGab} align={Align.CENTER}>
                        <Text text={p.header} type={TextType.smallHeader}/>
                        <If condition={p.description !== undefined} ifTrue={
                            <Text text={p.description as string} align={Align.CENTER} type={TextType.secondaryDescription} fontSize={px(11)}/>
                        }/>
                    </FlexBox>
                ]}/>
            }/>
        );
    }

}

import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {FlexBox} from "../../lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Button} from "../../lo/Button";
import {Separator} from "../../lo/Separator";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {getOr} from "../../../logic/Utils";

export type NavHeaderProps = {
    elements: Map<string, (navInstance: NavHeader) => JSX.Element>,
    element?: string,
    onChange: (from: string, to: string) => void,
    bypassOnChangeFilter?: boolean
}

export class NavHeader extends BernieComponent<NavHeaderProps, any, any> {

    constructor(props: NavHeaderProps) {
        super(props, undefined, undefined);
    }

    componentRender(p: NavHeaderProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const element = getOr(p.element, "default");
        return (
            <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                {
                    Array.from(p.elements).map(([id, renderer]) => {
                        return (
                            <FlexBox flexDir={FlexDirection.COLUMN} gap={t.gaps.smallGab}>
                                <Button border={false} bgColorOnDefault={false} opaque opaqueValue={.6} onClick={() => {
                                    if (element !== id || p.bypassOnChangeFilter) {
                                        p.onChange(element, id);
                                    }
                                }} children={
                                    renderer(this)
                                }/>
                                <Separator visualMeaning={ObjectVisualMeaning.INFO} visible={element === id}/>
                            </FlexBox>
                        );
                    })
                }
            </FlexBox>
        );
    }

}

import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {percent} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {FlexBox} from "../lo/FlexBox";
import {Align} from "../../logic/style/Align";
import ScrollContainer from "react-indiana-drag-scroll";

export type SideScrollerProps = {
    useMouseDragging?: boolean
}

export class SideScroller extends BernieComponent<SideScrollerProps, any, any> {

    componentRender(p: SideScrollerProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.useMouseDragging) {
            return (
                <ScrollContainer style={{width: "100%"}} horizontal children={
                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} children={
                        this.props.children
                    }/>
                }/>
            );
        } else {
            return (
                <FlexBox width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} children={
                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} children={
                        this.props.children
                    }/>
                }/>
            );
        }
    }
}

import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Box} from "../../../components/lo/Box";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Separator} from "../../../components/lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {Justify} from "../../../logic/style/Justify";
import {Align} from "../../../logic/style/Align";
import {Text} from "../../../components/lo/Text";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";

export type QueueInfoCardProps = {
    data: any
}

export class QueueInfoCard extends BC<QueueInfoCardProps, any, any> {

    private isIdle(): boolean {
        return this.props.data.idle_since !== undefined;
    }

    componentRender(p: QueueInfoCardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box fw overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN} noPadding elements={[
                <Flex fw fh gap={px()} elements={[
                    <Box borderless borderRadiiConfig={{
                        enableCustomBorderRadii: true, fallbackCustomBorderRadii: px()
                    }} fw bgColor={t.colors.backgroundHighlightInputColor} elements={[
                        <FlexRow fw justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} elements={[
                            <FlexRow align={Align.CENTER} elements={[
                                <Text text={this.props.data.name}/>
                            ]}/>,
                            <FlexRow align={Align.CENTER} />,
                        ]}/>
                    ]}/>,
                    <Separator orientation={Orientation.HORIZONTAL}/>,



                    <FlexRow fw justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} elements={[
                        <Text text={this.isIdle() ? "Idle" : "Running"}/>
                    ]}/>
                ]}/>
            ]}/>
        );
    }
}

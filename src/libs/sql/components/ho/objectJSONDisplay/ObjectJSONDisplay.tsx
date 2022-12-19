import React from "react";
import {Box} from "../../lo/Box";
import ReactJson from "react-json-view";
import {Dimension} from "../../../logic/style/Dimension";
import {DimensionalMeasured} from "../../../logic/style/DimensionalMeasured";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Text} from "../../lo/Text";
import {FlexBox} from "../../lo/FlexBox";
import {ReactComponent as ExpandIcon} from "../../../../../assets/icons/ic-20/ic20-unfold-more.svg";
import {ReactComponent as CollapseIcon} from "../../../../../assets/icons/ic-20/ic20-unfold-less.svg";
import {Icon} from "../../lo/Icon";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Justify} from "../../../logic/style/Justify";
import {getOr} from "../../../logic/Utils";
import {WithVisualMeaning} from "../../../logic/style/WithVisualMeaning";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";

export type ObjectJSONDisplayProps = WithVisualMeaning & {
    object: any,
    title?: string
    showControls?: boolean,
    pure?: boolean,
    opaque?: boolean,
    enableClipboard?: boolean,
    defaultCollapsed?: boolean
}

export type ObjectJSONDisplayState = {
    collapsed: boolean
}

export class ObjectJSONDisplay extends React.Component<ObjectJSONDisplayProps, ObjectJSONDisplayState> {

    constructor(props: ObjectJSONDisplayProps) {
        super(props);
        this.state = {
            collapsed: getOr(props.defaultCollapsed, true)
        };
    }

    private toggleCollapse(collapse?: boolean): ObjectJSONDisplay {
        this.setState({
            collapsed: getOr(collapse, !this.state.collapsed)
        });
        return this;
    }

    private renderTitle(): JSX.Element {
        if (this.props.title === undefined) {
            return <></>;
        } else {
            return <Text text={this.props.title}/>;
        }
    }

    private renderControls(): JSX.Element {
        if (this.props.showControls) {
            return (
                <FlexBox flexDir={FlexDirection.ROW}>
                    <Icon icon={<ExpandIcon/>} onClick={() => this.toggleCollapse(false)}/>
                    <Icon icon={<CollapseIcon/>} onClick={() => this.toggleCollapse(true)}/>
                </FlexBox>
            );
        } else {
            return <></>;
        }
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const vm: ObjectVisualMeaning = getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);
        const mc: MeaningfulColors = getMeaningfulColors(vm, theme);
        return (
            <Box overflowXBehaviour={OverflowBehaviour.SCROLL} width={DimensionalMeasured.of(100, Dimension.percentage)}
                 visualMeaning={getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT)} opaque={this.props.opaque}
                 gapX={DimensionalMeasured.of(10, Dimension.px)} gapY={DimensionalMeasured.of(10, Dimension.px)}>
                {getOr(this.props.pure, true) ? <></> :
                    <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                        {this.renderTitle()}
                        {this.renderControls()}
                    </FlexBox>}
                <div style={{width: "100%", overflowX: "scroll"}}>
                    <ReactJson
                        collapsed={this.state.collapsed}
                        displayDataTypes={true}
                        src={this.props.object}
                        enableClipboard={getOr(this.props.enableClipboard, false)}
                        displayObjectSize={true}
                        theme={theme.libraries.reactJson.theme}
                        iconStyle={"square"}
                        style={{
                            // width: "100%",

                            overflowX: "scroll",
                            whiteSpace: "nowrap",
                            // backgroundColor: theme.colors.backgroundHighlightColor.css()
                            // backgroundColor: mc.lighter.withAlpha(.1).css()
                            backgroundColor: "transparent"
                        }}
                    />
                </div>
            </Box>
        );
    }
}

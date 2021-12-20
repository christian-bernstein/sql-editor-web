import React from "react";
import {Box} from "./Box";
import ReactJson from "react-json-view";
import {Dimension} from "../logic/Dimension";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {OverflowBehaviour} from "../logic/OverflowBehaviour";

export type ObjectJSONDisplayProps = {
    object: any
}

export class ObjectJSONDisplay extends React.Component<ObjectJSONDisplayProps, any> {

    constructor(props: ObjectJSONDisplayProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        return (
            <Box overflowXBehaviour={OverflowBehaviour.SCROLL}
                 width={DimensionalMeasured.of(100, Dimension.percentage)}
                 gapX={DimensionalMeasured.of(10, Dimension.px)}
                 gapY={DimensionalMeasured.of(10, Dimension.px)}>
                <ReactJson collapsed displayDataTypes={false} src={this.props.object} enableClipboard={false} displayObjectSize={false} theme={"grayscale"} iconStyle={"square"} style={{
                    width: "100%",
                    backgroundColor: theme.colors.backgroundHighlightColor.css()
                }}/>
            </Box>
        );
    }
}

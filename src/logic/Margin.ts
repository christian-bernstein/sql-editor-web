import {DimensionalMeasured} from "./style/DimensionalMeasured";
import {Dimension} from "./style/Dimension";
import {CSSProperties} from "styled-components";

export type Margin = {
    top?: DimensionalMeasured,
    right?: DimensionalMeasured,
    bottom?: DimensionalMeasured,
    left?: DimensionalMeasured,
}

export function createMargin(top: number, right: number, bottom: number, left: number, dimension: Dimension = Dimension.px): Margin {
    return {
        top: DimensionalMeasured.of(top, dimension),
        right: DimensionalMeasured.of(right, dimension),
        bottom: DimensionalMeasured.of(bottom, dimension),
        left: DimensionalMeasured.of(left, dimension)
    }
}

export function setMarginToCSSProperties(margin: Margin, css: CSSProperties): CSSProperties {
    return {
        ...css,
        marginTop: margin.top?.css(false),
        marginRight: margin.right?.css(false),
        marginBottom: margin.bottom?.css(false),
        marginLeft: margin.left?.css(false),
    }
    // css.marginTop = margin.top?.css(true);
    // css.marginRight = margin.right?.css(true);
    // css.marginBottom = margin.bottom?.css(true);
    // css.marginLeft = margin.left?.css(true);
    // return css;
}

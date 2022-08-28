import React, {CSSProperties} from "react";
import {Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import styled from "styled-components";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {getOr} from "../../logic/Utils";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {createMargin, Margin} from "../../logic/style/Margin";

export type FlexBoxProps = {
    flexDir?: FlexDirection,
    gap?: DimensionalMeasured,
    style?: CSSProperties,
    align?: Align,
    justifyContent?: Justify,
    width?: DimensionalMeasured,
    minWidth?: DimensionalMeasured,
    height?: DimensionalMeasured,
    overflowXBehaviour?: OverflowBehaviour,
    overflowYBehaviour?: OverflowBehaviour
    classnames?: string[],
    margin?: Margin,
    deactivateMarginSetting?: boolean,
    type?: 'div' | 'form',
    paddingX?: DimensionalMeasured,
    paddingY?: DimensionalMeasured,
    padding?: boolean,

    id?: string,
}

export const FlexBox: React.FC<FlexBoxProps> = props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const margin: Margin = getOr(props.margin, createMargin(0, 0, 0, 0));
    const Wrapper = styled['div']`
      display: flex;
      padding: ${!props.padding ? "0" : ((getOr(props.paddingY, theme.paddings.defaultObjectPadding).css() + " " + getOr(props.paddingX, theme.paddings.defaultObjectPadding).css()))};
      flex-direction: ${getOr(props.flexDir, FlexDirection.COLUMN)};
      gap: ${getOr(props.gap?.css(), theme.gaps.defaultGab.css())};
      align-items: ${props.align || Align.START};
      justify-content: ${getOr(props.justifyContent, Justify.FLEX_START)};
      width: ${getOr(props.width?.css(), "auto")};
      // todo does the removal of min-w break any 
        // min-width: ${getOr(props.minWidth, px()).css()};
      height: ${getOr(props.height?.css(), "auto")};
      overflow-x: ${getOr<OverflowBehaviour>(props.overflowXBehaviour, OverflowBehaviour.VISIBLE)};
      overflow-y: ${getOr<OverflowBehaviour>(props.overflowYBehaviour, OverflowBehaviour.VISIBLE)};
      
      ${
        props.deactivateMarginSetting ? '' : `
          margin-top: ${margin.top?.css()};
          margin-bottom: ${margin.bottom?.css()};
          margin-left: ${margin.left?.css()};
          margin-right: ${margin.right?.css()};
        `
      }
    `;

    return (
        <Wrapper id={props.id} as={getOr(props.type, "div")} style={getOr(props.style, {})} className={getOr(props.classnames?.join(" "), "")}>
            {props.children}
        </Wrapper>
    );
}

export {
    FlexBox as Flex
}

// export class FlexBox extends React.Component<FlexBoxProps, any> {
//
//     render() {
//         const theme: Themeable.Theme = utilizeGlobalTheme();
//         const margin: Margin = getOr(this.props.margin, createMargin(0, 0, 0, 0));
//         const Wrapper = styled['div']`
//           display: flex;
//           padding: ${!this.props.padding ? "0" : ((getOr(this.props.paddingY, theme.paddings.defaultObjectPadding).css() + " " + getOr(this.props.paddingX, theme.paddings.defaultObjectPadding).css()))};
//           flex-direction: ${getOr(this.props.flexDir, FlexDirection.COLUMN)};
//           gap: ${getOr(this.props.gap?.css(), theme.gaps.defaultGab.css())};
//           align-items: ${this.props.align || Align.START};
//           justify-content: ${getOr(this.props.justifyContent, Justify.FLEX_START)};
//           width: ${getOr(this.props.width?.css(), "auto")};
//           // todo does the removal of min-w break any
//           // min-width: ${getOr(this.props.minWidth, px()).css()};
//           height: ${getOr(this.props.height?.css(), "auto")};
//           overflow-x: ${getOr<OverflowBehaviour>(this.props.overflowXBehaviour, OverflowBehaviour.VISIBLE)};
//           overflow-y: ${getOr<OverflowBehaviour>(this.props.overflowYBehaviour, OverflowBehaviour.VISIBLE)};
//           margin-top: ${margin.top?.css()};
//           margin-bottom: ${margin.bottom?.css()};
//           margin-left: ${margin.left?.css()};
//           margin-right: ${margin.right?.css()};
//         `;
//         return (
//             <Wrapper as={getOr(this.props.type, "div")} style={getOr(this.props.style, {})} className={getOr(this.props.classnames?.join(" "), "")}>
//                 {this.props.children}
//             </Wrapper>
//         );
//     }
// }

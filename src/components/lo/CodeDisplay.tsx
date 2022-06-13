import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Box} from "./Box";
import ReactCodeMirror from "@uiw/react-codemirror";
import React from "react";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {FlexBox} from "./FlexBox";
import styled from "styled-components";
import {Group} from "./Group";
import {Button} from "./Button";
import {CopyIcon} from "../ho/copyIcon/CopyIcon";
import {javascript, tsxLanguage} from "@codemirror/lang-javascript";
import {jsx} from "@emotion/react";

export type CodeDisplayProps = {
    code: string[]
}

export class CodeDisplay extends BernieComponent<CodeDisplayProps, any, any> {

    constructor(props: CodeDisplayProps) {
        super(props, undefined, undefined);
    }

    componentRender(p: CodeDisplayProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

        const Wrapper = styled.span `
          position: relative;
          
          &:hover > .cd-controls {
            opacity: 1 !important
          }
          
          * {
            background-color: transparent;
          }
          
          .cm-activeLine {
            // background-color: ${t.colors.primaryHighlightColor.withAlpha(.1).css()};
            background-color: transparent;
          }
          
          .cm-selectionBackground {
            background-color: ${t.colors.primaryHighlightColor.withAlpha(.3).css()} !important;
          }

          .cm-line {
            cursor: text;
            color: ${t.colors.fontPrimaryColor.css()} !important;
          }

          .cm-placeholder {
            color: #888 !important;
          }

          .keyword, [class="ͼa"] {
            color: ${t.colors.primaryColor.css()} !important;
          }

          .local, [class="ͼf"] {
            color: #2EA043 !important;
          }

          .color {
            color: #2EA043 !important;
          }

          .comment {
            color: #7A7A7A  ;
          }

          .function {
            color: #E8BF6A;
          }

          .string, [class="ͼd"] {
            color: #E8BF6A;
          }

          .content {
            color: white;
          }

          [class="ͼq"] {
            color: #CFD2D5;
          }
          
          .cm-gutters {
            display: none;
          }
        `;

        const renderControls = () => {


            return (
                <FlexBox classnames={["cd-controls"]} style={{
                    position: "absolute",
                    opacity: "0",
                    transition: ".14s",
                    top: 0,
                    right: 0
                }} children={
                    <Button children={
                        <CopyIcon displayValueAsHover={false} copyValueProducer={() => this.props.code.join("\n")}/>
                    }/>
                }/>
            );
        }

        return (
            <Box width={percent(100)}>
                <Wrapper>
                    {renderControls()}
                    <ReactCodeMirror
                        style={{
                            borderRadius: t.radii.defaultObjectRadius.css(),
                            overflow: "hidden",
                        }}
                        editable={false}
                        value={p.code.join("\n")}
                        extensions={[javascript()]}
                    />
                </Wrapper>
            </Box>
        );
    }
}

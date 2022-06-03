import ReactCodeMirror, {Extension} from "@uiw/react-codemirror";
import React from "react";
import _ from "lodash";
import {getOr} from "../../logic/Utils";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {DimensionalMeasured} from "../../logic/style/DimensionalMeasured";
import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";

export type CodeEditorProps = WithVisualMeaning & {
    value?: string,
    upstreamHook: (value: string) => void,
    placeholder?: string | HTMLElement,
    classnames?: string[],
    theme?: "dark" | "light" | Extension,
    extensions?: Extension[],
    debounce?: boolean,
    debounceMS?: number,
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    editable?: boolean,
    hoverEffect?: boolean,
}

export class CodeEditor extends React.PureComponent<CodeEditorProps, any> {

    public static staticState: string = "";

    constructor(props: CodeEditorProps) {
        super(props);
    }

    private _valueChangeHandler(value: string) {
        CodeEditor.staticState = value;
        this.props.upstreamHook.call(this, value);
    }

    private debouncedValueChangeHandler = _.debounce((value: string) => {
        this._valueChangeHandler(value);
    }, getOr(this.props.debounceMS, 50));

    private valueChangeHandler = (value: string) => {
        if (this.props.debounce) {
            this.debouncedValueChangeHandler(value);
        } else {
            this._valueChangeHandler(value);
        }
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const Editor = styled.div`
          max-width: 100%;
          width: ${getOr(this.props.width?.css(), "100%")};
          height: ${getOr(this.props.height?.css(), "auto")};
          min-height: 37px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: ${theme.radii.defaultObjectRadius.css()};
            // background-color: ${theme.colors.backgroundHighlightColor.css()};
          border: 1px solid ${theme.colors.borderPrimaryColor.css()};
          background-color: #282c34;
          overflow-x: hidden;
          transition: all ${theme.transitions.mainTime.css()};
          
          &:hover {
            filter: ${getOr(this.props.hoverEffect, true) ? `brightness(1.2)` : "none"};
            box-shadow: ${getOr(this.props.hoverEffect, true) ? `0 0 0 4px ${meaningfulColors.lighter.withAlpha(.13).css()}` : "none"};
          }
          
          .CodeMirror-gutters, .CodeMirror {
              // background-color: ${theme.colors.backgroundColor.css()} !important;
            background-color: #282c34;
            height: auto !important;
          }

          .cm-colored .cm-line {
            // color: #e06c75 !important;
            color: ${theme.colors.primaryHighlightColor.css()};
            span, pre {
              color: ${theme.colors.primaryHighlightColor.css()};
            }
          }
          
          .cm {
            width: 100% !important;
            box-sizing: border-box;
        
            .cm-placeholder {
              color: #888 !important;
            }
            
            // todo make special class
            // .cm-line {
            //   // color: #e06c75 !important;
            //   color: ${theme.colors.primaryHighlightColor.css()};
            // 
            //   span, pre {
            //     color: ${theme.colors.primaryHighlightColor.css()};
            //   }
            // }
            
            .keyword {
              // color: #66A6FF;
              color: ${theme.colors.primaryColor.css( )};
            }
            
            .local {
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
            
            .string {
              color: #E8BF6A;
            }
            
            .content {
              color: white;
            }
            
            // .ͼv {
            //   color: #A782BB;
            // }
            
            [class="ͼq"] {
              color: #CFD2D5; 
            }
          }
        `;

        return (
            <Editor>
                <ReactCodeMirror
                    value={getOr(this.props.value, "")}
                    editable={getOr(this.props.editable, true)}
                    indentWithTab={true}
                    spellCheck={false}
                    placeholder={this.props.placeholder}
                    onChange={this.valueChangeHandler}
                    className={getOr(this.props.classnames?.join(" "), "")}
                    theme={this.props.theme}
                    extensions={this.props.extensions}
                />
            </Editor>
        );
    }
}

import ReactCodeMirror, {Extension} from "@uiw/react-codemirror";
import React from "react";
import _ from "lodash";
import {getOr} from "../logic/Utils";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";

export type CodeEditorProps = {
    value?: string,
    upstreamHook: (value: string) => void,
    placeholder?: string | HTMLElement,
    classnames?: string[],
    theme?: "dark" | "light" | Extension,
    extensions?: Extension[],
    debounce?: boolean,
    debounceMS?: number
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
        const Editor = styled.div`
          max-width: 100%;
          width: 100%;
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
          }
        `;

        return (
            <Editor>
                <ReactCodeMirror value={this.props.value}
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

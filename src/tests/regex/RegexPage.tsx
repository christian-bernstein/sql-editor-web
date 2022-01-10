import React, {useMemo} from "react";
import {Text, TextType} from "../../components/Text";
import ReactCodeMirror from "@uiw/react-codemirror";
import styled from "styled-components";
import {Themeable} from "../../Themeable";
import {utilizeGlobalTheme} from "../../logic/App";
import {FlexBox} from "../../components/FlexBox";
import {PosInCenter} from "../../components/PosInCenter";
import {FlexDirection} from "../../logic/FlexDirection";
import {em, percent} from "../../logic/DimensionalMeasured";
import {Box} from "../../components/Box";
import {javascript} from "@codemirror/lang-javascript";
import {Controlled as CodeMirror} from 'react-codemirror2'

import "codemirror/lib/codemirror.css";
import "codemirror/theme/blackboard.css";
import "codemirror/mode/jsx/jsx.js";
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";
import Highlight from "react-highlighter";
import _ from "lodash";

export type RegexPageState = {
    regex: string,
    search: string
    changeHandler: (regex: string) => void
}

let instance: RegexPage | undefined = undefined;

export class RegexPage extends React.Component<any, RegexPageState> {

    constructor(props: any) {
        console.log("hello world")
        super(props);
        this.state = {
            regex: "\\w",
            search: "The quick brown fox jumps over the lazy dog",
            changeHandler: () => _.debounce((regex: string) => {
                console.log("asdasdasd")
                this.setState({
                    regex: regex
                });
            }, 150)
        };
    }

    public onRegexChange(regex: string) {
        this.setState({
            regex: regex
        });
    }

    componentDidMount() {
        instance = this;
    }

    componentWillUnmount() {
        instance = undefined;
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const Wrapper = styled.div`
          color: ${theme.colors.fontPrimaryColor.css()};
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
          padding: ${theme.paddings.defaultObjectPadding.css()};
          background-color: ${theme.colors.backgroundColor.css()};

          .container {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            max-width: 100%;
            display: grid;
            grid-template-rows: 10% 90%;

            .reg-match {
              color: ${theme.colors.fontPrimaryColor.css()};
              background-color: ${theme.colors.primaryHighlightColor.withAlpha(.5).css()};
            }
          }
        `;

        const Editor = styled.div`
          max-width: 100%;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          // padding: 1em 0;
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          // background-color: ${theme.colors.backgroundHighlightColor.css()};
          border: 1px solid ${theme.colors.borderPrimaryColor.css()};
          background-color: #282c34;
          overflow: hidden;

          .cm-matchhighlight {
            background: red !important
          }
          
          .CodeMirror-gutters, .CodeMirror {
            // background-color: ${theme.colors.backgroundColor.css()} !important;
            background-color: #282c34;
            height: auto !important;
          }
          
          .cm {
            width: 100% !important;
            box-sizing: border-box;
          }
        `;

        const Highlight = require('react-highlighter');

        let exp: RegExp = new RegExp("");
        let expValid: boolean = true;
        try {
            exp = new RegExp(this.state.regex);
        } catch (e) {
            expValid = false;
        }

        return (
            <Wrapper key={"regex-editor"}>
                <div className={"container"}>

                    <FlexBox width={percent(90)}>
                        <Text text={"Regex viewer"} type={TextType.smallHeader}/>
                    </FlexBox>

                    <PosInCenter>
                        <FlexBox flexDir={FlexDirection.COLUMN} width={percent(70)}>
                            <Text text={`'${this.state.regex}'`}/>

                            <Highlight matchClass={"reg-match"} search={expValid ? exp : ""}>{this.state.search}</Highlight>

                            <Box width={percent(100)} gapY={em(.5)}>
                                <Text text={"Search string"}/>
                                <Editor>
                                    <CodeMirror
                                        value={this.state.regex}
                                        onBeforeChange={(editor, data, value) => {
                                            // this.onRegexChange(value);

                                            this.state.changeHandler(value);
                                        }}
                                        className={"cm"}
                                        options={{
                                            autofocus: true,
                                            height: "10px",
                                            placeholder: 'asd',
                                            mode: 'jsx',
                                            theme: 'blackboard',
                                            lineNumbers: true,
                                        }}
                                    />
                                </Editor>
                            </Box>
                            <Box width={percent(100)} gapY={em(.5)}>
                                <Text text={"Search string"}/>
                                <Editor>
                                    <ReactCodeMirror value={""}
                                                     placeholder={"The quick brown fox jumps over the lazy dog"}
                                                     key={"cm-test-input"}
                                                     className={"cm"}
                                                     theme={"dark"}
                                                     extensions={[javascript({
                                                         typescript: true
                                                     })]}
                                                     onChange={instance?.onRegexChange}
                                    />
                                </Editor>
                            </Box>
                        </FlexBox>
                    </PosInCenter>
                </div>
            </Wrapper>
        );
    }
}

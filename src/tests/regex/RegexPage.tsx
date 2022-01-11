import React, {useMemo, useRef, useState} from "react";
import {Text, TextType} from "../../components/Text";
import ReactCodeMirror from "@uiw/react-codemirror";
import styled from "styled-components";
import {Themeable} from "../../Themeable";
import {utilizeGlobalTheme} from "../../logic/App";
import {FlexBox} from "../../components/FlexBox";
import {PosInCenter} from "../../components/PosInCenter";
import {FlexDirection} from "../../logic/FlexDirection";
import {em, percent, px} from "../../logic/DimensionalMeasured";
import {Box} from "../../components/Box";
import {javascript} from "@codemirror/lang-javascript";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/blackboard.css";
import "codemirror/mode/jsx/jsx.js";
import Highlight from "react-highlighter";
import _ from "lodash";

export type RegexPageState = {
    regex: string,
    search: string
}

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
  border-radius: ${theme.radii.defaultObjectRadius.css()};
    // background-color: ${theme.colors.backgroundHighlightColor.css()};
  border: 1px solid ${theme.colors.borderPrimaryColor.css()};
  background-color: #282c34;
  overflow: hidden;

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

export const RegexPageFC: React.FC = props => {
    console.log("rerender")

    const [state, setState] = useState<RegexPageState>(() => {
        return {
            regex: "",
            search: ""
        }
    });


    const debouncedOnChange = useMemo(() => _.debounce((val: string, type: "regex" | "search") => {
        setState(prevState => {
            switch (type) {
                case "regex": return {
                    search: prevState.search,
                    regex: val
                };
                case "search": return {
                    search: val,
                    regex: prevState.regex
                };
            }
        });
    }, 300), []);

    const Highlight = require('react-highlighter');

    let exp: RegExp = new RegExp("");
    let expValid: boolean = true;
    try {
        exp = new RegExp(state.regex);
    } catch (e) {
        expValid = false;
    }

    const ref = useRef<HTMLInputElement>(null);

    // <input key={"asd"} onChange={event => debouncedOnChange(event.target.value, "search")}/>
    return (
        <Wrapper key={"regex-editor"}>
            <div className={"container"}>

                <FlexBox width={percent(90)}>
                    <Text text={"Regex viewer"} type={TextType.smallHeader}/>
                </FlexBox>

                <PosInCenter>
                    <FlexBox flexDir={FlexDirection.COLUMN} width={percent(70)}>
                        <Box width={percent(100)} gapY={em(.5)}>
                            <Text text={"Search string"} type={TextType.smallHeaderDeactivated}/>
                            <Highlight key={"search-highlight"}
                                       matchClass={"reg-match"}
                                       search={expValid ? exp : "."}>{state.search}</Highlight>

                            <Editor>
                                <ReactCodeMirror value={state.search}
                                                 placeholder={"The quick brown fox jumps over the lazy dog."}
                                                 onChange={value => debouncedOnChange(value, "search")}
                                                 key={"cm-search-input"}
                                                 className={"cm"}
                                                 theme={"dark"}
                                                 extensions={[javascript({
                                                     typescript: true
                                                 })]}
                                />
                            </Editor>
                        </Box>
                        <Box width={percent(100)} gapY={em(.5)}>
                            <Text text={"Enter expression"} type={TextType.smallHeaderDeactivated}/>
                            <Text text={`Regular expression: '${state.regex}'`} type={TextType.secondaryDescription} fontSize={px(12)}/>
                            <Editor>
                                <ReactCodeMirror value={state.regex}
                                                 placeholder={"([A-Z])\\w+"}
                                                 onChange={value => debouncedOnChange(value, "regex")}
                                                 key={"cm-regex-input"}
                                                 className={"cm"}
                                                 theme={"dark"}
                                                 extensions={[javascript({
                                                     typescript: true
                                                 })]}
                                />
                            </Editor>
                        </Box>
                    </FlexBox>
                </PosInCenter>
            </div>
        </Wrapper>
    );
}


// <CodeMirror
//     key={"cm"}
//     onBeforeChange={(editor, data, value, next) => {
//         // debouncedOnChange(value, "search");
//         console.log("new val: " + value)
//         // debouncedOnChange(value, "search")
//         if (value !== state.search) {
//             setState({
//                 regex: state.regex,
//                 search: value
//             });
//             // debouncedOnChange(value, "search")
//         }
//         next();
//     }}
//     className={"cm"}
//     options={{
//             autofocus: false,
//         height: "10px",
//         placeholder: 'asd',
//         mode: 'jsx',
//         theme: 'blackboard',
//         lineNumbers: true,
//     }}
// />

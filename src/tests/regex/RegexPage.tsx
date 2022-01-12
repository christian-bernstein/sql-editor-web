import React, {useMemo, useRef, useState} from "react";
import {Text, TextType} from "../../components/Text";
import ReactCodeMirror, {ReactCodeMirrorProps, ReactCodeMirrorRef, useCodeMirror} from "@uiw/react-codemirror";
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
import {Button} from "../../components/Button";
import {Icon} from "../../components/Icon";
import {ReactComponent as EnterIcon} from "../../assets/icons/ic-20/ic20-arrow-right.svg";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {UnControlled} from "react-codemirror2";
import CodeMirror from 'react-codemirror2';

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
      border: .5px solid ${theme.colors.primaryHighlightColor.css()};
    }
  }
`;

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
  overflow: hidden;

  .CodeMirror-gutters, .CodeMirror {
      // background-color: ${theme.colors.backgroundColor.css()} !important;
    background-color: #282c34;
    height: auto !important;
  }

  .cm {
    width: 100% !important;
    box-sizing: border-box;
    
    .cm-placeholder {
      color: #888 !important;
    }
    
    .cm-line {
      // color: #e06c75 !important;
      color: ${theme.colors.primaryHighlightColor.css()};
      
      span, pre {
        color: ${theme.colors.primaryHighlightColor.css()};
      }
    }
  }
`;

export const getRegExp: (regex: string) => [exp: RegExp, expValid: boolean] = regex => {
    let exp: RegExp = new RegExp("");
    let expValid: boolean = true;
    try {
        exp = new RegExp(regex);
    } catch (e) {
        expValid = false;
    }
    return [exp, expValid];
}

let publicState: RegexPageState = {
    regex: "",
    search: ""
}

export const RegexPageFC: React.FC = props => {

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

    const [exp, expValid] = getRegExp(state.regex);

    const Highlight = require('react-highlighter');

    return (
        <Wrapper key={"regex-editor"}>
            <div className={"container"}>
                <FlexBox width={percent(90)}>
                    <Text text={"Regex viewer"} type={TextType.smallHeader}/>
                </FlexBox>
                <PosInCenter>
                    <FlexBox flexDir={FlexDirection.COLUMN} width={percent(100)}>

                        <ReactCodeMirror placeholder={"([A-Z])\\w+"}
                                         value={publicState.search}
                                         key={"mirror"}
                                         onChange={value => {
                                             publicState = {
                                                 regex: publicState.regex,
                                                 search: value
                                             }
                                         }}
                                         className={"cm"}
                                         theme={"dark"}
                                         extensions={[javascript({
                                             typescript: true
                                         })]}
                        />

                        <Box width={percent(100)} gapY={em(.5)}>
                            <Text text={"Search string"} type={TextType.smallHeaderDeactivated}/>
                            <Highlight key={"search-highlight"} matchClass={"reg-match"} search={expValid ? exp : "."}>
                                {state.search}
                            </Highlight>
                            <FlexBox flexDir={FlexDirection.ROW} classnames={[""]}>
                                <Editor>
                                    <ReactCodeMirror value={state.search}
                                                     placeholder={"The quick brown fox jumps over the lazy dog."}
                                                     onChange={value => debouncedOnChange(value, "search")}
                                                     className={"cm"}
                                                     theme={"dark"}
                                                     extensions={[javascript({
                                                         typescript: true
                                                     })]}
                                    />
                                </Editor>
                                <Button visualMeaning={ObjectVisualMeaning.SUCCESS} opaque={true} onClick={event => {

                                }}>
                                    <Icon visualMeaning={ObjectVisualMeaning.SUCCESS} colored={true} icon={<EnterIcon/>}/>
                                </Button>
                            </FlexBox>
                        </Box>
                        <Box width={percent(100)} gapY={em(.5)}>
                            <Text text={"Enter expression"} type={TextType.smallHeaderDeactivated}/>
                            <Text text={`Regular expression: '${state.regex}'`} type={TextType.secondaryDescription} fontSize={px(12)}/>
                            <Editor>
                                <ReactCodeMirror value={state.regex}
                                                 autoFocus={true}
                                                 placeholder={"([A-Z])\\w+"}
                                                 onChange={value => debouncedOnChange(value, "regex")}
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
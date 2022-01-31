import React from "react";
import {Text, TextType} from "../../components/Text";
import ReactCodeMirror, {Extension} from "@uiw/react-codemirror";
import styled from "styled-components";
import {Themeable} from "../../Themeable";
import {utilizeGlobalTheme} from "../../logic/App";
import {FlexBox} from "../../components/FlexBox";
import {PosInCenter} from "../../components/PosInCenter";
import {FlexDirection} from "../../logic/FlexDirection";
import {em, percent, px} from "../../logic/DimensionalMeasured";
import {Box} from "../../components/Box";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/blackboard.css";
import "codemirror/mode/jsx/jsx.js";
import {Icon} from "../../components/Icon";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {v4} from "uuid";
import {getOr} from "../../logic/Utils";
import {ReactComponent as SuccessIcon} from "../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {ReactComponent as AddIcon} from "../../assets/icons/ic-16/ic16-plus.svg";
import {LiteGrid} from "../../components/LiteGrid";
import {Justify} from "../../logic/Justify";
import {Align} from "../../logic/Align";
import _ from "lodash";
import {Button} from "../../components/Button";
import {Cursor} from "../../logic/style/Cursor";
import {RegExpHighlighter} from "./RegExpHighlighter";
import {RenderController} from "./RenderController";
import {RenderExecutor} from "./RenderExecutor";
import {Assembly} from "../../logic/Assembly";

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

        const theme: Themeable.Theme = utilizeGlobalTheme(Themeable.defaultTheme);

        const Editor = styled.div`
  max-width: 100%;
  width: 100%;
  min-height: 37px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.radii.defaultObjectRadius.css()};
  background-color: ${theme.colors.backgroundHighlightInputColor.css()};
  border: 1px solid ${theme.colors.borderPrimaryColor.css()};
  // background-color: #282c34;
  overflow-x: hidden;

  .CodeMirror-gutters, .CodeMirror {
    background-color: ${theme.colors.backgroundHighlightInputColor.css()} !important;
    // background-color: #282c34;
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
      // color: ${theme.colors.primaryHighlightColor.css()};
      color: ${theme.colors.fontPrimaryColor.css()};

      span, pre {
        // color: ${theme.colors.primaryHighlightColor.css()};
        color: ${theme.colors.fontPrimaryColor.css()};
      }
    }
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

export class RegexPage extends React.PureComponent {

    public static readonly controller: RenderController = new RenderController();

    public static downstreamHook: ((value: string, type: ("regex" | "search")) => void) | undefined = undefined;

    public static staticRenderCheatsheet: boolean = false;

    private assembly: Assembly;

    /**
     * Function to update the localstorage.
     * For performance reasons at max one update every second, using debounce technique.
     * Debounce: Function gets first executed if last call was one second earlier.
     * Calls within the one second delay will be dropped.
     */
    public static updateLocalStore = _.debounce((value: string, type: ("regex" | "search")) => {
        window.localStorage.setItem(type, value);
    }, 1000);

    constructor() {
        super({});
        this.assembly = new Assembly()
            .assembly("annotation", props => {
                const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
                const match: RegExpMatchArray | null = exp.exec(RegExpHighlighter.staticSearch);
                const exact: boolean = match !== null && match.length === 1 && match[0].length === RegExpHighlighter.staticSearch.length;
                return (
                    <LiteGrid responsive={true} minResponsiveWidth={em(8)}>
                        <Text text={`Valid`}
                              type={TextType.secondaryDescription}
                              fontSize={px(12)}
                              enableLeftAppendix={true}
                              leftAppendix={expValid ?
                                  <Icon colored={true}
                                        visualMeaning={ObjectVisualMeaning.SUCCESS}
                                        icon={<SuccessIcon/>}/> :
                                  <Icon colored={true}
                                        visualMeaning={ObjectVisualMeaning.ERROR}
                                        icon={<ErrorIcon/>}/>
                              }
                        />
                        <Text text={`Exact match`}
                              type={TextType.secondaryDescription}
                              fontSize={px(12)}
                              enableLeftAppendix={true}
                              leftAppendix={exact ?
                                  <Icon colored={true}
                                        visualMeaning={ObjectVisualMeaning.SUCCESS}
                                        icon={<SuccessIcon/>}/> :
                                  <Icon colored={true}
                                        visualMeaning={ObjectVisualMeaning.ERROR}
                                        icon={<ErrorIcon/>}/>
                              }
                        />
                    </LiteGrid>
                );
            })
        ;
        document.title = "Regex viewer"
    }

    // noinspection JSMethodCanBeStatic
    private searchChangeHandler(value: string, type: ("regex" | "search")) {
        switch (type) {
            case "regex": {
                RegExpHighlighter.staticRegex = value;
                break;
            }
            case "search": {
                console.log("change static search")
                RegExpHighlighter.staticSearch = value;
                break;
            }
        }
        RegexPage.controller.rerender("*", "tests", type);
        RegexPage.updateLocalStore(value, type);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme(Themeable.defaultTheme);
        const Wrapper = styled.div`
          position: relative;
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
            position: relative;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            max-width: 100%;
            display: grid;
            grid-template-rows: 10% 90%;
            overflow: hidden;
        
            .editor-view {
              position: relative;
              max-height: 100%;
              height: 100%;
            }
        
            .reg-match {
              color: ${theme.colors.fontPrimaryColor.css()};
              background-color: ${theme.colors.primaryHighlightColor.withAlpha(.5).css()};
              border: .5px solid ${theme.colors.primaryHighlightColor.css()};
            }
          }
        `;

        return (
            <Wrapper key={"regex-editor"}>
                <div className={"container"}>
                    <FlexBox align={Align.START} width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                        <Text text={"Regex viewer"} type={TextType.smallHeader}/>

                        <Text text={"[Worksheet](https://github.com/christian-bernstein/regex/blob/main/introduction.md)"} type={TextType.secondaryDescription} fontSize={px(12)}/>

                        {/*<FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                            <Text text={"Cheatsheet"}/>
                            <Switch color={"default"} onChange={(event, checked) => {
                                RegexPage.staticRenderCheatsheet = checked;
                                console.log("checked: " + checked)
                                this.controller.rerender("*", "cheatsheet")
                            }}/>
                        </FlexBox>*/}
                    </FlexBox>
                    <PosInCenter classnames={["editor-view"]}>
                        <LiteGrid columns={2}
                                  gap={theme.gaps.defaultGab}
                                  // height={percent(100)}
                                  responsive={true}
                                  minResponsiveWidth={px(200)}
                                  style={{
                                      boxSizing: "border-box",
                                      maxWidth: "100%",
                                      resize: "horizontal",
                                      overflow: "auto"
                                  }}>
                            {/*<RenderExecutor
                                id={v4()}
                                renderChildren={RegexPage.staticRenderCheatsheet}
                                upstreamOnComponentUnmountHandler={id => this.controller.unregister(id)}
                                channels={["*", "cheatsheet"]}
                                componentDidMountRelay={bridge => this.controller.register(bridge)}
                                componentFactory={() => (
                                    <Cheatsheet categories={cheatsheet.categories}/>
                                )}
                            />*/}

                            <PosInCenter>
                                <FlexBox flexDir={FlexDirection.COLUMN} width={percent(100)}>
                                    <Box width={percent(100)} gapY={em(.5)}>
                                        <Text text={"Search string"} type={TextType.smallHeaderDeactivated}/>
                                        <Text text={"Enter search string. Create a test by clicking the plus-icon. Each line will be parsed as an individual test."} type={TextType.secondaryDescription} fontSize={px(12)}/>

                                        <RenderExecutor channels={["*", "tests"]} componentFactory={() => RegExpHighlighter.testCount() > 0 ? (
                                            <Text
                                                text={"**Clear all**"}
                                                uppercase={true}
                                                coloredText={true}
                                                cursor={Cursor.pointer}
                                                visualMeaning={ObjectVisualMeaning.INFO}
                                                type={TextType.secondaryDescription}
                                                fontSize={px(12)}
                                                onClick={() => RegExpHighlighter.clearTests()}
                                            />
                                        ) : (
                                            <></>
                                        )} id={v4()} componentDidMountRelay={bridge => RegexPage.controller.register(bridge)}/>

                                        <RenderExecutor
                                            id={v4()}
                                            upstreamOnComponentUnmountHandler={id => RegexPage.controller.unregister(id)}
                                            channels={["*", "regex", "search", "tests"]}
                                            componentDidMountRelay={bridge => RegexPage.controller.register(bridge)}
                                            componentFactory={() => (
                                                <RegExpHighlighter/>
                                            )}
                                        />

                                        <FlexBox flexDir={FlexDirection.ROW} classnames={[""]}>
                                            <CodeEditor
                                                value={RegExpHighlighter.staticSearch}
                                                upstreamHook={value => this.searchChangeHandler(value, "search")}
                                                theme={theme.mode}
                                                debounce={true}
                                                debounceMS={300}
                                                classnames={["cm"]}
                                                placeholder={"The quick brown fox jumps over the lazy dog."}
                                            />
                                            <Button visualMeaning={ObjectVisualMeaning.INFO} opaque={true} onClick={() => {
                                                if (RegExpHighlighter.staticSearch.length !== 0) {
                                                    const tests: string[] = RegExpHighlighter.staticSearch.split(new RegExp("[;(\\n)]"));
                                                    tests.forEach(test => {
                                                        if (test.length > 0) {
                                                            RegExpHighlighter.addTest({
                                                                id: v4(),
                                                                test: test
                                                            });
                                                        }
                                                    })
                                                }
                                            }}>
                                                <Icon visualMeaning={ObjectVisualMeaning.INFO} colored={true}
                                                      icon={<AddIcon/>}
                                                />
                                            </Button>
                                        </FlexBox>
                                    </Box>
                                    <Box width={percent(100)} gapY={em(.5)}>
                                        <Text text={"Enter expression"} type={TextType.smallHeaderDeactivated}/>

                                        <RenderExecutor
                                            id={v4()}
                                            upstreamOnComponentUnmountHandler={id => RegexPage.controller.unregister(id)}
                                            channels={["*", "regex", "search"]}
                                            componentDidMountRelay={bridge => RegexPage.controller.register(bridge)}
                                            componentFactory={() => this.assembly.render({
                                                component: "annotation"
                                            })}
                                        />

                                        <CodeEditor
                                            value={RegExpHighlighter.staticRegex}
                                            upstreamHook={value => this.searchChangeHandler(value, "regex")}
                                            theme={theme.mode}
                                            debounce={true}
                                            debounceMS={150}
                                            classnames={["cm"]}
                                            placeholder={"([A-Z])\\w+"}
                                        />
                                    </Box>
                                </FlexBox>
                            </PosInCenter>
                        </LiteGrid>
                    </PosInCenter>
                </div>
            </Wrapper>
        );
    }
}

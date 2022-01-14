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
import Highlight from "react-highlighter";
import {Icon} from "../../components/Icon";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {v4} from "uuid";
import {getOr} from "../../logic/Utils";
import {ReactComponent as SuccessIcon} from "../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {ReactComponent as AddIcon} from "../../assets/icons/ic-16/ic16-plus.svg";
import {LiteGrid} from "../../components/LiteGrid";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {Justify} from "../../logic/Justify";
import {Align} from "../../logic/Align";
import _ from "lodash";
import {Button} from "../../components/Button";

export const getLocalStoreValue: (type: "regex" | "search", def?: string) => string = (type, def) =>  {
    const item = window.localStorage.getItem(type);
    if (item === null) {
        return getOr(def, "");
    } else return item;
}

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

const cheatsheet: CheatsheetData = {
    categories: [
        {
            title: "Character classes",
            entries: [
                {
                    regex: ".",
                    description: "any character except newline"
                },
                {
                    regex: "\\w \\d \\s",
                    description: "word, digit, whitespace"
                },
                {
                    regex: "\\W \\D \\S",
                    description: "not word, digit, whitespace"
                },
                {
                    regex: "[abc]",
                    description: "any of a, b or c"
                },
                {
                    regex: "[^abc]",
                    description: "not a, b or c"
                },
                {
                    regex: "[a-g] [0-5]",
                    description: "character between a & g / character between 0 & 5"
                },
            ]
        },
        {
            title: "Anchors",
            entries: [
                {
                    regex: "^abc$",
                    description: "start / end of the string"
                },
                {
                    regex: "\\b \\B",
                    description: "word, not-word boundary"
                },
            ]
        },
        {
            title: "Escaped characters",
            entries: [
                {
                    regex: "\\. \\* \\\\",
                    description: "escaped special characters"
                },
                {
                    regex: "\\t \\n \\r",
                    description: "\ttab, linefeed, carriage return"
                },
            ]
        }
    ]
}

const theme: Themeable.Theme = utilizeGlobalTheme();

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

export type RegexPageState = {
    regex: string,
    search: string
}

export class RenderController {

    private readonly executors: Map<string, RenderBridge> = new Map<string, RenderBridge>();

    public register(bridge: RenderBridge) {

        console.log(this.executors)

        this.executors.set(bridge.id, bridge);
    }

    public unregister(id: string) {
        this.executors.delete(id);
    }

    public rerender(...channels: string[]) {
        Array.from(this.executors.values()).filter(value => {
            let b: boolean = false;
            for (let channel of value.channels) {
                if (channels.includes(channel)) {
                    b = true;
                }
            }
            return b;
        }).forEach(value => {
            try {
                value.rerenderHook();
            } catch (e) {
                console.error(e);
            }
        })
    }
}

export type RenderBridge = {
    rerenderHook: () => void,
    channels: string[],
    id: string
}

export type RenderExecutorProps = {
    renderChildren?: boolean,
    componentFactory: () => JSX.Element,
    channels?: string[],
    upstreamOnComponentUnmountHandler?: (id: string) => void,
    id: string
    componentDidMountRelay: (bridge: RenderBridge) => void;
}

export class RenderExecutor extends React.Component<RenderExecutorProps> {

    componentDidMount() {
        this.props.componentDidMountRelay({
            rerenderHook: () => {
                this.forceUpdate();
            },
            channels: getOr(this.props.channels, []),
            id: this.props.id
        })
    }

    componentWillUnmount() {
        this.props.upstreamOnComponentUnmountHandler?.(this.props.id);
    }

    render() {
        return (
            <>
                {this.props.componentFactory()}
                {this.props.children}
            </>
        );
        // todo investigate bug
        // console.log("rerender")
        // if (getOr(this.props.renderChildren, false)) {
        //     return (
        //         <>
        //             {this.props.componentFactory()}
        //             {this.props.children}
        //         </>
        //     )
        // } else return <>{String(getOr(this.props.renderChildren, false))}</>;
    }
}

export type Test = {
    id: string,
    test: string
}

export const TestDisplay: React.FC<{ test: Test, index?: number }> = props => {
    const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
    return (
        <Box visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque={true}>
            <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                <FlexBox gap={px(0)}>
                    <Text text={`Test ${props.index}`}/>

                    <Highlight matchClass={"reg-match"} search={exp}>
                        {props.test.test}
                    </Highlight>

                </FlexBox>
                <Icon icon={<ErrorIcon/>} onClick={() => {
                    RegExpHighlighter.removeTest(props.test.id);
                }}/>
            </FlexBox>
        </Box>
    );
}

export class RegExpHighlighter extends React.Component {

    public static readonly staticTests: Test[] = RegExpHighlighter.loadTests();

    public static staticRegex: string = getLocalStoreValue("regex", "");

    public static staticSearch: string = getLocalStoreValue("search", "");

    private static loadTests(): Test[] {
        const json = window.localStorage.getItem("tests");
        if (json === null) return [];
        try {
            return JSON.parse(json);
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    private static saveTests() {
        try {
            const json = JSON.stringify(RegExpHighlighter.staticTests);
            window.localStorage.setItem("tests", json);
        } catch (e) {
            console.error(e);
            // todo error handling..
        }
    }

    public static addTest(test: Test, rerender: boolean = true) {
        this.staticTests.push(test);
        if (rerender) {
            RegexPage.controller.rerender("*", "tests")
        }
        this.saveTests();
    }

    public static removeTest(id: string, rerender: boolean = true) {
        const index = this.staticTests.findIndex(value => value.id === id);
        if (index > -1) {
            this.staticTests.splice(index, 1);
            if (rerender) {
                RegexPage.controller.rerender("*", "tests")
            }
            this.saveTests();
        }
    }

    render() {
        const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
        return (
            <>
                <Text text={String(new Date())} type={TextType.secondaryDescription} fontSize={px(12)}/>
                {
                    RegExpHighlighter.staticTests.map((value, index) => {
                        return (
                            <TestDisplay test={value} index={index} key={"test-" + index}/>
                        );
                    })
                }
                <Highlight matchClass={"reg-match"} search={exp}>
                    {RegExpHighlighter.staticSearch}
                </Highlight>
            </>
        );
    }
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

export type CheatsheetData = {
    categories: {
        title: string
        entries: {
            regex: string,
            description: string
        }[]
    }[]
}

export const Cheatsheet: React.FC<CheatsheetData> = React.memo(props => {

    return (
        <Box gapY={theme.paddings.defaultObjectPadding} overflowYBehaviour={OverflowBehaviour.SCROLL}>{
            props.categories.map(value => {
                return (
                    <>
                        <Text text={value.title} type={TextType.smallHeader}/>
                        {
                            value.entries.map(entry => {
                                return (
                                    <Box>
                                        <LiteGrid columns={2} responsive={true} minResponsiveWidth={px(400)}>
                                            <Text text={entry.regex} coloredText={true} visualMeaning={ObjectVisualMeaning.INFO}/>
                                            <Text text={entry.description}/>
                                        </LiteGrid>
                                    </Box>
                                );
                            })
                        }
                    </>
                );
            })
        }</Box>
    );
});

export class RegexPage extends React.PureComponent {

    public static readonly controller: RenderController = new RenderController();

    public static downstreamHook: ((value: string, type: ("regex" | "search")) => void) | undefined = undefined;

    public static staticRenderCheatsheet: boolean = false;

    public static updateLocalStore = _.debounce((value: string, type: ("regex" | "search")) => {
        window.localStorage.setItem(type, value);
    }, 1000);

    constructor() {
        super({});
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
        return (
            <Wrapper key={"regex-editor"}>
                <div className={"container"}>
                    <FlexBox align={Align.START} width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                        <Text text={"Regex viewer"} type={TextType.smallHeader}/>
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
                                                theme={"dark"}
                                                debounce={true}
                                                classnames={["cm"]}
                                                placeholder={"The quick brown fox jumps over the lazy dog."}
                                            />
                                            <Button visualMeaning={ObjectVisualMeaning.INFO} opaque={true} onClick={() => {
                                                if (RegExpHighlighter.staticSearch.length !== 0) {
                                                    RegExpHighlighter.addTest({
                                                        id: v4(),
                                                        test: RegExpHighlighter.staticSearch
                                                    });
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
                                            componentFactory={() => {
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

                                                        {/*<Text text={`Match count: ${match ? match?.length : "NaN"}`}
                                                      type={TextType.secondaryDescription}
                                                      fontSize={px(12)}
                                                />*/}
                                                    </LiteGrid>
                                                );
                                            }}
                                        />

                                        <CodeEditor
                                            value={RegExpHighlighter.staticRegex}
                                            upstreamHook={value => this.searchChangeHandler(value, "regex")}
                                            theme={"dark"}
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

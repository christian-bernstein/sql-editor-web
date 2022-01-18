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
import {Cursor} from "../../logic/style/Cursor";
import {FormControlLabel, Switch} from "@mui/material";

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

const ThemeSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                // backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                backgroundColor: '#8796A5'
            },
        },
    },
    '& .MuiSwitch-thumb': {
        // backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        backgroundColor: '#003892',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        // backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        backgroundColor: '#8796A5',
        borderRadius: 20 / 2,
    },
}));

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

    public static staticTests: Test[] = RegExpHighlighter.loadTests();

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

    public static testCount(): number {
        return this.staticTests.length;
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

    public static clearTests(rerender: boolean = true) {
        this.staticTests = [];
        if (rerender) {
            RegexPage.controller.rerender("*", "tests")
        }
        this.saveTests();
    }

    render() {
        const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
        return (
            <>
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

    const theme: Themeable.Theme = utilizeGlobalTheme(Themeable.defaultTheme);

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

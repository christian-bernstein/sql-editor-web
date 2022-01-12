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
import {javascript} from "@codemirror/lang-javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/blackboard.css";
import "codemirror/mode/jsx/jsx.js";
import Highlight from "react-highlighter";
import {Icon} from "../../components/Icon";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {v4} from "uuid";
import {getOr, Utils} from "../../logic/Utils";
import {ReactComponent as SuccessIcon} from "../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {LiteGrid} from "../../components/LiteGrid";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {Switch} from "@mui/material";
import {Justify} from "../../logic/Justify";
import {Align} from "../../logic/Align";

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see https://stackoverflow.com/a/7924240/938822
 */
function occurrences(string: string, subString: string, allowOverlapping: boolean) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    let n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

export type RegexPageState = {
    regex: string,
    search: string
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

export class RegExpHighlighter extends React.PureComponent<{ componentDidMountRelay: (downstreamHook: (value: string, type: "regex" | "search") => void) => void }, any> {

    public static staticRegex: string = "";

    public static staticSearch: string = "";

    componentDidMount() {
        this.props.componentDidMountRelay((value, type) => {
            switch (type) {
                case "regex": {
                    RegExpHighlighter.staticRegex = value;
                    break;
                }
                case "search": {
                    RegExpHighlighter.staticSearch = value;
                    break;
                }
            }
            this.forceUpdate();
        })
    }

    render() {
        const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
        // expValid ? exp : "."
        return (
            <Highlight matchClass={"reg-match"} search={expValid ? exp : "."}>
                {RegExpHighlighter.staticSearch}
            </Highlight>
        );
    }
}

export type CodeEditorProps = {
    upstreamHook: (value: string) => void,
    placeholder?: string | HTMLElement,
    classnames?: string[],
    theme?: "dark" | "light" | Extension,
    extensions?: Extension[]
}

export class CodeEditor extends React.PureComponent<CodeEditorProps, any> {

    public static staticState: string = "";

    constructor(props: CodeEditorProps) {
        super(props);
    }

    private valueChangeHandler = (value: string) => {
        CodeEditor.staticState = value;
        this.props.upstreamHook.call(this, value);
    }

    render() {
        return (
            <Editor>
                <ReactCodeMirror value={""}
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

    public static downstreamHook: ((value: string, type: ("regex" | "search")) => void) | undefined = undefined;

    public static staticRenderCheatsheet: boolean = false;

    private readonly controller: RenderController = new RenderController();

    constructor() {
        super({});
        document.title = "Regex viewer"
    }

    private searchChangeHandler(value: string, type: ("regex" | "search")) {
        RegexPage.downstreamHook?.(value, type);
        this.controller.rerender(type);
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
                                  style={{overflowY: "scroll"}}
                                  gap={theme.gaps.defaultGab}
                                  height={percent(100)}
                                  responsive={true}
                                  minResponsiveWidth={px(200)}>

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
                                        <RegExpHighlighter
                                            componentDidMountRelay={downstreamHook => RegexPage.downstreamHook = downstreamHook}/>
                                        <FlexBox flexDir={FlexDirection.ROW} classnames={[""]}>
                                            <CodeEditor
                                                upstreamHook={value => this.searchChangeHandler(value, "search")}
                                                theme={"dark"}
                                                classnames={["cm"]}
                                                placeholder={"The quick brown fox jumps over the lazy dog."}
                                                extensions={[javascript({
                                                    typescript: true
                                                })]}
                                            />
                                            {/*<Button visualMeaning={ObjectVisualMeaning.SUCCESS} opaque={true}>
                                            <Icon visualMeaning={ObjectVisualMeaning.SUCCESS} colored={true}
                                                  icon={<EnterIcon/>}/>
                                        </Button>*/}
                                        </FlexBox>
                                    </Box>
                                    <Box width={percent(100)} gapY={em(.5)}>
                                        <Text text={"Enter expression"} type={TextType.smallHeaderDeactivated}/>

                                        <RenderExecutor
                                            id={v4()}
                                            upstreamOnComponentUnmountHandler={id => this.controller.unregister(id)}
                                            channels={["*", "regex", "search"]}
                                            componentDidMountRelay={bridge => this.controller.register(bridge)}
                                            componentFactory={() => {
                                                const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
                                                const match: RegExpMatchArray | null = exp.exec(RegExpHighlighter.staticSearch);
                                                const exact: boolean = match !== null && match.length === 1 && match[0].length === RegExpHighlighter.staticSearch.length;
                                                return (
                                                    <LiteGrid responsive={true} minResponsiveWidth={em(8)}>
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
                                            upstreamHook={value => this.searchChangeHandler(value, "regex")}
                                            theme={"dark"}
                                            classnames={["cm"]}
                                            placeholder={"([A-Z])\\w+"}
                                            extensions={[javascript({
                                                typescript: true
                                            })]}
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

// <RenderExecutor
//     id={v4()}
//     upstreamOnComponentUnmountHandler={id => this.controller.unregister(id)}
//     channels={["*", "regex"]}
//     componentDidMountRelay={bridge => this.controller.register(bridge)}
//     componentFactory={() => (
//         <Text text={`Regular expression: '${RegExpHighlighter.staticRegex}'`}
//               type={TextType.secondaryDescription}
//               fontSize={px(12)}
//         />
//     )}
// />

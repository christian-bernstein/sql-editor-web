import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React from "react";
import {screenedAndCentered} from "../../components/lo/Page";
import {Flex} from "../../components/lo/FlexBox";
import {Align} from "../../logic/style/Align";
import {array} from "../../logic/Utils";
import {AF} from "../../components/logic/ArrayFragment";
import {dimension, percent, px} from "../../logic/style/DimensionalMeasured";
import {Justify} from "../../logic/style/Justify";
import {Dot} from "../../components/lo/Dot";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {Button} from "../../components/lo/Button";
import {Text} from "../../components/lo/Text";
import {Box} from "../../components/lo/Box";
import styled from "styled-components";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {CodeEditor} from "../../components/lo/CodeEditor";
import {javascript} from "@codemirror/lang-javascript";
import {oneDark} from "@codemirror/theme-one-dark";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {Dimension} from "../../logic/style/Dimension";

export class UnitTestPage extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined, {
            enableLocalDialog: true
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        type CodePageProps = {
            dim: number,
            cellSize: number
        }

        type CodePageLocalState = {
            consoleBuffer: any[],
            loop?: NodeJS.Timeout,

            consoleInput?: string
        }

        class CodePage extends BernieComponent<CodePageProps, any, CodePageLocalState> {

            constructor(props: CodePageProps) {
                super(props, undefined, {
                    consoleBuffer: array(null, props.dim * props.dim),
                    loop: undefined
                });
            }

            private flatBufferAddress(x: number, y: number): number {
                return (y * this.props.dim) + x
            }

            private print(x: number, y: number, arr: any[]) {
                const address: number = this.flatBufferAddress(x, y);
                const buffer = this.local.state.consoleBuffer;
                arr.forEach((o, i) => {
                    buffer[address + i] = o;
                });

                this.local.setStateWithChannels({
                    consoleBuffer: buffer
                }, ["buffer"]);
            }

            componentRender(p: CodePageProps, s: any, l: CodePageLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

                const Editor = styled.div`

                  * {
                    text-shadow: -0.033em 0 1px rgba(255,0,0,0.67), 0.033em 0 1px rgba(0, 255, 255, 0.67);
                    // animation:
                    //         7s distort 15s infinite alternate,
                    //         blur 30ms infinite,
                    //         flick 50ms infinite,
                    //         jump 50ms infinite;

                    animation:
                            blur 30ms infinite;
                  }

                  @keyframes blur {
                    0% {
                      filter: blur(.05px);
                      opacity: 0.8;
                    }
                    50% {
                      filter: blur(.05px);
                      opacity: 1;
                    }
                    100% {
                      filter: blur(.08px);
                      opacity: 0.8;
                    }
                  }

                  @keyframes flick {
                    50% {
                      left: .05px;
                    }
                    51% {
                      left: 0;
                    }
                  }

                  @keyframes jump {
                    30% {
                      top: .05px;
                    }
                    31% {
                      top: 0;
                    }
                  }

                  @keyframes distort {
                    10% {
                      opacity: 1;
                      top: 0;
                      left: 0;
                      transform: scale(1, 1);
                      transform: skew(0, 0);
                    }
                    11% {
                      opacity: 0.8;
                      top: 0px;
                      left: -10px;
                      transform: scale(1, 1.2);
                      transform: skew(50deg, 0);
                    }
                    12% {
                      opacity: 0.2;
                      top: 0px;
                      left: 10px;
                      transform: scale(1, 1.2);
                      transform: skew(-80deg, 0);
                    }
                    13% {
                      opacity: 1;
                      top: 0;
                      left: 0;
                      transform: scale(1, 1);
                      transform: skew(0, 0);
                    }
                  }
                `;

                const Monitor = styled.div`                  
                  .box-3d {
                    box-shadow: -0.033em 0 1px rgba(255,0,0,0.67), 0.033em 0 1px rgba(0, 255, 255, 0.67);
                  }
                  
                  * {
                    text-shadow: -0.033em 0 1px rgba(255,0,0,0.67), 0.033em 0 1px rgba(0, 255, 255, 0.67);
                    animation:
                            blur 30ms infinite,
                            flick 50ms infinite,
                            jump 50ms infinite;
                  }
                  
                  @keyframes blur {
                    0% {
                      filter: blur(.1px);
                      opacity: 0.8;
                    }
                    50% {
                      filter: blur(.1px);
                      opacity: 1;
                    }
                    100% {
                      filter: blur(.2px);
                      opacity: 0.8;
                    }
                  }
                  
                  @keyframes flick {
                    50% {
                      left: .1px;
                    }
                    51% {
                      left: 0;
                    }
                  }
                  
                  @keyframes jump {
                    30% {
                      top: .1px;
                    }
                    31% {
                      top: 0;
                    }
                  }
                `;

                return screenedAndCentered(
                    <Flex align={Align.CENTER} width={percent(50)}>

                        <Box overflowXBehaviour={OverflowBehaviour.HIDDEN} overflowYBehaviour={OverflowBehaviour.HIDDEN} noPadding borderRadiiConfig={{enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(0)}}  children={
                            <Monitor children={
                                this.component(local => (
                                    <LiteGrid style={{width: p.dim * p.cellSize}} columns={p.dim} rows={p.dim} children={
                                        <AF elements={
                                            local.state.consoleBuffer.map(cell => (
                                                <Flex width={px(p.cellSize)} height={px(p.cellSize)} justifyContent={Justify.CENTER} align={Align.CENTER} children={
                                                    <>{cell === null ? <Dot className={"box-3d"}/> :
                                                        (typeof cell === "string" || typeof cell === "number") ? (
                                                            <Text text={String(cell)}/>
                                                        ) : (
                                                            cell
                                                        )
                                                    }</>
                                                }/>
                                            ))
                                        }/>
                                    }/>
                                ), "buffer")
                            }/>
                        }/>

                        <Editor children={
                            <CodeEditor theme={oneDark} width={dimension(10, Dimension.rem)} classnames={["cm"]} extensions={[
                                javascript({ jsx: true, typescript: true }),
                                HighlightStyle.define([
                                    {tag: tags.keyword, class: "keyword"},
                                    {tag: tags.local, class: "local"},
                                    {tag: tags.color, class: "color"},
                                    {tag: tags.comment, class: "comment"},
                                    {tag: tags.function, class: "function"},
                                    {tag: tags.string, class: "string"},
                                    {tag: tags.content, class: "content"},
                                    {tag: tags.arithmeticOperator, class: "arithmeticOperator"},
                                ])
                            ]} value={this.local.state.consoleInput} upstreamHook={value => {
                                this.local.setState({
                                    consoleInput: value
                                })
                            }} onKeyDown={event => {
                                if (event.altKey) {
                                    const val = this.local.state.consoleInput;
                                    if (val === undefined) return;
                                    const split = val.split("->");
                                    const [x, y] = split[0].split(" ");
                                    this.print(Number(x), Number(y), split[1].split(""));
                                }
                            }}/>
                        }/>
                    </Flex>
                );
            }
        }

        return (
            <CodePage dim={10} cellSize={20}/>
        );

        // return (
        //     <Screen children={
        //         <Flex width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} flexDir={FlexDirection.ROW} height={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER}>
        //             <HOCWrapper body={wrapper => (
        //                 <Button text={"QA-Panel"} onClick={() => {
        //                     wrapper.dialog(
        //                         <StaticDrawerMenu body={props => (
        //                             <QuickActionPanel noPadding/>
        //                         )}/>
        //                     );
        //                 }}/>
        //             )}/>
        //             <Button text={"Anomaly"} onClick={() => {
        //                 this.dialog(
        //                     <EnumSelector from={AnomalyLevel} onSubmit={element => {
        //                         this.dialog(
        //                             <AnomalyInfo anomaly={{
        //                                 level: AnomalyLevel[element as keyof typeof AnomalyLevel]
        //                             }}/>
        //                         );
        //                     }}/>
        //                 );
        //             }}/>
        //             <Button text={"Switch app mode"} onClick={() => {
        //                 this.dialog(
        //                     <AppModeSwitcher/>
        //                 );
        //             }}/>
        //         </Flex>
        //     }/>
        // );
    }
}

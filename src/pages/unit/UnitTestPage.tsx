import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React from "react";
import {CodeEditor} from "../../components/lo/CodeEditor";
import {screenedAndCentered} from "../../components/lo/Page";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {oneDark} from "@codemirror/theme-one-dark";
import {sql} from "@codemirror/lang-sql";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {Flex, FlexBox} from "../../components/lo/FlexBox";
import {Button} from "../../components/lo/Button";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Box} from "../../components/lo/Box";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Justify} from "../../logic/style/Justify";

export class UnitTestPage extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        type CommandPageLocalState = {
            commands: Map<string, string>,
            tabHistory: Map<string, string[]>
        }

        class CommandPage extends BernieComponent<any, any, CommandPageLocalState> {
            constructor() {
                super(undefined, undefined, {
                    commands: new Map<string, string>([
                        ["primary", "test"]
                    ]),
                    tabHistory: new Map<string, string[]>([
                        ["primary", []]
                    ])
                }, {
                    enableLocalDialog: true
                });
            }

            private clearPrimaryHistory() {
                const l = this.local.state;
                const history = l.tabHistory;
                history.set("primary", []);
                this.local.setStateWithChannels({
                    tabHistory: history
                }, ["command-push"]);
            }

            private submitPrimaryCommand(): boolean {
                const l = this.local.state;
                const command = l.commands.get("primary");
                if (command !== undefined && command.length > 0) {
                    const history = l.tabHistory;
                    history.get("primary")?.push(command);
                    this.local.setStateWithChannels({
                        tabHistory: history
                    }, ["command-push"]);
                    return true;
                } else return false;
            }

            componentRender(p: any, s: any, l: CommandPageLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
                return screenedAndCentered(
                    <FlexBox width={percent(100)} height={percent(100)}>
                        <Box noPadding borderless height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} width={percent(100)} children={
                            <FlexBox height={percent(100)} width={percent(100)} children={
                                this.component(local => (
                                    <CodeEditor
                                        height={percent(100)}
                                        width={percent(100)}
                                        theme={oneDark}
                                        classnames={["cm"]}
                                        debounce={true}
                                        debounceMS={300}
                                        hoverEffect={false}
                                        editable={false}
                                        value={local.state.tabHistory.get("primary")?.join("\n")}
                                        extensions={[sql(), HighlightStyle.define([{tag: tags.keyword, class: "keyword"}, {tag: tags.local, class: "local"}, {tag: tags.color, class: "color"}, {tag: tags.comment, class: "comment"}, {tag: tags.function, class: "function"}, {tag: tags.string, class: "string"}, {tag: tags.content, class: "content"}, {tag: tags.arithmeticOperator, class: "arithmeticOperator"},])]}
                                        upstreamHook={() => {}}
                                    />
                                ), "command-push")
                            }/>
                        }/>

                        <CodeEditor
                            width={percent(100)}
                            theme={oneDark}
                            classnames={["cm"]}
                            debounce={true}
                            debounceMS={300}
                            value={l.commands.get("primary")}
                            extensions={[sql(), HighlightStyle.define([{tag: tags.keyword, class: "keyword"}, {tag: tags.local, class: "local"}, {tag: tags.color, class: "color"}, {tag: tags.comment, class: "comment"}, {tag: tags.function, class: "function"}, {tag: tags.string, class: "string"}, {tag: tags.content, class: "content"}, {tag: tags.arithmeticOperator, class: "arithmeticOperator"},])]}
                            upstreamHook={value => {
                                l.commands.set("primary", value);

                                if (value === "#") {
                                    this._openLocalDialog(
                                        <Box borderless borderRadiiConfig={{
                                            enableCustomBorderRadii: true,
                                            bottomLeft: px(),
                                            bottomRight: px()
                                        }} children={
                                            <CodeEditor
                                                autoFocus
                                                width={percent(100)}
                                                theme={oneDark}
                                                classnames={["cm"]}
                                                debounce={true}
                                                debounceMS={300}
                                                value={""}
                                                extensions={[sql(), HighlightStyle.define([{tag: tags.keyword, class: "keyword"}, {tag: tags.local, class: "local"}, {tag: tags.color, class: "color"}, {tag: tags.comment, class: "comment"}, {tag: tags.function, class: "function"}, {tag: tags.string, class: "string"}, {tag: tags.content, class: "content"}, {tag: tags.arithmeticOperator, class: "arithmeticOperator"},])]}
                                                upstreamHook={val => {}}
                                                onKeyDown={ev => {
                                                    if (ev.key === "Enter") {
                                                        this.closeLocalDialog();
                                                    }
                                                }}
                                            />
                                        }/>
                                    );
                                }
                            }}
                            onKeyDown={event => {
                                if (event.altKey) {
                                    if (event.key === "Enter") {
                                        this.submitPrimaryCommand();
                                    }
                                }
                            }}
                        />

                        <Flex width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.FLEX_END}>
                            <Button text={"clear history"} onClick={() => this.clearPrimaryHistory()}/>
                            <Button text={"run"} onClick={() => this.submitPrimaryCommand()}/>
                        </Flex>
                    </FlexBox>
                )
            }
        }

        return (
            <CommandPage/>
        );
    }
}

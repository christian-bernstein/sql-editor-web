import {BC} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Box} from "../../../components/lo/Box";
import {DimensionalMeasured, px} from "../../../logic/style/DimensionalMeasured";
import {Color} from "../../../logic/style/Color";
import {OverflowWithHeader} from "../../../components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Text, TextType} from "../../../components/lo/Text";
import {Flex} from "../../../components/lo/FlexBox";
import {Separator} from "../../../components/lo/Separator";
import Editor from "@monaco-editor/react";
import React from "react";
import {Align} from "../../../logic/style/Align";
import {Dimension} from "../../../logic/style/Dimension";
import {Justify} from "../../../logic/style/Justify";
import {Gloria} from "../Gloria";
import {CommandSelector} from "./CommandSelector";
import {CommandHighlightMode} from "../CommandHighlightMode";
import {GloriaCommandDefinition} from "../GloriaCommandDefinition";
import _ from "lodash";
import {ReactComponent as Watermark} from "../assets/footer.svg";
import {createMargin} from "../../../logic/style/Margin";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {AF} from "../../../components/logic/ArrayFragment";
import {ConfigManager} from "../../../tests/atlas/config/ConfigManager";
import {
    LocalStorageConfigManagerPersistentAdapter
} from "../../../tests/atlas/config/LocalStorageConfigManagerPersistentAdapter";
import {GloriaCommandPaletteConfig} from "../config/GloriaCommandPaletteConfig";
import {KeyHint} from "../../../components/lo/KeyHint";
import {Centered} from "../../../components/lo/PosInCenter";
import {FlexWrap} from "../../../logic/style/FlexWrap";

export type SampleCommandPaletteProps = {
    gloria: Gloria
}

export type SampleCommandPaletteLocalState = {
    configManager: ConfigManager
    filteredCommands: Array<GloriaCommandDefinition>,
    filteredCommandsPointer: number,
    filter?: string,
    calculateFilteredCommands: () => void,
}

export class GloriaCommandPalette extends BC<SampleCommandPaletteProps, any, SampleCommandPaletteLocalState> {

    constructor(props: SampleCommandPaletteProps) {
        super(props, undefined, {
            configManager: new ConfigManager(new LocalStorageConfigManagerPersistentAdapter()),
            filteredCommands: props.gloria.commands,
            filteredCommandsPointer: 0,
            calculateFilteredCommands: _.debounce(() => {
                this._calculateFilteredCommands();
            }, 1000)
        });
    }

    init() {
        super.init();
        this.ls().configManager.loadConfig<GloriaCommandPaletteConfig>("GloriaCommandPaletteConfig", {
            openSidePanels: true
        });
        this.westCompartmentAssembly();
        this.coreAssembly();
        this.eastCompartmentAssembly();
    }

    public setFilteredCommandsPointer(newPointerPositionCandidate: number) {
        if (newPointerPositionCandidate >= 0 && newPointerPositionCandidate < this.ls().filteredCommands.length) {
            this.local.setStateWithChannels({
                filteredCommandsPointer: newPointerPositionCandidate
            }, ["pointer"]);
        }
    }

    public moveFilteredCommandsPointer(delta: number) {
        this.setFilteredCommandsPointer(this.ls().filteredCommandsPointer + delta);
    }

    public executePointedCommand() {
        const state = this.ls();
        const command = state.filteredCommands[state.filteredCommandsPointer];
        this.props.gloria.run(command.id, new Map<string, string>(), undefined).then(r => {
            console.log("response", r);
        });
    }

    public getSelectedCommand(): GloriaCommandDefinition {
        return this.ls().filteredCommands[this.ls().filteredCommandsPointer];
    }

    public toggleSidePanels() {
        this.ls().configManager.updateConfig<GloriaCommandPaletteConfig>("GloriaCommandPaletteConfig", config => {
            config.openSidePanels = !config.openSidePanels;
            return config;
        });
        this.rerender("side-panels")
    }

    private getConfig(): GloriaCommandPaletteConfig {
        return this.ls().configManager.loadConfig<GloriaCommandPaletteConfig>("GloriaCommandPaletteConfig");
    }

    private coreAssembly() {
        this.assembly.assembly("core", t => {
            return (
                <Box bgColor={Color.ofHex("#121212")} width={DimensionalMeasured.of(35, Dimension.vw)} fh noPadding elements={[
                    <OverflowWithHeader
                        dir={FlexDirection.COLUMN}
                        staticContainerHeader={{
                            gap: px(),
                            elements: [
                                <Flex fw flexDir={FlexDirection.ROW} padding paddingX={px(19)} paddingY={px(27)} elements={[
                                    <Flex flexDir={FlexDirection.ROW} gap={px(1)} height={px(21)} align={Align.CENTER} justifyContent={Justify.CENTER} fw elements={[
                                        <Text
                                            whitespace={"nowrap"}
                                            fontSize={px(14)}
                                            type={TextType.secondaryDescription}
                                            color={Color.ofHex("#ABABAB")}
                                            coloredText
                                            text={"root/Tu Darmstadt/"}
                                        />,
                                        <Text
                                            whitespace={"nowrap"}
                                            fontSize={px(14)}
                                            type={TextType.secondaryDescription}
                                            color={Color.ofHex("#585858")}
                                            coloredText
                                            text={"@"}
                                        />,
                                        <Editor
                                            saveViewState
                                            beforeMount={monaco => {
                                                monaco.languages.register({ id: "command" })

                                                monaco.languages.setMonarchTokensProvider("command", {
                                                    tokenizer: {
                                                        root: [
                                                            [/-+\w+/, "argument"]
                                                        ]
                                                    }
                                                })

                                                monaco.editor.defineTheme("SampleCommandPalette", {
                                                    base: "vs-dark",
                                                    inherit: true,
                                                    rules: [
                                                        { token: "", background: t.colors.backgroundColor.toHex() },
                                                        { token: "argument", foreground: "#585858" }
                                                    ],
                                                    colors: {
                                                        "editor.foreground": "#DFA661",
                                                        // "editor.background": t.colors.backgroundColor.toHex(),
                                                        "editor.background": "#121212",
                                                        "editor.lineHighlightBackground": "#DFA661",
                                                    }
                                                });
                                            }}
                                            onMount={(editor, monaco) => {
                                                editor.onKeyDown(e => {
                                                    if (e.keyCode == monaco.KeyCode.Enter) {
                                                        this.executePointedCommand();
                                                        e.preventDefault();
                                                    }

                                                    if (e.altKey && e.keyCode == monaco.KeyCode.KeyS) {
                                                        this.toggleSidePanels();
                                                        e.preventDefault();
                                                        return;
                                                    }

                                                    if (e.ctrlKey) {
                                                        switch (e.keyCode) {
                                                            case monaco.KeyCode.DownArrow:
                                                                this.setFilteredCommandsPointer(this.ls().filteredCommands.length - 1)
                                                                break;
                                                            case monaco.KeyCode.UpArrow:
                                                                this.setFilteredCommandsPointer(0);
                                                                break;
                                                        }
                                                    } else {
                                                        switch (e.keyCode) {
                                                            case monaco.KeyCode.DownArrow:
                                                                this.moveFilteredCommandsPointer(1);
                                                                break;
                                                            case monaco.KeyCode.UpArrow:
                                                                this.moveFilteredCommandsPointer(-1);
                                                                break;
                                                        }
                                                    }
                                                });
                                                editor.onDidPaste(e => {
                                                    if (e.range.endLineNumber > 1) {
                                                        editor.setValue(editor.getValue().replaceAll('\n', ''));
                                                    }
                                                });

                                                editor.focus();
                                                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, args => {

                                                });
                                            }}
                                            language={"command"}
                                            theme={"SampleCommandPalette"}
                                            defaultValue={""}
                                            onChange={(filter, ev) => {
                                                this.local.setStateWithChannels({
                                                    filter: filter
                                                }, [], () => this.calculateFilteredCommands());
                                            }}
                                            options={{
                                                lineNumbers: 'off',
                                                glyphMargin: false,
                                                folding: false,
                                                lineDecorationsWidth: 0,
                                                lineNumbersMinChars: 0,
                                                hideCursorInOverviewRuler: true,
                                                renderValidationDecorations: "off",
                                                overviewRulerBorder: false,
                                                renderLineHighlight: "none",
                                                codeLens: false,
                                                cursorStyle: "block",
                                                scrollbar: {
                                                    vertical: "hidden",
                                                    horizontal: "hidden"
                                                },
                                                minimap: {
                                                    enabled: false
                                                },
                                                fontLigatures: true,
                                                fontFamily: "OperatorMono",
                                                fontWeight: "350",
                                                fontSize: 14,
                                                lineHeight: 21
                                            }}
                                        />
                                    ]}/>
                                ]}/>,
                                <Separator style={{ backgroundColor: "#212121" }}/>
                            ]
                        }}
                        overflowContainer={{
                            elements: [
                                this.component(local => (
                                    <Flex fw gap={px()} flexDir={FlexDirection.COLUMN} padding paddingX={px()} paddingY={px(13)} elements={[
                                        ...this.ls().filteredCommands.map((cd, index) => {
                                            return (
                                                <CommandSelector
                                                    gloria={this.props.gloria}
                                                    command={cd}
                                                    highlightMode={this.ls().filteredCommandsPointer === index ? CommandHighlightMode.SELECTED : CommandHighlightMode.NONE}
                                                />
                                            );
                                        })
                                    ]}/>
                                ), "pointer", "filtered-commands")
                            ]
                        }}
                        staticContainer={{
                            elements: [
                                <Flex fw align={Align.CENTER} justifyContent={Justify.CENTER} margin={createMargin(0, 0, 20, 0)} elements={[
                                    <Flex wrap={FlexWrap.WRAP} elements={[
                                        <KeyHint keys={["ALT", "S"]} label={"Toggle side panels"}/>,
                                    ]}/>,
                                    <Centered children={
                                        <Watermark/>
                                    }/>
                                ]}/>
                            ]
                        }}
                    />
                ]}/>

            );
        });
    }

    private westCompartmentAssembly() {
        this.assembly.assembly("west-compartment", theme => {
            if (this.getConfig().openSidePanels) return <></>;

            return (
                <Box
                    bgColor={Color.ofHex("#121212")}
                    width={DimensionalMeasured.of(18, Dimension.vw)}
                    fh
                    noPadding
                    elements={[
                        <Flex fw flexDir={FlexDirection.ROW} padding paddingX={px(19)} paddingY={px(27)} elements={[
                            <Flex height={px(21)} align={Align.CENTER} elements={[
                                <Text text={"Console"}/>
                            ]}/>
                        ]}/>,
                        <Separator style={{ backgroundColor: "#212121" }}/>
                    ]
                }/>
            );
        });
    }

    private eastCompartmentAssembly() {
        this.assembly.assembly("east-compartment", theme => {
            if (this.getConfig().openSidePanels) return <></>;

            return (
                <Box
                    bgColor={Color.ofHex("#121212")}
                    width={DimensionalMeasured.of(18, Dimension.vw)}
                    fh
                    noPadding
                    elements={[
                        this.component(() => {
                            const selectedCommand = this.getSelectedCommand();

                            if (selectedCommand === undefined) {
                                return (
                                    <>No command selected</>
                                );
                            }

                            return (
                                <AF elements={[
                                    <Flex fw flexDir={FlexDirection.ROW} padding paddingX={px(19)} paddingY={px(27)} elements={[
                                        <Flex height={px(21)} align={Align.CENTER} elements={[
                                            <Text text={selectedCommand.title(this.props.gloria)}/>
                                        ]}/>
                                    ]}/>,

                                    <Separator style={{ backgroundColor: "#212121" }}/>,

                                    <Flex fw style={{ flex: "1 1 auto" }} flexDir={FlexDirection.ROW} padding paddingX={px(19)} overflowYBehaviour={OverflowBehaviour.SCROLL} paddingY={px(13)} elements={[
                                        <Flex gap={theme.gaps.smallGab} elements={[
                                            <Text
                                                fontSize={px(12)}
                                                bold
                                                type={TextType.secondaryDescription}
                                                text={"Description"}
                                            />,
                                            <Text
                                                fontSize={px(11)}
                                                type={TextType.secondaryDescription}
                                                text={selectedCommand.description?.(this.props.gloria) ?? ""}
                                            />
                                        ]}/>
                                    ]}/>
                                ]}/>
                            );
                        }, "pointer")
                    ]
                }/>
            );
        });
    }

    public calculateFilteredCommands() {
        this.ls().calculateFilteredCommands();
    }

    private _calculateFilteredCommands() {
        const state = this.ls();
        const gloria = this.props.gloria;
        let filteredCommands: GloriaCommandDefinition[];
        const filter = state.filter?.toLocaleLowerCase().trim() ?? /.*/;
        if (state.filter === undefined) filteredCommands = gloria.commands;
        else filteredCommands = gloria.commands.filter(cd => cd.title(gloria).toLocaleLowerCase().match(filter));
        this.local.setStateWithChannels({
            filteredCommands: filteredCommands,
            filteredCommandsPointer: 0
        }, ["filtered-commands", "pointer"]);
    }

    componentRender(p: SampleCommandPaletteProps, s: any, l: SampleCommandPaletteLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex flexDir={FlexDirection.ROW} justifyContent={Justify.CENTER} align={Align.CENTER} gap={px(20)} fw height={DimensionalMeasured.of(40, Dimension.vh)} elements={[
                this.component(() => this.a("west-compartment"), "side-panels", "west-compartment"),
                this.a("core"),
                this.component(() => this.a("east-compartment"), "side-panels", "east-compartment"),
            ]}/>
        );
    }
}

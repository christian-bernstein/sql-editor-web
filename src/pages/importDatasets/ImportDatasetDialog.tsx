import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Text, TextType} from "../../components/lo/Text";
import {Screen} from "../../components/lo/Page";
import {Box} from "../../components/lo/Box";
import {Centered} from "../../components/lo/PosInCenter";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {FlexBox} from "../../components/lo/FlexBox";
import {Badge} from "../../components/lo/Badge";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import React from "react";
import {CodeEditor} from "../../components/lo/CodeEditor";
import {oneDark} from "@codemirror/theme-one-dark";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {javascript} from "@codemirror/lang-javascript";
import {Button} from "../../components/lo/Button";
import {Select} from "../../components/lo/Select";
import {If} from "../../components/logic/If";

export type ImportDatasetDialogProps = {
    tableSupplier: (instance: ImportDatasetDialog) => Array<string>,
    sqlRelay: (sql: string) => void
}

export type ImportDatasetDialogLocalState = {
    tables: Array<string>,
    json: string,
    selectedTable?: string,
    validJson?: boolean
}

export class ImportDatasetDialog extends BernieComponent<ImportDatasetDialogProps, any, ImportDatasetDialogLocalState> {

    constructor(props: ImportDatasetDialogProps) {
        super(props, undefined, {
            tables: [],
            json: ""
        });
    }

    init() {
        super.init();
        this.structAssembly();
        this.formAssembly();
        this.editorAssembly();
        this.tableAssembly();
        this.submitAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        const tables = this.props.tableSupplier(this);
        this.local.setStateWithChannels({
            tables: tables,
            selectedTable: tables[0]
        }, ["tables"]);
    }

    private tableAssembly() {
        this.assembly.assembly("table", (theme, props) => {
            return this.component(local => {
                return (
                    <FlexBox width={percent(100)}>
                        <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} flexDir={FlexDirection.ROW}
                                 width={percent(100)}>
                            <Text text={"Select table"}/>

                        </FlexBox>

                        <Select initialValue={this.local.state.selectedTable} onChange={element => {
                            this.local.setStateWithChannels({
                                selectedTable: element
                            }, ["tables"]);
                        }} elements={() => this.local.state.tables.map(tableName => {
                            return {
                                value: tableName
                            };
                        })}/>
                    </FlexBox>
                );
            }, "tables")
        })
    }

    private editorAssembly() {
        this.assembly.assembly("editor", (theme, props) => {
            return this.component(local => {
                return (
                    <FlexBox width={percent(100)}>
                        <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} flexDir={FlexDirection.ROW}
                                 width={percent(100)}>
                            <Text text={"JSON representation"}/>
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                                {
                                    this.component(() => (
                                        <If condition={local.state.validJson !== undefined && local.state.validJson} ifTrue={
                                            <Badge visualMeaning={ObjectVisualMeaning.SUCCESS} opaque>
                                                <Text
                                                    text={"valid"}
                                                    bold
                                                    uppercase
                                                    coloredText
                                                    type={TextType.secondaryDescription}
                                                    visualMeaning={ObjectVisualMeaning.SUCCESS}
                                                />
                                            </Badge>
                                        } ifFalse={
                                            <If condition={local.state.validJson !== undefined && !local.state.validJson} ifTrue={
                                                <Badge visualMeaning={ObjectVisualMeaning.ERROR} opaque>
                                                    <Text
                                                        text={"invalid"}
                                                        bold
                                                        uppercase
                                                        coloredText
                                                        type={TextType.secondaryDescription}
                                                        visualMeaning={ObjectVisualMeaning.ERROR}
                                                    />
                                                </Badge>
                                            }/>
                                        }/>
                                    ), "json-valid")
                                }
                            </FlexBox>
                        </FlexBox>

                        <CodeEditor
                            width={percent(100)}
                            theme={oneDark}
                            classnames={["cm"]}
                            debounce={true}
                            debounceMS={300}
                            value={this.local.state.json}
                            placeholder={"[..]"}
                            extensions={[
                                javascript(),
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
                            ]}
                            upstreamHook={value => this.local.setStateWithChannels({
                                json: value.trim(),
                                validJson: value.trim().length > 0 ? ImportDatasetDialog.checkJSONValidity(value) : undefined
                            }, ["json-valid"])}
                        />
                    </FlexBox>
                );
            }, "json");
        });
    }

    private submitAssembly() {
        this.assembly.assembly("submit", (theme, props) => {
            return (
                <FlexBox width={percent(100)} flexDir={FlexDirection.ROW}>
                    <Button width={percent(50)} onClick={() => this.submit("reset")} children={
                        <Text text={"Insert & reset"}/>
                    }/>
                    <Button width={percent(50)} onClick={() => this.submit("close")} children={
                        <Text text={"Insert & close"}/>
                    }/>
                </FlexBox>
            );
        });
    }

    private formAssembly() {
        this.assembly.assembly("form", (theme, props) => {
            return (
                <Box minWidth={percent(25)} maxWidth={percent(100)}>
                    <FlexBox>
                        {this.a("table")}
                        {this.a("editor")}
                        {this.a("submit")}
                    </FlexBox>
                </Box>
            );
        });
    }

    private structAssembly() {
        this.assembly.assembly("struct", (theme, props) => {
            return (
                <Screen>
                    <Centered fullHeight>
                        {this.a("form")}
                    </Centered>
                </Screen>
            );
        });
    }

    private generateSQL(): string {
        const state = this.local.state;
        const arr = JSON.parse(state.json) as object[];
        let sql = `insert into ${state.selectedTable} values `;
        sql += arr.map(dataset => {
            return `(${Object.values(dataset).map(entry => `'${entry}'`).join(",")})`
        }).join(",") + ";";
        return sql;
    }

    private executeSQL() {
        try {
            this.props.sqlRelay(this.generateSQL());
        } catch (e) {
            console.error(e);
        }
    }

    private submit(mode: "close" | "reset") {
        if (!this.local.state.validJson) {
            return;
        }
        switch (mode) {
            case "close":
                this.executeSQL();
                break;
            case "reset":
                this.executeSQL();
                this.local.setStateWithChannels({
                    json: ""
                }, ["tables", "json"]);
                break;
        }
    }

    componentRender(p: ImportDatasetDialogProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.a("struct");
    }

    private static checkJSONValidity(json: string): boolean {
        try {
            return Array.isArray(JSON.parse(json));
        } catch (e) {
            return false;
        }
    }
}

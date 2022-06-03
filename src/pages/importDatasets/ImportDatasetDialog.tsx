import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Text, TextType} from "../../components/lo/Text";
import {Screen} from "../../components/lo/Page";
import {Box} from "../../components/lo/Box";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {FlexBox} from "../../components/lo/FlexBox";
import {Badge} from "../../components/lo/Badge";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import React from "react";
import {Button} from "../../components/lo/Button";
import {Select} from "../../components/lo/Select";
import {If} from "../../components/logic/If";
import {App} from "../../logic/app/App";
import {SessionCommandType} from "../../logic/data/SessionCommandType";
import {BarLoader} from "react-spinners";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {CodeEditor} from "../../components/lo/CodeEditor";
import {oneDark} from "@codemirror/theme-one-dark";
import {javascript} from "@codemirror/lang-javascript";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {Centered} from "../../components/lo/PosInCenter";
import {sql} from "@codemirror/lang-sql";
import {format} from "sql-formatter";
import {AppHeader} from "../../components/lo/AppHeader";
import {Icon} from "../../components/lo/Icon";
import {Default, Mobile} from "../../components/logic/Media";

export type ImportDatasetDialogProps = {
    dbID: string
}

export type ImportDatasetDialogLocalState = {
    tables: Array<string>,
    json: string,
    selectedTable?: string,
    validJson?: boolean,
    processingSQLInsert: boolean,
    loadingTables: boolean
}

export class ImportDatasetDialog extends BernieComponent<ImportDatasetDialogProps, any, ImportDatasetDialogLocalState> {

    constructor(props: ImportDatasetDialogProps) {
        super(props, undefined, {
            tables: [],
            json: "",
            processingSQLInsert: false,
            loadingTables: false
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

        App.app().net().intrinsicSQLQuery({
            onStart: () => {
                this.local.setStateWithChannels({
                    loadingTables: true
                }, ["tables"]);
            },
            onCallback: data => {
                const tables: string[] = data.rows.map(dataset => {
                    return (new Map(Object.entries(dataset)).get("TABLE_NAME"))
                });
                this.local.setStateWithChannels({
                    loadingTables: false,
                    tables: tables,
                    selectedTable: tables[0]
                }, ["tables"]);
            },
            simulateDelay: true,
            simulatedDelay: () => 5000,
            packet: {
                attributes: new Map<string, string>(),
                raw: "show tables from public",
                type: SessionCommandType.PULL,
                dbID: this.props.dbID
            }
        });
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

                        <If condition={local.state.loadingTables} ifTrue={
                            <Box visualMeaning={ObjectVisualMeaning.WARNING} opaque width={percent(100)} paddingY={px()} height={px(40)}>
                                <FlexBox flexDir={FlexDirection.ROW} width={percent(100)} height={percent(100)} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                    <Text text={"Loading tables"}/>
                                    <BarLoader color={theme.colors.warnHighlightColor.css()}/>
                                </FlexBox>
                            </Box>
                        } ifFalse={
                            <Select initialValue={this.local.state.selectedTable} onChange={element => {
                                this.local.setStateWithChannels({
                                    selectedTable: element
                                }, ["tables"]);
                            }} elements={() => this.local.state.tables.map(tableName => {
                                return {
                                    value: tableName
                                };
                            })}/>
                        }/>


                    </FlexBox>
                );
            }, "tables")
        })
    }

    private editorAssembly() {
        this.assembly.assembly("editor", (theme, props) => {
            return this.component(local => {

                const renderer: () => JSX.Element = () => {
                    return (
                        <>
                            <FlexBox width={percent(100)} height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                                <FlexBox width={percent(100)} height={percent(100)}>
                                    <CodeEditor
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
                            </FlexBox>
                            <FlexBox height={percent(100)} width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                                <FlexBox width={percent(100)} height={percent(100)} minWidth={percent(100)}>
                                    {
                                        this.component(() => (
                                            <If condition={ImportDatasetDialog.checkJSONValidity(local.state.json)} ifTrue={
                                                <FlexBox width={percent(100)}>
                                                    <CodeEditor
                                                        theme={oneDark}
                                                        classnames={["cm"]}
                                                        editable={false}
                                                        value={format(this.generateSQL())}
                                                        extensions={[
                                                            sql(),
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
                                                        upstreamHook={() => {}}
                                                    />
                                                </FlexBox>
                                            } ifFalse={
                                                <Box height={percent(100)} width={percent(100)}>
                                                    <Centered fullHeight>
                                                        <Text text={"error"}/>
                                                    </Centered>
                                                </Box>
                                            }/>
                                        ), "json-valid")
                                    }
                                </FlexBox>
                            </FlexBox>
                        </>
                    );
                }

                return (
                    <FlexBox overflowYBehaviour={OverflowBehaviour.HIDDEN} width={percent(100)} style={{
                        flexGrow: 1,
                    }}>
                        <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} flexDir={FlexDirection.ROW} width={percent(100)}>
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
                        <Default children={
                            <LiteGrid height={percent(100)} gap={theme.gaps.defaultGab} style={{overflow: "hidden",}} columns={2} rows={1} children={renderer()}/>
                        }/>
                        <Mobile children={
                            <LiteGrid height={percent(100)} gap={theme.gaps.defaultGab} style={{overflow: "hidden",}} columns={1} rows={2} children={renderer()}/>
                        }/>
                    </FlexBox>
                );
            }, "json");
        });
    }

    private submitAssembly() {
        this.assembly.assembly("submit", (theme, props) => {
            return this.component(local => {
                return (
                    <If condition={local.state.processingSQLInsert} ifTrue={
                        <></>
                    } ifFalse={
                        <FlexBox width={percent(100)} flexDir={FlexDirection.ROW}>
                            <Button width={percent(50)} onClick={() => this.submit("reset")} children={
                                <Text text={"Insert & reset"}/>
                            }/>
                            <Button width={percent(50)} onClick={() => this.submit("close")} children={
                                <Text text={"Insert & close"}/>
                            }/>
                        </FlexBox>
                    }/>
                );
            }, "insert");
        });
    }

    private formAssembly() {
        this.assembly.assembly("form", (theme, props) => {
            return (
                <FlexBox width={percent(100)} height={percent(100)}>
                    <AppHeader title={"Insert data"} right={
                        <Icon icon={<CloseIcon/>} onClick={() => App.app().callAction("close-main-dialog")}/>
                    }/>
                    {this.a("table")}
                    {this.a("editor")}
                    {this.a("submit")}
                </FlexBox>
            );
        });
    }

    private structAssembly() {
        this.assembly.assembly("struct", (theme, props) => {
            return (
                <Screen>
                    {this.a("form")}
                </Screen>
            );
        });
    }

    private generateSQL(): string {
        const state = this.local.state;
        if (!ImportDatasetDialog.checkJSONValidity(state.json)) {
            return "";
        }
        const arr = JSON.parse(state.json) as object[];
        let sql = `insert into ${state.selectedTable} values `;
        sql += arr.map(dataset => {
            return `(${Object.values(dataset).map(entry => `'${entry}'`).join(",")})`
        }).join(",") + ";";
        return sql;
    }

    private executeSQL() {
        App.app().net().intrinsicSQLUpdate({
            packet: {
                dbID: this.props.dbID,
                raw: this.generateSQL(),
                type: SessionCommandType.PUSH,
                attributes: new Map<string, string>()
            },
            onCallback: data => {
                this.local.setStateWithChannels({
                    processingSQLInsert: false
                }, ["insert"])
            }
        })
    }

    private submit(mode: "close" | "reset") {
        if (!this.local.state.validJson) {
            return;
        }
        switch (mode) {
            case "close":
                this.executeSQL();
                App.app().callAction("close-main-dialog");
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
        if (json.trim().length === 0) {
            return false;
        }
        try {
            return Array.isArray(JSON.parse(json));
        } catch (e) {
            return false;
        }
    }
}

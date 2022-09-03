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
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as CheckIcon} from "../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as FalseIcon} from "../../assets/icons/ic-16/ic16-close.svg";
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
import {SQLCommandUpdateResponsePacketData} from "../../packets/in/SQLCommandUpdateResponsePacketData";
import _ from "lodash";
import {SQLResultDisplay} from "../../components/ho/dbErrorDisplay/SQLResultDisplay";
import {ContextCompound} from "../../components/ho/contextCompound/ContextCompound";
import {ContextMenuElement} from "../../components/lo/ContextMenuElement";

export type ImportDatasetDialogProps = {
    dbID: string
}

export type ImportDatasetDialogLocalState = {
    tables: Array<string>,
    json: string,
    selectedTable?: string,
    validJson?: boolean,
    processingSQLInsert: boolean,
    loadingTables: boolean,
    currentUpdateResult?: SQLCommandUpdateResponsePacketData,
    jsonPersist: (json: string) => void,
    jsonPersistInSync: boolean
}

export class ImportDatasetDialog extends BernieComponent<ImportDatasetDialogProps, any, ImportDatasetDialogLocalState> {

    constructor(props: ImportDatasetDialogProps) {
        const json = App.app().ls().get("insert-data", "json", "");
        super(props, undefined, {
            tables: [],
            json: json,
            validJson: json.trim().length > 0 ? ImportDatasetDialog.checkJSONValidity(json) : undefined,
            processingSQLInsert: false,
            loadingTables: false,
            jsonPersist: _.debounce(json => {
                App.app().ls().save("insert-data", "json", json.trim())
                this.local.setStateWithChannels({
                    jsonPersistInSync: true
                }, ["json-persist"]);
            }, 2000),
            jsonPersistInSync: true
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
            simulateDelay: false,
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
                            <FlexBox style={{borderRadius: theme.radii.defaultObjectRadius.css()}} width={percent(100)} height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                                <FlexBox width={percent(100)} height={percent(100)}>

                                    <FlexBox width={percent(100)}>
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
                                            upstreamHook={value => this.updateJSONInput(value, false)}
                                        />
                                    </FlexBox>

                                </FlexBox>
                            </FlexBox>
                            <FlexBox style={{borderRadius: theme.radii.defaultObjectRadius.css()}} width={percent(100)} height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
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
                                                        <Text text={"invalid json"}/>
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
                                        <If condition={local.state.jsonPersistInSync} ifTrue={
                                            <Badge visualMeaning={ObjectVisualMeaning.SUCCESS} opaque>
                                                <Text
                                                    text={"saved"}
                                                    uppercase
                                                    coloredText
                                                    type={TextType.secondaryDescription}
                                                    visualMeaning={ObjectVisualMeaning.SUCCESS}
                                                    enableLeftAppendix
                                                    leftAppendix={
                                                        <Icon icon={<CheckIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored size={px(16)}/>
                                                    }
                                                />
                                            </Badge>
                                        } ifFalse={
                                            <Badge visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque>
                                                <Text
                                                    text={"saving"}
                                                    uppercase
                                                    coloredText
                                                    type={TextType.secondaryDescription}
                                                    visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                                    enableLeftAppendix
                                                    leftAppendix={
                                                        <Icon icon={<FalseIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored size={px(16)}/>
                                                    }
                                                />
                                            </Badge>
                                        }/>
                                    ), "json-persist")
                                }
                                {
                                    this.component(() => (
                                        <If condition={local.state.validJson !== undefined && local.state.validJson} ifTrue={
                                            <Badge visualMeaning={ObjectVisualMeaning.SUCCESS} opaque>
                                                <Text
                                                    text={"valid"}
                                                    uppercase
                                                    coloredText
                                                    type={TextType.secondaryDescription}
                                                    visualMeaning={ObjectVisualMeaning.SUCCESS}
                                                    enableLeftAppendix
                                                    leftAppendix={
                                                        <Icon icon={<CheckIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored size={px(16)}/>
                                                    }
                                                />
                                            </Badge>
                                        } ifFalse={
                                            <If condition={local.state.validJson !== undefined && !local.state.validJson} ifTrue={
                                                <Badge visualMeaning={ObjectVisualMeaning.ERROR} opaque>
                                                    <Text
                                                        text={"invalid"}
                                                        uppercase
                                                        coloredText
                                                        type={TextType.secondaryDescription}
                                                        visualMeaning={ObjectVisualMeaning.ERROR}
                                                        enableLeftAppendix
                                                        leftAppendix={
                                                            <Icon icon={<FalseIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored size={px(16)}/>
                                                        }
                                                    />
                                                </Badge>
                                            }/>
                                        }/>
                                    ), "json-valid")
                                }

                                <ContextCompound menu={
                                    <FlexBox gap={px(1)}>
                                        <ContextMenuElement title={"Format json *(human readable)*"} onClick={() => this.formatJSONInput()}/>
                                        <ContextMenuElement title={"Format json *(space efficient)*"} onClick={() => this.formatJSONInput(false)}/>
                                    </FlexBox>
                                } children={
                                    <Icon icon={<MenuIcon/>}/>
                                }/>

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
            }, "json", "tables");
        });
    }

    private updateJSONInput(newJSON: string, rerenderInputEditor: boolean = true) {
        const channels = ["json-valid", "json-persist"];
        if (rerenderInputEditor) {
            channels.push("json");
        }
        this.local.setStateWithChannels({
            json: newJSON.trim(),
            validJson: newJSON.trim().length > 0 ? ImportDatasetDialog.checkJSONValidity(newJSON) : undefined,
            jsonPersistInSync: false
        }, channels, () => {
            this.local.state.jsonPersist(newJSON);
        });
    }

    private formatJSONInput(beautify: boolean = true) {
        let json = this.local.state.json;
        if (ImportDatasetDialog.checkJSONValidity(json)) {
            if (beautify) {
                this.updateJSONInput(JSON.stringify(JSON.parse(json), null, 2));
            } else {
                this.updateJSONInput(JSON.stringify(JSON.parse(json)));
            }
        }
    }

    private submitAssembly() {
        this.assembly.assembly("submit", (theme, props) => {
            return this.component(local => {
                return (
                    <If condition={local.state.processingSQLInsert} ifTrue={
                        <Box width={percent(100)} paddingY={px()} height={px(40)} visualMeaning={ObjectVisualMeaning.WARNING} opaque>
                            <FlexBox width={percent(100)} height={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                <Text text={"Inserting datasets.."}/>
                                <BarLoader color={theme.colors.warnHighlightColor.css()}/>
                            </FlexBox>
                        </Box>
                    } ifFalse={
                        <FlexBox width={percent(100)}>
                            {
                                this.component(local1 => {
                                    return (
                                        local.state.currentUpdateResult !== undefined ? (
                                            <SQLResultDisplay response={this.local.state.currentUpdateResult} type={SessionCommandType.PUSH} clearHook={() => {
                                                this.local.setStateWithChannels({
                                                    currentUpdateResult: undefined
                                                }, ["insert-result"]);
                                            }}/>
                                        ) : <></>
                                    );
                                }, "insert-result")
                            }
                            {
                                this.component(local1 => {
                                    return (
                                        <LiteGrid columns={3} gap={theme.gaps.smallGab}>
                                            <Button visualMeaning={this.local.state.validJson ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque width={percent(100)} onClick={() => this.submit("reset")} children={
                                                <Text text={"Insert & reset"} align={Align.CENTER}/>
                                            }/>
                                            <Button visualMeaning={this.local.state.validJson ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque width={percent(100)} onClick={() => this.submit("plain")} children={
                                                <Text text={"Insert"}/>
                                            }/>
                                            <Button visualMeaning={this.local.state.validJson ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque width={percent(100)} onClick={() => this.submit("close")} children={
                                                <Text text={"Insert & close"} align={Align.CENTER}/>
                                            }/>
                                        </LiteGrid>
                                    );
                                }, "json-valid")
                            }
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
            onStart: () => {
                this.local.setStateWithChannels({
                    processingSQLInsert: true,
                    currentUpdateResult: undefined
                }, ["insert"]);
            },
            packet: {
                dbID: this.props.dbID,
                raw: this.generateSQL(),
                type: SessionCommandType.PUSH,
                attributes: new Map<string, string>()
            },
            simulateDelay: false,
            simulatedDelay: () => 2000,
            onCallback: data => {
                this.local.setStateWithChannels({
                    processingSQLInsert: false,
                    currentUpdateResult: data
                }, ["insert"]);
            }
        })
    }

    private submit(mode: "close" | "reset" | "plain") {
        if (!this.local.state.validJson) {
            return;
        }
        switch (mode) {
            case "plain":
                this.executeSQL();
                break;
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

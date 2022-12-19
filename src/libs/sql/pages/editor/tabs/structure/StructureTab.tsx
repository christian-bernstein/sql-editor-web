import {BernieComponent} from "../../../../logic/BernieComponent";
import {TabProps} from "../TabProps";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import '@inovua/reactdatagrid-community/theme/blue-dark.css';
import React, {CSSProperties} from "react";
import {App} from "../../../../logic/app/App";
import {SessionCommandType} from "../../../../logic/data/SessionCommandType";
import {DBTable} from "../../../../logic/data/DBTable";
import {Align} from "../../../../logic/style/Align";
import {Justify} from "../../../../logic/style/Justify";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {Text, TextType} from "../../../../components/lo/Text";
import {Cursor} from "../../../../logic/style/Cursor";

import {ReactComponent as BrowseIcon} from "../../../../../../assets/icons/ic-20/ic20-view-table.svg";
import {ReactComponent as SearchIcon} from "../../../../../../assets/icons/ic-20/ic20-search.svg";
import {ReactComponent as InsertIcon} from "../../../../../../assets/icons/ic-20/ic20-publish.svg";
import {ReactComponent as ArrowLeftUpIcon} from "../../../../../../assets/icons/arrow-left-up.svg";
import {Icon} from "../../../../components/lo/Icon";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {TypeRowSelection} from "@inovua/reactdatagrid-community/types";
import {Button} from "../../../../components/lo/Button";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {TableActionConfig} from "./TableActionConfig";
import {getOr} from "../../../../logic/Utils";
import {If} from "../../../../components/logic/If";

export type StructureTabProps = TabProps & {
}

export type StructureTabLocalState = {
    loadingTables: boolean,
    tables: Array<DBTable>,
    selected?: TypeRowSelection
}

// noinspection RequiredAttributes
export class StructureTab extends BernieComponent<StructureTabProps, any, StructureTabLocalState> {

    private static readonly tableActions: Array<TableActionConfig> = [
        {
            allowedRange: {min: 1, max: 1},
            actionButtonRenderer: (instance, config) => (
                <Button border={false} bgColorOnDefault={false} opaqueValue={.6} onClick={() => config.run(instance, Object.keys(instance.local.state.selected as object))} children={
                    <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Browse"} enableLeftAppendix leftAppendix={<Icon icon={<BrowseIcon/>}/>}/>
                }/>
            ),
            run: (instance, tables) => {
                const sql = `select * from ${tables[0]}`;
                console.log(sql)
                instance.props.editor.sendCommand(SessionCommandType.PULL, sql).then(() => {});
            }
        },

        {
            allowedRange: {min: 1, max: 1},
            actionButtonRenderer: (instance, config) => (
                <Button border={false} bgColorOnDefault={false} opaqueValue={.6} onClick={() => config.run(instance, Object.keys(instance.local.state.selected as object))} children={
                    <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Structure"} enableLeftAppendix/>
                }/>
            ),
            run: (instance, tables) => {}
        },

        {
            allowedRange: {min: 1, max: 1},
            actionButtonRenderer: (instance, config) => (
                <Button border={false} bgColorOnDefault={false} opaqueValue={.6} children={
                    <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Search"} enableLeftAppendix leftAppendix={<Icon icon={<SearchIcon/>}/>}/>
                }/>
            ),
            run: (instance, tables) => {}
        },

        {
            allowedRange: {min: 1, max: 1},
            actionButtonRenderer: (instance, config) => (
                <Button border={false} bgColorOnDefault={false} opaqueValue={.6} children={
                    <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Insert"} enableLeftAppendix leftAppendix={<Icon icon={<InsertIcon/>}/>}/>
                }/>
            ),
            run: (instance, tables) => {}
        },

        {
            actionButtonRenderer: (instance, config) => (
                <Button border={false} visualMeaning={ObjectVisualMeaning.ERROR} bgColorOnDefault={false} opaque children={
                    <Text type={TextType.secondaryDescription} highlight cursor={Cursor.pointer} visualMeaning={ObjectVisualMeaning.ERROR} text={"Empty"} enableLeftAppendix/>
                }/>
            ),
            run: (instance, tables) => {}
        },

        {
            actionButtonRenderer: (instance, config) => (
                <Button border={false} visualMeaning={ObjectVisualMeaning.ERROR} bgColorOnDefault={false} opaque children={
                    <Text type={TextType.secondaryDescription} highlight cursor={Cursor.pointer} visualMeaning={ObjectVisualMeaning.ERROR} text={"Drop"} enableLeftAppendix/>
                }/>
            ),
            run: (instance, tables) => {}
        }
    ];

    constructor(props: StructureTabProps) {
        super(props, undefined, {
            tables: [],
            loadingTables: false,
            selected: []
        });
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
                    tables: tables.map(raw => ({
                        name: raw
                    })),
                }, ["tables"]);
            },
            simulateDelay: false,
            simulatedDelay: () => 5000,
            packet: {
                attributes: new Map<string, string>(),
                raw: `show tables from public`,
                type: SessionCommandType.PULL,
                dbID: this.props.projectInfo.id
            }
        });
    }

    componentRender(p: StructureTabProps, s: any, l: StructureTabLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const gridStyle: CSSProperties = {
            height: "100%",
            borderRadius: t.radii.defaultObjectRadius.withPlus(-1).css(),
            overflow: "hidden",
            width: "100%",
        };

        return this.component(local => {
            return (
                <FlexBox width={percent(100)} height={percent(100)}>
                    <ReactDataGrid
                        pagination={"local"}
                        // theme={t.mode === "dark" ? "green-dark" : "green-light"}
                        theme={t.mode === "dark" ? "blue-dark" : "green-light"}
                        defaultSelected={local.state.selected}
                        onSelectionChange={config => {
                            this.local.setStateWithChannels({
                                selected: config.selected
                            }, ["table-actions"]);
                        }}
                        checkboxColumn
                        idProperty={"name"}
                        columns={[
                            {name: "name", header: "Table", minWidth: 250, defaultFlex: 1},
                            {name: "rows", header: "Rows", minWidth: 100, defaultFlex: 1},
                            {name: "type", header: "Type", minWidth: 100, defaultFlex: 1},
                            {name: "collation", header: "Collation", minWidth: 100, defaultFlex: 1},
                            {name: "size", header: "Size", minWidth: 100, defaultFlex: 1},
                        ]}
                        dataSource={local.state.tables}
                        style={gridStyle as {[p: string]: string | number}}
                    />

                    {
                        this.component(local => (
                            <If condition={Object.keys(this.local.state.selected as object).length > 0} ifTrue={
                                <FlexBox width={percent(100)} align={Align.CENTER} justifyContent={Justify.FLEX_START} flexDir={FlexDirection.ROW} gap={px()}>
                                    <Icon icon={<ArrowLeftUpIcon/>} size={px(40)} style={{
                                        top: -6,
                                        left: 0,
                                        marginRight: t.gaps.smallGab.css(),
                                        marginLeft: 8,
                                    }}/>
                                    <FlexBox flexDir={FlexDirection.ROW} gap={px()} align={Align.CENTER} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                                        {
                                            StructureTab.tableActions.filter(act => {
                                                const selectedCount = Object.keys(this.local.state.selected as object).length;
                                                let allowed = true;
                                                if (getOr(act.allowedRange?.min, 1) > selectedCount) {
                                                    allowed = false;
                                                }
                                                if (act.allowedRange?.max !== undefined && (act.allowedRange.max as number) < selectedCount) {
                                                    allowed = false
                                                }
                                                return allowed;

                                            }).map(act => act.actionButtonRenderer(this, act))
                                        }
                                    </FlexBox>
                                </FlexBox>
                            }/>
                        ), "table-actions")
                    }
                </FlexBox>
            );
        }, "tables", "filters");
    }
}

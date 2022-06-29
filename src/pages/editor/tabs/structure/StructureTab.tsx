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

import {ReactComponent as BrowseIcon} from "../../../../assets/icons/ic-20/ic20-view-table.svg";
import {ReactComponent as SearchIcon} from "../../../../assets/icons/ic-20/ic20-search.svg";
import {ReactComponent as InsertIcon} from "../../../../assets/icons/ic-20/ic20-publish.svg";
import {ReactComponent as ArrowLeftUpIcon} from "../../../../assets/icons/arrow-left-up.svg";
import {Icon} from "../../../../components/lo/Icon";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {TypeRowSelection} from "@inovua/reactdatagrid-community/types";
import {Button} from "../../../../components/lo/Button";

export type StructureTabProps = TabProps & {
}

export type StructureTabLocalState = {
    loadingTables: boolean,
    tables: Array<DBTable>,
    selected?: TypeRowSelection
}

// noinspection RequiredAttributes
export class StructureTab extends BernieComponent<StructureTabProps, any, StructureTabLocalState> {

    constructor(props: StructureTabProps) {
        super(props, undefined, {
            tables: [],
            loadingTables: false,
            selected: []
            // selected: new Map<number, boolean>()
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
                raw: "show tables from public",
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
                        selected={local.state.selected}
                        onSelectionChange={config => {
                            console.log(config);
                            this.local.setStateWithChannels({
                                selected: config.selected
                            }, ["filters"]);
                        }}
                        checkboxColumn
                        idProperty={"name"}
                        columns={[
                            {name: "name", header: "Table", minWidth: 250, defaultFlex: 1},
                            // {name: "rows", header: "Rows", minWidth: 100, defaultFlex: 1},
                            // {name: "type", header: "Type", minWidth: 100, defaultFlex: 1},
                            // {name: "collation", header: "Collation", minWidth: 100, defaultFlex: 1},
                            // {name: "size", header: "Size", minWidth: 100, defaultFlex: 1},
                        ]}
                        dataSource={local.state.tables}
                        style={gridStyle as {[p: string]: string | number}}
                    />
                    <FlexBox width={percent(100)} align={Align.CENTER} justifyContent={Justify.CENTER} flexDir={FlexDirection.ROW} gap={px()}>
                        <Icon icon={<ArrowLeftUpIcon/>} size={px(40)} style={{
                            top: -6,
                            left: 0,
                            marginRight: t.gaps.smallGab.css()
                        }}/>

                        <Button border={false} bgColorOnDefault={false} opaqueValue={.6} children={
                            <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Browse"} enableLeftAppendix leftAppendix={<Icon icon={<BrowseIcon/>}/>}/>
                        }/>
                        <Button border={false} bgColorOnDefault={false} opaqueValue={.6} children={
                            <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Structure"} enableLeftAppendix/>
                        }/>
                        <Button border={false} bgColorOnDefault={false} opaqueValue={.6} children={
                            <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Search"} enableLeftAppendix leftAppendix={<Icon icon={<SearchIcon/>}/>}/>
                        }/>
                        <Button border={false} bgColorOnDefault={false} opaqueValue={.6} children={
                            <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} text={"Insert"} enableLeftAppendix leftAppendix={<Icon icon={<InsertIcon/>}/>}/>
                        }/>
                        <Button border={false} visualMeaning={ObjectVisualMeaning.ERROR} bgColorOnDefault={false} opaqueValue={.6} children={
                            <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} visualMeaning={ObjectVisualMeaning.ERROR} text={"Empty"} enableLeftAppendix/>
                        }/>
                        <Button border={false} visualMeaning={ObjectVisualMeaning.ERROR} bgColorOnDefault={false} opaqueValue={.6} children={
                            <Text type={TextType.secondaryDescription} cursor={Cursor.pointer} visualMeaning={ObjectVisualMeaning.ERROR} text={"Drop"} enableLeftAppendix/>
                        }/>
                    </FlexBox>
                </FlexBox>
            );
        }, "tables", "filters");
    }
}

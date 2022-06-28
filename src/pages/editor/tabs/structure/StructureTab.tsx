import {BernieComponent} from "../../../../logic/BernieComponent";
import {TabProps} from "../TabProps";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {percent} from "../../../../logic/style/DimensionalMeasured";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import React, {CSSProperties} from "react";

export type StructureTabProps = TabProps & {
}

// noinspection RequiredAttributes
export class StructureTab extends BernieComponent<StructureTabProps, any, any> {

    componentRender(p: StructureTabProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const gridStyle: CSSProperties = {
            height: "100%",
            borderRadius: t.radii.defaultObjectRadius.withPlus(-1).css(),
            overflow: "hidden",
            width: "100%"
        };

        return (
            <FlexBox width={percent(100)}>

                <ReactDataGrid
                    pagination={"local"}
                    theme={t.mode === "dark" ? "green-dark" : "green-light"}
                    idProperty="id"
                    columns={
                        [
                            {
                                name: "table",
                                header: "Table",
                                minWidth: 50,
                                defaultFlex: 1
                            },
                            {
                                name: "rows",
                                header: "Rows",
                                minWidth: 50,
                                defaultFlex: 1
                            },
                            {
                                name: "type",
                                header: "Type",
                                minWidth: 50,
                                defaultFlex: 1
                            },
                            {
                                name: "collation",
                                header: "Collation",
                                minWidth: 50,
                                defaultFlex: 1
                            },
                            {
                                name: "size",
                                header: "Size",
                                minWidth: 50,
                                defaultFlex: 1
                            },
                            {
                                name: "action",
                                header: "Action",
                                minWidth: 50,
                                defaultFlex: 1
                            }
                        ]
                    }
                    dataSource={
                        [
                            {
                                id1: "test"
                            }
                        ]
                    }
                    style={gridStyle as {[p: string]: string | number}}
                />

            </FlexBox>
        );
    }
}

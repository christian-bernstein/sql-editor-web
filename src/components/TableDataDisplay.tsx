import React, {CSSProperties} from "react";
import {PageV2} from "./Page";
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-community/theme/green-dark.css'
import {FlexBox} from "./FlexBox";
import {LiteGrid} from "./LiteGrid";
import {Align} from "../logic/Align";
import {Justify} from "../logic/Justify";
import {Icon} from "./Icon";
import {CustomTooltip} from "./CustomTooltip";
import {ReactComponent as MenuIcon} from "../assets/icons/ic-20/ic20-menu.svg";
import {App, utilizeGlobalTheme} from "../logic/App";
import {Text, TextType} from "./Text";
import {FlexDirection} from "../logic/FlexDirection";
import {ReactComponent as CloseIcon} from "../assets/icons/ic-20/ic20-close.svg";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Box} from "./Box";
import {OverflowBehaviour} from "../logic/OverflowBehaviour";
import {percent} from "../logic/DimensionalMeasured";
import {Themeable} from "../Themeable";
import {arrayFactory} from "../logic/Utils";

export type TableDataDisplayProps = {
}

export class TableDataDisplay extends React.Component<TableDataDisplayProps, any> {

    constructor(props: TableDataDisplayProps) {
        super(props);
    }

    render() {
        const columns = [
            { name: 'id', header: 'ID', minWidth: 50, defaultFlex: 1 },
            { name: 'name', header: 'Name', minWidth: 50, defaultFlex: 2 },
            { name: 'age', header: 'Age', maxWidth: 1000, defaultFlex: 1 }
        ]
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const gridStyle: CSSProperties = {
            minHeight: 550 ,
            borderRadius: theme.radii.defaultObjectRadius.withPlus(-1).css(),
            overflow: "hidden",
        }
        const dataSource = [
            { id: 1, name: 'John McQueen', age: 35 },
            { id: 2, name: 'Mary Stones', age: 25 },
            { id: 3, name: 'Robert Fil', age: 27 },
            { id: 4, name: 'Roger Robson', age: 81 },
            { id: 5, name: 'Billary Konwik', age: 18 },
            { id: 6, name: 'Bob Martin', age: 18 },
            { id: 7, name: 'Matthew Richardson', age: 54 },
            { id: 8, name: 'Ritchie Peterson', age: 54 },
            { id: 9, name: 'Bryan Martin', age: 40 },
            { id: 10, name: 'Mark Martin', age: 44 },
            { id: 11, name: 'Michelle Sebastian', age: 24 },
            { id: 12, name: 'Michelle Sullivan', age: 61 },
            { id: 13, name: 'Jordan Bike', age: 16 },
            { id: 14, name: 'Nelson Ford', age: 34 },
            { id: 15, name: 'Tim Cheap', age: 3 },
            { id: 16, name: 'Robert Carlson', age: 31 },
            { id: 17, name: 'Johny Perterson', age: 40 },
            ...arrayFactory(i => {
                return {
                    id: i + 18,
                    name: "Franz",
                    age: Math.round(Math.random() * 100)
                }
            }, 200)
        ]

        // noinspection RequiredAttributes
        return (
            <ReactDataGrid
                pagination={"local"}
                theme={theme.mode === "dark" ? "green-dark" : "green-light"}
                idProperty="id"
                columns={columns}
                dataSource={dataSource}
                style={gridStyle as {[p: string]: string | number}}
            />
        );
    }
}

export class DebugTableDataDisplayPage extends React.Component<any, any> {

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        return (
            <PageV2>
                <LiteGrid columns={3}>
                    <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                        <Icon icon={(
                            <CustomTooltip title={"Toggle menu"} arrow>
                                <span>
                                    <MenuIcon/>
                                </span>
                            </CustomTooltip>
                        )} onClick={() => App.app().openMenu()}/>
                    </FlexBox>
                    <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                        <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"SQL Result"}/>
                    </FlexBox>
                    <FlexBox align={Align.CENTER} justifyContent={Justify.FLEX_END} flexDir={FlexDirection.ROW}>
                        <CustomTooltip title={<Text text={"Close"}/>} arrow noBorder>
                            <span>
                                <Icon icon={<CloseIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored={false}/>
                            </span>
                        </CustomTooltip>
                    </FlexBox>
                </LiteGrid>

                <Box height={percent(100)} noPadding={true} overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN}>
                    <TableDataDisplay/>
                </Box>
            </PageV2>
        );
    }
}

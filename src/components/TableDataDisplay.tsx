import React, {CSSProperties} from "react";
import {PageV2} from "./Page";
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-community/theme/green-dark.css';
import '@inovua/reactdatagrid-community/theme/green-light.css';
import {FlexBox} from "./FlexBox";
import {LiteGrid} from "./LiteGrid";
import {Align} from "../logic/Align";
import {Justify} from "../logic/Justify";
import {Icon} from "./Icon";
import {CustomTooltip} from "./CustomTooltip";
import {ReactComponent as MenuIcon} from "../assets/icons/ic-20/ic20-menu.svg";
import {ReactComponent as DebugIcon} from "../assets/icons/ic-20/ic20-bug.svg";
import {ReactComponent as CloseIcon} from "../assets/icons/ic-20/ic20-close.svg";
import {App, utilizeGlobalTheme} from "../logic/App";
import {Text, TextType} from "./Text";
import {FlexDirection} from "../logic/FlexDirection";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Themeable} from "../Themeable";
import {SQLCommandQueryResponsePacketData} from "../packets/in/SQLCommandQueryResponsePacketData";
import {cs} from "../logic/state/State";
import {RenderController} from "../tests/regex/RenderController";
import {getOr} from "../logic/Utils";
import {v4} from "uuid";
import {RenderExecutor} from "../tests/regex/RenderExecutor";
import {If} from "./If";
import {Separator} from "./Separator";
import {Orientation} from "../logic/Orientation";
import {Box} from "./Box";
import {ObjectJSONDisplay} from "./ObjectJSONDisplay";
import {percent} from "../logic/DimensionalMeasured";
import {OverflowBehaviour} from "../logic/OverflowBehaviour";
import styled from "styled-components";
import {generateCSSBodyForInovuaReactDataGrid} from "./table/InovuaReactDataGridTheme";

export type TableDataDisplayProps = {
    data: SQLCommandQueryResponsePacketData,
}

export class TableDataDisplay extends React.Component<TableDataDisplayProps, any> {

    constructor(props: TableDataDisplayProps) {
        super(props);
    }

    render() {
        const columns = [
            // { name: 'id', header: 'ID', minWidth: 50, defaultFlex: 1 },
            // { name: 'name', header: 'Name', minWidth: 50, defaultFlex: 2 },
            // { name: 'age', header: 'Age', maxWidth: 1000, defaultFlex: 1 },
            // todo add more versatile mapping procedure
            ...this.props.data.columns.map(col => ({
                name: col.id, header: col.id, minWidth: 50, defaultFlex: 1
            }))
        ]
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const gridStyle: CSSProperties = {
            minHeight: 550 ,
            borderRadius: theme.radii.defaultObjectRadius.withPlus(-1).css(),
            overflow: "hidden",
        }
        const dataSource = [
            // { id: 1, name: 'John McQueen', age: 35 },
            // { id: 2, name: 'Mary Stones', age: 25 },
            // { id: 3, name: 'Robert Fil', age: 27 },
            // { id: 4, name: 'Roger Robson', age: 81 },
            // { id: 5, name: 'Billary Konwik', age: 18 },
            // { id: 6, name: 'Bob Martin', age: 18 },
            // { id: 7, name: 'Matthew Richardson', age: 54 },
            // { id: 8, name: 'Ritchie Peterson', age: 54 },
            // { id: 9, name: 'Bryan Martin', age: 40 },
            // { id: 10, name: 'Mark Martin', age: 44 },
            // { id: 11, name: 'Michelle Sebastian', age: 24 },
            // { id: 12, name: 'Michelle Sullivan', age: 61 },
            // { id: 13, name: 'Jordan Bike', age: 16 },
            // { id: 14, name: 'Nelson Ford', age: 34 },
            // { id: 15, name: 'Tim Cheap', age: 3 },
            // { id: 16, name: 'Robert Carlson', age: 31 },
            // { id: 17, name: 'Johny Perterson', age: 40 },
            // ...arrayFactory(i => {
            //     return {
            //         id: i + 18,
            //         name: "Franz",
            //         age: Math.round(Math.random() * 100)
            //     }
            // }, 200),
            ...this.props.data.rows.map(value => {
                return {
                    ...value
                }
            })
        ]

        // const Wrapper = styled.span`
        //   ${generateCSSBodyForInovuaReactDataGrid()}
        // `;

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

export type DebugTableDataDisplayPageProps = {
    data: SQLCommandQueryResponsePacketData,
    onClose?: () => void
}

export type DebugTableDataDisplayPageLocalState = {
    debug: boolean
}

export class DebugTableDataDisplayPage extends React.Component<DebugTableDataDisplayPageProps, any> {

    private readonly local = cs<DebugTableDataDisplayPageLocalState>({
        debug: App.app().config.debugMode
    });

    private readonly controller = new RenderController();

    constructor(props: DebugTableDataDisplayPageProps) {
        super(props);
        this.local.on((state, value) => {
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });
    }

    private toggleDebugMode() {
        this.local.setState({
            debug: !this.local.state.debug
        }, new Map<string, any>([["channels", ["debug"]]]));
    }

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

                        <CustomTooltip title={<Text text={"Toggles debugging mode"}/>} arrow noBorder>
                            <span>
                                <RenderExecutor id={v4()} channels={["debug"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                    <If condition={this.local.state.debug} ifTrue={
                                        <Icon icon={<DebugIcon/>} colored visualMeaning={ObjectVisualMeaning.INFO} onClick={() => this.toggleDebugMode()}/>
                                    } ifFalse={
                                        <Icon icon={<DebugIcon/>} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} onClick={() => this.toggleDebugMode()}/>
                                    }/>
                                )}/>
                            </span>
                        </CustomTooltip>

                        <Separator orientation={Orientation.VERTICAL}/>

                        <CustomTooltip title={<Text text={"Close"}/>} arrow noBorder>
                            <span>
                                <Icon icon={<CloseIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored={false} onClick={() => {
                                    this.props.onClose?.();
                                }}/>
                            </span>
                        </CustomTooltip>
                    </FlexBox>
                </LiteGrid>

                <RenderExecutor id={v4()} channels={["debug"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                    <If condition={this.local.state.debug} ifTrue={
                        <ObjectJSONDisplay title={"**[DEBUG]** Packet viewer"} showControls pure={false} object={this.props.data}/>
                    } ifFalse={
                        <></>
                    }/>
                )}/>

                <Box height={percent(100)} noPadding={true} overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN}>
                    <TableDataDisplay data={this.props.data}/>
                </Box>
            </PageV2>
        );
    }
}

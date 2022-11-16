import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import React from "react";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {ReactComponent as OnStateIcon} from "../../../assets/icons/ic-20/ic20-turn-off.svg";
import {ReactComponent as RefreshIcon} from "../../../assets/icons/ic-20/ic20-refresh.svg";
import {ReactComponent as ContextIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as PlugIcon} from "../../../assets/icons/ic-20/ic20-plugin.svg";
import {ReactComponent as FunctionIcon} from "../../../assets/icons/ic-20/ic20-functions.svg";
import {Icon} from "../../../components/lo/Icon";
import {If} from "../../../components/logic/If";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {Text, TextType} from "../../../components/lo/Text";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import _ from "lodash";
import {Button} from "../../../components/lo/Button";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {AF} from "../../../components/logic/ArrayFragment";
import {createMargin} from "../../../logic/style/Margin";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {Box} from "../../../components/lo/Box";
import {Cursor} from "../../../logic/style/Cursor";

export type DevelopmentHuePlugToggleCardProps = {

}

export type DevelopmentHuePlugToggleCardLocalState = {
    updaterInterval?: NodeJS.Timeout,
    state?: any
}

export class DevelopmentHuePlugToggleCard extends BC<DevelopmentHuePlugToggleCardProps, any, DevelopmentHuePlugToggleCardLocalState> {

    constructor(props: DevelopmentHuePlugToggleCardProps) {
        super(props, undefined, {
        });
    }

    init() {
        super.init();
        this.mainDialogAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.setState({
            updaterInterval: setInterval(() => {
                this.queryPlugState()
            }, 1e3)
        });
    }

    private queryPlugState() {
        fetch("http://192.168.178.22:8080/plug/state/2").then(r => r.json()).then(r => {
            if (!_.isEqual(this.ls().state, r)) {
                this.local.setStateWithChannels({
                    state: r
                }, ["state"])
            }
        })
    }

    private setPlugOnlineState(state: boolean) {
        fetch(`http://192.168.178.22:8080/plug/${state}`, {
            method: "POST"
        }).then(r => r.json()).then(r => {
            // TODO: Remove maybe
            this.queryPlugState();
            // TODO: Handle response
        })
    }

    public isPlugOn(): boolean {
        return this.ls().state?.state?.on ?? false
    }

    public openContextMenu() {
        this.dialog(
            this.component(
                () => this.a("main-dialog"),
                "main-dialog"
            )
        );
    }

    public isDataLoaded(): boolean {
        console.log("data loaded", this.ls().state !== undefined,  this.ls().state)
        return this.ls().state !== undefined;
    }

    public mainDialogAssembly() {
        this.assembly.assembly("main-dialog", theme => {
            return (
                <StaticDrawerMenu body={props => {
                    return (
                        <Flex align={Align.CENTER} elements={[
                            <DrawerHeader
                                header={this.ls().state?.name ?? "Hue device"}
                                enableBadge={true}
                                badgeText={"Hue device"}
                                badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                description={"The Fetch API provides a JavaScript interface for accessing and manipulating parts of the protocol, such as requests and responses. It also provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network."}
                            />,
                            this.component(() => (
                                <If condition={this.ls().state?.state?.reachable ?? false} ifFalse={
                                    <AF elements={[
                                        <Text
                                            text={"Not reachable"}
                                            type={TextType.secondaryDescription}
                                            fontSize={px(12)}
                                            bold
                                            coloredText
                                            visualMeaning={ObjectVisualMeaning.WARNING}
                                        />
                                    ]}/>
                                }/>
                            ), "state"),
                            <FlexRow align={Align.CENTER} margin={createMargin(40, 0, 40, 0)} justifyContent={Justify.SPACE_AROUND} elements={[
                                <Button opaque visualMeaning={VM.UI_NO_HIGHLIGHT} children={
                                    <Icon icon={<ContextIcon/>}/>
                                }/>,
                                <Button
                                    onClick={() => this.setPlugOnlineState(false)}
                                    tooltip={"Device online"}
                                    border={true}
                                    width={px(50)}
                                    height={px(50)}
                                    // children={
                                    //     // <Icon icon={<OnStateIcon/>} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                    // }
                                />,
                                this.component(() => (
                                    <If condition={this.isPlugOn()} ifTrue={
                                        <Button
                                            vibrateOnClick
                                            vibrationPattern={[1]}
                                            onClick={() => this.setPlugOnlineState(false)}
                                            tooltip={"Device online"}
                                            width={px(80)}
                                            height={px(80)}
                                            border={true}
                                            shrinkOnClick
                                            opaque
                                            visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT}
                                            enableBaseAnimation
                                            baseAnimation={"hover-repeat"}
                                            borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(100) }}
                                            children={
                                                <Icon icon={<OnStateIcon/>} colored visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT}/>
                                            }
                                        />
                                    } ifFalse={
                                        <Button
                                            vibrateOnClick
                                            vibrationPattern={[10]}
                                            onClick={() => this.setPlugOnlineState(true)}
                                            tooltip={"Device offline"}
                                            width={px(80)}
                                            height={px(80)}
                                            border={true}
                                            shrinkOnClick
                                            borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(100) }}
                                            children={
                                                <Icon icon={<OnStateIcon/>} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                            }
                                        />
                                    }/>
                                ), "state"),
                                <Button
                                    tooltip={"Lambdas"}
                                    border={true}
                                    width={px(50)}
                                    height={px(50)}
                                    children={
                                        <Icon icon={<FunctionIcon/>}/>
                                    }
                                />,
                                <Button onClick={() => this.queryPlugState()} tooltip={"Refresh"} opaque visualMeaning={VM.UI_NO_HIGHLIGHT} children={
                                    <Icon icon={<RefreshIcon/>}/>
                                }/>,
                            ]}/>,
                        ]}/>
                    );
                }}/>
            );
        })
    }

    componentRender(p: DevelopmentHuePlugToggleCardProps, s: any, l: DevelopmentHuePlugToggleCardLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <Button
                opaque
                visualMeaning={this.isPlugOn() ? VM.SUCCESS_DEFAULT : VM.UI_NO_HIGHLIGHT}
                cursor={Cursor.pointer}
                onClick={() => this.setPlugOnlineState(!this.isPlugOn())}
                onContextMenu={() => this.openContextMenu()}
                shrinkOnClick
                children={
                    <Flex fw fh elements={[
                        <Flex fw align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <If condition={this.isDataLoaded()} ifTrue={
                                    <Icon icon={<PlugIcon/>}/>
                                } ifFalse={
                                    <Icon icon={<PlugIcon/>} colored visualMeaning={VM.UI_NO_HIGHLIGHT}/>
                                }/>,
                                <Text
                                    fontSize={px(14)}
                                    // type={TextType.displayDescription}
                                    text={this.ls().state?.name ?? "Hue device"}
                                />,
                            ]}/>,

                            <If condition={this.isPlugOn()} ifTrue={
                                <Text text={"ON"}/>
                            } ifFalse={
                                <Text text={"OFF"}/>
                            }/>,
                        ]}/>
                    ]}/>
                }
            />

        ), "state");
    }
}

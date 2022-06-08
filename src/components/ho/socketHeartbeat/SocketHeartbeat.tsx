import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {LiteGrid} from "../../lo/LiteGrid";
import {FlexBox} from "../../lo/FlexBox";
import {Text} from "../../lo/Text";
import {Box} from "../../lo/Box";
import {ReactComponent as InboundIcon} from "../../../assets/icons/ic-20/ic20-arrow-down.svg";
import {ReactComponent as OutboundIcon} from "../../../assets/icons/ic-20/ic20-arrow-up.svg";
import {ReactComponent as MoreIcon} from "../../../assets/icons/ic-20/ic20-chevron-right.svg";
import {ReactComponent as LessIcon} from "../../../assets/icons/ic-20/ic20-chevron-left.svg";
import {Icon} from "../../lo/Icon";
import {Align} from "../../../logic/style/Align";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Environment} from "../../../logic/Environment";
import {App} from "../../../logic/app/App";
import _ from "lodash";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Justify} from "../../../logic/style/Justify";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Button} from "../../lo/Button";
import {Togglable} from "../../logic/Togglable";
import {Group} from "../../lo/Group";
import {Orientation} from "../../../logic/style/Orientation";
import {NumberSelector} from "../../lo/NumberSelector";
import {getOr} from "../../../logic/Utils";

export type SocketHeartbeatLocalState = {
    activeInbound: boolean,
    activeOutbound: boolean,
    inboundHandlerFunc: () => void,
    outboundHandlerFunc: () => void,
    sinIn: boolean,
    calIn: boolean,
    resIn: boolean,
    sinOut: boolean,
    calOut: boolean,
    resOut: boolean,
    channels: Map<string, () => void>,
}

export class SocketHeartbeat extends BernieComponent<any, any, SocketHeartbeatLocalState> {

    constructor() {
        super(undefined, undefined, {
            activeInbound: false,
            activeOutbound: false,
            channels: new Map<string, () => void>(),
            sinIn: false,
            calIn: false,
            resIn: false,
            sinOut: false,
            calOut: false,
            resOut: false,
            inboundHandlerFunc: _.debounce(() => {
                this.local.setStateWithChannels({
                    activeInbound: true
                }, ["inbound"], () => {
                    setTimeout(() => {
                        this.local.setStateWithChannels({
                            activeInbound: false
                        }, ["inbound"]);
                    }, 100);
                });
            }, 100, {
                leading: true
            }),
            outboundHandlerFunc: _.debounce(() => {
                this.local.setStateWithChannels({
                    activeOutbound: true
                }, ["outbound"], () => {
                    setTimeout(() => {
                        this.local.setStateWithChannels({
                            activeOutbound: false
                        }, ["outbound"]);
                    }, 100);
                });
            }, 100, {
                leading: true
            })
        });
    }

    init() {
        super.init();
        const channels: Map<string, () => void> = new Map();
        ["sinIn", "calIn", "resIn", "sinOut", "calOut", "resOut"].forEach(op => {
            channels.set(op, _.debounce(() => {
                this.local.setStateWithChannels({
                    [op]: true
                }, [op], () => {
                    setTimeout(() => {
                        this.local.setStateWithChannels({
                            [op]: false
                        }, [op]);
                    }, 100);
                });
            }, 100, {
                leading: true
            }));
        });
        this.local.setState({
            channels: channels
        });
    }

    componentDidMount() {
        super.componentDidMount();

        const opEventMapping = new Map<string, Environment.SocketEventTypes>([
            ["sinIn", Environment.SocketEventTypes.ON_IN_SINGLETON_MESSAGE],
            ["calIn", Environment.SocketEventTypes.ON_IN_CALL_MESSAGE],
            ["resIn", Environment.SocketEventTypes.ON_IN_RESPONSE_MESSAGE],
            ["sinOut", Environment.SocketEventTypes.ON_OUT_SINGLETON_MESSAGE],
            ["calOut", Environment.SocketEventTypes.ON_OUT_CALL_MESSAGE],
            ["resOut", Environment.SocketEventTypes.ON_OUT_RESPONSE_MESSAGE]
        ]);

        ["sinIn", "calIn", "resIn", "sinOut", "calOut", "resOut"].forEach(op => {
            App.app().getConnector().registerSocketEventHandler(opEventMapping.get(op) as Environment.SocketEventTypes, {
                stator: true,
                handle: (ev) => {
                    this.local.state.channels.get(op)?.();
                }
            });
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)} borderless paddingY={percent(5)} children={
                <FlexBox width={percent(100)} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                    <Text text={"**C**hannel-**s**plit-**c**ontroller"} uppercase/>
                    <LiteGrid gap={t.gaps.defaultGab} columns={2}>

                        <FlexBox width={percent(100)} height={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER}>
                            <Text text={"inbound"} bold uppercase/>

                            <FlexBox width={percent(100)} height={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                    <Text text={"SIN"}/>
                                    {
                                        this.component(local => (
                                            <Icon icon={<InboundIcon/>} size={px(35)} colored visualMeaning={local.state.sinIn ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                        ), "sinIn")
                                    }
                                    <Text text={"0"}/>

                                    <Togglable initialActiveState active={
                                        <Button children={
                                            <Text text={"ENG"}/>
                                        }/>
                                    } inactive={
                                        <Button visualMeaning={ObjectVisualMeaning.WARNING} opaque children={
                                            <Text text={"DIS"}/>
                                        }/>
                                    }/>

                                </FlexBox>

                                <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                    <Text text={"CAL"}/>
                                    {
                                        this.component(local => (
                                            <Icon icon={<InboundIcon/>} size={px(35)} colored visualMeaning={local.state.calIn ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                        ), "calIn")
                                    }
                                    <Text text={"0"}/>

                                    <Togglable initialActiveState active={
                                        <Button children={
                                            <Text text={"ENG"}/>
                                        }/>
                                    } inactive={
                                        <Button visualMeaning={ObjectVisualMeaning.WARNING} opaque children={
                                            <Text text={"DIS"}/>
                                        }/>
                                    }/>

                                </FlexBox>

                                <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                    <Text text={"RES"}/>
                                    {
                                        this.component(local => (
                                            <Icon icon={<InboundIcon/>} size={px(35)} colored visualMeaning={local.state.resIn ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                        ), "resIn")
                                    }
                                    <Text text={"0"}/>

                                    <Togglable initialActiveState active={
                                        <Button children={
                                            <Text text={"ENG"}/>
                                        }/>
                                    } inactive={
                                        <Button visualMeaning={ObjectVisualMeaning.WARNING} opaque children={
                                            <Text text={"DIS"}/>
                                        }/>
                                    }/>

                                </FlexBox>
                            </FlexBox>






                            <Text text={"Delay"} uppercase bold/>
                            {
                                this.component(() => (
                                    <NumberSelector
                                        onChange={newValue => {
                                            App.app().getConnector().inboundDelayMS = newValue;
                                            this.rerender("inbound-delay");
                                        }}
                                        format={"{current}"}
                                        initialValue={App.app().getConnector().inboundDelayMS}
                                        deltaCalculator={() => 100}
                                        minValue={0}
                                        maxValue={2000}
                                        specialNumberDisplayRenderers={new Map<{min: number; max: number}, (current: number) => JSX.Element>([
                                            [{min: 0, max: 0}, () => <Text text={"off"} visualMeaning={ObjectVisualMeaning.INFO} coloredText uppercase bold/>]
                                        ])}
                                    />
                                ), "inbound-delay")
                            }











                        </FlexBox>


                        {/*<FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW_REVERSE} children={this.component(local => {
                        return (
                            <>
                                <Icon icon={<InboundIcon/>} size={px(35)} colored visualMeaning={local.state.activeInbound ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                <Text text={"in"}/>
                            </>
                        );
                    }, "inbound")}/>*/}

                        <FlexBox width={percent(100)} height={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER}>
                            <Text text={"outbound"} bold uppercase/>

                            <FlexBox width={percent(100)} height={percent(100)} align={Align.CENTER} justifyContent={Justify.CENTER} flexDir={FlexDirection.ROW}>
                                <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                    <Text text={"RES"}/>
                                    {
                                        this.component(local => (
                                            <Icon icon={<OutboundIcon/>} size={px(35)} colored visualMeaning={local.state.resOut ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                        ), "resOut")
                                    }
                                    <Text text={"0"}/>

                                    <Togglable initialActiveState active={
                                        <Button children={
                                            <Text text={"ENG"}/>
                                        }/>
                                    } inactive={
                                        <Button visualMeaning={ObjectVisualMeaning.WARNING} opaque children={
                                            <Text text={"DIS"}/>
                                        }/>
                                    }/>

                                </FlexBox>

                                <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                    <Text text={"CAL"}/>
                                    {
                                        this.component(local => (
                                            <Icon icon={<OutboundIcon/>} size={px(35)} colored visualMeaning={local.state.calOut ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                        ), "calOut")
                                    }
                                    <Text text={"0"}/>

                                    <Togglable initialActiveState active={
                                        <Button children={
                                            <Text text={"ENG"}/>
                                        }/>
                                    } inactive={
                                        <Button visualMeaning={ObjectVisualMeaning.WARNING} opaque children={
                                            <Text text={"DIS"}/>
                                        }/>
                                    }/>

                                </FlexBox>

                                <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                    <Text text={"SIN"}/>
                                    {
                                        this.component(local => (
                                            <Icon icon={<OutboundIcon/>} size={px(35)} colored visualMeaning={local.state.sinOut ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                        ), "sinOut")
                                    }
                                    <Text text={"0"}/>

                                    <Togglable initialActiveState active={
                                        <Button children={
                                            <Text text={"ENG"}/>
                                        }/>
                                    } inactive={
                                        <Button visualMeaning={ObjectVisualMeaning.WARNING} opaque children={
                                            <Text text={"DIS"}/>
                                        }/>
                                    }/>

                                </FlexBox>
                            </FlexBox>

                            <Text text={"Delay"} uppercase bold/>
                            {
                                this.component(() => (
                                    <NumberSelector
                                        onChange={newValue => {
                                            App.app().getConnector().outboundDelayMS = newValue;
                                            this.rerender("outbound-delay");
                                        }}
                                        format={"{current}"}
                                        initialValue={App.app().getConnector().outboundDelayMS}
                                        deltaCalculator={() => 100}
                                        minValue={0}
                                        maxValue={2000}
                                        specialNumberDisplayRenderers={new Map<{min: number; max: number}, (current: number) => JSX.Element>([
                                            [{min: 0, max: 0}, () => <Text text={"off"} visualMeaning={ObjectVisualMeaning.INFO} coloredText uppercase bold/>]
                                        ])}
                                    />
                                ), "outbound-delay")
                            }
                        </FlexBox>
                    </LiteGrid>
                </FlexBox>
            }/>
        );
    }
}

import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {LiteGrid} from "../../lo/LiteGrid";
import {FlexBox} from "../../lo/FlexBox";
import {Text} from "../../lo/Text";
import {Box} from "../../lo/Box";
import {ReactComponent as InboundIcon} from "../../../assets/icons/ic-20/ic20-arrow-down.svg";
import {ReactComponent as OutboundIcon} from "../../../assets/icons/ic-20/ic20-arrow-up.svg";
import {Icon} from "../../lo/Icon";
import {Align} from "../../../logic/style/Align";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Environment} from "../../../logic/Environment";
import {App} from "../../../logic/app/App";
import _ from "lodash";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";

export type SocketHeartbeatLocalState = {
    activeInbound: boolean,
    activeOutbound: boolean
}

export class SocketHeartbeat extends BernieComponent<any, any, SocketHeartbeatLocalState> {

    constructor() {
        super(undefined, undefined, {
            activeInbound: false,
            activeOutbound: false
        });
    }

    componentDidMount() {
        super.componentDidMount();

        App.app().getConnector().registerSocketEventHandler(Environment.SocketEventTypes.ON_INBOUND_MESSAGE, {
            stator: true,
            handle: () => {
                _.debounce(() => {
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
                });
            }
        });

    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box borderless paddingY={percent(5)} children={
                <LiteGrid gap={t.gaps.defaultGab} columns={2}>
                    <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW_REVERSE} children={this.component(local => {
                        return (
                            <>
                                <Icon icon={<InboundIcon/>} size={px(35)} colored visualMeaning={local.state.activeInbound ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                <Text text={"in"}/>
                            </>
                        );
                    }, "inbound")}/>
                    <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW} children={this.component(local => {
                        return (
                            <>
                                <Icon icon={<OutboundIcon/>} size={px(35)} colored visualMeaning={local.state.activeOutbound ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                <Text text={"out"}/>
                            </>
                        );
                    }, "outbound")}/>
                </LiteGrid>
            }/>
        );
    }
}

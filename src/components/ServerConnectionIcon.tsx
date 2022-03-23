import React from "react";
import {ReactComponent as ServerIcon} from "../assets/icons/ic-20/ic20-dns.svg";
import {ReactComponent as ProtocolIcon} from "../assets/icons/ic-20/ic20-chat.svg";
import {ReactComponent as PluginIcon} from "../assets/icons/ic-20/ic20-plugin.svg";
import {Icon} from "./Icon";
import {App, utilizeGlobalTheme} from "../logic/App";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Environment} from "../logic/Environment";
import {getMeaningfulColors, Themeable} from "../Themeable";
import {percent, px} from "../logic/style/DimensionalMeasured";
import {getOr} from "../logic/Utils";
import {CustomTooltip} from "./CustomTooltip";
import {FlexBox} from "./FlexBox";
import {ElementHeader} from "./ElementHeader";
import {Separator} from "./Separator";
import {Text} from "./Text";
import {Box} from "./Box";
import {Constants} from "../Constants";
import {Orientation} from "../logic/style/Orientation";
import {Align} from "../logic/Align";
import {Button} from "./Button";
import {FlexDirection} from "../logic/style/FlexDirection";
import {BadgedWrapper} from "./BadgedWrapper";
import {Badge} from "./Badge";
import {BounceLoader} from "react-spinners";

export type ServerConnectionIconProps = {
    openConnectionMetricsDialog?: boolean,
    pulse?: boolean
}

export const ServerConnectionIcon: React.FC<ServerConnectionIconProps> = props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const connector = App.app().getConnector();
    const conState = connector.socket?.readyState;

    return (
        <CustomTooltip noBorder noPadding title={renderTooltip(props, theme, connector)}>
            <span onClick={() => {
                if (getOr(props.openConnectionMetricsDialog, false)) {
                    App.app().callAction("open-main-dialog", Constants.serverConnectionDialog);
                }
            }}>
            {(() => {
                switch (conState) {
                    case 0:
                        return renderConnecting(props, theme, connector);
                    case 1:
                        return renderOnline(props, theme, connector);
                    case 2:
                        return <>Stopping</>;
                    case 3:
                        return renderNoConnection(theme, connector);
                    default:
                        return <></>
                }
            })()}
        </span>
        </CustomTooltip>
    );
}

export const renderTooltip: (props: ServerConnectionIconProps, theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (props, theme, con) => {
    return (
        <Box gapY={theme.gaps.smallGab}>
            <ElementHeader icon={<ServerIcon/>} title={"Server connection telemetry"}/>
            <Separator/>
            <Text text={`Current protocol: '**${con.currentProtocol}**'`} enableLeftAppendix leftAppendix={
                <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                    <Icon icon={<ProtocolIcon/>}/>
                    <span/>
                </FlexBox>
            }/>

            <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque children={
                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                    <Icon icon={<PluginIcon/>}/>
                    <Text text={"Connect"}/>
                </FlexBox>
            }/>
        </Box>
    );
}

export const renderOnline: (props: ServerConnectionIconProps, theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (props, theme, con) => {
    return (
        <BadgedWrapper showBadgeInitially={getOr(props.pulse, true)} badge={
            <Badge padding={false} shadow={true}>
                <BounceLoader color={getMeaningfulColors(ObjectVisualMeaning.SUCCESS, theme).lighter.css()}
                              size={10}/>
            </Badge>
        }>
            <Icon colored size={px(24)} icon={<ServerIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS}/>
        </BadgedWrapper>
    );
}
export const renderConnecting: (props: ServerConnectionIconProps, theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (props, theme, con) => {
    return (
        <BadgedWrapper showBadgeInitially={getOr(props.pulse, true)} badge={
            <Badge padding={false} shadow={true}>
                <BounceLoader color={getMeaningfulColors(ObjectVisualMeaning.WARNING, theme).lighter.css()}
                              size={10}/>
            </Badge>
        }>
            <Icon colored size={px(24)} icon={<ServerIcon/>} visualMeaning={ObjectVisualMeaning.WARNING}/>
        </BadgedWrapper>
    );
}


export const renderNoConnection: (theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (theme, con) => {
    return (
        <Icon colored size={px(24)} icon={<ServerIcon/>} visualMeaning={ObjectVisualMeaning.ERROR}/>
    );
}

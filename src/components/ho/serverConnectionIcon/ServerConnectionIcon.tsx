import React from "react";
import {ReactComponent as ServerIcon} from "../../../assets/icons/ic-20/ic20-dns.svg";
import {ReactComponent as ProtocolIcon} from "../../../assets/icons/ic-20/ic20-chat.svg";
import {ReactComponent as PluginIcon} from "../../../assets/icons/ic-20/ic20-plugin.svg";
import {Icon} from "../../lo/Icon";
import {App, utilizeGlobalTheme} from "../../../logic/app/App";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Environment} from "../../../logic/Environment";
import {getMeaningfulColors, Themeable} from "../../../logic/style/Themeable";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {getOr} from "../../../logic/Utils";
import {CustomTooltip} from "../../lo/CustomTooltip";
import {FlexBox} from "../../lo/FlexBox";
import {ElementHeader} from "../../lo/ElementHeader";
import {Separator} from "../../lo/Separator";
import {Text} from "../../lo/Text";
import {Box} from "../../lo/Box";
import {Constants} from "../../../logic/misc/Constants";
import {Align} from "../../../logic/style/Align";
import {Button} from "../../lo/Button";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {BadgedWrapper} from "../../lo/BadgedWrapper";
import {Badge} from "../../lo/Badge";
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

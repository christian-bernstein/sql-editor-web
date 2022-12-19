import React from "react";
import {ReactComponent as ServerIcon} from "../../../../../assets/icons/ic-20/ic20-dns.svg";
import {ReactComponent as ProtocolIcon} from "../../../../../assets/icons/ic-20/ic20-chat.svg";
import {Icon} from "../../lo/Icon";
import {App, utilizeGlobalTheme} from "../../../logic/app/App";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Environment} from "../../../logic/Environment";
import {getMeaningfulColors, Themeable} from "../../../logic/style/Themeable";
import {DimensionalMeasured, px} from "../../../logic/style/DimensionalMeasured";
import {getOr} from "../../../logic/Utils";
import {CustomTooltip} from "../../lo/CustomTooltip";
import {FlexBox} from "../../lo/FlexBox";
import {ElementHeader} from "../../lo/ElementHeader";
import {Separator} from "../../lo/Separator";
import {Text, TextType} from "../../lo/Text";
import {Box} from "../../lo/Box";
import {Constants} from "../../../logic/misc/Constants";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {BadgedWrapper} from "../../lo/BadgedWrapper";
import {Badge} from "../../lo/Badge";
import {BounceLoader} from "react-spinners";
import {LatencyDisplay} from "../../../../../tests/chart/LatencyDisplay";

export type ServerConnectionIconProps = {
    openConnectionMetricsDialog?: boolean,
    pulse?: boolean,
    renderTooltip?: boolean,
    iconSize?: DimensionalMeasured
}

export const ServerConnectionIcon: React.FC<ServerConnectionIconProps> = props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const connector = App.app().getConnector();
    const conState = connector.socket?.readyState;

    const icon = (
        <span onClick={() => {
            if (getOr(props.openConnectionMetricsDialog, false)) {
                App.app().callAction("open-main-dialog", Constants.serverConnectionDialog);
            }
        }} children={
            (() => {
                switch (conState) {
                    case 0:
                        return renderConnecting(props, theme, connector);
                    case 1:
                        return renderOnline(props, theme, connector);
                    case 2:
                        return <>Stopping</>;
                    case 3:
                        return renderNoConnection(props, theme, connector);
                    default:
                        return <></>
                }
            })()
        }/>
    );

    if (getOr(props.renderTooltip, true)) {
        return (
            <CustomTooltip noBorder arrow noPadding title={renderTooltip(props, theme, connector)} children={icon}/>
        );
    } else {
        return icon;
    }
}

export const renderTooltip: (props: ServerConnectionIconProps, theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (props, theme, con) => {
    return (
        <Box gapY={theme.gaps.smallGab}>
            <ElementHeader icon={<ServerIcon/>} title={"Server connection telemetry"} appendix={
                <Box opaque visualMeaning={ObjectVisualMeaning.INFO} paddingX={theme.paddings.defaultButtonPadding} paddingY={theme.paddings.defaultBadgePadding} children={
                    <Text text={"healthy"} uppercase bold fontSize={px(12)}/>
                }/>
            }/>
            <Separator/>

            <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                <Icon icon={<ProtocolIcon/>}/>
                <Text text={"Current protocol: "} type={TextType.secondaryDescription}/>
                <Text text={con.currentProtocol}/>
            </FlexBox>

            <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                <Icon icon={<ServerIcon/>}/>
                <Text text={"Address: "} type={TextType.secondaryDescription}/>
                <Text text={con.config.address}/>
            </FlexBox>

            <LatencyDisplay/>

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
            <Icon colored size={getOr(props.iconSize, px(24))} icon={<ServerIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS}/>
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
            <Icon colored size={getOr(props.iconSize, px(24))} icon={<ServerIcon/>} visualMeaning={ObjectVisualMeaning.WARNING}/>
        </BadgedWrapper>
    );
}


export const renderNoConnection: (props: ServerConnectionIconProps, theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (props, theme, con) => {
    return (
        <Icon colored size={getOr(props.iconSize, px(24))} icon={<ServerIcon/>} visualMeaning={ObjectVisualMeaning.ERROR}/>
    );
}

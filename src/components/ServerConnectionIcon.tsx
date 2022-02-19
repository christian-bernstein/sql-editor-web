import React from "react";
import {BadgedWrapper} from "./BadgedWrapper";
import {ReactComponent as ServerIcon} from "../assets/icons/ic-20/ic20-dns.svg";
import {Icon} from "./Icon";
import {App, utilizeGlobalTheme} from "../logic/App";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Environment} from "../logic/Environment";
import {getMeaningfulColors, Themeable} from "../Themeable";
import {BounceLoader} from "react-spinners";
import {Badge} from "./Badge";
import {px} from "../logic/DimensionalMeasured";
import {getOr} from "../logic/Utils";
import {CustomTooltip} from "./CustomTooltip";
import {FlexBox} from "./FlexBox";
import {ElementHeader} from "./ElementHeader";
import {Separator} from "./Separator";
import {Text} from "./Text";
import {Box} from "./Box";
import {Constants} from "../Constants";

export type ServerConnectionIconProps = {
    openConnectionMetricsDialog?: boolean
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
                        return renderConnecting(theme, connector);
                    case 1:
                        return renderOnline(theme, connector);
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
            <ElementHeader icon={<ServerIcon/>} title={"Server connection telemetry"} beta/>
            <Separator/>
            <Text text={"Hello world from another not useful component!"}/>
        </Box>
    );
}

export const renderOnline: (theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (theme, con) => {
    return (
        <BadgedWrapper showBadgeInitially badge={
            <Badge padding={false} shadow={true}>
                <BounceLoader color={getMeaningfulColors(ObjectVisualMeaning.SUCCESS, theme).lighter.css()}
                              size={10}/>
            </Badge>
        }>
            <Icon colored size={px(24)} icon={<ServerIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS}/>
        </BadgedWrapper>
    );
}
export const renderConnecting: (theme: Themeable.Theme, con: Environment.Connector) => JSX.Element = (theme, con) => {
    return (
        <BadgedWrapper showBadgeInitially badge={
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

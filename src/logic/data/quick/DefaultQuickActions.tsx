import {QuickActionConfig} from "./QuickActionConfig";
import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Themeable} from "../../style/Themeable";
import {ReactComponent as FullscreenEnterIcon} from "../../../assets/icons/ic-20/ic20-fullscreen.svg";
import {ReactComponent as FullscreenExitIcon} from "../../../assets/icons/ic-20/ic20-fullscreen-exit.svg";
import {ReactComponent as LightThemeIcon} from "../../../assets/icons/ic-20/ic20-brightness-high.svg";
import {ReactComponent as DarkThemeIcon} from "../../../assets/icons/ic-20/ic20-brightness-low.svg";
import {ReactComponent as ReloadIcon} from "../../../assets/icons/ic-20/ic20-refresh.svg";
import {ReactComponent as BrowserIcon} from "../../../assets/icons/ic-20/ic20-globe.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/icons/ic-20/ic20-delete.svg";
import {ReactComponent as CheckIcon} from "../../../assets/icons/ic-20/ic20-check.svg";
import {Utils} from "../../Utils";
import {App} from "../../app/App";
import {Icon} from "../../../components/lo/Icon";
import React from "react";
import {Text} from "../../../components/lo/Text";
import {px} from "../../style/DimensionalMeasured";
import {ReactComponent as LogIcon} from "../../../assets/icons/ic-20/ic20-bolt.svg";
import {BadgedWrapper} from "../../../components/lo/BadgedWrapper";
import {Constants} from "../../misc/Constants";
import {If} from "../../../components/logic/If";
import {ServerConnectionIcon} from "../../../components/ho/serverConnectionIcon/ServerConnectionIcon";
import {ObjectVisualMeaning} from "../../style/ObjectVisualMeaning";

export namespace DefaultQuickActions {

    export const fullscreenQA: QuickActionConfig = {
        displayName: "Toggle fullscreen",
        tags: ["Fullscreen", "F11"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <Icon icon={(() => {
                    if (document.fullscreenElement === null) {
                        return <FullscreenEnterIcon/>
                    } else {
                        return <FullscreenExitIcon/>
                    }
                })()} onClick={() => Utils.toggleFullScreen(() => {
                    App.app().rerenderGlobally();
                })}/>
            );
        }
    }

    export const logQA: QuickActionConfig = {
        displayName: "Open logs",
        tags: ["Open logs", "logs"],
        wrapperStyleOverwrite: {
            gridColumn: "span 1",
            gridRow: "span 2"
        },
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <BadgedWrapper badge={
                    <Text text={`${App.app().sophisticatedLogHistory.length}`} fontSize={px(12)}/>
                } showBadgeInitially>
                    <Icon icon={<LogIcon/>}/>
                </BadgedWrapper>
            );
        },
        onClick: (event, config) => {
            App.app().callAction("open-main-dialog", Constants.logDialog);
        }
    }

    export const clearLogQA: QuickActionConfig = {
        displayName: "Clear logs",
        tags: ["clear", "logs", "delete", "empty"],
        isAllowedAction() {
            return App.app().sophisticatedLogHistory.length > 0;
        },
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <BadgedWrapper badge={
                    <Icon icon={<DeleteIcon/>} size={px(12)}/>
                } showBadgeInitially>
                    <Icon icon={<LogIcon/>}/>
                </BadgedWrapper>
            );
        },
        onClick: (event, config) => {
            const history = App.app().sophisticatedLogHistory;
            history.splice(0, history.length);
        }
    }

    export const lightThemeQA: QuickActionConfig = {
        displayName: "Toggle Light-Theme",
        tags: ["Light-Theme", "Light", "Theme"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <If condition={App.app().globalThemeName === "light-green"} ifTrue={
                    <BadgedWrapper badge={
                        <Icon icon={<CheckIcon/>} size={px(12)} colored visualMeaning={ObjectVisualMeaning.INFO}/>
                    } showBadgeInitially>
                        <Icon icon={<LightThemeIcon/>}/>
                    </BadgedWrapper>
                } ifFalse={
                    <Icon icon={<LightThemeIcon/>}/>
                }/>
            );
        },
        onClick: (event, config) => {
            App.app().setGlobalTheme("light-green");
            App.app().rerenderGlobally();
        }
    }

    export const darkThemeQA: QuickActionConfig = {
        displayName: "Toggle Dark-Theme",
        tags: ["Dark-Theme", "Dark", "Theme"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <If condition={App.app().globalThemeName === "dark-green"} ifTrue={
                    <BadgedWrapper badge={
                        <Icon icon={<CheckIcon/>} size={px(12)} colored visualMeaning={ObjectVisualMeaning.INFO}/>
                    } showBadgeInitially>
                        <Icon icon={<DarkThemeIcon/>}/>
                    </BadgedWrapper>
                } ifFalse={
                    <Icon icon={<DarkThemeIcon/>}/>
                }/>
            );
        },
        onClick: (event, config) => {
            App.app().setGlobalTheme("dark-green");
            App.app().rerenderGlobally();
        }
    }

    export const rerenderQA: QuickActionConfig = {
        displayName: "Rerender",
        tags: ["Rerender", "Render"],
        beta: true,
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <Icon icon={<ReloadIcon/>}/>
            );
        },
        onClick: (event, config) => {
            App.app().rerenderGlobally();
        }
    }

    export const reloadQA: QuickActionConfig = {
        displayName: "Reload webpage",
        tags: ["Reload", "F5"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <BadgedWrapper badge={
                    <Icon icon={<BrowserIcon/>} size={px(12)}/>
                } showBadgeInitially>
                    <Icon icon={<ReloadIcon/>}/>
                </BadgedWrapper>
            );
        },
        onClick: (event, config) => {
            Utils.reloadPage();
        }
    }

    export const serverQuickViewQA: QuickActionConfig = {
        displayName: "Server quick view",
        tags: ["Server", "Connection"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <ServerConnectionIcon renderTooltip={false} pulse={false} openConnectionMetricsDialog/>
            );
        },
        onClick: (event, config) => {
            App.app().callAction("open-main-dialog", Constants.serverConnectionDialog);
        }
    }
}

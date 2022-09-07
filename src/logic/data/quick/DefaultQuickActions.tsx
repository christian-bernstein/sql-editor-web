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
import {ReactComponent as SwitchIcon} from "../../../assets/icons/ic-20/ic20-apps.svg";
import {ReactComponent as PageIcon} from "../../../assets/icons/ic-20/ic20-desktop.svg";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/ic-20/ic20-settings.svg";
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
import {AppModeSwitcher} from "../../../components/ho/appModeSwitcher/AppModeSwitcher";
import {AnomalyInfo} from "../../../components/ho/anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../AnomalyLevel";
import {SettingsPlayground} from "../../../components/ho/settingsPlayground/SettingsPlayground";
import {
    FirstJoinIntroductionLauncher
} from "../../../components/ho/firstJoinIntroduction/FirstJoinIntroductionLauncher";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";

export namespace DefaultQuickActions {

    export const fullscreenQA: QuickActionConfig = {
        displayName: "Toggle fullscreen",
        canonicalDisplayName: "Fullscreen",
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
        canonicalDisplayName: "Logs",
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

    export const gotoBoardingPageQA: QuickActionConfig = {
        displayName: "Goto boarding page",
        canonicalDisplayName: "Boarding page",
        tags: ["Goto", "Boarding", "Page"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <Icon icon={<PageIcon/>}/>
            );
        },
        onClick: (event, config) => {
            window.location.href = "/boarding"
            App.app().rerenderGlobally();
        }
    }

    export const appModeSwitcherQA: QuickActionConfig = {
        displayName: "Switch app mode",
        canonicalDisplayName: "App mode",
        tags: ["Switch", "Mode", "App", "Config", "Development", "Debug"],
        beta: true,
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <Icon icon={<SwitchIcon/>}/>
            );
        },
        onClick: (event, config, panel) => {
            panel.dialog(
                <AppModeSwitcher/>
            )
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
        canonicalDisplayName: "Reload",
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
        canonicalDisplayName: "Server",
        description: "Hello world",
        tags: ["Server", "Connection"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <ServerConnectionIcon renderTooltip={false} pulse={false} openConnectionMetricsDialog iconSize={px(20)}/>
            );
        },
        onClick: (event, config) => {
            App.app().callAction("open-main-dialog", Constants.serverConnectionDialog);
        }
    }

    // TODO: Convert into a page, with multiple reset functions
    export const resetFirstJoinAcknowledgeNotificationStateQA: QuickActionConfig = {
        displayName: "Reset First-Join-Acknowledge-state",
        canonicalDisplayName: "Reset First-Join-Acknowledge-state",
        tags: ["Settings", "Playground", "Debug", "Development", "Reset"],
        beta: true,
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <Icon icon={<ReloadIcon/>}/>
            );
        },
        onClick: (event, config, panel) => {
            try {
                FirstJoinIntroductionLauncher.resetFirstJoinAcknowledgeState();

                panel.dialog(
                    <StaticDrawerMenu body={() => (
                        <DrawerHeader
                            header={"Reset completed"}
                            description={"**First-Join-Acknowledge**-state reset successfully completed."
                        }/>
                    )}/>
                );
            } catch (e) {
                panel.dialog(
                    <StaticDrawerMenu body={() => (
                        <AnomalyInfo anomaly={{
                            description: "Error thrown while reset of **First-Join-Acknowledge**-state.",
                            data: e
                        }}/>
                    )}/>
                );
            }
        }
    }













    export const settingsPlayGroundQA: QuickActionConfig = {
        displayName: "Settings playground",
        canonicalDisplayName: "S. playground",
        tags: ["Settings", "Playground", "Debug", "Development"],
        beta: true,
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <Icon icon={<SettingsIcon/>}/>
            );
        },
        onClick: (event, config, panel) => {
            if (App.app().settings() === undefined) {
                panel.dialog(
                    <AnomalyInfo anomaly={{
                        level: AnomalyLevel.ERROR,
                        description: "<u>**Settings playground QA</u>**\n Cannot call settings QA routine, because *SettingsShard* in **App.app().settings()** is undefined"
                    }}/>
                );
                return;
            }

            panel.dialog(
                <SettingsPlayground/>
            );
        }
    }
}

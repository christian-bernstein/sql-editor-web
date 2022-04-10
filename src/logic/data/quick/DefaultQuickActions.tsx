import {QuickActionConfig} from "./QuickActionConfig";
import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Themeable} from "../../../Themeable";
import {ReactComponent as FullscreenEnterIcon} from "../../../assets/icons/ic-20/ic20-fullscreen.svg";
import {ReactComponent as FullscreenExitIcon} from "../../../assets/icons/ic-20/ic20-fullscreen-exit.svg";
import {ReactComponent as LightThemeIcon} from "../../../assets/icons/ic-20/ic20-brightness-high.svg";
import {ReactComponent as DarkThemeIcon} from "../../../assets/icons/ic-20/ic20-brightness-low.svg";
import {ReactComponent as ReloadIcon} from "../../../assets/icons/ic-20/ic20-refresh.svg";
import {ReactComponent as BrowserIcon} from "../../../assets/icons/ic-20/ic20-globe.svg";
import {Utils} from "../../Utils";
import {App} from "../../App";
import {Icon} from "../../../components/Icon";
import React from "react";
import {Text} from "../../../components/Text";
import {px} from "../../style/DimensionalMeasured";
import {ReactComponent as LogIcon} from "../../../assets/icons/ic-20/ic20-bolt.svg";
import {BadgedWrapper} from "../../../components/BadgedWrapper";
import {Constants} from "../../../Constants";

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

    export const lightThemeQA: QuickActionConfig = {
        displayName: "Toggle Light-Theme",
        tags: ["Light-Theme", "Light", "Theme"],
        render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
            return (
                <Icon icon={<LightThemeIcon/>}/>
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
                <Icon icon={<DarkThemeIcon/>}/>
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
        beta: true,
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
}

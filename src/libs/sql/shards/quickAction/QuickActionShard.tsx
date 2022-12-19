import {Shard} from "../../../../logic/misc/Shard";
import {App, utilizeGlobalTheme} from "../../../../logic/app/App";
import {QuickActionCategory} from "../../../../logic/data/quick/QuickActionCategory";
import React from "react";
import {DefaultQuickActions} from "../../../../logic/data/quick/DefaultQuickActions";
import {Themeable} from "../../../../logic/style/Themeable";
import {QuickActionPanel} from "../../../../components/ho/quickPanel/QuickActionPanel";
import {QuickActionConfig} from "../../../../logic/data/quick/QuickActionConfig";
import {If} from "../../../../components/logic/If";
import {BadgedWrapper} from "../../../../components/lo/BadgedWrapper";
import {Icon} from "../../../../components/lo/Icon";
import {ReactComponent as CheckIcon} from "../../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as ServerIcon} from "../../../../assets/icons/ic-20/ic20-dns.svg";
import {ReactComponent as ShutdownIcon} from "../../../../assets/icons/ic-20/ic20-turn-off.svg";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {ReactComponent as DarkThemeIcon} from "../../../../assets/icons/ic-20/ic20-brightness-low.svg";
import {ReactComponent as LightThemeIcon} from "../../../../assets/icons/ic-20/ic20-brightness-high.svg";
import {StaticDrawerMenu} from "../../../../components/lo/StaticDrawerMenu";
import {Flex} from "../../../../components/lo/FlexBox";
import {Input} from "../../../../components/lo/Input";
import {Button} from "../../../../components/lo/Button";
import {Text, TextType} from "../../../../components/lo/Text";
import {Align} from "../../../../logic/style/Align";
import {createMargin} from "../../../../logic/style/Margin";
import {LiteGrid} from "../../../../components/lo/LiteGrid";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {Justify} from "../../../../logic/style/Justify";
import {Badge} from "../../../../components/lo/Badge";

export class QuickActionShard extends Shard {

    private _quickActionsCategories?: Array<QuickActionCategory>;

    load(app: App) {
        super.load(app);
        this._quickActionsCategories = new Array<QuickActionCategory>();

        this.addCategory(new QuickActionCategory({
            id: "utilities",
            displayName: "Utilities"
        }), qac => {
            qac.registerQuickAction(
                DefaultQuickActions.serverQuickViewQA,
                DefaultQuickActions.fullscreenQA,
                DefaultQuickActions.reloadQA,
                DefaultQuickActions.gotoBoardingPageQA,
            );
        });

        this.addCategory(new QuickActionCategory({
            id: "themes",
            displayName: "Themes"
        }), qac => {
            // qac.registerQuickAction(
            //     DefaultQuickActions.lightThemeQA,
            //     DefaultQuickActions.darkThemeQA
            // );

            App.app().config.themes.forEach((theme, name) => {
                qac.registerQuickAction({
                    displayName: `Toggle ${name}-theme`,
                    canonicalDisplayName: name,
                    tags: [name, String(theme.mode), "Theme"],
                    render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {

                        const icon = theme.mode === "dark" ? <DarkThemeIcon/> : <LightThemeIcon/>;

                        return (
                            <If condition={App.app().globalThemeName === name} ifTrue={
                                <BadgedWrapper badge={
                                    <Icon icon={<CheckIcon/>} size={px(12)} colored visualMeaning={ObjectVisualMeaning.INFO}/>
                                } showBadgeInitially>
                                    <Icon icon={icon}/>
                                </BadgedWrapper>
                            } ifFalse={
                                <Icon icon={icon}/>
                            }/>
                        );
                    },
                    onClick: (event, config) => {
                        App.app().setGlobalTheme(name);
                        App.app().rerenderGlobally();
                    }
                })
            })
        });

        this.addCategory(new QuickActionCategory({
            id: "development",
            displayName: "Development"
        }), qac => {
            qac.registerQuickAction(
                DefaultQuickActions.logQA,
                DefaultQuickActions.clearLogQA,
                DefaultQuickActions.resetFirstJoinAcknowledgeNotificationStateQA,
                DefaultQuickActions.appModeSwitcherQA,
                DefaultQuickActions.rerenderQA,
                DefaultQuickActions.settingsPlayGroundQA,




                {
                    displayName: "Close net",
                    tags: [],
                    beta: true,
                    render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {
                        return (
                            <BadgedWrapper badge={
                                <Icon icon={<ShutdownIcon/>} size={px(12)}/>
                            } showBadgeInitially>
                                <Icon icon={<ServerIcon/>}/>
                            </BadgedWrapper>
                        );
                    },
                    onClick: (event, config, panel) => {
                        const theme = utilizeGlobalTheme();
                        let code: number | undefined;
                        let message: string | undefined;

                        panel.dialog(
                            <StaticDrawerMenu body={props => (
                                <Flex width={percent(100)} align={Align.CENTER}>
                                    <Flex width={percent(100)} align={Align.CENTER} gap={theme.gaps.smallGab} margin={createMargin(0, 0, 40, 0)}>
                                        {Badge.badge("development", {
                                            visualMeaning: ObjectVisualMeaning.SUCCESS
                                        })}
                                        <Text text={"Close connection"} type={TextType.smallHeader}/>
                                        <Text align={Align.CENTER} text={"Specify the closing code, an additional message and confirm the network closing request"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                    </Flex>

                                    <Flex width={percent(100)} gap={theme.gaps.smallGab}>
                                        <Flex width={percent(100)} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                            <Text text={"Code"} type={TextType.secondaryDescription}/>
                                            <Text text={"optional"} type={TextType.secondaryDescription} uppercase bold coloredText visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} fontSize={px(11)}/>
                                        </Flex>
                                        <Input fontWeight={"lighter"} inputMode={"numeric"} type={"number"} placeholder={String(1000)} onChange={ev => code = Number(ev.target.value)}/>
                                        <Text text={"Specify the socket closing code. [Websocket close codes](https://github.com/Luka967/websocket-close-codes)"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                    </Flex>

                                    <Flex width={percent(100)} gap={theme.gaps.smallGab} margin={createMargin(0, 0, 40, 0)}>
                                        <Flex width={percent(100)} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                            <Text text={"Message"} type={TextType.secondaryDescription}/>
                                            <Text text={"optional"} type={TextType.secondaryDescription} uppercase bold coloredText visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} fontSize={px(11)}/>
                                        </Flex>
                                        <Input fontWeight={"lighter"} onChange={ev => message = ev.target.value}/>
                                        <Text text={"Add an additional message. *This message can be used as an additional payload of data by the server.*"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                    </Flex>

                                    <LiteGrid columns={2} gap={theme.gaps.smallGab}>
                                        <Button width={percent(100)} text={"Cancel"} onClick={() => {
                                            panel.closeLocalDialog();
                                        }}/>
                                        <Button width={percent(100)} visualMeaning={ObjectVisualMeaning.WARNING} opaque text={"Close connection"} onClick={() => {
                                            panel.closeLocalDialog();
                                            setTimeout(() => {
                                                App.app().getConnector().socket?.close(code, message);
                                            }, 100);
                                        }}/>
                                    </LiteGrid>
                                </Flex>
                            )}/>
                        );

                    }
                }
            );
        });

        this.addCategory(new QuickActionCategory({
            id: "haptics",
            displayName: "Haptics"
        }), qac => {
            qac.registerQuickAction(

                // todo register haptics-related actions

            );
        });
    }

    public addCategory(category: QuickActionCategory, initHandler?: (qac: QuickActionCategory) => void) {
        if (this._quickActionsCategories?.push(category)) {
            initHandler?.(category);
        }
    }

    public useCategory(id: String, action: (qac: QuickActionCategory) => void): void {
        const filter = this._quickActionsCategories?.filter(qac => qac.config.id === id);
        if (filter != undefined && filter.length === 1) {
            action(filter[0]);
        }
    }

    get quickActionsCategories(): Array<QuickActionCategory> | undefined {
        return this._quickActionsCategories;
    }
}

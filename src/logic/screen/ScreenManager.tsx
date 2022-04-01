import {ScreenConfig} from "./ScreenConfig";
import {App, utilizeGlobalTheme} from "../App";
import {Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import {ViewConfig} from "./ViewConfig";
import {ViewRenderContext} from "./ViewRenderContext";
import {BoardingPage} from "../../pages/boarding/BoardingPage";
import {FlexBox} from "../../components/FlexBox";
import {Icon} from "../../components/Icon";
import {ReactComponent as TestIcon} from "../../assets/icons/ic-20/ic20-alert.svg";
import {ReactComponent as HubIcon} from "../../assets/icons/ic-20/ic20-home.svg";
import {ReactComponent as InformationIcon} from "../../assets/icons/ic-20/ic20-info.svg";
import {ReactComponent as MapIcon} from "../../assets/icons/ic-20/ic20-map.svg";
import {Box} from "../../components/Box";
import {FlexDirection} from "../style/FlexDirection";
import {percent, px} from "../style/DimensionalMeasured";
import {Align} from "../Align";
import {Cursor} from "../style/Cursor";
import {getOr} from "../Utils";
import {ObjectVisualMeaning} from "../ObjectVisualMeaning";
import {CustomTooltip} from "../../components/CustomTooltip";
import {ElementHeader} from "../../components/ElementHeader";
import {Separator} from "../../components/Separator";
import {Orientation} from "../style/Orientation";
import {Text} from "../../components/Text";
import {If} from "../../components/If";
import {LinkPreview} from "@dhaiwat10/react-link-preview";

export class ScreenManager {

    private readonly screens: Array<ScreenConfig> = new Array<ScreenConfig>({
        defaultView: "def",
        routeExact: true,
        id: "/",
        location: "/",
        debug: false,
        viewFactory: config => {
            return [{
                id: "def",
                description: "The root distributor",
                accessible: (config) => true,
                displayName: "The root distributor",
                tags: ["internal", "root", "distributor", "entrance"],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box borderless cursor={Cursor.pointer} noBGColor={!ctx.active}>
                                <Icon icon={<TestIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored/>
                            </Box>
                        );
                    }
                },
                renderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        const appConfig = App.app().config;
                        return (
                            <Redirect push to={appConfig.debugMode ? appConfig.defaultDebugAppRoute : appConfig.defaultAppRoute}/>
                        );
                    }
                }
            } as ViewConfig];
        }
    }, {
        defaultView: "def",
        id: "boarding",
        location: "/boarding",
        debug: false,
        viewFactory: config => {
            return [{
                id: "def",
                description: "Sign up, log-in using shortcut-login *(Continue as)* or log-in using your credentials.",
                accessible: (config) => true,
                displayName: "Boarding page",
                tags: [],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box highlight cursor={Cursor.pointer} noBGColor={!ctx.active}>
                                <Icon icon={<HubIcon/>}/>
                            </Box>
                        );
                    }
                },
                renderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <BoardingPage/>
                        );
                    }
                }
            } as ViewConfig, {
                id: "about",
                beta: true,
                description: "Shows details about the project, like the author & contributors. [Project's GitHub repo](https://github.com/christian-bernstein/sql-editor-web)",
                accessible: (config) => true,
                displayName: "About page",
                tags: [],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box highlight cursor={Cursor.pointer} width={percent(100)} noBGColor={!ctx.active}>
                                <Icon icon={<InformationIcon/>}/>
                            </Box>
                        );
                    }
                },
                renderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <>Test page!!</>
                        );
                    }
                }
            } as ViewConfig];
        }
    });

    private readonly viewLocations: Map<string, string> = new Map<string, string>();

    private loadAndRenderRoutes(): JSX.Element[] {
        const app = App.app();
        return this.screens.filter(config => config.debug === app.config.debugMode || !config.debug).map(config => {
            if (config.customRouteFactory !== undefined) {
                return config.customRouteFactory(config);
            } else {
                return (
                    <Route path={config.location} render={() => {
                        let loc = this.viewLocations.get(config.location);
                        if (loc === undefined) {
                            loc = config.defaultView;
                        }

                        const candidates = config.viewFactory(config).filter(view => view.id === loc);
                        if (candidates.length !== 1) {
                            throw new Error(`Cannot resolve view '${loc}' in screen '${config.location}'.`);
                        } else {
                            const viewConfig = candidates[0];
                            const active = viewConfig.id === loc;
                            return viewConfig.renderer.render({
                                viewLocation: loc,
                                viewConfig: viewConfig,
                                screenConfig: config,
                                active: active
                            });
                        }
                    }}/>
                );
            }
        });
    }

    private loadAndRenderMenuIcons(): JSX.Element[] {
        return this.screens.map(screen => (
            <Route exact={getOr(screen.routeExact, false)} path={screen.location} render={props => (
                <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} width={percent(100)}>
                    {
                        screen.viewFactory(screen).map(view => {
                            let loc = this.viewLocations.get(screen.location);
                            if (loc === undefined || loc === null) loc = screen.defaultView;
                            const active = view.id === loc;
                            const theme = utilizeGlobalTheme();

                            return (
                                <span style={{
                                    boxSizing: "content-box",
                                    width: percent(100).css()
                                }} children={
                                    <CustomTooltip placement={"right"} arrow noPadding noBorder title={
                                        <Box gapY={theme.gaps.smallGab} maxWidth={px(500)}>
                                            <ElementHeader icon={<MapIcon/>} title={`${view.displayName} *(${screen.id} **@** ${view.id})*`} beta={getOr(view.beta, false)} appendix={
                                                <If condition={active} ifTrue={
                                                    <Box opaque visualMeaning={ObjectVisualMeaning.INFO} paddingX={theme.paddings.defaultButtonPadding} paddingY={theme.paddings.defaultBadgePadding} children={
                                                        <Text text={"current"} uppercase bold fontSize={px(12)}/>
                                                    }/>
                                                }/>
                                            }/>
                                            <Separator orientation={Orientation.HORIZONTAL}/>
                                            <Text text={view.description} whitespace={"pre-wrap"}/>
                                        </Box>
                                    } children={
                                        <span onClick={() => {
                                            if (loc != null && !active) {
                                                this.viewLocations.set(screen.location, view.id);
                                                App.app().rerenderGlobally();
                                            }
                                        }} children={
                                            view.iconRenderer.render({
                                                screenConfig: screen,
                                                viewConfig: view,
                                                viewLocation: loc,
                                                active: active
                                            })
                                        }/>
                                    }/>
                                }/>
                            );
                        })
                    }
                </FlexBox>
            )}/>
        ));

        // <CustomTooltip arrow noPadding noBorder title={<Text text={screen.location}/>} children={
        //                                         view.iconRenderer.render({
        //                                             screenConfig: screen,
        //                                             viewConfig: view,
        //                                             viewLocation: loc,
        //                                             active: active
        //                                         })
        //                                     }/>
    }

    public renderMenuIcons(): JSX.Element {
        return (
            <Switch>
                {this.loadAndRenderMenuIcons()}
            </Switch>
        );

        // return (
        //     <>
        //         {this.loadAndRenderMenuIcons()}
        //     </>
        // );
    }

    public renderRoutes(): JSX.Element {
        return (
            <>
                {this.loadAndRenderRoutes()}
            </>
        );
    }
}

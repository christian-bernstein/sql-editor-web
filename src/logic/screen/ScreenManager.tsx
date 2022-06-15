import {ScreenConfig} from "./ScreenConfig";
import {App, utilizeGlobalTheme} from "../app/App";
import {Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import {ViewConfig} from "./ViewConfig";
import {ViewRenderContext} from "./ViewRenderContext";
import {BoardingPage} from "../../pages/boarding/BoardingPage";
import {FlexBox} from "../../components/lo/FlexBox";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as TestIcon} from "../../assets/icons/ic-20/ic20-alert.svg";
import {ReactComponent as HubIcon} from "../../assets/icons/ic-20/ic20-home.svg";
import {ReactComponent as InformationIcon} from "../../assets/icons/ic-20/ic20-info.svg";
import {ReactComponent as DocsIcon} from "../../assets/icons/ic-20/ic20-book.svg";
import {ReactComponent as MapIcon} from "../../assets/icons/ic-20/ic20-map.svg";
import {ReactComponent as EpicureIcon} from "../../assets/icons/ic-20/ic20-explore.svg";
import {ReactComponent as DebugIcon} from "../../assets/icons/ic-20/ic20-bug.svg";
import {Box} from "../../components/lo/Box";
import {FlexDirection} from "../style/FlexDirection";
import {percent, px} from "../style/DimensionalMeasured";
import {Align} from "../style/Align";
import {Cursor} from "../style/Cursor";
import {getOr} from "../Utils";
import {ObjectVisualMeaning} from "../style/ObjectVisualMeaning";
import {CustomTooltip} from "../../components/lo/CustomTooltip";
import {ElementHeader} from "../../components/lo/ElementHeader";
import {Separator} from "../../components/lo/Separator";
import {Orientation} from "../style/Orientation";
import {Text} from "../../components/lo/Text";
import {If} from "../../components/logic/If";
import {BadgedWrapper} from "../../components/lo/BadgedWrapper";
import {Badge} from "../../components/lo/Badge";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import {UnitTestPage} from "../../pages/unit/UnitTestPage";
import {EpicureHubPage} from "../../tests/epicure/pages/hub/EpicureHubPage";
import {DocumentationPage} from "../../pages/documentation/DocumentationPage";

export class ScreenManager {

    /**
     * todo remove this dirty way of preventing the website to constantly fall back to the root page, whenever the website
     *  is re-rendered globally
     */
    private static hasRenderedRedirectToDefaultPage: boolean = false;

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

                             if (!ScreenManager.hasRenderedRedirectToDefaultPage) {
                                 ScreenManager.hasRenderedRedirectToDefaultPage = true;
                                 console.log("redirect to default page (from ScreenManager)");
                                 return (
                                     <Redirect push to={appConfig.debugMode ? appConfig.defaultDebugAppRoute : appConfig.defaultAppRoute}/>
                                 );
                             } else return <></>
                         }
                    }
                } as ViewConfig];
            }
         },
        {
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
            } as ViewConfig, {
                id: "docs",
                beta: true,
                description: "Documentation page with all the necessary information to use the SQL-Editor",
                accessible: (config) => true,
                displayName: "Documentation",
                tags: [],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box highlight cursor={Cursor.pointer} width={percent(100)} noBGColor={!ctx.active}>
                                <Icon icon={<DocsIcon/>}/>
                            </Box>
                        );
                    }
                },
                renderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <DocumentationPage/>
                        );
                    }
                }
            } as ViewConfig, {
                id: "unit",
                beta: true,
                description: "Unit-test page",
                accessible: (config) => true,
                displayName: "Unit-test page",
                tags: [],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box highlight cursor={Cursor.pointer} width={percent(100)} noBGColor={!ctx.active}>
                                <Icon icon={<DebugIcon/>}/>
                            </Box>
                        );
                    }
                },
                renderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <UnitTestPage/>
                        );
                    }
                }
            } as ViewConfig, {
                id: "epi",
                description: "Epicure page",
                accessible: (config) => true,
                displayName: "Epicure page",
                tags: [],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box highlight cursor={Cursor.pointer} noBGColor={!ctx.active}>
                                <Icon icon={<EpicureIcon/>}/>
                            </Box>
                        );
                    }
                },
                renderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <EpicureHubPage/>
                        );
                    }
                }
            } as ViewConfig];
        }
    }, {
        defaultView: "def",
        id: "dashboard",
        location: "/dashboard",
        debug: false,
        viewFactory: config => {
            return [{
                id: "def",
                description: "Sign up, log-in using shortcut-login *(Continue as)* or log-in using your credentials.",
                accessible: (config) => true,
                displayName: "Projects page",
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
                            <DashboardPage/>
                        );
                    }
                }
            } as ViewConfig, {
                id: "templates",
                beta: true,
                description: "Shows details about the project, like the author & contributors. [Project's GitHub repo](https://github.com/christian-bernstein/sql-editor-web)",
                accessible: (config) => true,
                displayName: "Templates page",
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
                            <>Templates page!!</>
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
                                    <CustomTooltip enterDelay={700} placement={"right"} arrow noPadding noBorder title={
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
                                            <BadgedWrapper badge={
                                                <Badge visualMeaning={ObjectVisualMeaning.INFO} children={
                                                    <Text text={"1"}/>
                                                }/>
                                            } showBadgeInitially={false} children={
                                                view.iconRenderer.render({
                                                    screenConfig: screen,
                                                    viewConfig: view,
                                                    viewLocation: loc,
                                                    active: active
                                                })
                                            }/>
                                        }/>
                                    }/>
                                }/>
                            );
                        })
                    }
                </FlexBox>
            )}/>
        ));
    }

    public renderMenuIcons(): JSX.Element {
        return (
            <Switch>
                {this.loadAndRenderMenuIcons()}
            </Switch>
        );
    }

    public renderRoutes(): JSX.Element {
        return (
            <>
                {this.loadAndRenderRoutes()}
            </>
        );
    }
}

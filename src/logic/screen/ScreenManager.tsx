import {ScreenConfig} from "./ScreenConfig";
import {App} from "../App";
import {Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import {ViewConfig} from "./ViewConfig";
import {ViewRenderContext} from "./ViewRenderContext";
import {BoardingPage} from "../../pages/boarding/BoardingPage";
import {FlexBox} from "../../components/FlexBox";
import {Icon} from "../../components/Icon";
import {ReactComponent as SettingsIcon} from "../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as TestIcon} from "../../assets/icons/ic-20/ic20-alert.svg";
import {Box} from "../../components/Box";
import {FlexDirection} from "../style/FlexDirection";
import {percent} from "../style/DimensionalMeasured";
import {Align} from "../Align";
import {Cursor} from "../style/Cursor";
import {getOr} from "../Utils";

export class ScreenManager {

    private readonly screens: Array<ScreenConfig> = new Array<ScreenConfig>({
        defaultView: "def",
        routeExact: false,
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
                                <Icon icon={<TestIcon/>}/>
                            </Box>
                        );
                    }
                },
                renderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        const appConfig = App.app().config;
                        console.log("render redirect!!")
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
                description: "Boarding page",
                accessible: (config) => true,
                displayName: "Boarding page",
                tags: [],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box highlight cursor={Cursor.pointer} noBGColor={!ctx.active}>
                                <Icon icon={<SettingsIcon/>}/>
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
                id: "test",
                description: "Test page",
                accessible: (config) => true,
                displayName: "Test page",
                tags: [],
                iconRenderer: {
                    render(ctx: ViewRenderContext): JSX.Element {
                        return (
                            <Box highlight cursor={Cursor.pointer} width={percent(100)} noBGColor={!ctx.active}>
                                <Icon icon={<TestIcon/>}/>
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
                            if (loc === undefined || loc === null) {
                                loc = screen.defaultView;
                            }

                            const active = view.id === loc;
                            return (
                                <span style={{
                                    boxSizing: "content-box",
                                    width: percent(100).css()
                                }} onClick={() => {
                                    if (loc != null) {
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

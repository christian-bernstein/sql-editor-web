import React from "react";
import "../../styles/pages/MenuPage.scss";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {Text} from "../../components/Text";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../Themeable";
import {Box} from "../../components/Box";
import {percent} from "../../logic/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {InformationBox} from "../../components/InformationBox";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {Button} from "../../components/Button";
import {getOr, Utils} from "../../logic/Utils";
import {BounceLoader} from "react-spinners";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {Justify} from "../../logic/Justify";
import {Align} from "../../logic/Align";
import {ReactComponent as OpenDialogIcon} from "../../assets/icons/ic-20/ic20-open-in-browser.svg";
import {ReactComponent as LogIcon} from "../../assets/icons/ic-20/ic20-tag.svg";
import {Icon} from "../../components/Icon";
import {CustomTooltip} from "../../components/CustomTooltip";
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";

export type MenuPageProps = {
    showMenuInitially?: boolean,
    doubleClickMenuOpen?: boolean
}

export type MenuPageState = {
    showMenu: boolean,
    updateSlave: number
}

let instance: MenuPage | undefined = undefined;

export default class MenuPage extends React.Component<MenuPageProps, MenuPageState> {

    constructor(props: MenuPageProps) {
        super(props);
        this.state = {
            showMenu: (this.props.showMenuInitially) ? this.props.showMenuInitially : false,
            updateSlave: 0
        };
        instance = this;
    }

    // todo investigate bug!
    componentDidMount() {
        App.app().registerAction("show-menu", () => {
            if (instance) {
                instance.setState({
                    showMenu: true
                });
            }
        });

        App.app().registerAction("hide-menu", () => {
            if (instance) {
                instance.setState({
                    showMenu: false
                });
            }
        });

        App.app().registerAction("toggle-menu", () => {
            if (instance) {
                instance.setState({
                    showMenu: !instance.state.showMenu
                });
            }
        });
    }

    componentWillUnmount() {
        instance = undefined;
    }

    private handleWrapperClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.state.showMenu) {
            event.preventDefault();
            this.setState({
                showMenu: false
            });
        }
    }

    // noinspection JSMethodCanBeStatic
    private openMenu(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        App.app().callAction("show-menu");
    }

    private onDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
        if (getOr(this.props.doubleClickMenuOpen, false) && !this.state.showMenu) {
            this.openMenu(event);
        }
    }

    // noinspection JSMethodCanBeStatic
    private renderServerAvailabilityStatus(): JSX.Element {
        const connector = App.app().getConnector();
        const state = connector.socket?.readyState;
        const theme: Themeable.Theme = utilizeGlobalTheme();
        let mc: MeaningfulColors;
        const config = connector.config;

        const getConnectingBox = () => (
            <InformationBox visualMeaning={ObjectVisualMeaning.WARNING} width={percent(100)}>
                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}
                         width={percent(100)}>
                    <Text text={`Connecting to\n ${config.address}`}/>
                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                        <Text text={`${connector.connectionAttempts} / ${config.maxConnectAttempts}`}/>
                        <BounceLoader color={getMeaningfulColors(ObjectVisualMeaning.WARNING, theme).lighter.css()}
                                      size={20}/>
                    </FlexBox>
                </FlexBox>
            </InformationBox>
        );

        switch (state) {
            case 0:
                return (getConnectingBox());
            case 1:
                return (
                    <InformationBox visualMeaning={ObjectVisualMeaning.SUCCESS} width={percent(100)}>
                        <Text text={"Socket connection online."}/>
                    </InformationBox>
                );
            case 2:
                return (
                    <InformationBox visualMeaning={ObjectVisualMeaning.WARNING} width={percent(100)}>
                        <Text text={"**WARN**: Socket connection closing."}/>
                    </InformationBox>
                );
            case 3:
                if (connector.connectionAttempts < connector.config.maxConnectAttempts) {
                    return getConnectingBox();
                } else return (
                    <InformationBox visualMeaning={ObjectVisualMeaning.ERROR} width={percent(100)}>
                        <Text text={"**ERR**: Socket connection closed."}/>
                    </InformationBox>
                );
            default:
                return (<>Error</>);
        }
    }

    private updateUI() {
        this.setState({
            updateSlave: this.state.updateSlave + 1
        });
    }

    // BOX: height={percent(100)}
    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        return (
            <div className={"menu-wrapper"}>
                <div
                    onDoubleClick={(event) => this.onDoubleClick(event)}
                    onClick={event => this.handleWrapperClick(event)}
                    className={["wrapper", this.state.showMenu ? "menu-showing" : ""].join(" ").trim()}
                    style={{
                        userSelect: "none"
                    }}>
                    {this.props.children}
                </div>
                <div className={["menu", this.state.showMenu ? "menu-showing" : ""].join(" ").trim()}
                     style={{
                         overflowY: "scroll",
                         paddingLeft: theme.paddings.defaultObjectPadding.css(),
                         paddingRight: theme.paddings.defaultObjectPadding.css()
                     }}>
                    <Box width={percent(100)}
                         style={{
                             minHeight: "100%"
                         }}
                         overflowYBehaviour={OverflowBehaviour.SCROLL}
                         overflowXBehaviour={OverflowBehaviour.SCROLL}
                         gapY={theme.gaps.defaultGab}>
                        {this.renderServerAvailabilityStatus()}
                        <FlexBox flexDir={FlexDirection.ROW} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                            <Button visualMeaning={ObjectVisualMeaning.INFO}
                                    width={percent(100)}
                                    opaque={true}
                                    shrinkOnClick={true}
                                    onClick={() => App.app().rerenderGlobally()}>
                                <Text text={"Rerender"}/>
                            </Button>
                            <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                    width={percent(100)}
                                    opaque={true}
                                    shrinkOnClick={true}
                                    onClick={() => Utils.reloadPage()}>
                                <Text text={"Reload"}/>
                            </Button>
                            <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                    width={percent(100)}
                                    opaque={true}
                                    shrinkOnClick={true}
                                    onClick={() => {
                                        Utils.toggleFullScreen(undefined, undefined);
                                        this.updateUI();
                                    }}>
                                <Text text={"Fullscreen"}/>
                            </Button>
                            <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                    width={percent(100)}
                                    opaque={true}
                                    shrinkOnClick={true}
                                    onClick={() => {
                                        App.app().callAction("open-command-pallet");
                                    }}>
                                <Text text={"CMD"}/>
                            </Button>
                        </FlexBox>



                        <FlexBox flexDir={FlexDirection.ROW} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                            <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                    width={percent(100)}
                                    opaque={true}
                                    shrinkOnClick={true}
                                    onClick={() => {
                                        App.app().setGlobalTheme("light-green");
                                        App.app().rerenderGlobally();
                                    }}>
                                <Text text={"Light-Theme"}/>
                            </Button>
                            <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                    width={percent(100)}
                                    opaque={true}
                                    shrinkOnClick={true}
                                    onClick={() => {
                                        App.app().setGlobalTheme("dark-green");
                                        App.app().rerenderGlobally();
                                    }}>
                                <Text text={"Dark-Theme"}/>
                            </Button>
                        </FlexBox>

                        <FlexBox flexDir={FlexDirection.ROW}>
                            <CustomTooltip title={"Open main dialog"} arrow>
                                <span>
                                    <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                            opaque={true}
                                            shrinkOnClick={true}
                                            onClick={() => {
                                                App.app().callAction("open-main-dialog");
                                            }}>
                                <Icon icon={<OpenDialogIcon/>}/>
                            </Button>
                                </span>
                            </CustomTooltip>

                            <CustomTooltip title={"Open logs"} arrow>
                                <span>
                                    <Button visualMeaning={ObjectVisualMeaning.ERROR}
                                            opaque={false}
                                            shrinkOnClick
                                            enableBaseAnimation
                                            baseAnimation={"hover-repeat"}
                                            onClick={() => {
                                                App.app().callAction("open-main-dialog", "log");
                                            }}
                                    >
                                        <FlexBox flexDir={FlexDirection.ROW}>
                                            <Icon icon={<LogIcon/>}/>
                                            <Text
                                                visualMeaning={ObjectVisualMeaning.ERROR}
                                                leftAppendix={<></>}
                                                enableLeftAppendix
                                                uppercase
                                                text={"**Logs**"}
                                            />
                                            <FlexBox flexDir={FlexDirection.ROW} height={percent(100)}>
                                                <Text text={`(${String(App.app().logHistory.length)})`}/>
                                            </FlexBox>
                                        </FlexBox>
                                    </Button>
                                </span>
                            </CustomTooltip>
                        </FlexBox>

                        <ObjectJSONDisplay
                            object={App.app().config}
                            title={"**App config**"}
                            pure={false}
                        />
                        <ObjectJSONDisplay
                            object={App.app().logHistory}
                            pure={false}
                            title={`**Log history** (*${App.app().logHistory.length} entries*)`}
                            showControls
                        />
                    </Box>
                </div>
            </div>
        );
    }
}

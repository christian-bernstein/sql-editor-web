import React from "react";
import "../../styles/pages/MenuPage.scss";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {Text, TextType} from "../../components/Text";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../Themeable";
import {Box} from "../../components/Box";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {InformationBox} from "../../components/InformationBox";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {Button} from "../../components/Button";
import {getOr, Utils} from "../../logic/Utils";
import {BounceLoader} from "react-spinners";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/Align";
import {ReactComponent as OpenDialogIcon} from "../../assets/icons/ic-20/ic20-open-in-browser.svg";
import {ReactComponent as LogIcon} from "../../assets/icons/ic-20/ic20-bolt.svg";
import {Icon} from "../../components/Icon";
import {CustomTooltip} from "../../components/CustomTooltip";
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";
import {Constants} from "../../Constants";
import {BadgedWrapper} from "../../components/BadgedWrapper";
import {Jumper} from "../../components/Jumper";
import {ClientDisplay} from "../../components/ClientDisplay";
import {UserActiveState} from "../../logic/data/UserActiveState";
import {ClientDeviceType} from "../../logic/data/ClientDeviceType";
import {v4} from "uuid";
import Banner from "../../assets/images/img-4.gif";
import ProfilePicture from "../../assets/images/img-4.gif";
import {CDNRequestPacketData} from "../../packets/out/CDNRequestPacketData";
import {CDNResponsePacketData} from "../../packets/in/CDNResponsePacketData";
import {Debug} from "../../components/Debug";

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

    private renderLogSection(): JSX.Element {
        return (
            <CustomTooltip title={"Open logs"} arrow>
                <span>
                    <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                            opaque={true}
                            width={percent(100)}
                            shrinkOnClick
                            enableBaseAnimation
                            baseAnimation={"hover-repeat"}
                            onClick={() => App.app().callAction("open-main-dialog", Constants.logDialog)}
                    >
                        <FlexBox flexDir={FlexDirection.ROW}>
                            <Icon icon={<LogIcon/>}/>
                            <Text
                                visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                leftAppendix={<></>}
                                enableLeftAppendix
                                uppercase
                                text={"**Logs**"}
                            />
                            <FlexBox flexDir={FlexDirection.ROW} height={percent(100)}>
                                <Text text={`(${String(App.app().sophisticatedLogHistory.length)})`}/>
                            </FlexBox>
                        </FlexBox>
                    </Button>
                </span>
            </CustomTooltip>
        );
    }

    private renderRedirectPanel(): JSX.Element {
        return (
            <Jumper/>
        );
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
                            <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
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

                        {/*this.renderLogSection()*/}

                        <FlexBox flexDir={FlexDirection.ROW} overflowXBehaviour={OverflowBehaviour.SCROLL}>
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

                            <CustomTooltip title={<Text text={"**[DEBUG]**\nOpen **client-display-playground-dialog**-dialog"}/>} arrow>
                                <span>
                                    <Button
                                        visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                        opaque={true}
                                        shrinkOnClick={true}
                                        children={<Text text={"cd-playground"} whitespace={"nowrap"} uppercase bold fontSize={px(12)} enableLeftAppendix leftAppendix={
                                            <Icon icon={<OpenDialogIcon/>}/>
                                        } />}
                                        onClick={() => {
                                            App.app().callDialog("client-display-playground-dialog");
                                        }}
                                    />
                                </span>
                            </CustomTooltip>

                            <CustomTooltip title={<Text text={"**[DEBUG]**\nOpen **menu-debug**-dialog"}/>} arrow>
                                <span>
                                    <Button
                                        visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                        opaque={true}
                                        shrinkOnClick={true}
                                        children={<Text text={"menu"} uppercase bold fontSize={px(12)} enableLeftAppendix leftAppendix={
                                            <Icon icon={<OpenDialogIcon/>}/>
                                        } />}
                                        onClick={() => {
                                            App.app().callDialog("menu-debug-dialog");
                                        }}
                                    />
                                </span>
                            </CustomTooltip>

                            <CustomTooltip title={"Open log dialog"} arrow>
                                <span>
                                    <Button
                                        visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                        opaque={true}
                                        shrinkOnClick={true}
                                        onClick={() => {
                                            App.app().callAction("open-main-dialog", Constants.logDialog);
                                        }}
                                    >
                                        <BadgedWrapper
                                            badge={
                                                <Text text={`${App.app().sophisticatedLogHistory.length}`} fontSize={px(12)}/>
                                            } showBadgeInitially
                                        >
                                                <Icon icon={<LogIcon/>}/>
                                        </BadgedWrapper>
                                    </Button>
                                </span>
                            </CustomTooltip>
                        </FlexBox>

                        {this.renderRedirectPanel()}

                        <ObjectJSONDisplay
                            object={App.app().config}
                            title={"**App config**"}
                            pure={false}
                        />

                        <Debug>
                            <FlexBox width={percent(100)} gap={theme.gaps.smallGab} align={Align.CENTER}>
                                <Box width={percent(100)}>
                                    <FlexBox flexDir={FlexDirection.ROW} width={percent(100)} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                        <ClientDisplay clientDataResolver={() => ({
                                            activeState: UserActiveState.DO_NOT_DISTURB,
                                            badges: [],
                                            deviceType: ClientDeviceType.MOBILE,
                                            email: "christian-bernstein@gmail.com",
                                            id: v4(),
                                            firstname: "Christian",
                                            lastname: "Bernstein",
                                            lastActive: new Date(),
                                            links: [],
                                            username: "Christian",
                                            viewedFromID: undefined,
                                            biography: "It contains **basic information about the subject's life** — like their place of birth, education, and interests. A biography may also chronicle relationships with family members, as well as major events in the subject's childhood and how those influenced their upbringing.",
                                            banner: {
                                                type: "SRC",
                                                src: Banner
                                            },
                                            profilePicture: {
                                                type: "SRC",
                                                src: ProfilePicture
                                            }
                                        })}/>
                                        <Button children={<Text text={"CDN"} uppercase bold fontSize={px(12)}/>} onClick={() => {
                                            const requestID = v4();
                                            App.app().getConnector().call({
                                                protocol: "base",
                                                packetID: "CDNRequestPacketData",
                                                data: {
                                                    branches: [
                                                        {
                                                            branch: "biography",
                                                            targetID: "626ff913-9faa-4e3d-9d41-1cd4636213ca",
                                                            requestID: requestID
                                                        }
                                                    ]
                                                } as CDNRequestPacketData,
                                                callback: {
                                                    handle: (connector, packet) => {
                                                        const data = packet.data as CDNResponsePacketData;
                                                        console.log("cdn response", data.response.entries.filter(req => req.requestID === requestID)[0]);
                                                    }
                                                }
                                            });
                                        }}/>
                                    </FlexBox>
                                </Box>

                                <InformationBox visualMeaning={ObjectVisualMeaning.BETA} width={percent(100)}>
                                    <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} width={percent(100)} justifyContent={Justify.SPACE_BETWEEN}>
                                        <Text type={TextType.secondaryDescription} text={"As of subversion **v2.29-alpha.0** *(01. Mar 2022)*, the website is in it's development phase."}/>
                                    </FlexBox>
                                </InformationBox>
                            </FlexBox>
                        </Debug>

                        <Button width={percent(100)} onClick={() => App.app().callDialog(Constants.roadmapDialog)}>
                            <Text text={"Roadmap"} uppercase bold fontSize={px(12)}/>
                        </Button>

                        {/*<ObjectJSONDisplay
                            object={App.app().logHistory}
                            pure={false}
                            title={`**Log history** (*${App.app().logHistory.length} entries*)`}
                            showControls
                        />*/}
                    </Box>
                </div>
            </div>

        );
    }
}

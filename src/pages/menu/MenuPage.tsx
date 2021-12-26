import React from "react";
import "../../styles/pages/MenuPage.scss";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";
import {Text} from "../../components/Text";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../Themeable";
import {Box} from "../../components/Box";
import {percent} from "../../logic/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {InformationBox} from "../../components/InformationBox";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {Button} from "../../components/Button";
import {Utils} from "../../logic/Utils";
import {BounceLoader, ClipLoader, MoonLoader} from "react-spinners";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {Justify} from "../../logic/Justify";
import {Align} from "../../logic/Align";

export type MenuPageProps = {
    showMenuInitially?: boolean
}

export type MenuPageState = {
    showMenu: boolean,
    updateSlave: number
}

export default class MenuPage extends React.Component<MenuPageProps, MenuPageState> {

    constructor(props: MenuPageProps) {
        super(props);
        this.state = {
            showMenu: (this.props.showMenuInitially) ? this.props.showMenuInitially : false,
            updateSlave: 0
        };
    }

    // todo investigate bug!
    componentDidMount() {
        App.app().registerAction("show-menu", () => {
            this.setState({
                showMenu: true
            });
        });
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

    // noinspection JSMethodCanBeStatic
    private renderServerAvailabilityStatus(): JSX.Element {
        const state = App.app().getConnector().socket?.readyState;
        const theme: Themeable.Theme = utilizeGlobalTheme();
        let mc: MeaningfulColors;
        switch (state) {
            case 0:
                mc = getMeaningfulColors(ObjectVisualMeaning.WARNING, theme);
                return (
                <InformationBox visualMeaning={ObjectVisualMeaning.WARNING} width={percent(100)}>
                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)}>
                        <Text text={"Connecting to server."}/>
                        <BounceLoader color={mc.lighter.css()} size={20}/>
                    </FlexBox>

                </InformationBox>
            );
            case 1: return (
                <InformationBox visualMeaning={ObjectVisualMeaning.SUCCESS} width={percent(100)}>
                    <Text text={"Socket connection online."}/>
                </InformationBox>
            );
            case 2: return (
                <InformationBox visualMeaning={ObjectVisualMeaning.WARNING} width={percent(100)}>
                    <Text text={"**WARN**: Socket connection closing."}/>
                </InformationBox>
            );
            case 3: return (
                <InformationBox visualMeaning={ObjectVisualMeaning.ERROR} width={percent(100)}>
                    <Text text={"**ERR**: Socket connection closed."}/>
                </InformationBox>
            );
            default: return (<>Error</>);
        }
    }

    private updateUI() {
        this.setState({
            updateSlave: this.state.updateSlave + 1
        });
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        return (
            <div className={"menu-wrapper"}>
                <div
                    onDoubleClick={(event) => this.openMenu(event)}
                    onClick={event => this.handleWrapperClick(event)}
                    className={["wrapper", this.state.showMenu ? "menu-showing" : ""].join(" ").trim()}
                    style={{
                        userSelect: "none"
                    }}>
                    {this.props.children}
                </div>
                <div className={["menu", this.state.showMenu ? "menu-showing" : ""].join(" ").trim()}
                     style={{
                        paddingLeft: theme.paddings.defaultObjectPadding.css(),
                        paddingRight: theme.paddings.defaultObjectPadding.css(),
                     }}>
                    <Box height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} gapY={theme.gaps.defaultGab}>
                        {this.renderServerAvailabilityStatus()}

                        <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                opaque={true}
                                shrinkOnClick={true}
                                onClick={() => App.app().rerenderGlobally()}>
                            <Text text={"Rerender app"}/>
                        </Button>

                        <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                opaque={true}
                                shrinkOnClick={true}
                                onClick={() => Utils.reloadPage()}>
                            <Text text={"Reload page"}/>
                        </Button>

                        <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                opaque={true}
                                shrinkOnClick={true}
                                onClick={() => {
                                    Utils.toggleFullScreen(undefined, undefined);
                                    this.updateUI();
                                }}>
                            <Text text={!document.fullscreen ? "Disable fullscreen" : "Enable fullscreen"}/>
                        </Button>

                        <ObjectJSONDisplay object={App.app().config} title={"App config"}/>

                        <ObjectJSONDisplay object={App.app().logHistory} title={`Log history (*${App.app().logHistory.length} entries*)`} showControls/>
                    </Box>
                </div>
            </div>
        );
    }
}

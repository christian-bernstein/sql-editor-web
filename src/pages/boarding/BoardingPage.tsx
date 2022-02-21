import React from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Logo} from "../../assets/retired_logo_v2.svg";
import {ReactComponent as AppLogo} from "../../assets/logo.svg";
import {ReactComponent as FullscreenEnterIcon} from "../../assets/icons/ic-20/ic20-fullscreen.svg";
import {ReactComponent as FullscreenExitIcon} from "../../assets/icons/ic-20/ic20-fullscreen-exit.svg";
import {ReactComponent as LogIcon} from "../../assets/icons/ic-20/ic20-bolt.svg";
// todo remove completely
// import "../../styles/pages/BoardingPage.scss";
import {_Button} from "../../components/_Button";
import {ComponentStyle} from "../../ComponentStyle";
import {ContinueAs} from "../../components/ContinueAs";
import {App} from "../../logic/App";
import {SessionHistoryEntry} from "../../logic/SessionHistoryEntry";
import {FlexDirection} from "../../logic/FlexDirection";
import {Align} from "../../logic/Align";
import {Text, TextType} from "../../components/Text";
import {FlexBox} from "../../components/FlexBox";
import styled from "styled-components";
import {Themeable} from "../../Themeable";
import {ServerConnectionIcon} from "../../components/ServerConnectionIcon";
import {Button} from "../../components/Button";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {percent, px} from "../../logic/DimensionalMeasured";
import {PosInCenter} from "../../components/PosInCenter";
import {Cursor} from "../../logic/style/Cursor";
import {Icon} from "../../components/Icon";
import {Utils} from "../../logic/Utils";
import {Separator} from "../../components/Separator";
import {Orientation} from "../../logic/Orientation";
import {Justify} from "../../logic/Justify";
import {Zoom} from "@mui/material";
import {CustomTooltip} from "../../components/CustomTooltip";
import {createMargin} from "../../logic/Margin";
import {Constants} from "../../Constants";
import {BadgedWrapper} from "../../components/BadgedWrapper";
import {v4} from "uuid";
import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/Assembly";
import {InformationBox} from "../../components/InformationBox";
import {If} from "../../components/If";

export type BoardingPageProps = {}

export type BoardingPageState = {
    id: string
}

export class BoardingPage extends BernieComponent<BoardingPageProps, BoardingPageState, any> {

    constructor(props: Readonly<BoardingPageProps> | BoardingPageProps) {
        super(props, {
            id: v4()
        }, undefined);

        App.use(app => {
            app.removeInvalidSessionHistoryEntries();
            // After ton socket has connected, the cached sessions might/will change
            // server-wise and need to be reloaded on the client.
            app.registerAction("connection-established", () => {
                app.removeInvalidSessionHistoryEntries(() => {
                    // After validation result sent by the server and recalculated on the client
                    // rerender the boarding page.
                    this.forceUpdate();
                });
            });
        });
    }

    componentDidMount() {
        App.app().getConnector().registerOnProtocolChangeHandler(this.state.id, (connector, switchData) => {
            if (switchData.newProtocol === "main") {
                this.goto("dashboard");
            }
        });
    }

    componentWillUnmount() {
        App.app().getConnector().unregisterOnProtocolChangeHandler(this.state.id);
    }

    componentRender(p: BoardingPageProps, s: BoardingPageState, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        // todo remove redundant constant
        const theme: Themeable.Theme = t;

        const Wrapper = styled.div`
          background-color: ${theme.colors.backgroundColor.css()};

          width: 100%;
          height: 100vh;
          color: ${theme.colors.fontPrimaryColor.css()};
          box-sizing: border-box;
          position: relative;

          .boarding-page-foreground {
            box-sizing: border-box;
            padding: ${theme.paddings.defaultObjectPadding.css()};
            z-index: 10;
            position: relative;
            width: 100%;
            max-width: 100%;
            height: 100%;
            display: grid;
            grid-template-areas: "a" "b" "c" "d";
            grid-template-rows: repeat(4, 1fr);

            .header {
              grid-area: a;
              width: 100%;

              .header-container {
                width: 100%;
                align-items: center;
                display: grid;
                grid-template-columns: repeat(3, 1fr);

                .logo-space {
                  width: 100%;

                  &:first-child {
                    height: 24px;
                    fill: ${theme.colors.iconColor.css()};
                  }
                }

                .page-name {
                  justify-self: center;
                  color: ${theme.colors.fontPrimaryColor.css()};
                  margin: 0;
                  font-family: 'Poppins', sans-serif;
                  font-style: normal;
                  font-weight: 900;
                  font-size: 14px;
                  line-height: 27px;
                  display: flex;
                  align-items: center;
                  text-align: center;
                  letter-spacing: 0.03em;
                  text-transform: uppercase;
                }
              }
            }

            .title {
              grid-area: b;
              width: 100%;
              height: 100%;
              font-family: "OperatorMono", monospace;
              display: flex;
              justify-content: center;
              flex-direction: column;

              h1 {
                margin: 0;
                font-style: normal;
                font-weight: bold;
                font-size: 38px;
                line-height: 58px;
                display: flex;
                align-items: center;
                letter-spacing: 0.03em;
                color: ${theme.colors.fontPrimaryColor.css()};
              }

              h3 {
                margin: 10px 0 0;
                font-style: normal;
                font-weight: 350;
                font-size: 14px;
                line-height: 22px;
                display: flex;
                align-items: center;
                letter-spacing: 0.03em;
                color: ${theme.colors.fontPrimaryColor.css()};
              }
            }

            .boarding {
              grid-area: d;
              width: 100%;
              max-width: 100%;

              .boarding-form {
                height: 100%;
                width: 100%;
                display: flex;
                align-items: flex-start;
                justify-content: flex-end;
                flex-direction: column;

                .continue-as-list {
                  padding: 0;
                  width: 100%;
                  max-width: 100%;
                  margin-bottom: 1em;
                  display: flex;
                  flex-direction: column;
                  gap: 1em;
                }

                .boarding-type {
                  width: 100%;
                  display: grid;
                  grid-template-columns: 1fr fit-content(0) 1fr;
                  align-items: center;

                  .separator {
                    font-family: "Consolas", monospace;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 24px;
                    line-height: 33px;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    letter-spacing: 0.03em;
                    color: ${theme.colors.fontDeactivatedColor.css()};
                    flex: none;
                    flex-grow: 0;
                    margin: 0 15px;
                  }
                }
              }
            }
          }

          .boarding-page-background {
            background-color: ${theme.colors.backgroundColor.css()};
            z-index: 1;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;

            & :first-child {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `;

        return (
            <Wrapper>
                <div className={"boarding-page-foreground"}>
                    <div className={"header"}>
                        <div className={"header-container"}>
                            <div className={"logo-space"}>
                                <Logo/>
                            </div>
                            <h3 className={"page-name"}>Boarding</h3>

                            <FlexBox flexDir={FlexDirection.ROW_REVERSE} height={percent(100)} gap={theme.gaps.smallGab}>
                                <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} height={percent(100)}>
                                    <ServerConnectionIcon
                                        openConnectionMetricsDialog
                                    />
                                </FlexBox>
                                <Separator orientation={Orientation.VERTICAL} width={px(1)}/>
                                <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} height={percent(100)}>
                                    <CustomTooltip noBorder arrow title={"Toggle fullscreen"} TransitionComponent={Zoom}>
                                        <span>
                                            <Icon icon={(() => {
                                                if (document.fullscreenElement === null) {
                                                    return <FullscreenEnterIcon/>
                                                } else {
                                                    return <FullscreenExitIcon/>
                                                }
                                            })()} onClick={() => Utils.toggleFullScreen(() => {
                                                App.app().rerenderGlobally();
                                            })}/>
                                        </span>
                                    </CustomTooltip>
                                </FlexBox>

                                {/*<FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} height={percent(100)} margin={createMargin(0, theme.gaps.smallGab.measurand, 0, 0)}>
                                    <Icon icon={<ClearIcon/>} onClick={() => {
                                        App.app().clearSessionHistory();
                                        this.forceUpdate();
                                    }}/>
                                </FlexBox>*/}

                                <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} height={percent(100)} margin={createMargin(0, theme.gaps.smallGab.measurand, 0, 0)}>
                                    <CustomTooltip noBorder arrow title={"Open log dialog"} TransitionComponent={Zoom} onClick={() => {
                                        App.app().callAction("open-main-dialog", Constants.logDialog)
                                    }}>
                                        <span>
                                            <BadgedWrapper badge={
                                                <Text text={`${App.app().sophisticatedLogHistory.length}`} fontSize={px(12)}/>
                                            } showBadgeInitially>
                                                <Icon icon={<LogIcon/>}/>
                                            </BadgedWrapper>

                                        </span>
                                    </CustomTooltip>
                                </FlexBox>
                            </FlexBox>
                        </div>
                    </div>
                    <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER}>
                        <AppLogo/>
                        <Text text={"SQL-Editor"} type={TextType.largeHeader}/>
                        <Text text={"Learn SQL in our interactive\neditor and create your projects"} type={TextType.secondaryDescription} align={Align.CENTER}/>
                    </FlexBox>
                    <div className={"boarding"}>
                        <form className={"boarding-form"}>

                            {/*<InformationBox visualMeaning={ObjectVisualMeaning.BETA} width={percent(100)}>
                                <FlexBox width={percent(100)} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} flexDir={FlexDirection.ROW}>
                                    <Text text={"New **beta** available. Do you want to enable beta mode."} visualMeaning={ObjectVisualMeaning.BETA} coloredText/>
                                    Badge.beta()
                                    <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque={true}>
                                        <Text text={"Enable"} bold visualMeaning={ObjectVisualMeaning.BETA} coloredText/>
                                    </Button>
                                </FlexBox>
                            </InformationBox>*/}

                            {/*<FlexBox width={DimensionalMeasured.of(100, Dimension.percentage)}>
                                <DBTask data={{
                                    timestamp: new Date(),
                                    client: {
                                        type: ClientType.BOT,
                                        id: v4(),
                                        username: "root"
                                    }
                                }}/>
                            </FlexBox>*/}

                            <If.Beta/>

                            <InformationBox visualMeaning={ObjectVisualMeaning.BETA} width={percent(100)}>
                                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)} justifyContent={Justify.SPACE_BETWEEN}>
                                    <Text type={TextType.secondaryDescription} text={"As of subversion **v16** *(19. Feb 2022)*, the website is in it's development phase."}/>
                                    <Button onClick={() => App.app().callDialog(Constants.roadmapDialog)}>
                                        <Text text={"Roadmap"} uppercase bold fontSize={px(12)}/>
                                    </Button>
                                </FlexBox>
                            </InformationBox>

                            <ol className={"continue-as-list"}>
                                {
                                    App.app().getSessionHistoryEntries().map((entry: SessionHistoryEntry) => <ContinueAs
                                        key={""} sessionHistoryEntry={{
                                        sessionID: entry.sessionID,
                                        profileData: entry.profileData
                                    }}/>)
                                }
                            </ol>
                            <div className={"boarding-type"}>
                                <Link to={"/login"}>
                                    <_Button onClick={() => {}} internalStyling={true} theme={ComponentStyle.DEFAULT}>
                                        Log in
                                    </_Button>
                                </Link>
                                <span className={"separator"}>/</span>
                                <Link to={"/register"} style={{width: "100%", height: "100%", textDecoration: "none"}}>
                                    <Button width={percent(100)} height={percent(100)}  visualMeaning={ObjectVisualMeaning.INFO} shrinkOnClick opaque>
                                        <PosInCenter fullHeight>
                                            <Text cursor={Cursor.pointer} text={"Sign up"} type={TextType.smallHeader}/>
                                        </PosInCenter>
                                    </Button>
                                    {/*<_Button onClick={() => {}} internalStyling={true} theme={ComponentStyle.PRIMARY}>
                                        Sign up
                                    </_Button>*/}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

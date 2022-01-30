import React from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Logo} from "../../assets/retired_logo_v2.svg";
import {ReactComponent as AppLogo} from "../../assets/logo.svg";
import {ReactComponent as FullscreenEnterIcon} from "../../assets/icons/ic-20/ic20-fullscreen.svg";
import {ReactComponent as FullscreenExitIcon} from "../../assets/icons/ic-20/ic20-fullscreen-exit.svg";
// todo remove completely
// import "../../styles/pages/BoardingPage.scss";
import {_Button} from "../../components/_Button";
import {ComponentStyle} from "../../ComponentStyle";
import {ContinueAs} from "../../components/ContinueAs";
import {App, utilizeGlobalTheme} from "../../logic/App";
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
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";
import {Zoom} from "@mui/material";
import {ReactComponent as ProjectIcon} from "../../assets/icons/ic-20/ic20-file.svg";
import {CustomTooltip} from "../../components/CustomTooltip";

export type BoardingPageProps = {}

export type BoardingPageState = {}

export class BoardingPage extends React.Component<BoardingPageProps, BoardingPageState> {

    constructor(props: Readonly<BoardingPageProps> | BoardingPageProps) {
        super(props);
        App.app().removeInvalidSessionHistoryEntries();
        // After ton socket has connected, the cached sessions might/will change
        // server-wise and need to be reloaded on the client.
        App.app().registerAction("connection-established", () => {
            App.app().removeInvalidSessionHistoryEntries(() => {
                // After validation result sent by the server and recalculated on the client
                // rerender the boarding page.
                this.forceUpdate();
            });
        })
    }

    // todo implement
    private clearSessionHistory() {
        console.log("clearing session history")
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
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
            // className={"boarding-page"}
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
                                    <ServerConnectionIcon/>
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
                            </FlexBox>
                        </div>
                    </div>
                    <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER}>
                        <AppLogo/>
                        <Text text={"SQL-Editor"} type={TextType.largeHeader}/>
                        <Text text={"Learn SQL in our interactive\neditor and create your projects"}
                              type={TextType.secondaryDescription}
                              align={Align.CENTER}
                        />
                    </FlexBox>
                    <div className={"boarding"}>
                        <form className={"boarding-form"}>
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

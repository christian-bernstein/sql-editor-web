import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../Themeable";
import {PageV2} from "../../components/Page";
import {AppHeader} from "../../components/AppHeader";
import React from "react";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as ReloadIcon} from "../../assets/icons/ic-20/ic20-refresh.svg";
import {App} from "../../logic/App";
import {Icon} from "../../components/Icon";
import {Box} from "../../components/Box";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {Text, TextType} from "../../components/Text";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {getOr} from "../../logic/Utils";
import ReactJson from "react-json-view";
import {Justify} from "../../logic/Justify";
import dateFormat from "dateformat";
import {Separator} from "../../components/Separator";
import {Orientation} from "../../logic/Orientation";
import {Align} from "../../logic/Align";
import {percent} from "../../logic/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {LogEntry} from "../../logic/data/LogEntry";
import {v4} from "uuid";

export class LogPage extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined);
        // App.app().log({
        //     timestamp: new Date(),
        //     level: "ERROR",
        //     id: v4(),
        //     creator: "console",
        //     appendices: [],
        //     message: "Hello world!"
        // });
        // App.app().log({
        //     timestamp: new Date(),
        //     level: "WARN",
        //     id: v4(),
        //     creator: "console",
        //     appendices: [],
        //     message: "Hello world!"
        // });
        // App.app().log({
        //     timestamp: new Date(),
        //     level: "INFO",
        //     id: v4(),
        //     creator: "console",
        //     appendices: [{
        //         type: "json",
        //         data: {}
        //     }, {
        //         type: "json",
        //         data: {}
        //     }],
        //     message: "Hello world!"
        // });
    }

    private renderSophisticatedLogHistory(t: Themeable.Theme): JSX.Element {
        const history: Array<LogEntry> = App.app().sophisticatedLogHistory;
        return (
            <Box gapY={t.gaps.smallGab}>{
                history.map(log => {
                    let vm: ObjectVisualMeaning;
                    switch (log.level) {
                        case "ERROR": {
                            vm = ObjectVisualMeaning.ERROR;
                            break;
                        }
                        case "WARN": {
                            vm = ObjectVisualMeaning.WARNING;
                            break;
                        }
                        default: {
                            vm = ObjectVisualMeaning.UI_NO_HIGHLIGHT;
                            break;
                        }
                    }
                    return (
                        <Box width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} visualMeaning={vm} gapY={t.gaps.smallGab} opaque>
                            <FlexBox flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN}>
                                <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                                    <FlexBox gap={t.gaps.smallGab} height={percent(100)} flexDir={FlexDirection.ROW}>
                                        <Text text={`**${dateFormat(log.timestamp, "h:MM:ss:l TT")}**`} visualMeaning={vm}/>
                                        <Separator orientation={Orientation.VERTICAL}/>
                                        <Text text={`**${log.level}**`} visualMeaning={vm} coloredText/>
                                    </FlexBox>
                                    <Text text={`*${log.creator}*`} type={TextType.secondaryDescription}/>
                                </FlexBox>
                                <Text text={log.message} visualMeaning={vm}/>
                            </FlexBox>
                            {
                                log.appendices.length > 0 ? (
                                    log.appendices.map(appendix => <ReactJson
                                        src={appendix.data}
                                        displayDataTypes={false}
                                        displayObjectSize={false}
                                        collapsed={true}
                                        onEdit={edit => {}}
                                        enableClipboard={getOr(this.props.enableClipboard, false)}
                                        theme={t.libraries.reactJson.theme}
                                        iconStyle={"square"}
                                        style={{
                                            whiteSpace: "nowrap",
                                            width: "100%",
                                            backgroundColor: "transparent"
                                        }}
                                    />)
                                ) : (
                                    <></>
                                )
                            }

                        </Box>
                    );
                })
            }</Box>
        );
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme): JSX.Element | undefined {
        const history: any[][] = App.app().logHistory;
        return (
            <PageV2>
                <AppHeader
                    title={"Log"}
                    left={<FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} height={percent(100)}>
                        <Icon icon={<ReloadIcon/>} onClick={() => {
                            this.forceUpdate();
                        }}/>
                        <Separator orientation={Orientation.VERTICAL}/>
                        <Text type={TextType.secondaryDescription} text={`${dateFormat(new Date(), "h:MM:ss")}`}/>
                    </FlexBox>}
                    right={<Icon icon={<CloseIcon/>} onClick={() => {
                        App.app().callAction("close-main-dialog");
                    }}/>}
                />
                {this.renderSophisticatedLogHistory(t)}
            </PageV2>
        );
    }
}

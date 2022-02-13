import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../Themeable";
import {PageV2} from "../../components/Page";
import {AppHeader} from "../../components/AppHeader";
import React from "react";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as ReloadIcon} from "../../assets/icons/ic-20/ic20-refresh.svg";
import {ReactComponent as DeleteIcon} from "../../assets/icons/ic-20/ic20-delete.svg";
import {ReactComponent as PacketIcon} from "../../assets/icons/ic-20/ic20-archive.svg";
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
import {percent, px} from "../../logic/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {LogEntry} from "../../logic/data/LogEntry";
import {PosInCenter} from "../../components/PosInCenter";
import {Assembly} from "../../logic/Assembly";
import {Environment} from "../../logic/Environment";
import {LogEntryAppendix} from "../../logic/data/LogEntryAppendix";
import {InformationBox} from "../../components/InformationBox";
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";

export class LogPage extends BernieComponent<any, any, any> {

    private readonly asmMap: Map<string, string> = new Map<string, string>([
        ["string", "string-appendix-asm"],
        ["object", "object-appendix-asm"],
        ["packet", "packet-appendix-asm"],
        ["any", "any-appendix-asm"],
    ])

    constructor() {
        super(undefined, undefined, undefined);

        this.assembly.assembly("string-appendix-asm", (theme, props) => {
            const c: string = String(props);
            return (
                <Text text={c} type={TextType.secondaryDescription}/>
            );
        });

        this.assembly.assembly("object-appendix-asm", (theme, props) => {
            const c: object = props;
            return (
                <ReactJson
                    src={c}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    collapsed={true}
                    onEdit={edit => {}}
                    enableClipboard={getOr(this.props.enableClipboard, false)}
                    theme={theme.libraries.reactJson.theme}
                    iconStyle={"square"}
                    style={{
                        whiteSpace: "nowrap",
                        width: "100%",
                        backgroundColor: "transparent"
                    }}
                />
            );
        });

        this.assembly.assembly("packet-appendix-asm", (theme, props) => {
            const c: Environment.Packet = props;
            return (
                <Box width={percent(100)} gapY={theme.gaps.smallGab}>
                    <Text leftAppendix={
                        <Icon icon={<PacketIcon/>} size={px(16)}/>
                    } enableLeftAppendix text={"**Packet**"}/>
                    <Separator/>
                    <FlexBox width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} gap={percent()}>
                        <Text whitespace={"nowrap"} text={`**Type:** ${c.type}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**Packet-ID:** ${c.packetID}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**ID:** ${c.id}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**Protocol:** ${c.protocol}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**Timestamp:** ${String(c.timestamp)}`} type={TextType.secondaryDescription}/>
                    </FlexBox>
                    <ObjectJSONDisplay object={c.data} pure={false} showControls={true} title={`**Payload** *(${new Blob([c.data]).size} bytes)*`}/>
                </Box>
            );
        });

        this.assembly.assembly("any-appendix-asm", (theme, props) => {
            try {
                return (
                    <ReactJson
                        src={
                            (typeof props === 'object' && !Array.isArray(props) && props !== null) ? ({
                                ...props
                            }) : ({
                                data: props
                            })
                        }
                        displayDataTypes={false}
                        displayObjectSize={false}
                        collapsed={true}
                        onEdit={edit => {}}
                        enableClipboard={getOr(this.props.enableClipboard, false)}
                        theme={theme.libraries.reactJson.theme}
                        iconStyle={"square"}
                        style={{
                            whiteSpace: "nowrap",
                            width: "100%",
                            backgroundColor: "transparent"
                        }}
                    />
                );
            } catch (e) {
                return (
                    <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
                        <Text text={`Cannot json-render any-object '${props}'`}/>
                    </InformationBox>
                );
            }
        });

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

    private renderEmptySophisticatedLogHistory() {
        return (
            <PosInCenter fullHeight>
                <Text text={"No logs recorded yet"}/>
            </PosInCenter>
        );
    }

    private renderAppendix(data: LogEntryAppendix): JSX.Element {
        if (this.asmMap.has(data.type)) {
            return this.assembly.render({
               param: data.data,
               component: this.asmMap.get(data.type) as string
            });
        } else {
            return this.assembly.render({
                param: data.data,
                component: this.asmMap.get("any") as string
            });
        }
    }

    private renderSophisticatedLogHistory(t: Themeable.Theme): JSX.Element {
        const history: Array<LogEntry> = App.app().sophisticatedLogHistory;
        if (history.length < 1) {
            return this.renderEmptySophisticatedLogHistory();
        }
        return (
            <FlexBox height={percent(100)} width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                <Box gapY={t.gaps.smallGab} width={percent(100)}>{
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
                                <FlexBox gap={percent(0)} overflowXBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}>
                                    {
                                        log.appendices.length > 0 ? (
                                            log.appendices.map(appendix => this.renderAppendix(appendix))
                                        ) : (
                                            <></>
                                        )
                                    }
                                </FlexBox>
                            </Box>
                        );
                    })
                }</Box>
            </FlexBox>
        );
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
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
                    right={<FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} height={percent(100)}>
                        <Icon icon={<DeleteIcon/>} onClick={() => {
                            App.app().sophisticatedLogHistory = [];
                            this.forceUpdate();
                        }}/>
                        <Separator orientation={Orientation.VERTICAL}/>
                        <Icon icon={<CloseIcon/>} onClick={() => {
                            App.app().callAction("close-main-dialog");
                        }}/>
                    </FlexBox>}
                />
                {this.renderSophisticatedLogHistory(t)}
            </PageV2>
        );
    }
}

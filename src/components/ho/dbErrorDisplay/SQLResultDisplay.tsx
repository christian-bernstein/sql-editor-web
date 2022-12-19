import {BernieComponent} from "../../../logic/BernieComponent";
import {EditorCommandError} from "../../../pages/editor/EditorCommandError";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {FlexBox} from "../../lo/FlexBox";
import {ElementHeader} from "../../lo/ElementHeader";
import {Icon} from "../../lo/Icon";
import {ReactComponent as ErrorIcon} from "../../../assets/icons/ic-20/ic20-alert.svg";
import {ReactComponent as SuccessIcon} from "../../../assets/icons/ic-20/ic20-check.svg";
import {Align} from "../../../logic/style/Align";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {ClientDisplay} from "../clientDisplay/ClientDisplay";
import {Separator} from "../../lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {ReactComponent as DeleteIcon} from "../../../assets/icons/ic-20/ic20-delete.svg";
import {Text, TextType} from "../../lo/Text";
import {ObjectJSONDisplay} from "../objectJSONDisplay/ObjectJSONDisplay";
import {Box} from "../../lo/Box";
import React from "react";
import {getOr} from "../../../logic/Utils";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import {SQLCommandQueryResponsePacketData} from "../../../libs/sql/packets/in/SQLCommandQueryResponsePacketData";
import {SQLCommandUpdateResponsePacketData} from "../../../libs/sql/packets/in/SQLCommandUpdateResponsePacketData";
import {SessionCommandType} from "../../../logic/data/SessionCommandType";

export type SQLResultDisplayProps = {
    error?: EditorCommandError,
    deleteErrorHook?: (error: EditorCommandError) => void,
    deleteIcon?: boolean,

    clearHook?: () => void,

    response?: SQLCommandQueryResponsePacketData | SQLCommandUpdateResponsePacketData
    type?: SessionCommandType,

    height?: DimensionalMeasured
}

export class SQLResultDisplay extends BernieComponent<SQLResultDisplayProps, any, any> {

    private renderUpdateSuccess(): JSX.Element {
        const p = this.props;
        const t = utilizeGlobalTheme();
        const r = p.response as SQLCommandUpdateResponsePacketData;

        return (
            <Box height={p.height} visualMeaning={ObjectVisualMeaning.SUCCESS} opaque width={percent(100)}>
                <FlexBox gap={t.gaps.smallGab}>
                    <ElementHeader title={"Success"} boldHeader wrapIcon icon={
                        <Icon icon={<SuccessIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                    } appendix={
                        <Icon icon={<DeleteIcon/>} onClick={() => {
                            p.clearHook?.();
                        }}/>
                    }/>
                    <Separator orientation={Orientation.HORIZONTAL}/>
                    <Text text={`Update finished after *${r.durationMS} ms* & affected *${r.affected}* dataset${r.affected > 1 ? "s" : ""}.\nReturn code [*${r.code}*]`}/>
                </FlexBox>
            </Box>
        );
    }

    private renderError(): JSX.Element {
        const p = this.props;
        const t = utilizeGlobalTheme();
        const r = p.response as SQLCommandUpdateResponsePacketData | SQLCommandQueryResponsePacketData;
        const error = r.error as EditorCommandError;

        return (
            <Box height={p.height} visualMeaning={ObjectVisualMeaning.ERROR} opaque width={percent(100)}>
                <FlexBox gap={t.gaps.smallGab}>
                    <ElementHeader title={"Error"} boldHeader wrapIcon icon={
                        <Icon icon={<ErrorIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored/>
                    } appendix={
                        <Icon icon={<DeleteIcon/>} onClick={() => {
                            p.clearHook?.();
                        }}/>
                    }/>
                    <Separator orientation={Orientation.HORIZONTAL}/>

                    <Text text={error.title} uppercase bold type={TextType.smallHeader}/>
                    <Text text={error.message}/>

                    <Separator orientation={Orientation.HORIZONTAL}/>

                    {error.exceptions.map(e => {
                        return (
                            <>
                                <FlexBox gap={px()}>
                                    <Text text={"Error type"} type={TextType.secondaryDescription} uppercase bold fontSize={px(12)}/>
                                    <Text text={e.type} fontSize={px(12)}/>
                                </FlexBox>
                                <FlexBox gap={px()}>
                                    <Text text={"Message"} type={TextType.secondaryDescription} uppercase bold fontSize={px(12)}/>
                                    <Text text={e.message} renderMarkdown={false} fontSize={px(12)}/>
                                </FlexBox>
                                {e.data.size > 0 ? (
                                    <ObjectJSONDisplay object={e.data}/>
                                ) : (
                                    <></>
                                )}
                            </>
                        );
                    })}
                </FlexBox>
            </Box>
        )
    }

    private renderQuerySuccess(): JSX.Element {
        const p = this.props;
        const t = utilizeGlobalTheme();
        const r = p.response as SQLCommandQueryResponsePacketData;

        return (
            <Box height={p.height} visualMeaning={ObjectVisualMeaning.SUCCESS} opaque width={percent(100)}>
                <FlexBox gap={t.gaps.smallGab}>
                    <ElementHeader title={"Success"} boldHeader wrapIcon icon={
                        <Icon icon={<SuccessIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                    } appendix={
                        <Icon icon={<DeleteIcon/>} onClick={() => {
                            p.clearHook?.();
                        }}/>
                    }/>
                    <Separator orientation={Orientation.HORIZONTAL}/>
                    <Text text={`Query finished after *${r.durationMS} ms* & returned *${r.rows.length}* datasets.`}/>
                </FlexBox>
            </Box>
        );
    }

    private renderInResponseMode(): JSX.Element {
        const p = this.props;
        const r = p.response as SQLCommandQueryResponsePacketData | SQLCommandUpdateResponsePacketData;

        switch (p.type) {
            case SessionCommandType.PUSH: {
                if (r.success) {
                    return this.renderUpdateSuccess();
                }
                return this.renderError();
            }
            case SessionCommandType.PULL: {
                if (r.success) {
                    return this.renderQuerySuccess();
                }
                return this.renderError();
            }
            default: return <>error</>
        }
    }

    private renderInErrorMode(): JSX.Element {
        const p = this.props;
        const t = utilizeGlobalTheme();
        const error = this.props.error as EditorCommandError;
        const deleteIcon = getOr(p.deleteIcon, true);
        return (
            <Box height={p.height} visualMeaning={ObjectVisualMeaning.ERROR} opaque width={percent(100)}>
                <FlexBox gap={t.gaps.smallGab}>
                    <ElementHeader title={"Error"} boldHeader wrapIcon icon={
                        <Icon icon={<ErrorIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored/>
                    } appendix={
                        <FlexBox height={percent(100)} align={Align.CENTER} flexDir={FlexDirection.ROW} overflowXBehaviour={OverflowBehaviour.SCROLL} gap={t.gaps.smallGab}>
                            <ClientDisplay enableClientBadge={false} clientID={error.client.id}/>
                            {deleteIcon ? (
                                <>
                                    <Separator orientation={Orientation.VERTICAL}/>
                                    <Icon icon={<DeleteIcon/>} onClick={() => {
                                        p.deleteErrorHook?.(error);
                                    }}/>
                                </>
                            ) : (
                                <></>
                            )}
                        </FlexBox>
                    }/>
                    <Separator orientation={Orientation.HORIZONTAL}/>

                    <Text text={error.title} uppercase bold type={TextType.smallHeader}/>
                    <Text text={error.message}/>

                    <Separator orientation={Orientation.HORIZONTAL}/>

                    {error.exceptions.map(e => {
                        return (
                            <>
                                <FlexBox gap={px()}>
                                    <Text text={"Error type"} type={TextType.secondaryDescription} uppercase bold fontSize={px(12)}/>
                                    <Text text={e.type} fontSize={px(12)}/>
                                </FlexBox>
                                <FlexBox gap={px()}>
                                    <Text text={"Message"} type={TextType.secondaryDescription} uppercase bold fontSize={px(12)}/>
                                    <Text text={e.message} renderMarkdown={false} fontSize={px(12)}/>
                                </FlexBox>
                                {e.data.size > 0 ? (
                                    <ObjectJSONDisplay object={e.data}/>
                                ) : (
                                    <></>
                                )}
                            </>
                        );
                    })}
                </FlexBox>
            </Box>
        );
    }

    componentRender(p: SQLResultDisplayProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.error === undefined) {
            return this.renderInResponseMode();
        } else {
            return this.renderInErrorMode();
        }
    }
}

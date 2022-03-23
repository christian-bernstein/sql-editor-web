import {BernieComponent} from "../logic/BernieComponent";
import {EditorCommandError} from "../pages/editor/EditorCommandError";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {DimensionalMeasured, percent, px} from "../logic/style/DimensionalMeasured";
import {FlexBox} from "./FlexBox";
import {ElementHeader} from "./ElementHeader";
import {Icon} from "./Icon";
import {ReactComponent as ErrorIcon} from "../assets/icons/ic-20/ic20-alert.svg";
import {Align} from "../logic/Align";
import {FlexDirection} from "../logic/style/FlexDirection";
import {OverflowBehaviour} from "../logic/style/OverflowBehaviour";
import {ClientDisplay} from "./ClientDisplay";
import {Separator} from "./Separator";
import {Orientation} from "../logic/style/Orientation";
import {ReactComponent as DeleteIcon} from "../assets/icons/ic-20/ic20-delete.svg";
import {Text, TextType} from "./Text";
import {ObjectJSONDisplay} from "./ObjectJSONDisplay";
import {Box} from "./Box";
import React from "react";
import {getOr} from "../logic/Utils";
import {App} from "../logic/App";

export type DBErrorDisplayProps = {
    error: EditorCommandError,
    deleteHook?: (error: EditorCommandError) => void,
    height?: DimensionalMeasured,
    deleteIcon?: boolean
}

export class DBErrorDisplay extends BernieComponent<DBErrorDisplayProps, any, any> {

    componentRender(p: DBErrorDisplayProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const error = p.error;
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
                                         p.deleteHook?.(p.error);
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
}

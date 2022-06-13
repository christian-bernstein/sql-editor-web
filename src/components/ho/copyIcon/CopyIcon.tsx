import React from "react";
import {Text} from "../../lo/Text";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import {getOr, Utils} from "../../../logic/Utils";
import {CustomTooltip} from "../../lo/CustomTooltip";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {If} from "../../logic/If";

export type ContextMenuCopyButtonProps = {
    copyValueProducer: () => string,
    displayValueAsHover?: boolean
}

export const CopyIcon: React.FC<ContextMenuCopyButtonProps> = props => {
    const [copied, setCopied] = React.useState(false);
    const theme = utilizeGlobalTheme();

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (copied) setCopied(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [copied]);

    return (
        <button onClick={() => {
            if (!copied) {
                Utils.copyTextToClipboard(props.copyValueProducer());
                setCopied(true);
            }
        }} style={{
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            appearance: "none",
            padding: 0,
            margin: 0,
            border: 0,
            outline: 0,
            cursor: "pointer",
            backgroundColor: theme.colors.backgroundHighlightColor.css()
        }} children={

            <If condition={getOr(props.displayValueAsHover, true)} ifTrue={
                <CustomTooltip arrow noBorder title={
                    copied ? (
                        <Text text={"Copied"} bold coloredText visualMeaning={ObjectVisualMeaning.SUCCESS}/>
                    ) : (
                        <Text text={props.copyValueProducer()}/>
                    )
                } children={
                    <div style={{position: "relative", height: 16, width: 16}}>
                        <Clippy style={{color: theme.colors.iconColor.css(), position: "absolute", top: 0, left: 0, strokeDasharray: 50, strokeDashoffset: copied ? -50 : 0, transition: "all 300ms ease-in-out"}}/>
                        <Check isVisible={copied} style={{color: theme.colors.primaryHighlightColor.css(), position: "absolute", top: 0, left: 0, strokeDasharray: 50, strokeDashoffset: copied ? 0 : -50, transition: "all 300ms ease-in-out"}}/>
                    </div>
                }/>
            } ifFalse={
                <div style={{position: "relative", height: 16, width: 16}}>
                    <Clippy style={{color: theme.colors.iconColor.css(), position: "absolute", top: 0, left: 0, strokeDasharray: 50, strokeDashoffset: copied ? -50 : 0, transition: "all 300ms ease-in-out"}}/>
                    <Check isVisible={copied} style={{color: theme.colors.primaryHighlightColor.css(), position: "absolute", top: 0, left: 0, strokeDasharray: 50, strokeDashoffset: copied ? 0 : -50, transition: "all 300ms ease-in-out"}}/>
                </div>
            }/>
        }/>
    );

    // return (
    //     <Button onClick={() => setCopied(true)}>
    //         <div style={{position: "relative", height: 16, width: 16}}>
    //             <Clippy style={{color: theme.colors.iconColor.css(), position: "absolute", top: 0, left: 0, strokeDasharray: 50, strokeDashoffset: copied ? -50 : 0, transition: "all 300ms ease-in-out"}}/>
    //             <Check isVisible={copied} style={{color: theme.colors.primaryHighlightColor.css(), position: "absolute", top: 0, left: 0, strokeDasharray: 50, strokeDashoffset: copied ? 0 : -50, transition: "all 300ms ease-in-out"}}/>
    //         </div>
    //     </Button>
    // );

    // return (
    //     <Button bgColorOnDefault={false} border={false} visualMeaning={ObjectVisualMeaning.ERROR} width={percent(100)} onClick={() => setCopied(true)}>
    //         <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)}>
    //             <Text text={`Copy project ID`}/>
    //             <div style={{
    //                     position: "relative",
    //                     height: 16,
    //                     width: 16
    //                 }}>
    //                 <Clippy style={{
    //                         color: "red",
    //                         position: "absolute",
    //                         top: 0,
    //                         left: 0,
    //                         strokeDasharray: 50,
    //                         strokeDashoffset: copied ? -50 : 0,
    //                         transition: "all 300ms ease-in-out"
    //                     }}/>
    //                 <Check isVisible={copied} style={{
    //                         color: "green",
    //                         position: "absolute",
    //                         top: 0,
    //                         left: 0,
    //                         strokeDasharray: 50,
    //                         strokeDashoffset: copied ? 0 : -50,
    //                         transition: "all 300ms ease-in-out"
    //                     }}/>
    //             </div>
    //         </FlexBox>
    //     </Button>
    // );
}

export const Clippy: React.FC<any> = props => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5.75 4.75H10.25V1.75H5.75V4.75Z"/>
            <path
                d="M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379"/>
        </svg>
    );
}

export const Check: React.FC<any> = props => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M13.25 4.75L6 12L2.75 8.75"/>
        </svg>
    );
}


import React, {CSSProperties} from "react";
import {Tooltip, tooltipClasses, TooltipProps, Zoom} from "@mui/material";
import styled from "styled-components";
import {Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {ContextCompound} from "../ho/contextCompound/ContextCompound";
import {px} from "../../logic/style/DimensionalMeasured";

export type CustomTooltipProps = {
    noPadding?: boolean,
    noBorder?: boolean,
    wrapperStyle?: CSSProperties
}

// noinspection RequiredAttributes
export const CustomTooltip = styled(({ className, ...props }: TooltipProps & CustomTooltipProps) => (
    <ContextCompound wrapperStyle={props.wrapperStyle} clickType={"double"} wrapMenu={false} menu={<>{props.title}</>}>
        <Tooltip {...props} classes={{ popper: className }} TransitionComponent={Zoom}/>
    </ContextCompound>
))((props) => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    return ({
        [`& .${tooltipClasses.tooltip}`]: {
            // backgroundColor: theme.colors.tooltipBackgroundColor.css() + " !important",
            // borderRadius: theme.radii.defaultObjectRadius.withPlus(1).css(),
            borderRadius: theme.radii.defaultObjectRadius.withPlus(-2).css(),
            color: "#DEDFE0",
            backgroundColor: theme.colors.tooltipBackgroundColor.css(),
            // maxWidth: 220,
            maxWidth: 500,
            fontSize: 12,
            fontFamily: "OperatorMono",
            padding: props.noPadding ? '0' : `${px(10)} ${theme.gaps.defaultGab.css()}`,
            border: (props.noBorder ?? true) ? 'none' : `1px solid ${theme.colors.borderPrimaryColor.css()}`,
            boxShadow: "0px 0px 30px 0px rgba(20, 20, 20, .5)"
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.colors.tooltipBackgroundColor.css(),
        }
    });
});

import React from "react";
import {Tooltip, tooltipClasses, TooltipProps, Zoom} from "@mui/material";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {ContextCompound} from "./ContextCompound";

export type CustomTooltipProps = {
    noPadding?: boolean,
    noBorder?: boolean,
}

// noinspection RequiredAttributes
export const CustomTooltip = styled(({ className, ...props }: TooltipProps & CustomTooltipProps) => (
    <ContextCompound clickType={"double"} wrapMenu={false} menu={<>{props.title}</>}>
        <Tooltip {...props} classes={{ popper: className }} TransitionComponent={Zoom}/>
    </ContextCompound>
))((props) => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    return ({
        [`& .${tooltipClasses.tooltip}`]: {
            // backgroundColor: theme.colors.tooltipBackgroundColor.css() + " !important",
            borderRadius: theme.radii.defaultObjectRadius.withPlus(1).css(),
            color: "#DEDFE0",
            backgroundColor: theme.colors.tooltipBackgroundColor.css(),
            // maxWidth: 220,
            maxWidth: 500,
            fontSize: 12,
            fontFamily: "OperatorMono",
            padding: props.noPadding ? '0' : 'auto',
            border: props.noBorder ? 'none' : `1px solid ${theme.colors.borderPrimaryColor.css()}`,
            boxShadow: "0px 0px 30px 0px rgba(20, 20, 20, .5)"
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.colors.tooltipBackgroundColor.css(),
        }
    });
});

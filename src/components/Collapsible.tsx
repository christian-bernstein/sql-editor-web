import {BernieComponent} from "../logic/BernieComponent";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {Icon} from "./Icon";
import {ReactComponent as ExpandIcon} from "../assets/icons/ic-20/ic20-chevron-down.svg";
import {percent, px} from "../logic/style/DimensionalMeasured";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/style/FlexDirection";
import React from "react";
import {getOr} from "../logic/Utils";
import {If} from "./If";
import {OverflowBehaviour} from "../logic/style/OverflowBehaviour";
import {Box} from "./Box";

export type CollapsibleProps = {
    header: (t: Themeable.Theme, a: Assembly) => JSX.Element,
    content: (t: Themeable.Theme, a: Assembly) => JSX.Element,
    disableFlexboxWrapper?: boolean
}

export class Collapsible extends BernieComponent<CollapsibleProps, any, any> {

    componentRender(p: CollapsibleProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const disableFlexboxWrapper = getOr(p.disableFlexboxWrapper, false);

        return (
            <Box noPadding overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN} width={percent(100)}>
                <Accordion sx={{
                    background: t.colors.backgroundHighlightColor200.css(),
                    '& .MuiAccordionSummary-root': {
                        minHeight: "0 !important",
                        paddingY: t.paddings.defaultObjectPadding.css()
                    }
                }}>
                    <AccordionSummary
                        expandIcon={<Icon icon={<ExpandIcon/>} size={px(16)}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        children={p.header(t, a)}
                        sx={{
                            '.MuiAccordionSummary-content': {
                                margin: "0 !important",
                            }
                        }}
                    />
                    <AccordionDetails>
                        <If condition={disableFlexboxWrapper} ifFalse={
                            <FlexBox flexDir={FlexDirection.COLUMN} gap={t.gaps.smallGab} height={percent(100)} width={percent(100)} children={p.content(t, a)}/>
                        } ifTrue={
                            p.content(t, a)
                        }/>
                    </AccordionDetails>
                </Accordion>
            </Box>
        );
    }
}

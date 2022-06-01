import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {FormControl, MenuItem, Select as MUISelect} from "@mui/material";
import React from "react";
import {Text} from "./Text";

export type SelectElement = {
    value: any,
    renderer?: (value: any, selected: boolean) => JSX.Element
}

export type SelectProps = {
    elements: () => Array<SelectElement>,
    onChange: (value: any) => void,
    initialValue: any
}

export class Select extends BernieComponent<SelectProps, any, any> {

    // <MenuItem value={30}>Thirty</MenuItem>
    componentRender(p: SelectProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FormControl sx={{width: "100%"}} size="small">
                <MUISelect value={p.initialValue} sx={{
                    backgroundColor: t.colors.backgroundHighlightColor200.css(),
                    color: t.colors.fontPrimaryColor.css(),
                    '& .MuiSvgIcon-root': {
                        fill: `${t.colors.iconColor.css()} !important`
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: `1px solid ${t.colors.borderPrimaryColor.css()} !important`,
                    },
                    ".MuiList-root + &": {
                        backgroundColor: "red !important"
                    }
                }} onChange={(event) => {
                    this.props.onChange(event.target.value);
                }}>
                    {
                        p.elements().map(element => {
                            if (element.renderer === undefined) {
                                return (
                                    <MenuItem sx={{
                                        backgroundColor: t.colors.backgroundHighlightColor200.css(),
                                        color: t.colors.fontPrimaryColor.css(),
                                        '&:hover': {
                                            backgroundColor: `${t.colors.backgroundHighlightColor200.css()} !important`,
                                            filter: "brightness(120%)"
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: `${t.colors.backgroundHighlightColor200.css()} !important`,
                                            filter: "brightness(130%)"
                                        }
                                    }} value={element.value}>
                                        <Text text={String(element.value)}/>
                                    </MenuItem>
                                );
                            } else {
                                return element.renderer(element.value, element.value === p.initialValue);
                            }
                        })
                    }
                </MUISelect>
            </FormControl>
        );
    }
}

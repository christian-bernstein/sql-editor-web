import React from "react";
import {Menu} from "@mui/material";
import {Button} from "./Button";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {percent} from "../logic/DimensionalMeasured";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {FlexBox} from "./FlexBox";
import styled from "styled-components";
import {Separator} from "./Separator";
import {Text} from "./Text";
import {Cursor} from "../logic/style/Cursor";

export type ContextMenuProps = {
}

export type ContextMenuState = {
    open: boolean,
    anchorEl?: HTMLDivElement
}

export class ContextCompound extends React.Component<ContextMenuProps, ContextMenuState> {

    constructor(props: ContextMenuProps) {
        super(props);
        this.state = {
            open: false,
            anchorEl: undefined
        };
    }

    private handleChildrenClick(event: React.MouseEvent<HTMLDivElement>) {
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }

    private handleClose() {
        this.setState({
            open: false,
            anchorEl: undefined
        });
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const MenuWrapper = styled.div`
          padding: ${theme.paddings.defaultButtonPadding.css()};
        `;
        return (
            <div>
                <div onClick={event => this.handleChildrenClick(event)}>
                    {this.props.children}
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: theme.colors.backgroundHighlightColor.css() + " !important",
                            borderRadius: theme.radii.defaultObjectRadius.css(),
                            border: "1px solid " + theme.colors.borderPrimaryColor.css(),
                            color: theme.colors.fontPrimaryColor.css(),
                        },
                        '& .MuiList-root': {
                            padding: 0
                        }
                    }}
                    onClose={() => this.handleClose()}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuWrapper>
                        <FlexBox gap={theme.gaps.smallGab}>
                            <Button shrinkOnClick={true} width={percent(100)} visualMeaning={ObjectVisualMeaning.SUCCESS} opaque={true}>
                                Delete
                            </Button>
                            <Button shrinkOnClick={true} width={percent(100)} visualMeaning={ObjectVisualMeaning.ERROR} opaque={true}>
                                <Text text={"Delete project"} cursor={Cursor.pointer}/>
                            </Button>
                        </FlexBox>
                    </MenuWrapper>
                </Menu>
            </div>
        );
    }
}

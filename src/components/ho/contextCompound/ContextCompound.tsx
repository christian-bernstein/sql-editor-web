import React, {CSSProperties} from "react";
import {Menu} from "@mui/material";
import {Themeable} from "../../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import styled from "styled-components";
import {getOr} from "../../../logic/Utils";
import {If} from "../../logic/If";
import {DimensionalMeasured} from "../../../logic/style/DimensionalMeasured";

export type ContextMenuProps = {
    menu?: JSX.Element,
    clickType?: "single" | "double",
    wrapMenu?: boolean,
    wrapperStyle?: CSSProperties,
    width?: DimensionalMeasured,
    onClose?: () => void,
    open?: boolean
}

export type ContextMenuState = {
    open: boolean,
    anchorEl?: HTMLDivElement
}

export class ContextCompound extends React.Component<ContextMenuProps, ContextMenuState> {

    constructor(props: ContextMenuProps) {
        super(props);
        this.state = {
            open: getOr(props.open, false),
            anchorEl: undefined
        };
    }

    private handleChildrenClick(event: React.MouseEvent<HTMLDivElement>) {
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        }, () => {
            this.props.onClose?.();
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
        const clickType = getOr(this.props.clickType, "single");
        const wrapMenu = getOr(this.props.wrapMenu, true);
        const MenuWrapper = styled.div`
          padding: ${theme.paddings.defaultButtonPadding.css()};
        `;
        return (
            <div style={getOr(this.props.wrapperStyle, {})}>
                <div
                    onDoubleClick={event => {
                        if (clickType === "double") {
                            this.handleChildrenClick(event);
                        }
                    }}
                    onClick={event => {
                        if (clickType === "single") {
                            this.handleChildrenClick(event);
                        }
                    }}>
                    {this.props.children}
                </div>
                <Menu
                    id="basic-menu"
                    anchorOrigin={{
                        horizontal: "right",
                        vertical: "bottom"
                    }}
                    transitionDuration={{
                        appear: 0,
                        enter: 100,
                        exit: 100
                }}
                    anchorReference={"anchorEl"}
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    sx={{
                        '& .MuiPaper-root': {
                            width: this.props.width?.css(),

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
                    <If condition={wrapMenu} ifTrue={
                        <MenuWrapper>
                            {this.props.menu ? this.props.menu : <></>}
                        </MenuWrapper>
                    } ifFalse={
                        this.props.menu ? this.props.menu : <></>
                    }/>

                </Menu>
            </div>
        );
    }
}

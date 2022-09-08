import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Align} from "../../../logic/style/Align";
import {Box} from "../../lo/Box";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Flex} from "../../lo/FlexBox";
import React from "react";
import {NavHeader} from "../navHeader/NavHeader";
import {Text, TextType} from "../../lo/Text";
import {createMargin} from "../../../logic/style/Margin";
import styled from "styled-components";
import {getOr} from "../../../logic/Utils";
import {Drawer, SwipeableDrawer} from "@mui/material";
import {Justify} from "../../../logic/style/Justify";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {AF} from "../../logic/ArrayFragment";
import {Separator} from "../../lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Button} from "../../lo/Button";
import {DrawerHeader} from "../../lo/DrawerHeader";
import {Input} from "../../lo/Input";

export interface BoardingActionDrawerRenderer {
    render(component: BoardingActionsDrawer, theme: Themeable.Theme): JSX.Element
}

export type BoardingActionsDrawerLocalState = {
    currentAction: string | "none"
}

export class BoardingActionsDrawer extends BC<any, any, BoardingActionsDrawerLocalState> {

    private static readonly actionDrawerRenderers = new Map<string, BoardingActionDrawerRenderer>([
        ["login", {
            render(component: BoardingActionsDrawer, theme: Themeable.Theme): JSX.Element {
                return (
                    <Flex fw align={Align.CENTER} elements={[
                        <DrawerHeader
                            header={"Login to SQL-Editor"}
                            enableBadge
                            badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                            badgeText={"Login"}
                            description={"Login to the SQL-Editor, using your credentials."}
                        />,

                        <Flex fw gap={theme.gaps.smallGab} margin={createMargin(40, 0, 10, 0)} elements={[
                            <Input width={percent(100)} placeholder={"Username"}/>,
                            <Input width={percent(100)} placeholder={"Password"}/>,
                            <Flex fw align={Align.CENTER} padding={false} paddingY={px()} paddingX={px(20)} elements={[
                                <Button text={"Login"} width={percent(100)} opaque visualMeaning={VM.SUCCESS}/>,
                            ]}/>
                        ]}/>
                    ]}/>
                );
            }
        }]
    ]);

    constructor() {
        super(undefined, undefined, {
            currentAction: "none"
        });
    }

    private switchActionDialog(to?: string) {
        if (this.local.state.currentAction === "none") {

            // Open the dialog
            this.local.setStateWithChannels({
                currentAction: getOr(to, "none")
            }, ["action", "action-display"]);
        } else {

            // Close an existing dialog and open the new one
            this.local.setStateWithChannels({
                currentAction: "none"
            }, ["action", "action-display"], () => {

                setTimeout(() => {
                    this.local.setStateWithChannels({
                        currentAction: getOr(to, "none")
                    }, ["action", "action-display"])
                }, 200);
            });
        }
    }

    componentRender(p: any, s: any, l: BoardingActionsDrawerLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw gap={px(0)} align={Align.CENTER} elements={[
                this.component(local => {
                    const Puller = styled.div`
                      width: 25%;
                      height: 6px;
                      border-radius: 50px;
                      background-color: ${t.colors.backgroundHighlightInputColor.css()};
                    `;

                    return (
                        <SwipeableDrawer open={local.state.currentAction !== "none"} id={"BoardingActionsDrawer"} key={"BoardingActionsDrawer"} anchor={"bottom"} variant={"persistent"} keepMounted closeAfterTransition hideBackdrop onOpen={() => {}} onClose={() => {
                            this.local.setStateWithChannels({
                                currentAction: "none"
                            }, ["action", "action-display"]);
                        }} sx={{
                            '& .MuiDrawer-paper': {
                                bottom: "108px",
                                zIndex: 10,
                                boxSizing: 'border-box',
                                background: "transparent",
                                boxShadow: "none",
                            }
                        }} children={
                            <Flex height={percent(100)} fw justifyContent={Justify.FLEX_END} align={Align.CENTER} elements={[
                                <Box borderless width={percent(100)} maxHeight={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} borderRadiiConfig={{
                                    enableCustomBorderRadii: true,
                                    bottomRight: px(),
                                    bottomLeft: px()
                                }} children={
                                    <Flex width={percent(100)} align={Align.CENTER} children={
                                        <AF elements={[
                                            <Puller/>,

                                            BoardingActionsDrawer.actionDrawerRenderers
                                                .get(local.state.currentAction)
                                                ?.render(this, t)
                                        ]}/>
                                    }/>
                                }/>,
                            ]}/>
                        }/>
                    );
                }, "action-display"),

                <Box style={{ zIndex: 1500 }} width={percent(100)} noPadding borderless borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px() }} children={
                    <Flex margin={createMargin(7, 0, 0, 0)} fw align={Align.CENTER} elements={[
                        this.component(local => (
                            <NavHeader bypassOnChangeFilter element={local.state.currentAction} elements={new Map<string, (nav: NavHeader) => JSX.Element>([
                                ["resume", nav => <Text text={"Resume"}/>],
                                ["login", nav => <Text text={"Login"}/>],
                                ["sign-up", nav => <Text text={"Sign up"}/>],
                            ])} onChange={(from, to) => {
                                if (from === to) {
                                    this.switchActionDialog();
                                } else {
                                    this.switchActionDialog(to);
                                }
                            }}/>
                        ), "action")
                    ]}/>
                }/>,

                <Separator orientation={Orientation.HORIZONTAL} style={{
                    zIndex: 1500
                }}/>
            ]}/>
        );
    }
}

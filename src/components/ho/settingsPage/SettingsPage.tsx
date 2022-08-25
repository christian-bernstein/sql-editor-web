import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Screen} from "../../lo/Page";
import {FlexBox} from "../../lo/FlexBox";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Dimension} from "../../../logic/style/Dimension";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {SwipeableDrawer} from "@mui/material";
import {Text, TextType} from "../../lo/Text";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import React from "react";
import {AF} from "../../logic/ArrayFragment";
import {Align} from "../../../logic/style/Align";
import {If} from "../../logic/If";
import {LiteGrid} from "../../lo/LiteGrid";
import {Justify} from "../../../logic/style/Justify";
import {createMargin} from "../../../logic/style/Margin";
import {Icon} from "../../lo/Icon";
import {ReactComponent as BackIcon} from "../../../assets/icons/ic-16/ic16-chevron-left.svg";
import {Cursor} from "../../../logic/style/Cursor";

export type SettingsPageProps = {
    parentPageName?: string,
    pageName: string,
    description?: string,
    headerAppendix?: (page: SettingsPage) => JSX.Element,
    onExit: (page: SettingsPage) => void,
    componentDidMount?: (page: SettingsPage) => void,
    content: (page: SettingsPage) => JSX.Element
}

export type SettingsPageLocalState = {
    openSubpageDialog: boolean,
    generator?: (page: SettingsPage) => JSX.Element
}

export class SettingsPage extends BernieComponent<SettingsPageProps, any, SettingsPageLocalState> {

    constructor(props: SettingsPageProps) {
        super(props, undefined, {
            openSubpageDialog: false
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.componentDidMount?.(this);
    }

    public subpage(generator: (page: SettingsPage) => JSX.Element) {
        this.local.setStateWithChannels({
            openSubpageDialog: true,
            generator: generator
        }, ["subpage-dialog"]);
    }

    public closeSubpage() {
        this.local.setStateWithChannels({
            openSubpageDialog: false,
        }, ["subpage-dialog"]);
    }

    private renderSubpageDialog(): JSX.Element {
        return (
            <SwipeableDrawer
                id={"settings-page-subpage-dialog"}
                key={"settings-page-subpage-dialog"}
                anchor={"right"}
                open={this.local.state.openSubpageDialog}
                keepMounted
                onOpen={() => {
                    this.local.setStateWithChannels({
                        openSubpageDialog: true
                    }, ["subpage-dialog"]);
                }}
                onClose={() => {
                    this.local.setStateWithChannels({
                        openSubpageDialog: false
                    }, ["subpage-dialog"]);
                }} sx={{
                '& .MuiPaper-root': {
                    background: "transparent",
                    boxShadow: "none"
                },
                '& .MuiDialog-paper': {
                    background: "red",
                    maxHeight: "100vh !important",
                    maxWidth: "100vw !important",
                    margin: "0 !important",
                    borderRadius: "0 !important"
                }
            }} children={
                this.local.state.generator?.(this)
            }/>
        );
    }

    componentRender(p: SettingsPageProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <AF elements={[
                this.component(() => this.renderSubpageDialog(), "subpage-dialog"),
                <Screen style={{width: "100vw"}} children={
                    <FlexBox width={percent(100)} height={DimensionalMeasured.of(100, Dimension.vh)} overflowYBehaviour={OverflowBehaviour.HIDDEN}>


                        <FlexBox width={percent(100)} style={{flex: "0 1 auto"}} gap={t.gaps.smallGab} align={Align.CENTER} margin={createMargin(0, 0, 40, 0)}>

                            <LiteGrid columns={3}>
                                <FlexBox width={percent(100)} justifyContent={Justify.CENTER}>
                                    <If condition={p.parentPageName !== undefined} ifTrue={
                                        <Text enableLeftAppendix leftAppendix={
                                            <Icon icon={<BackIcon/>} colored visualMeaning={ObjectVisualMeaning.INFO} size={px(16)}/>
                                        } text={p.parentPageName as string} cursor={Cursor.pointer} coloredText visualMeaning={ObjectVisualMeaning.INFO} onClick={() => {
                                            p.onExit(this);
                                        }}/>
                                    }/>
                                </FlexBox>
                                <FlexBox width={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER}>
                                    <Text text={p.pageName} whitespace={"nowrap"} type={TextType.smallHeader}/>
                                </FlexBox>
                                <FlexBox width={percent(100)} justifyContent={Justify.CENTER} align={Align.END}>
                                    {p.headerAppendix?.(this)}
                                </FlexBox>
                            </LiteGrid>


                            <If condition={p.description !== undefined} ifTrue={
                                <Text text={p.description as string} align={Align.CENTER} type={TextType.secondaryDescription} fontSize={px(11)}/>
                            }/>
                        </FlexBox>



                        <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} style={{flex: "1 1 auto"}}>
                            <FlexBox width={percent(100)} height={percent(100)} children={p.content(this)}/>
                        </FlexBox>
                    </FlexBox>
                }/>
            ]}/>
        );
    }
}

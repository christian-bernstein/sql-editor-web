import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {TitledBox} from "../../lo/TitledBox";
import {FlexBox} from "../../lo/FlexBox";
import {ElementHeader} from "../../lo/ElementHeader";
import {ReactComponent as CloseIcon} from "../../../../../assets/icons/ic-20/ic20-chevron-down.svg";
import {ReactComponent as ExitIcon} from "../../../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as OpenIcon} from "../../../../../assets/icons/ic-20/ic20-chevron-right.svg";
import {ReactComponent as LoadIcon} from "../../../../../assets/icons/ic-20/ic20-arrow-right.svg";
import {Icon} from "../../lo/Icon";
import {ReactComponent as ContextIcon} from "../../../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ContextCompound} from "../contextCompound/ContextCompound";
import React from "react";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {ContextMenuElement} from "../../lo/ContextMenuElement";
import {Badge} from "../../lo/Badge";
import {ReactComponent as EditIcon} from "../../../../../assets/icons/ic-20/ic20-edit.svg";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {ReactComponent as DeleteIcon} from "../../../../../assets/icons/ic-20/ic20-delete.svg";
import {Separator} from "../../lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {ProjectInfoData} from "../../../logic/data/ProjectInfoData";
import {If} from "../../logic/If";
import {Text, TextType} from "../../lo/Text";
import {NavHeader} from "../navHeader/NavHeader";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {CustomTooltip} from "../../lo/CustomTooltip";
import {Justify} from "../../../logic/style/Justify";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {SVG} from "../../../logic/misc/SVG";
import {ReactComponent as CalenderIcon} from "../../../../../assets/icons/ic-20/ic20-calendar-edit.svg";
import {ReactComponent as FileIcon} from "../../../../../assets/icons/ic-20/ic20-file-add.svg";
import {Utils} from "../../../logic/Utils";
import {ReactComponent as TagsIcon} from "../../../../../assets/icons/ic-20/ic20-tag.svg";
import {ReactComponent as UserIcon} from "../../../../../assets/icons/ic-20/ic20-user.svg";
import moment from "moment";
import {Button} from "../../lo/Button";
import {Cursor} from "../../../logic/style/Cursor";
import {ProjectPreviewContext} from "./ProjectPreviewContext";
import {Dimension} from "../../../logic/style/Dimension";
import {App} from "../../../logic/app/App";
import {Constants} from "../../../logic/misc/Constants";
import {Default, Mobile} from "../../logic/Media";
import {Screen} from "../../lo/Page";
import {AppHeader} from "../../lo/AppHeader";

export type ProjectPreviewProps = {
    data: ProjectInfoData,
    ctx: ProjectPreviewContext
}

export type ProjectPreviewLocalState = {
    body: string
}

export class ProjectPreview extends BernieComponent<ProjectPreviewProps, any, ProjectPreviewLocalState> {

    constructor(props: ProjectPreviewProps) {
        super(props, undefined, {
            body: "default"
        });
    }

    init() {
        super.init();
        this.headerDesktopAssembly();
        this.headerMobileAssembly();
        this.bodyMobileAssembly();
    }

    private headerMobileAssembly() {
        this.assembly.assembly("header-mobile", (theme, instance: TitledBox) => {
            return (
                <FlexBox>
                    {/*icon={
                    <Icon size={px(16)} onClick={() => instance.toggleBody()} icon={
                        <If condition={instance.local.state.showBody} ifTrue={
                            <CloseIcon/>
                        } ifFalse={
                            <OpenIcon/>
                        }/>
                    }/>
                }*/}
                    <ElementHeader title={"SES internal infrastructure db"} appendix={
                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                            <ContextCompound menu={
                                <FlexBox gap={px(1)}>
                                    <ContextMenuElement title={"Edit project"} titleAppendix={() => Badge.beta(theme)} icon={() => <Icon icon={<EditIcon/>} size={px(16)}/>}/>
                                    <ContextMenuElement title={"Delete project"} visualMeaning={ObjectVisualMeaning.ERROR} icon={() => <Icon icon={<DeleteIcon/>} size={px(16)}/>}/>
                                    <Separator orientation={Orientation.HORIZONTAL}/>
                                    <ContextMenuElement title={"Copy project ID"}/>
                                </FlexBox>
                            } children={
                                <CustomTooltip arrow title={
                                    <Text text={"Advanced options"}/>
                                } children={
                                    <span children={
                                        <Icon icon={<ContextIcon/>}/>
                                    }/>
                                }/>
                            }/>
                        </FlexBox>
                    }/>
                    <If condition={instance.local.state.showBody} ifTrue={
                        <NavHeader element={this.local.state.body} elements={new Map<string, (navInstance: NavHeader) => JSX.Element>([
                            ["default", navInstance => <Text text={"Overview"}/>],
                            ["details", navInstance => <Text text={"Details"}/>],
                        ])} onChange={(from, to) => this.local.setStateWithChannels({
                            body: to,
                        }, ["container"], () => instance.switchBodyRenderer(to))}/>
                    }/>
                </FlexBox>
            );
        });
    }

    private headerDesktopAssembly() {
        this.assembly.assembly("header-desktop", (theme, instance: TitledBox) => {
            return (
                <FlexBox>
                    <ElementHeader icon={
                        <Icon size={px(16)} onClick={() => instance.toggleBody()} icon={
                            <If condition={instance.local.state.showBody} ifTrue={
                                <CloseIcon/>
                            } ifFalse={
                                <OpenIcon/>
                            }/>
                        }/>
                    } title={"SES internal infrastructure db"} appendix={
                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                            <ContextCompound menu={
                                <FlexBox gap={px(1)}>
                                    <ContextMenuElement title={"Edit project"} titleAppendix={() => Badge.beta(theme)} icon={() => <Icon icon={<EditIcon/>} size={px(16)}/>}/>
                                    <ContextMenuElement title={"Delete project"} visualMeaning={ObjectVisualMeaning.ERROR} icon={() => <Icon icon={<DeleteIcon/>} size={px(16)}/>}/>
                                    <Separator orientation={Orientation.HORIZONTAL}/>
                                    <ContextMenuElement title={"Copy project ID"}/>
                                </FlexBox>
                            } children={
                                <CustomTooltip arrow title={
                                    <Text text={"Advanced options"}/>
                                } children={
                                    <span children={
                                        <Icon icon={<ContextIcon/>}/>
                                    }/>
                                }/>
                            }/>
                        </FlexBox>
                    }/>
                    <If condition={instance.local.state.showBody} ifTrue={
                        <NavHeader element={this.local.state.body} elements={new Map<string, (navInstance: NavHeader) => JSX.Element>([
                            ["default", navInstance => <Text text={"Overview"}/>],
                            ["details", navInstance => <Text text={"Details"}/>],
                        ])} onChange={(from, to) => this.local.setStateWithChannels({
                            body: to,
                        }, ["container"], () => instance.switchBodyRenderer(to))}/>
                    }/>
                </FlexBox>
            );
        });
    }

    private bodyMobileAssembly() {
        this.assembly.assembly("body-mobile", (theme, props) => {
            return (
                <>
                    <Screen>
                        <AppHeader title={"Project preview"} right={
                            <Icon icon={<ExitIcon/>} onClick={() => {
                                App.app().callAction("close-main-dialog");
                            }}/>
                        }/>
                        <TitledBox height={percent(100)} width={percent(100)} showFooter={true} showBody={true} titleRenderer={instance => this.a("header-mobile", instance)} body={this.local.state.body} bodyRenderers={new Map<string, (instance: TitledBox) => JSX.Element>([
                            ["default", instance => {
                                return (
                                    <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} gap={theme.gaps.defaultGab}>
                                        <FlexBox gap={theme.gaps.smallGab}>
                                            <Text text={"**Description**:"} type={TextType.smallHeader}/>
                                            <Text text={this.props.data.description}/>
                                        </FlexBox>
                                    </FlexBox>
                                );
                            }],
                            ["details", instance => {
                                return (
                                    <FlexBox width={percent(100)}>
                                        <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} width={percent(100)} align={Align.CENTER} gap={theme.gaps.smallGab}>
                                            <Icon icon={SVG.circle()} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                            <Text text={"Lifecycle state: "} type={TextType.secondaryDescription}/>
                                            {/* todo: load a real value & make this a component */}
                                            <Text text={"N/A"} bold coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                                        </FlexBox>
                                        <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                            <Icon icon={<CalenderIcon/>}/>
                                            <Text text={"Last edited: "} type={TextType.secondaryDescription}/>
                                            <Text text={String(this.props.data.lastEdited)}/>
                                        </FlexBox>
                                        {this.component(local => {
                                            const fileSize = 454;
                                            if (fileSize === undefined) {
                                                return  (
                                                    <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                                        <Icon icon={<FileIcon/>}/>
                                                        <Text text={"File size: "} type={TextType.secondaryDescription}/>
                                                        <Text text={"N/A"} bold coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                                                    </FlexBox>
                                                );
                                            } else {
                                                const [size, unit] = Utils.humanFileSize(fileSize).split(' ');
                                                return (
                                                    <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                                        <Icon icon={<FileIcon/>}/>
                                                        <Text text={"File size: "} type={TextType.secondaryDescription}/>
                                                        <Text text={`${size} ${unit}`}/>
                                                    </FlexBox>
                                                );
                                            }
                                        }, "file_size")}

                                        <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                            <Icon icon={<TagsIcon/>}/>
                                            <Text text={"Internal tags: "} type={TextType.secondaryDescription}/>
                                            <Text text={String(this.props.data.internalTags.join(", "))}/>
                                        </FlexBox>

                                        <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                            <Icon icon={<UserIcon/>}/>
                                            <Text text={"Creator: "} type={TextType.secondaryDescription}/>
                                            {/* <ClientDisplay clientID={this.props.data.creatorUserID} enableClientBadge={false}/> */}
                                        </FlexBox>
                                    </FlexBox>
                                );
                            }]
                        ])} footer={instance => {
                            return (
                                <FlexBox flexDir={FlexDirection.ROW_REVERSE} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)}>
                                    {/*<FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                                        <Text text={"Lifecycle state: "} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                        <Text text={"online"} bold coloredText visualMeaning={ObjectVisualMeaning.INFO}/>
                                    </FlexBox>*/}

                                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)} height={percent(100)} justifyContent={Justify.FLEX_END}>
                                        <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                                            <Text text={"Last edited"} type={TextType.secondaryDescription} whitespace={"nowrap"}/>
                                            <Text text={moment(this.props.data.lastEdited, "YYYY-MM-DD[T]HH:mm:ss").fromNow()} type={TextType.secondaryDescription} whitespace={"nowrap"}/>
                                        </FlexBox>

                                        <CustomTooltip arrow title={
                                            <Text text={"Load project & start editor"}/>
                                        } children={
                                            <span children={
                                                <Button
                                                    bgColorOnDefault={false}
                                                    visualMeaning={ObjectVisualMeaning.INFO}
                                                    opaque
                                                    border={false}
                                                    padding={px(5)}
                                                    onClick={() => {
                                                        App.app().callAction("close-main-dialog");


                                                        // this.props.ctx.onSelect(this.props.data);
                                                    }}
                                                    children={
                                                        <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                                            <Text text={"Start editor"} whitespace={"nowrap"} uppercase coloredText={true} cursor={Cursor.pointer} visualMeaning={ObjectVisualMeaning.INFO}/>
                                                            <Icon icon={<LoadIcon/>} colored visualMeaning={ObjectVisualMeaning.INFO}/>
                                                        </FlexBox>
                                                    }
                                                />
                                            }/>
                                        }/>
                                    </FlexBox>
                                </FlexBox>
                            );
                        }}/>
                    </Screen>

                </>
            );
        });
    }

    componentRender(p: ProjectPreviewProps, s: any, l: ProjectPreviewLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => {

            return (
                <>
                    <Default children={
                        <TitledBox height={DimensionalMeasured.of(70, Dimension.vh)} width={DimensionalMeasured.of(50, Dimension.vw)} showFooter={true} showBody={true} titleRenderer={instance => this.a("header-desktop", instance)} body={local.state.body} bodyRenderers={new Map<string, (instance: TitledBox) => JSX.Element>([
                            ["default", instance => {
                                return (
                                    <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} gap={t.gaps.defaultGab}>
                                        <FlexBox gap={t.gaps.smallGab}>
                                            <Text text={"**Description**:"} type={TextType.smallHeader}/>
                                            <Text text={this.props.data.description}/>
                                        </FlexBox>
                                    </FlexBox>
                                );
                            }],
                            ["details", instance => {
                                return (
                                    <FlexBox width={percent(100)}>
                                        <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} width={percent(100)} align={Align.CENTER} gap={t.gaps.smallGab}>
                                            <Icon icon={SVG.circle()} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                            <Text text={"Lifecycle state: "} type={TextType.secondaryDescription}/>
                                            {/* todo: load a real value & make this a component */}
                                            <Text text={"N/A"} bold coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                                        </FlexBox>
                                        <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                            <Icon icon={<CalenderIcon/>}/>
                                            <Text text={"Last edited: "} type={TextType.secondaryDescription}/>
                                            <Text text={String(this.props.data.lastEdited)}/>
                                        </FlexBox>
                                        {this.component(local => {
                                            const fileSize = 454;
                                            if (fileSize === undefined) {
                                                return  (
                                                    <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                                        <Icon icon={<FileIcon/>}/>
                                                        <Text text={"File size: "} type={TextType.secondaryDescription}/>
                                                        <Text text={"N/A"} bold coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                                                    </FlexBox>
                                                );
                                            } else {
                                                const [size, unit] = Utils.humanFileSize(fileSize).split(' ');
                                                return (
                                                    <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                                        <Icon icon={<FileIcon/>}/>
                                                        <Text text={"File size: "} type={TextType.secondaryDescription}/>
                                                        <Text text={`${size} ${unit}`}/>
                                                    </FlexBox>
                                                );
                                            }
                                        }, "file_size")}

                                        <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                            <Icon icon={<TagsIcon/>}/>
                                            <Text text={"Internal tags: "} type={TextType.secondaryDescription}/>
                                            <Text text={String(this.props.data.internalTags.join(", "))}/>
                                        </FlexBox>

                                        <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                            <Icon icon={<UserIcon/>}/>
                                            <Text text={"Creator: "} type={TextType.secondaryDescription}/>
                                            {/* <ClientDisplay clientID={this.props.data.creatorUserID} enableClientBadge={false}/> */}
                                        </FlexBox>
                                    </FlexBox>
                                );
                            }]
                        ])} footer={instance => {
                            return (
                                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)}>
                                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab}>
                                        <Text text={"Lifecycle state: "} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                        <Text text={"online"} bold coloredText visualMeaning={ObjectVisualMeaning.INFO}/>
                                    </FlexBox>

                                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)} height={percent(100)} justifyContent={Justify.FLEX_END}>
                                        <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab}>
                                            <Text text={"Last edited"} type={TextType.secondaryDescription} whitespace={"nowrap"}/>
                                            <Text text={moment(this.props.data.lastEdited, "YYYY-MM-DD[T]HH:mm:ss").fromNow()} type={TextType.secondaryDescription} whitespace={"nowrap"}/>
                                        </FlexBox>

                                        <CustomTooltip arrow title={
                                            <Text text={"Load project & start editor"}/>
                                        } children={
                                            <span children={
                                                <Button
                                                    bgColorOnDefault={false}
                                                    visualMeaning={ObjectVisualMeaning.INFO}
                                                    opaque
                                                    border={false}
                                                    padding={px(5)}
                                                    onClick={() => {
                                                        // App.app().callAction("close-main-dialog");
                                                        this.props.ctx.onSelect(this.props.data);
                                                    }}
                                                    children={
                                                        <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                                            <Text text={"Start editor"} whitespace={"nowrap"} uppercase coloredText={true} cursor={Cursor.pointer} visualMeaning={ObjectVisualMeaning.INFO}/>
                                                            <Icon icon={<LoadIcon/>} colored visualMeaning={ObjectVisualMeaning.INFO}/>
                                                        </FlexBox>
                                                    }
                                                />
                                            }/>
                                        }/>
                                    </FlexBox>
                                </FlexBox>
                            );
                        }}/>
                    }/>
                    <Mobile children={this.a("body-mobile", this)}/>
                </>

            );
        }, "container");
    }
}

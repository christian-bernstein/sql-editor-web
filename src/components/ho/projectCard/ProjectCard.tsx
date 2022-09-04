import {BernieComponent} from "../../../logic/BernieComponent";
import {ProjectInfoData} from "../../../logic/data/ProjectInfoData";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Box} from "../../lo/Box";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Flex, FlexRow} from "../../lo/FlexBox";
import {Justify} from "../../../logic/style/Justify";
import {Icon} from "../../lo/Icon";
import {ReactComponent as CardDBIcon} from "../../../assets/icons/ic-24/ic24-dashboard.svg";
import {Tooltip} from "../tooltip/Tooltip";
import {Text, TextType} from "../../lo/Text";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {Cursor} from "../../../logic/style/Cursor";
import {Badge} from "../../lo/Badge";
import {ReactComponent as ContextIcon} from "../../../assets/icons/ic-16/ic16-more-ver.svg";
import {ReactComponent as EngineIcon} from "../../../assets/icons/ic-20/ic20-functions.svg";
import {ReactComponent as CommitIcon} from "../../../assets/icons/ic-20/ic20-publish.svg";
import {ReactComponent as FilesizeIcon} from "../../../assets/icons/ic-20/ic20-file.svg";
import {ReactComponent as InformationIcon} from "../../../assets/icons/ic-20/ic20-info.svg";
import moment from "moment";
import {App} from "../../../logic/app/App";
import {ProjectFileSizeRequestPacketData} from "../../../packets/out/ProjectFileSizeRequestPacketData";
import {ProjectFileSizeResponsePacketData} from "../../../packets/in/ProjectFileSizeResponsePacketData";
import {getOr, Utils} from "../../../logic/Utils";
import {Q, Queryable} from "../../../logic/query/Queryable";
import {Button} from "../../lo/Button";
import {QueryDisplay} from "../../logic/QueryDisplay";
import {QueryError} from "../../../logic/query/QueryError";
import {Loader} from "../../lo/Loader";
import {If} from "../../logic/If";

export type ProjectCardProps = {
    data: ProjectInfoData,
    onSelect?: (data: ProjectInfoData) => void,
    width?: DimensionalMeasured,
}

export type ProjectCardLocalState = {
    projectFileSize: Q<number>
}

export class ProjectCard extends BernieComponent<ProjectCardProps, any, ProjectCardLocalState> {

    constructor(props: ProjectCardProps) {
        super(props, undefined, {
            projectFileSize: new Q({
                component: () => this,
                fallback: 0,
                timeout: 5000,
                listeners: ["file-size"],
                process: (resolve, reject) => App.app().connector(connector => connector.call({
                    packetID: "ProjectFileSizeRequestPacketData",
                    protocol: "main",
                    data: {
                        projectID: this.props.data.id
                    } as ProjectFileSizeRequestPacketData,
                    callback: {
                        handle: (connector1, packet) => {
                            const data: ProjectFileSizeResponsePacketData = packet.data;
                            resolve (data.fileSize);
                        }
                    }
                }))
            })
        });
    }

    init() {
        super.init();
        this.filesizeTagAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.projectFileSize.query();
    }

    private filesizeTagAssembly() {
        this.assembly.assembly("filesize-tag", theme => {
            return (
                <FlexRow gap={theme.gaps.smallGab.times(.5)} elements={[
                    <Icon icon={<FilesizeIcon/>} size={px(16)} color={theme.colors.fontSecondaryColor}/>,

                    <QueryDisplay<number> q={this.local.state.projectFileSize} renderer={{
                        successOrNeutral(q: Queryable<number>, data: number): JSX.Element {
                            return <Text
                                text={Utils.humanFileSize(data)}
                                type={TextType.secondaryDescription}
                                fontSize={px(12)}
                            />
                        },
                        processing(q: Queryable<number>): JSX.Element {
                            return <Loader size={px(16)}/>
                        },
                        error(q: Queryable<number>, error?: QueryError): JSX.Element {
                            return <Text
                                text={"N/A"}
                                visualMeaning={VM.WARNING}
                                coloredText
                                type={TextType.secondaryDescription}
                                fontSize={px(12)}
                            />
                        }
                    }}/>
                ]}/>
            );
        })
    }

    componentRender(p: ProjectCardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={getOr(p.width, percent(100))} elements={[
                <Flex elements={[
                    <FlexRow fw justifyContent={Justify.SPACE_BETWEEN} elements={[
                        <FlexRow gap={t.gaps.smallGab} elements={[
                            // <Icon icon={<CardGenericIcon/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                            <Icon icon={<CardDBIcon/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,

                            <Tooltip title={`Open ${p.data.title}`} arrow noBorder children={
                                <Text bold text={p.data.title} highlight visualMeaning={VM.SUCCESS} cursor={Cursor.pointer} coloredText onClick={() => {
                                    p.onSelect?.(p.data);
                                }}/>
                            }/>,

                            <Badge children={
                                <Text text={"Private"} fontSize={px(12)} type={TextType.secondaryDescription}/>
                            }/>
                        ]}/>,

                        <FlexRow gap={t.gaps.smallGab} elements={[
                            <Tooltip title={"Information"} arrow noBorder children={
                                <FlexRow elements={[
                                    <Icon icon={<InformationIcon/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                ]}/>
                            }/>,
                            <Tooltip title={"More options"} arrow noBorder children={
                                <FlexRow elements={[
                                    <Icon icon={<ContextIcon/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                ]}/>
                            }/>
                        ]}/>,
                    ]}/>,

                    <If condition={p.data.description !== undefined && p.data.description.trim().length > 0} ifTrue={
                        <Text type={TextType.secondaryDescription} fontSize={px(12)} text={p.data.description}/>
                    }/>,

                    <If condition={p.data.internalTags.length > 0} ifTrue={
                        <FlexRow gap={t.gaps.smallGab} elements={
                            p.data.internalTags.map(s => (
                                <Box highlightShadow={false} cursor={Cursor.pointer} highlight opaque paddingY={px(4)} paddingX={px(7)} visualMeaning={VM.SUCCESS} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(500)}} borderless children={
                                    <Text text={s} cursor={Cursor.pointer} visualMeaning={VM.SUCCESS} fontSize={px(12)} coloredText type={TextType.secondaryDescription}/>
                                }/>
                            ))
                        }/>
                    }/>,



                    <FlexRow elements={[
                        <Tooltip title={"DBMS H2"} arrow noBorder children={
                            <FlexRow gap={t.gaps.smallGab.times(.5)} elements={[
                                <Icon icon={<EngineIcon/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                <Text text={`H2`} type={TextType.secondaryDescription} fontSize={px(12)}/>
                            ]}/>
                        }/>,

                        <Tooltip title={"45 commits"} arrow noBorder children={
                            <FlexRow gap={t.gaps.smallGab.times(.5)} elements={[
                                <Icon icon={<CommitIcon/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                <Text text={`45`} type={TextType.secondaryDescription} fontSize={px(12)}/>
                            ]}/>
                        }/>,

                        this.component(() => this.a("filesize-tag"), ...Q.allChannels("file-size")),

                        <FlexRow gap={t.gaps.smallGab.times(.5)} elements={[
                            <Text text={`Updated ${moment(p.data.lastEdited).fromNow()}`} type={TextType.secondaryDescription} fontSize={px(12)}/>
                        ]}/>
                    ]}/>
                ]}/>
            ]}/>
        );
    }
}

import {BernieComponent} from "../logic/BernieComponent";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/style/FlexDirection";
import {Image} from "./Image";
import React from "react";
import {Text, TextType} from "./Text";
import {percent, px} from "../logic/style/DimensionalMeasured";
import {Justify} from "../logic/style/Justify";
import {Align} from "../logic/Align";
import {Button} from "./Button";
import {Icon} from "./Icon";
import {ReactComponent as TwitterIcon} from "../assets/icons/ic-16/ic16-twitter.svg";
import {ReactComponent as LinkIcon} from "../assets/icons/ic-16/ic16-link.svg";
import {ReactComponent as LinkedinIcon} from "../assets/icons/ic-16/ic16-linkedin.svg";
import {ReactComponent as ContextIcon} from "../assets/icons/ic-16/ic16-more-ver.svg";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Badge} from "./Badge";
import {UserPublicProfileData} from "../logic/data/UserPublicProfileData";
import {Separator} from "./Separator";
import {Orientation} from "../logic/style/Orientation";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {Box} from "./Box";
import {OverflowBehaviour} from "../logic/style/OverflowBehaviour";

export type ProfileShortViewProps = {
    profile: UserPublicProfileData,
    enableBanner?: boolean,
    enableBiography?: boolean,
    enableLinks?: boolean,
    enableOptions?: boolean
}

export class ProfileShortView extends BernieComponent<ProfileShortViewProps, any, any> {

    constructor(props: ProfileShortViewProps) {
        super(props, undefined, undefined);
        this.profilePictureAssembly();
        this.profileOptionsAssembly();
        this.linksAssembly();
        this.bioAssembly();
        this.bannerAssembly();
    }

    /*
    enableRightAppendix rightAppendix={
        <Badge visualMeaning={ObjectVisualMeaning.BETA} opaque>
            <Text text={"team"} uppercase bold/>
        </Badge>
    }
     */
    private profilePictureAssembly() {
        this.assembly.assembly("profile-picture", (theme, props) => {
            const profile = this.props.profile;
            return (
                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.defaultGab} align={Align.CENTER} height={percent(100)}>

                    <Image height={px(70)} src={profile.profilePicture.src} width={px(70)} onClick={() => {
                        this.goto("cdn/IMPLEMENT")
                    }}/>

                    <FlexBox flexDir={FlexDirection.COLUMN} gap={px()} justifyContent={Justify.CENTER}>
                        <Text text={profile.username} type={TextType.smallHeader} bold/>
                        <Text text={profile.email}/>
                        <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                            <Badge visualMeaning={ObjectVisualMeaning.BETA} opaque>
                                <Text text={"team"} uppercase bold/>
                            </Badge>
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            );
        });
    }

    private profileOptionsAssembly() {
        this.assembly.assembly("profile-options", (theme, props) => {
            if (this.props.enableOptions === undefined || this.props.enableOptions) {
                return (
                    <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab} width={percent(100)}>
                        <Button width={percent(100)}>
                            <Text text={"View profile"}/>
                        </Button>
                        <Button width={percent(100)}>
                            <Text text={"Message"}/>
                        </Button><Button>
                        <Icon icon={<ContextIcon/>}/>
                    </Button>
                    </FlexBox>
                );
            } else {
                return (
                    <></>
                );
            }
        });
    }

    private linksAssembly() {
        this.assembly.assembly("profile-links", (theme, props) => {
            const profile = this.props.profile;
            if (this.props.enableLinks === undefined || this.props.enableLinks) {
                return (
                    <FlexBox gap={theme.gaps.smallGab}>
                        <Text text={"christian.bernstein"} highlight visualMeaning={ObjectVisualMeaning.INFO} enableLeftAppendix leftAppendix={
                            <Icon icon={<TwitterIcon/>}/>
                        }/>
                        <Text text={"christian-bernstein.de"} highlight visualMeaning={ObjectVisualMeaning.INFO} enableLeftAppendix leftAppendix={
                            <Icon icon={<LinkIcon/>}/>
                        }/>
                        <Text text={"Christian Bernstein"} highlight visualMeaning={ObjectVisualMeaning.INFO} enableLeftAppendix leftAppendix={
                            <Icon icon={<LinkedinIcon/>}/>
                        }/>
                    </FlexBox>
                );
            } else {
                return (
                    <></>
                );
            }
        });
    }

    private bioAssembly() {
        this.assembly.assembly("profile-bio", (theme, props) => {
            const profile = this.props.profile;
            if (this.props.enableBiography === undefined || this.props.enableBiography) {
                return (
                    <FlexBox gap={theme.gaps.smallGab}>
                        {/*<Text text={"Hay, ich bin Imke ☺️ ich bin 20 Jahre alt und mache zur Zeit eine Ausbildung als Kauffrau für Büromanagement. Ich bin steht’s bemüht in jedem das Gute zu sehen . Ich habe einen wunderbaren Freund😍, er heißt Christian und ist die Liebe meines Lebens. Ich zocke gerne 😘🥰😍😇🙂🙃😉"}/>*/}
                        <Text text={profile.biography}/>
                    </FlexBox>
                );
            } else {
                return (
                    <></>
                );
            }
        });
    }

    private bannerAssembly() {
        this.assembly.assembly("profile-banner", (theme, props) => {
            const profile = this.props.profile;
            if (this.props.enableBanner === undefined || this.props.enableBanner) {
                return (
                    <FlexBox width={percent(100)} gap={px()}>
                        <Image src={profile.banner.src} pure width={percent(100)} height={px(200)} objPosY={px(-50)}/>
                        <Separator orientation={Orientation.HORIZONTAL}/>
                    </FlexBox>
                );
            } else {
                return (
                    <></>
                );
            }
        });
    }

    // height={px(200)}
    // objPosY={px(-40)}
    componentRender(p: ProfileShortViewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box noPadding borderless gapY={px()} maxHeight={percent(100)} maxWidth={px(600)} width={percent(100)}>
                {this.assembly.render({
                    component: "profile-banner"
                })}
                <FlexBox padding paddingX={t.gaps.defaultGab} width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    {this.assembly.render({
                        component: "profile-picture"
                    })}
                    {this.assembly.render({
                        component: "profile-options"
                    })}
                    {this.assembly.render({
                        component: "profile-links"
                    })}
                    {this.assembly.render({
                        component: "profile-bio"
                    })}
                </FlexBox>
            </Box>
        );
    }
}

import {BernieComponent} from "../../../logic/BernieComponent";
import {PageV2} from "../../../components/Page";
import {Themeable} from "../../../Themeable";
import {Assembly} from "../../../logic/Assembly";
import {AppHeader} from "../../../components/AppHeader";
import {Icon} from "../../../components/Icon";
import {ReactComponent as CloseIcon} from "../../../assets/icons/ic-16/ic16-close.svg";
import React from "react";
import {App, utilizeGlobalTheme} from "../../../logic/App";
import {ReactComponent as Logo} from "../../../assets/logo.svg";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {PosInCenter} from "../../../components/PosInCenter";
import {Box} from "../../../components/Box";
import {ClientDisplay} from "../../../components/ClientDisplay";
import {Text} from "../../../components/Text";
import {ProfileShortView} from "../../../components/ProfileShortView";
import {FlexBox} from "../../../components/FlexBox";
import {LiteGrid} from "../../../components/LiteGrid";
import {UserPublicProfileData} from "../../../logic/data/UserPublicProfileData";
import {UserActiveState} from "../../../logic/data/UserActiveState";
import {ClientDeviceType} from "../../../logic/data/ClientDeviceType";
import {v4} from "uuid";
import Banner from "../../../assets/images/img-2.png";
import ProfilePicture from "../../../assets/images/img-2.png";
import {CheckBox} from "@mui/icons-material";
import {Checkbox, FormControlLabel} from "@mui/material";

export type ClientDisplayPlaygroundDialogLocalState = {
    banner: boolean,
    biography: boolean,
    links: boolean,
    options: boolean
}

export class ClientDisplayPlaygroundDialog extends BernieComponent<any, any, ClientDisplayPlaygroundDialogLocalState> {

    private static readonly profile: UserPublicProfileData = {
        activeState: UserActiveState.DO_NOT_DISTURB,
        badges: [],
        deviceType: ClientDeviceType.MOBILE,
        email: "christian.bernsteinde@gmail.com",
        id: v4(),
        firstname: "Christian",
        lastname: "Bernstein",
        lastActive: new Date(),
        links: [],
        username: "Christian",
        viewedFromID: undefined,
        biography: "My name is Christian and I'm kinda cute. It contains **basic information about the subject's life** — like their place of birth, education, and interests. A biography may also chronicle relationships with family members, as well as major events in the subject's childhood and how those influenced their upbringing.",
        banner: {
            type: "SRC",
            src: Banner
        },
        profilePicture: {
            type: "SRC",
            src: ProfilePicture
        }
    };

    constructor() {
        super(undefined, undefined, {
            banner: true,
            biography: true,
            links: true,
            options: true
        });
        this.displayAssembly();
    }

    private displayAssembly() {
        this.assembly.assembly("display", (t, props) => (
            <Box gapY={t.gaps.smallGab} width={percent(100)}>
                <PosInCenter>
                    <ClientDisplay clientDataResolver={() => ClientDisplayPlaygroundDialog.profile} overwriteMenuRenderer={instance => {
                        const ls = this.local.state;
                        return (
                            <ProfileShortView
                                profile={instance.props.clientDataResolver()}
                                enableBiography={ls.biography}
                                enableBanner={ls.banner}
                                enableLinks={ls.links}
                                enableOptions={ls.options}
                            />
                        );
                    }}/>
                </PosInCenter>
            </Box>
        ))
    }

    private createCheckbox(title: string, key: keyof ClientDisplayPlaygroundDialogLocalState): JSX.Element {
        const theme = utilizeGlobalTheme();
        return (
            <FormControlLabel control={<Checkbox defaultChecked sx={{
                color: theme.colors.backgroundHighlightColor200.css(),
                '&.Mui-checked': {
                    color: theme.colors.betaHighlightColor.css(),
                },
            }}/>} label={<Text text={title}/>} onChange={(event, checked) => {
                console.log("on change of banner", checked)
                this.local.setStateWithChannels({
                    [key]: checked
                }, ["display"])
            }}/>
        );
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <PageV2>
                <AppHeader title={"ClientDisplay-Playground"} left={
                    <Icon icon={<Logo/>} size={px(20)}/>
                } right={
                    <Icon icon={<CloseIcon/>} onClick={() => App.app().toggleMainDialog("closed")}/>
                }/>
                <PosInCenter fullHeight>
                    <FlexBox gap={t.gaps.smallGab} width={percent(100)}>
                        {this.createCheckbox("Banner", "banner")}
                        {this.createCheckbox("Biography", "biography")}
                        {this.createCheckbox("Links", "links")}
                        {this.createCheckbox("Options", "options")}
                        {this.component(local => this.assembly.render({
                            component: "display"
                        }), "display")}
                    </FlexBox>
                </PosInCenter>
            </PageV2>
        );
    }
}

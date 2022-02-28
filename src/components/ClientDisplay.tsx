import {BernieComponent} from "../logic/BernieComponent";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {ContextCompound} from "./ContextCompound";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/style/FlexDirection";
import {Align} from "../logic/Align";
import {Image} from "./Image";

// import Banner from "../assets/images/img-4.gif";
import ProfilePicture from "../assets/images/img-2.png";
import Banner from "../assets/images/img-2.png";
import {DimensionalMeasured, px} from "../logic/style/DimensionalMeasured";
import {Text, TextType} from "./Text";
import React from "react";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Box} from "./Box";
import {Cursor} from "../logic/style/Cursor";
import {ProfileShortView} from "./ProfileShortView";
import {UserPublicProfileData} from "../logic/data/UserPublicProfileData";
import {getOr} from "../logic/Utils";
import {UserActiveState} from "../logic/data/UserActiveState";
import {ClientDeviceType} from "../logic/data/ClientDeviceType";
import {v4} from "uuid";
import {InformationBox} from "./InformationBox";

// todo add id
export type ClientDisplayProps = {
    clientDataResolver?: (id: string, handler: (data: UserPublicProfileData) => void) => void,
    overwriteMenuRenderer?: (instance: ClientDisplay, profile: UserPublicProfileData) => JSX.Element,
    enableClientBadge?: boolean,
    imageSize?: DimensionalMeasured
}

export type ClientDisplayLocalState = {
    clientData?: UserPublicProfileData,
    clientDataResolver: (id: string, handler: (data: UserPublicProfileData) => void) => void,
    loading: boolean
}

export class ClientDisplay extends BernieComponent<ClientDisplayProps, any, ClientDisplayLocalState> {

    constructor(props: ClientDisplayProps) {
        super(props, undefined, {
            loading: true,

            // todo reimplement feature!!
            // getOr(props.clientDataResolver,
            clientDataResolver: (id, handler: (data: UserPublicProfileData) => void) => {
                handler({
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
                })
            }
        });
    }

    async componentDidMount() {
        super.componentDidMount();

        // todo pass real id value
        this.local.state.clientDataResolver("", data => {
            this.local.setStateWithChannels({
                clientData: data,
                loading: false
            }, ["data"]);
        });
    }

    private renderMenu(profile: UserPublicProfileData): JSX.Element {
        if (this.props.overwriteMenuRenderer !== undefined) {
            return this.props.overwriteMenuRenderer(this, profile);
        } else {
            return (
                <ProfileShortView profile={profile}/>
            );
        }
    }

    componentRender(p: ClientDisplayProps, s: any, l: ClientDisplayLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component((local) => {
            if (local.state.loading) {
                // Data is still loading
                return (
                    <Text text={"loading…"}/>
                );
            } else {
                // Currently not loading
                const profile = local.state.clientData;
                if (profile !== undefined) {
                    // Not loading & data is present
                    const enableClientBadge = getOr(p.enableClientBadge, true);
                    const imageSize = getOr(p.imageSize, px(20));
                    return (
                        <ContextCompound wrapMenu={false} menu={this.renderMenu(profile)}>
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab}>
                                <Image src={ProfilePicture} borderRadius={px(9999)} width={imageSize} height={imageSize}/>
                                <Text text={profile.username} cursor={Cursor.pointer} type={TextType.secondaryDescription}/>
                                {enableClientBadge ? (
                                    <Box visualMeaning={ObjectVisualMeaning.BETA} opaque paddingY={px(0)} paddingX={px(4)}>
                                        <Text text={"user"} bold uppercase fontSize={px(12)}/>
                                    </Box>
                                ) : (
                                    <></>
                                )}
                            </FlexBox>
                        </ContextCompound>
                    );
                } else {
                    // Not loading & no data present
                    return (
                        <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
                            <Text text={"ClientDisplay error: **Not loading & no data present**"}/>
                        </InformationBox>
                    );
                }
            }
        }, "data");
    }
}

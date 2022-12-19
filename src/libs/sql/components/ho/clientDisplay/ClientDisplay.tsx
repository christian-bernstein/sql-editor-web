import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {ContextCompound} from "../contextCompound/ContextCompound";
import {FlexBox} from "../../lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {Image} from "../../lo/Image";
import Banner from "../../../../../assets/images/img-2.png";
import ProfilePicture from "../../../../../assets/images/img-2.png";
import {DimensionalMeasured, px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../lo/Text";
import React from "react";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Box} from "../../lo/Box";
import {Cursor} from "../../../logic/style/Cursor";
import {ProfileShortView} from "../profileShortView/ProfileShortView";
import {UserPublicProfileData} from "../../../logic/data/UserPublicProfileData";
import {getOr} from "../../../logic/Utils";
import {UserActiveState} from "../../../logic/data/UserActiveState";
import {ClientDeviceType} from "../../../logic/data/ClientDeviceType";
import {v4} from "uuid";
import {InformationBox} from "../informationBox/InformationBox";
import {ImageData} from "../../../logic/data/ImageData";
import {App} from "../../../logic/app/App";
import {Icon} from "../../lo/Icon";
import {BounceLoader} from "react-spinners";

// todo add id
export type ClientDisplayProps = {
    clientID?: string,
    clientDataResolver?: (id: string, handler: (data: UserPublicProfileData) => void) => void,
    overwriteMenuRenderer?: (instance: ClientDisplay, profile: UserPublicProfileData) => JSX.Element,
    enableClientBadge?: boolean,
    imageSize?: DimensionalMeasured,
    onlyImage?: boolean,

    pureImage?: boolean
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

            clientDataResolver: getOr(props.clientDataResolver, (id, handler: (data: UserPublicProfileData) => void) => {
                if (id === undefined || id.length === 0) {
                    throw new Error(`clientDataResolver: cannot resolve data with faulty id ${id}`);
                } else {
                    App.use(app => {
                        const requestID = v4();
                        app.cdn([{
                            requestID: requestID,
                            branch: "hotfix-upd",
                            targetID: id,
                            accessToken: undefined,
                            attributes: new Map<string, any>()
                        }], data => {
                            const entries = data.response.entries.filter(res => res.requestID === requestID);
                            if (entries.length != 1) {
                                app.error(`Required 1 entry in hotfix-upd-response, but got ${entries.length}.`, entries);
                            } else {
                                const res = entries[0];
                                handler(res.data as UserPublicProfileData);
                            }
                        })
                    })
                }

                // handler({
                //     activeState: UserActiveState.DO_NOT_DISTURB,
                //     badges: [],
                //     deviceType: ClientDeviceType.MOBILE,
                //     email: "christian.bernsteinde@gmail.com",
                //     id: v4(),
                //     firstname: "Christian",
                //     lastname: "Bernstein",
                //     lastActive: new Date(),
                //     links: [],
                //     username: "Christian",
                //     viewedFromID: undefined,
                //     biography: "It contains **basic information about the subject's life** — like their place of birth, education, and interests. A biography may also chronicle relationships with family members, as well as major events in the subject's childhood and how those influenced their upbringing.",
                //     banner: {
                //         type: "SRC",
                //         src: Banner
                //     },
                //     profilePicture: {
                //         type: "SRC",
                //         src: ProfilePicture
                //     }
                // })
            })
        });
    }

    async componentDidMount() {
        super.componentDidMount();
        // todo pass real id value

        if (this.props.clientID === undefined) {
            App.app().error("Cannot load ClientDisplay-component, because the clientID is undefined. (This might indicate, that the component was written before Sat, 19.03.2022)", this.props)
        } else {
            this.local.state.clientDataResolver(this.props.clientID, data => {
                this.local.setStateWithChannels({
                    clientData: data,
                    loading: false
                }, ["data"]);
            });
        }
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

    /**
     * todo currently only supports src data type, support all the others as well
     */
    private static loadImageData(data: ImageData): string {
        return data.src;
    }

    componentRender(p: ClientDisplayProps, s: any, l: ClientDisplayLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component((local) => {
            const imageSize = getOr(p.imageSize, px(20));
            if (local.state.loading) {
                // Data is still loading
                return (
                    <Icon icon={
                        <BounceLoader size={imageSize.css()}/>
                    } size={imageSize}/>
                );
            } else {
                // Currently not loading
                const profile = local.state.clientData;
                if (profile !== undefined) {
                    // Not loading & data is present
                    const enableClientBadge = getOr(p.enableClientBadge, true);
                    const onlyImage = getOr(p.onlyImage, false);
                    return (
                        <ContextCompound wrapMenu={false} menu={this.renderMenu(profile)}>
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab}>
                                <Image
                                    src={ClientDisplay.loadImageData(profile.profilePicture)}
                                    borderRadius={px(9999)}
                                    width={imageSize}
                                    height={imageSize}
                                    pure={getOr(p.pureImage, false)}
                                />

                                {onlyImage ? undefined : <Text text={profile.username} cursor={Cursor.pointer} type={TextType.secondaryDescription}/>}

                                {!onlyImage && enableClientBadge ? (
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

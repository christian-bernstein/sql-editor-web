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
import {px} from "../logic/style/DimensionalMeasured";
import {Text, TextType} from "./Text";
import React from "react";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Box} from "./Box";
import {Cursor} from "../logic/style/Cursor";
import {ProfileShortView} from "./ProfileShortView";
import {UserPublicProfileData} from "../logic/data/UserPublicProfileData";

export type ClientDisplayProps = {
    clientDataResolver: () => UserPublicProfileData,
    overwriteMenuRenderer?: (instance: ClientDisplay, profile: UserPublicProfileData) => JSX.Element
}

export class ClientDisplay extends BernieComponent<ClientDisplayProps, any, any> {

    private renderMenu(profile: UserPublicProfileData): JSX.Element {
        if (this.props.overwriteMenuRenderer !== undefined) {
            return this.props.overwriteMenuRenderer(this, profile);
        } else {
            return (
                <ProfileShortView profile={profile}/>
            );
        }
    }

    componentRender(p: ClientDisplayProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const profile = p.clientDataResolver();
        return (
            <ContextCompound wrapMenu={false} menu={this.renderMenu(profile)}>
                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab}>
                    <Image src={ProfilePicture} borderRadius={px(9999)} width={px(20)} height={px(20)}/>
                    <Text text={profile.username} cursor={Cursor.pointer} type={TextType.secondaryDescription}/>
                    <Box visualMeaning={ObjectVisualMeaning.BETA} opaque paddingY={px(0)} paddingX={px(4)}>
                        <Text text={"user"} bold uppercase fontSize={px(12)}/>
                    </Box>
                </FlexBox>
            </ContextCompound>
        );
    }
}

import React from "react";
import {PuffLoader} from "react-spinners";
import {Img} from "react-image";
import styled from "styled-components";
import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {getOr} from "../../logic/Utils";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";

// todo remove, it's just a sample
import Sample from "../../assets/images/img-1.jpg";

export type ProfilePictureProps = {
    name: string
} & WithVisualMeaning

export const ProfilePicture: React.FC<ProfilePictureProps> = props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const vm: ObjectVisualMeaning = getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);
    const mc: MeaningfulColors = getMeaningfulColors(vm, theme);

    const Wrapper = styled.div`     
      display: flex;
      justify-content: center;
      align-items: center;
      
      .avatar {
        border-radius: 50%;
        height: 20px;
        width: 20px;
        object-fit: cover;
        object-position: 100% 0;
        border: 1px solid ${theme.colors.borderPrimaryShadowColor.css()};
      }

      .avatar-loader {
        border-radius: 50%;
        border: 1px solid ${theme.colors.borderPrimaryShadowColor.css()};
        height: 20px;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
    `;

    // src={"https://gravatar.com/avatar/" + props.name + "?d=identicon"}
    return (
        <Wrapper>
            <Img className={"avatar"}
                 alt={"avatar"}
                 // src={Sample}
                 src={"https://gravatar.com/avatar/" + props.name + "?d=identicon"}
                 loader={
                     <div className={"avatar-loader"}>
                         <PuffLoader color={"#A9E5C3"} size={"10px"}/>
                     </div>
                 }
            />
        </Wrapper>

    );
}

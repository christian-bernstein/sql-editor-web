import {BernieComponent} from "../logic/BernieComponent";
import {Assembly} from "../logic/Assembly";
import {Themeable} from "../Themeable";
import {Img} from "react-image";
import React, {CSSProperties} from "react";
import {Text} from "./Text";
import Sample from "../assets/images/img-1.jpg";
import {DimensionalMeasured, percent} from "../logic/style/DimensionalMeasured";
import {getOr} from "../logic/Utils";

export type ImageProps = {
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    objPosY?: DimensionalMeasured | "center",
    objPosX?: DimensionalMeasured | "center",
}

export class Image extends BernieComponent<ImageProps, any, any> {

    componentRender(p: ImageProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const opy = getOr(this.props.objPosY, "center");
        const opx = getOr(this.props.objPosX, "center");
        const op = `${opy === "center" ? "center" : (opy as DimensionalMeasured).css()} ${opx === "center" ? "center" : (opx as DimensionalMeasured).css()}`
        const style: CSSProperties = {
            width: getOr(p.width, percent(100)).css(),
            borderRadius: t.radii.defaultObjectRadius.css(),
            border: `1px solid ${t.colors.borderPrimaryColor.css()}`,
            overflow: "hidden",
            objectFit: "cover",
            objectPosition: op,
        };
        return (
            <Img style={style} src={Sample} loading={"lazy"} loader={(
                <Text text={"loading..."}/>
            )}/>
        );
    }
}

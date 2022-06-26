import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Img} from "react-image";
import React, {CSSProperties} from "react";
import {Text} from "./Text";
// import Sample from "../assets/images/img-2.png";
// import Sample from "../assets/images/img-4.gif";
import {DimensionalMeasured, percent} from "../../logic/style/DimensionalMeasured";
import {getOr} from "../../logic/Utils";
import {Skeleton} from "@mui/material";
import styled, {CSSProp} from "styled-components";
import {PuffLoader} from "react-spinners";
import {Box} from "./Box";

export type ImageProps = {
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    objPosY?: DimensionalMeasured | "center",
    objPosX?: DimensionalMeasured | "center",
    borderRadius?: DimensionalMeasured
    onClick?: () => void,
    pure?: boolean,
    src: string | string[],
    noBGColor?: boolean
}

export class Image extends BernieComponent<ImageProps, any, any> {

    componentRender(p: ImageProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const opy = getOr(this.props.objPosY, "center");
        const opx = getOr(this.props.objPosX, "center");
        const op = `${opx === "center" ? "center" : (opx as DimensionalMeasured).css()} ${opy === "center" ? "center" : (opy as DimensionalMeasured).css()}`
        const pure = getOr(p.pure, false);
        const style: CSSProperties = {
            width: getOr(p.width, percent(100)).css(),
            minWidth: getOr(p.width, percent(100)).css(),
            height: getOr(p.height, percent(100)).css(),
            minHeight: getOr(p.height, percent(100)).css(),
            borderRadius: pure ? 0 : getOr(p.borderRadius, t.radii.defaultObjectRadius).css(),
            border: pure ? "none" : `1px solid ${t.colors.borderPrimaryColor.css()}`,
            overflow: "hidden",
            objectFit: "cover",
            objectPosition: op,
        };

        const loader: CSSProperties = {
            width: getOr(p.width, percent(100)).css(),
            minWidth: getOr(p.width, percent(100)).css(),
            height: getOr(p.height, percent(100)).css(),
            minHeight: getOr(p.height, percent(100)).css(),
            borderRadius: pure ? 0 : getOr(p.borderRadius, t.radii.defaultObjectRadius).css(),
            border: pure ? "none" : `1px solid ${t.colors.borderPrimaryColor.css()}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        };

        const boxStyle: CSSProperties = {
            width: getOr(p.width, percent(100)).css(),
            minWidth: getOr(p.width, percent(100)).css(),
            height: getOr(p.height, percent(100)).css(),
            minHeight: getOr(p.height, percent(100)).css()
        }

        return (
            <Box noPadding noBGColor={getOr(p.noBGColor, false)} style={boxStyle} borderless>
                <Img onClick={p.onClick} className={"react-image-component"} style={style} src={p.src} loading={"lazy"} loader={(
                    <div style={loader}>
                        <PuffLoader color={t.colors.backgroundHighlightColor200.css()} size={"16px"}/>
                    </div>
                )}/>
            </Box>
        );
    }
}

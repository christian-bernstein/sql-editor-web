import {ImageRenderingMode} from "./ImageRenderingMode";
import {ImagePosition} from "./ImagePosition";
import {ImageFit} from "./ImageFit";

export type HyperionImage = {
    src: string,
    renderingMode: ImageRenderingMode,
    position: ImagePosition
    imageFit: ImageFit,
    opacity: number
}

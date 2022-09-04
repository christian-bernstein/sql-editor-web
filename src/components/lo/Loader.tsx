import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {CircularProgress} from "@mui/material";
import {Flex} from "./FlexBox";
import {getOr} from "../../logic/Utils";

export type LoaderProps = {
    size?: DimensionalMeasured,
    thickness?: number
}

export class Loader extends BernieComponent<LoaderProps, any, any> {

    componentRender(p: LoaderProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const size = getOr(p.size, px(20));
        const thickness = getOr(p.thickness, 4);

        return (
            <Flex width={size} height={size} align={Align.CENTER} style={{ position: "relative" }} justifyContent={Justify.CENTER}  elements={[
                <CircularProgress
                    size={size?.withPlus(-2).css()}
                    variant={"determinate"}
                    thickness={thickness}
                    value={100}
                    sx={{
                        '& .MuiCircularProgress-svg': {
                            color: t.colors.backgroundHighlightColor200.css()
                        }
                    }
                }/>,

                <CircularProgress size={size?.withPlus(-2).css()} thickness={thickness} sx={{
                    position: "absolute",
                    '& .MuiCircularProgress-svg': {
                        color: t.colors.fontSecondaryColor.css()
                    }
                }}/>
            ]}/>
        );
    }
}

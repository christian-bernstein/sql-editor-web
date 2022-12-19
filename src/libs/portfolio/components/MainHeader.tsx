import {BC} from "../../sql/logic/BernieComponent";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {PortfolioAPI} from "../PortfolioAPI";
import {Flex, FlexRow} from "../../sql/components/lo/FlexBox";
import {px} from "../../sql/logic/style/DimensionalMeasured";
import {LiteGrid} from "../../sql/components/lo/LiteGrid";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {Align} from "../../sql/logic/style/Align";
import {NavElement} from "../../../comsys/renaissance/components/NavElement";
import {Centered} from "../../sql/components/lo/PosInCenter";
import {Logo} from "./Logo";
import {Justify} from "../../sql/logic/style/Justify";
import {Icon} from "../../sql/components/lo/Icon";
import {Color} from "../../sql/logic/style/Color";
import {GitHub, Instagram, LinkedIn, Twitter} from "@mui/icons-material";
import {ReactComponent as Discord} from "../../../comsys/renaissance/assets/discord-mark-black.svg";
import {Typography} from "../../../comsys/renaissance/components/Typography";
import {TextLink} from "../../../comsys/renaissance/components/TextLink";
import {Button} from "../../../comsys/renaissance/components/Button";

export class MainHeader extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const globals = PortfolioAPI.api().globals;

        return (
            <LiteGrid columns={3} style={{
                paddingTop: "100px"
            }} children={
                <AF elements={[
                    // Left side :: Sitemap
                    <FlexRow align={Align.CENTER} gap={px(36)} elements={[
                        <NavElement href={"/"} title={"Home"}/>,
                        <NavElement href={"portfolio"} title={"Portfolio"}/>,
                        <NavElement href={"work"} title={"Work"}/>,
                        <NavElement href={"bernie-suite"} title={"Bernie suite"}/>
                    ]}/>,

                    <Centered children={
                        <span style={{
                            position: "relative"
                        }} children={
                            <span style={{
                                position: "absolute",
                                left: "50%",
                                bottom: "-15px",
                                transform: "translateX(-50%)"
                            }} children={
                                <Logo width={px(150)}/>
                            }/>
                        }/>
                    }/>,

                    // Right side :: social links
                    <FlexRow justifyContent={Justify.FLEX_END} align={Align.CENTER} gap={px(23)} elements={[
                        <Icon colored color={Color.ofHex("#000000")} icon={<Discord/>}/>,
                        <Icon colored color={Color.ofHex("#000000")} icon={<GitHub/>}/>,
                        <Icon colored color={Color.ofHex("#000000")} icon={<LinkedIn/>}/>,
                        <Icon colored color={Color.ofHex("#000000")} icon={<Instagram/>}/>,
                        <Icon colored color={Color.ofHex("#000000")} icon={<Twitter/>}/>,

                        <Button text={"Contact"}/>
                    ]}/>
                ]}/>
            }/>
        );
    }
}

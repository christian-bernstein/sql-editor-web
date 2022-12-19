import {BC} from "../../sql/logic/BernieComponent";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Flex, FlexRow} from "../../sql/components/lo/FlexBox";
import {LiteGrid} from "../../sql/components/lo/LiteGrid";
import {px} from "../../sql/logic/style/DimensionalMeasured";
import {PortfolioAPI} from "../PortfolioAPI";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {Justify} from "../../sql/logic/style/Justify";
import {Typography} from "../../../comsys/renaissance/components/Typography";
import {Align} from "../../sql/logic/style/Align";
import {TextLink} from "../../../comsys/renaissance/components/TextLink";
import {NavElement} from "../../../comsys/renaissance/components/NavElement";
import {Icon} from "../../sql/components/lo/Icon";
import {GitHub, Instagram, LinkedIn, Twitter} from "@mui/icons-material";
import {ReactComponent as Discord} from "../../../comsys/renaissance/assets/discord-mark-black.svg";
import {Color} from "../../sql/logic/style/Color";
import {Logo} from "./Logo";
import {Centered} from "../../sql/components/lo/PosInCenter";
import {If} from "../../sql/components/logic/If";

export type MainFooterProps = {
    showLogo?: boolean
}

export class MainFooter extends BC<MainFooterProps, any, any> {

    componentRender(p: MainFooterProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const globals = PortfolioAPI.api().globals;
        const showLogo = p.showLogo ?? true;

        return (
            <Flex fw gap={px(50)} elements={[

                // Upper line :: Sitemap & social links
                <LiteGrid columns={showLogo ? 3 : 2} children={
                    <AF elements={[
                        // Left side :: Sitemap
                        <FlexRow align={Align.CENTER} gap={px(36)} elements={[
                            <NavElement href={"/"} title={"Home"}/>,
                            <NavElement href={"portfolio"} title={"Portfolio"}/>,
                            <NavElement href={"work"} title={"Work"}/>,
                            <NavElement href={"bernie-suite"} title={"Bernie suite"}/>
                        ]}/>,

                        <If condition={showLogo} ifTrue={
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
                            }/>
                        }/>,

                        // Right side :: social links
                        <FlexRow justifyContent={Justify.FLEX_END} align={Align.CENTER} gap={px(23)} elements={[
                            <Icon colored color={Color.ofHex("#000000")} icon={<Discord/>}/>,
                            <Icon colored color={Color.ofHex("#000000")} icon={<GitHub/>}/>,
                            <Icon colored color={Color.ofHex("#000000")} icon={<LinkedIn/>}/>,
                            <Icon colored color={Color.ofHex("#000000")} icon={<Instagram/>}/>,
                            <Icon colored color={Color.ofHex("#000000")} style={{ transform: "rotate(90deg)" }} icon={<Twitter/>}/>,
                        ]}/>
                    ]}/>
                }/>,

                // Bottom line :: Copyright, contact & legal links
                <LiteGrid columns={3} style={{
                    paddingBottom: "56px"
                }} children={
                    <AF elements={[
                        <Flex fh justifyContent={Justify.CENTER} elements={[
                            <Typography text={globals.copyrightNote} style={{
                                fontSize: "14px",
                                fontWeight: 400,
                                fontFamily: 'Poppins, sans-serif'
                            }}/>
                        ]}/>,
                        <Flex fh fw align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                            <TextLink href={`mailto:${globals.contactEmail}`} visibleLink={
                                <Typography text={globals.contactEmail} style={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    fontFamily: 'Poppins, sans-serif'
                                }}/>
                            }/>,
                        ]}/>,
                        <FlexRow fh gap={px(51)} align={Align.CENTER} justifyContent={Justify.FLEX_END} elements={[
                            <TextLink href={"privacy"} visibleLink={
                                <Typography text={"Privacy"} style={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    fontFamily: 'Poppins, sans-serif'
                                }}/>
                            }/>,
                            <TextLink href={"imprint"} visibleLink={
                                <Typography text={"Imprint"} style={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    fontFamily: 'Poppins, sans-serif'
                                }}/>
                            }/>
                        ]}/>
                    ]}/>
                }/>
            ]}/>
        );
    }
}

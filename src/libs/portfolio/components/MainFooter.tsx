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

export class MainFooter extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const globals = PortfolioAPI.api().globals;

        return (
            <Flex fw gap={px(50)} elements={[

                // Upper line :: Sitemap & social links
                <FlexRow fw align={Align.CENTER} elements={[
                    // Left side :: Sitemap
                    <FlexRow align={Align.CENTER} gap={px(36)} elements={[
                        <NavElement href={"/"} title={"Home"}/>,
                        <NavElement href={"portfolio"} title={"Portfolio"}/>,
                        <NavElement href={"work"} title={"Work"}/>,
                        <NavElement href={"bernie-suite"} title={"Bernie suite"}/>
                    ]}/>

                ]}/>,

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

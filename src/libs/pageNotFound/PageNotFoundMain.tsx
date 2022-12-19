import {BC} from "../sql/logic/BernieComponent";
import {Assembly} from "../sql/logic/assembly/Assembly";
import {Themeable} from "../sql/logic/style/Themeable";
import {Screen} from "../../comsys/renaissance/components/Screen";
import {OverflowWithHeader} from "../sql/components/lo/OverflowWithHeader";
import {percent, px} from "../sql/logic/style/DimensionalMeasured";
import {LiteGrid} from "../sql/components/lo/LiteGrid";
import {AF} from "../sql/components/logic/ArrayFragment";
import {Flex} from "../sql/components/lo/FlexBox";
import {Typography} from "../../comsys/renaissance/components/Typography";
import {Justify} from "../sql/logic/style/Justify";
import {Button} from "../../comsys/renaissance/components/Button";
import {Link} from "react-router-dom";
import {LinkWithDescription} from "../../comsys/renaissance/components/LinkWithDescription";
import {createMargin} from "../sql/logic/style/Margin";
import {Align} from "../sql/logic/style/Align";
import Illustration404 from "./assets/404-illustration.png";
import {PortfolioAPI} from "../portfolio/PortfolioAPI";
import {MainFooter} from "../portfolio/components/MainFooter";

export class PageNotFoundMain extends BC<any, any, any> {

    init() {
        super.init();
        // TODO: Move to global init function -> May add init code to driver program like bootloaders: Array<() => void>
        PortfolioAPI.api(() => new PortfolioAPI());
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen main={
                <OverflowWithHeader
                    height={percent(100)}
                    staticContainer={{
                        elements: [
                            <MainFooter/>
                        ]
                    }}
                    overflowContainer={{
                        elements: [
                            <LiteGrid height={percent(100)} columns={2} children={
                                <AF elements={[
                                    // Left side :: Content
                                    <Flex gap={px(4)} justifyContent={Justify.CENTER} fh fw elements={[
                                        <Typography text={"Page not found"} style={{
                                            textTransform: "uppercase",
                                            fontSize: "40px"
                                        }}/>,

                                        <Typography style={{
                                            marginTop: 4,
                                            fontFamily: 'DM Serif Text'
                                        }} text={"Sorry, the page you are looking for doesn't exist or has been removed"}/>,

                                        <Link children={<Button text={"Back to start"} style={{
                                            padding: "10px 32px",
                                            marginTop: "20px"
                                        }}/>} to={"/"}/>,

                                        <Flex gap={px(28)} margin={createMargin(64, 0, 0, 0)} elements={[
                                            <LinkWithDescription
                                                title={"Documentation"}
                                                description={"Dive in to learn all about our product"}
                                                destination={"docs"}
                                            />,
                                            <LinkWithDescription
                                                title={"Publications"}
                                                description={"Dive into our list of articles"}
                                                destination={"publications"}
                                            />,
                                            <LinkWithDescription
                                                title={"Let's chat"}
                                                description={"Easy way to get in touch with me"}
                                                destination={"contact"}
                                            />
                                        ]}/>

                                    ]}/>,

                                    // Right side :: illustration
                                    <Flex fh fw justifyContent={Justify.CENTER} align={Align.CENTER} elements={[
                                        <img draggable={false} src={Illustration404} alt={"Error 404 illustration"} style={{
                                            userSelect: "none",
                                            width: "100%"
                                        }}/>
                                    ]}/>

                                ]}/>
                            }/>
                        ]
                    }}
                    staticContainerHeader={{
                        elements: [

                        ]
                    }}
                />
            }/>
        );
    }
}

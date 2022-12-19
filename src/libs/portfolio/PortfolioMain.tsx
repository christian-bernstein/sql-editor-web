import {BC} from "../sql/logic/BernieComponent";
import {Assembly} from "../sql/logic/assembly/Assembly";
import {Themeable} from "../sql/logic/style/Themeable";
import {Screen} from "../sql/components/lo/Page";
import {Centered} from "../sql/components/lo/PosInCenter";
import {Typography} from "../../comsys/renaissance/components/Typography";
import {Flex} from "../sql/components/lo/FlexBox";
import {Align} from "../sql/logic/style/Align";
import {px} from "../sql/logic/style/DimensionalMeasured";
import {Button} from "../../comsys/renaissance/components/Button";
import {Link} from "react-router-dom";

export class PortfolioMain extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen style={{ backgroundColor: "white" }} children={
                <Centered fullHeight children={
                    <Flex gap={px(4)} align={Align.CENTER} elements={[
                        <Typography style={{
                            textTransform: "uppercase",
                            fontFamily: "20px"
                        }} text={"Page not found"}/>,

                        <Typography style={{
                            fontFamily: 'DM Serif Text'
                        }} text={"Sorry, the page you are looking for doesn't exist or has been removed"}/>,

                        <Link children={<Button text={"Back to start"}/>} to={"start"}/>


                    ]}/>

                }/>
            }/>
        );
    }
}

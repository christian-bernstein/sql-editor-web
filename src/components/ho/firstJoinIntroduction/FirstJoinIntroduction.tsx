import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Flex} from "../../lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {Text, TextType} from "../../lo/Text";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Button} from "../../lo/Button";
import {createMargin} from "../../../logic/style/Margin";

export interface FirstJoinIntroductionActions {
    onAcknowledgeAndContinue: (component: FirstJoinIntroduction) => void
}

export type FirstJoinIntroductionProps = {
    actions: FirstJoinIntroductionActions
}

export class FirstJoinIntroduction extends BernieComponent<FirstJoinIntroductionProps, any, any> {

    init() {
        super.init();
        this.actionsAssembly();
    }

    private actionsAssembly() {
        this.assembly.assembly("actions", theme => {
            return (
                <Flex fw align={Align.CENTER} elements={[
                    <Text align={Align.CENTER} type={TextType.smallHeader} text={"Important information"}/>,
                    <Text align={Align.CENTER} type={TextType.secondaryDescription} text={"Please read the information below carefully!"}/>,
                    <Text align={Align.CENTER} type={TextType.secondaryDescription} fontSize={px(12)} text={"Consider this app to be an **advertising pillar**.\nEverything you enter into this website might be visible to others. **This includes your account information, as it is currently not stored with much security in mind.**"} visualMeaning={ObjectVisualMeaning.WARNING} coloredText/>,

                    <Flex fw align={Align.CENTER} margin={createMargin(40, 0, 15, 0)} padding paddingY={px()} paddingX={px(20)} elements={[
                        <Button text={"Acknowledge and continue"} width={percent(100)} onClick={() => {
                            this.props.actions.onAcknowledgeAndContinue(this);
                        }}/>,
                    ]}/>,

                    <Text align={Align.CENTER} type={TextType.secondaryDescription} fontSize={px(12)} text={"Questions? [Contact website team]()"}/>,
                ]}/>
            );
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw align={Align.CENTER} elements={[
                this.a("actions")
            ]}/>
        );
    }
}

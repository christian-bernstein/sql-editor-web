import {BC} from "../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {HyperionImageProducer} from "../../../frameworks/hyperion/producers/HyperionImageProducer";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {Separator} from "../../../components/lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Box} from "../../../components/lo/Box";
import {Form} from "../../../components/Form";
import {Input} from "../../../components/lo/Input";
import {Button} from "../../../components/lo/Button";
import {FormTransactionType} from "../../../components/FormTransactionType";
import {Text} from "../../../components/lo/Text";
import {InformationBox} from "../../../components/ho/informationBox/InformationBox";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Description} from "../../../components/lo/Description";

export type HyperionImageTestLocalState = {
    hyperionEntryID?: string
}

export class HyperionImageTest extends BC<any, any, HyperionImageTestLocalState> {

    public static test = UnitTestUtils.createTestConfig({
        name: "hyperion-image-test",
        displayName: "Hyperion image test",
        element: HyperionImageTest,
        factory: Elem => <Elem/>
    });

    constructor() {
        super(undefined, undefined, {});
    }

    componentRender(p: any, s: any, l: HyperionImageTestLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexRow gap={px(50)} elements={[
                // Controls
                <Box width={px(400)} elements={[
                    <Flex elements={[
                        <Text text={"Test configuration"}/>,
                        <Form
                            formID={"HyperionImageTest-form"}
                            renderer={(ctx, set) => {
                                return (
                                    <Flex fw elements={[
                                        <Input defaultValue={this.ls().hyperionEntryID} placeholder={"Hyperion entry id"} onChange={ev => set("id", ev.target.value)}/>,
                                        <Button width={percent(100)} text={"Apply changes"} onClick={() => ctx.transaction(FormTransactionType.SUBMIT)}/>
                                    ]}/>
                                );
                            }}
                            onSubmit={(ctx, get) => {
                                this.local.setStateWithChannels({
                                    hyperionEntryID: get("id")
                                }, ["test-object"]);
                            }}
                        />
                    ]}/>
                ]}/>,

                <Separator orientation={Orientation.VERTICAL} style={{ height: "80%" }}/>,

                // Test object
                this.component(() => this.ls().hyperionEntryID === undefined ? (
                    <InformationBox
                        visualMeaning={ObjectVisualMeaning.BETA}
                        children={
                            <Description text={"Please configure test"}/>
                        }
                    />
                ) : (
                    <HyperionImageProducer
                        hyperionEntryID={this.ls().hyperionEntryID as string}
                    />
                ), "test-object")
            ]}/>
        );
    }
}

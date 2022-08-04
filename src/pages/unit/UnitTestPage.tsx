import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React from "react";
import {Screen, screenedAndCentered} from "../../components/lo/Page";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Flex} from "../../components/lo/FlexBox";
import {Button} from "../../components/lo/Button";
import {Box} from "../../components/lo/Box";
import {Justify} from "../../logic/style/Justify";
import {Text, TextType} from "../../components/lo/Text";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {ObjectVisualMeaning, VM} from "../../logic/style/ObjectVisualMeaning";
import {If} from "../../components/logic/If";
import {Input} from "../../components/lo/Input";
import {getOr} from "../../logic/Utils";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {StaticDrawerMenu} from "../../components/lo/StaticDrawerMenu";
import {AF} from "../../components/logic/ArrayFragment";
import {AcknowledgeDrawer} from "../../components/lo/scripting/AcknowledgeDrawer";

export class UnitTestPage extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined, {
            enableLocalDialog: true
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {


        return screenedAndCentered(
            <AF elements={[
                <Button text={"open"} onClick={() => {
                    this._openLocalDialog(
                        <StaticDrawerMenu
                            vibration={{
                                enable: true
                            }}
                            body={props => (
                                <Flex>
                                    <Text text={"Script-generated input"} type={TextType.smallHeader}/>
                                    <InformationBox width={percent(100)} visualMeaning={VM.WARNING} children={
                                        <Text text={"**Never** enter sensitive information into a script-generated input! This data could be exploited by the script creator!"}/>
                                    }/>

                                    <form style={{width: "100%"}} onSubmit={event => {
                                        event.preventDefault();
                                        this.closeLocalDialog();
                                    }}>
                                        <Flex>
                                            <Flex gap={t.gaps.smallGab} width={percent(100)} margin={{top: px(50)}}>
                                                <If condition={true} ifTrue={
                                                    <Text text={"Title"} type={TextType.smallHeader}/>
                                                }/>

                                                <If condition={true} ifTrue={
                                                    <Text text={"Description"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                }/>
                                                <Input defaultValue={getOr(undefined, "")} placeholder={undefined} onChange={ev => {

                                                }}/>
                                            </Flex>

                                            <LiteGrid gap={t.gaps.smallGab} columns={2}>
                                                <Button text={"Cancel"} onClick={() => {
                                                    this.closeLocalDialog();
                                                    props.onClose?.();
                                                    props.onCancel?.();
                                                    // reject();
                                                }}/>
                                                <Button text={"Done"} vibrateOnClick opaque visualMeaning={VM.SUCCESS_DEFAULT} onClick={() => {
                                                    this.closeLocalDialog();
                                                    props.onClose?.();
                                                    props.onSubmit?.();
                                                    // resolve(getOr(value, ""));
                                                }}/>
                                            </LiteGrid>
                                        </Flex>
                                    </form>
                                </Flex>
                            )}
                            onSubmit={() => {
                                alert("Hello world")
                            }}
                        />
                    )
                }}/>,
                <Button text={"acknowledge"} onClick={() => {
                    this._openLocalDialog(
                        <AcknowledgeDrawer onSubmit={() => {
                            this.closeLocalDialog();
                            alert("Hello world")
                        }}/>
                    )
                }}/>
            ]}/>
        )
    }
}

import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React from "react";
import {Screen, screenedAndCentered} from "../../components/lo/Page";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Flex} from "../../components/lo/FlexBox";
import {Button} from "../../components/lo/Button";
import {Justify} from "../../logic/style/Justify";
import {StaticDrawerMenu} from "../../components/lo/StaticDrawerMenu";
import {Align} from "../../logic/style/Align";
import {HOCWrapper} from "../../components/HOCWrapper";
import {QuickActionPanel} from "../../components/ho/quickPanel/QuickActionPanel";
import {AnomalyInfo} from "../../components/ho/anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../../logic/data/AnomalyLevel";
import {EnumSelector} from "../../components/logic/EnumSelector";
import {AppModeSwitcher} from "../../components/ho/appModeSwitcher/AppModeSwitcher";
import {Text} from "../../components/lo/Text";
import {v4} from "uuid";
import {AF} from "../../components/logic/ArrayFragment";
import {SettingsAPI} from "../../logic/settings/SettingsAPI";

export class UnitTestPage extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined, {
            enableLocalDialog: true
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const api = new SettingsAPI();

        const data = new Map<string, any>([
            ['id', v4()],
            ['age', 20],
            // ['description', 'Test description']
        ]);

        type TestDataMapping = {
            id: string,
            age: number,
            description?: string,
        }

        // api.requestCompound<TestDataMapping>("id").then(value => {
        // });

        // api.request<string>("app-title").then(value => {
        // });

        try {
            let mapped: TestDataMapping = Object.fromEntries(data) as TestDataMapping;

            // return screenedAndCentered(
            //     <AF elements={[
            //         <Text text={JSON.stringify(mapped, null, 2)}/>,
            //         <Text text={String(mapped.description)}/>,
            //     ]}/>
            // );
        } catch (e) {
            this.dialog(
                <AnomalyInfo anomaly={{
                    level: AnomalyLevel.DEBUG,
                    data: e,
                    description: e
                }}/>
            )
        }




        return (
            <Screen children={
                <Flex width={percent(100)} height={percent(100)} justifyContent={Justify.FLEX_END} align={Align.CENTER}>
                    <HOCWrapper body={wrapper => (
                        <Button text={"QA-Panel"} onClick={() => {
                            wrapper.dialog(
                                <StaticDrawerMenu body={props => (
                                    <QuickActionPanel noPadding/>
                                )}/>
                            );
                        }}/>
                    )}/>

                    <Button text={"Anomaly"} onClick={() => {
                        this.dialog(
                            <EnumSelector from={AnomalyLevel} onSubmit={element => {
                                this.dialog(
                                    <AnomalyInfo anomaly={{
                                        level: AnomalyLevel[element as keyof typeof AnomalyLevel]
                                    }}/>
                                );
                            }}/>
                        );
                    }}/>

                    <Button text={"Switch app mode"} onClick={() => {
                        this.dialog(
                            <AppModeSwitcher/>
                        );
                    }}/>

                </Flex>
            }/>
        );
    }
}

import {BernieComponent} from "../../../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import {Assembly} from "../../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../../logic/style/Themeable";
import {LiteGrid} from "../../../../../components/lo/LiteGrid";
import {AF} from "../../../../../components/logic/ArrayFragment";
import {Button} from "../../../../../components/lo/Button";
import {percent, px} from "../../../../../logic/style/DimensionalMeasured";
import {StaticDrawerMenu} from "../../../../../components/lo/StaticDrawerMenu";
import {If} from "../../../../../components/logic/If";
import {Text, TextType} from "../../../../../components/lo/Text";
import {Cursor} from "../../../../../logic/style/Cursor";

import clickSound from "../../../../../assets/sound/click.mp3";
import {DrawerHeader} from "../../../../../components/lo/DrawerHeader";
import {VM} from "../../../../../logic/style/ObjectVisualMeaning";
import {Flex, FlexRow} from "../../../../../components/lo/FlexBox";
import {Align} from "../../../../../logic/style/Align";
import {Box} from "../../../../../components/lo/Box";
import {createMargin} from "../../../../../logic/style/Margin";
import styled from "styled-components";
import {Icon} from "../../../../../components/lo/Icon";

import {ReactComponent as DeleteIcon} from "../../../../../assets/icons/ic-16/ic16-chevron-left.svg";
import {SoundEffectProps} from "../../../../../components/props/SoundEffectProps";
import {getOr} from "../../../../../logic/Utils";
import {PinPad} from "../../../../../components/ho/pinPad/PinPad";


export class NumPadTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "numpad-test",
        displayName: "Numpad test",
        element: NumPadTest,
        factory: Elem => <Elem/>
    });

    private openNumpadDialog() {
        this.dialog(
            <StaticDrawerMenu body={props => (
                <AF elements={[
                    <PinPad
                        length={6}
                        maxAttempts={3}
                        validator={value => Number(value.join("")) === 230121}
                        enableSounds={false}
                        actions={{
                            onSuccess: component => {
                                setTimeout(() => {
                                    this.closeLocalDialog();

                                    setTimeout(() => {
                                        this.dialog(
                                            <StaticDrawerMenu body={() => (
                                                <Text text={"SUCCESS"}/>
                                            )}/>
                                        );
                                    }, 250);
                                }, 500);
                            }
                        }}
                    />
                ]}/>
            )}/>
        );
    }

    componentDidMount() {
        super.componentDidMount();
        this.openNumpadDialog();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Button text={"Open numpad validation"} onClick={() => this.openNumpadDialog()}/>
        );
    }
}

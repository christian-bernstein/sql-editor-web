import {BC} from "../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Button} from "../../../components/lo/Button";
import {Flex} from "../../../components/lo/FlexBox";
import {Centered} from "../../../components/lo/PosInCenter";
import {vh} from "../../../logic/style/DimensionalMeasured";
import { TransitionGroup } from 'react-transition-group';
import {Fade, Zoom} from "@mui/material";
import Box from "@mui/material/Box";
import {Screen} from "../../../components/lo/Page";
import {Gloria} from "../../../frameworks/gloria/Gloria";
import {GloriaCommandPalette} from "../../../frameworks/gloria/components/GloriaCommandPalette";

export class CommandPaletteTest extends BC<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "command-palette-test",
        displayName: "Command palette",
        element: CommandPaletteTest,
        factory: Elem => <Elem/>
    });

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Button text={"Command Palette"} onClick={() => {
                this.dialog(
                    <Screen style={{ backgroundColor: "black" }} children={
                        <Centered fullHeight children={
                            <GloriaCommandPalette gloria={new Gloria().registerCommand({
                                id: "test-1",
                                title: () => "Test 1",
                                description: () => "This is the test description for `Test 1`. This commands does only print to the console.",
                                executor: (ctx) => new Promise(resolve => {
                                    console.log("Test 1 running");
                                    resolve(undefined);
                                })
                            }).registerCommand({
                                id: "test-2",
                                title: () => "Test called 2",
                                executor: (ctx) => new Promise(resolve => {
                                    console.log("Test 2 running");
                                    resolve(undefined);
                                })
                            }).registerCommand({
                                id: "asd",
                                title: () => "ASd",
                                executor: (ctx) => new Promise(resolve => {
                                    console.log("asd running");
                                    resolve(undefined);
                                })
                            }).registerCommand({
                                id: "test-3",
                                title: () => "3 not 2!",
                                executor: (ctx) => new Promise(resolve => {
                                    console.log("Test 3 running");
                                    resolve(undefined);
                                })
                            })}/>
                        }/>
                    }/>
                );
            }}/>
        );
    }
}

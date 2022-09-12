import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {UnitTestUtils} from "./UnitTestUtils";
import React from "react";
import {Box} from "../../components/lo/Box";
import {Flex} from "../../components/lo/FlexBox";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {percent} from "../../logic/style/DimensionalMeasured";
import {BoardingActionsDrawer} from "../../components/ho/boardingActionsDrawer/BoardingActionsDrawer";
import {ColorSelector} from "../../components/ho/colorSelector/ColorSelector";
import {Color} from "../../logic/style/Color";

export class QuickTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "quick-test",
        displayName: "Quick test",
        element: QuickTest,
        factory: Elem => <Elem/>
    });

    /**
     * Note: Test assembly can be re-rendered by calling the 'test' channel.
     */
    private testAssembly() {
        // You may use this pre-made utility function to rerender the test assembly
        const rerender = () => this.rerender("test");

        this.assembly.assembly("test", (theme, props) => {
            // Display your test component here

            return (
                <ColorSelector actions={{}} showThemePalette showHistoryPalette palettes={new Map<string, Array<Color>>([
                    ["main", [
                        Color.ofHex("#FFee3F"),
                        Color.ofHex("#AFFF3F"),
                        Color.ofHex("#0F753F"),
                    ]]
                ])}/>
            );
        });
    }

    init() {
        super.init();
        this.testAssembly();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(() => this.a("test"), "test");
    }
}

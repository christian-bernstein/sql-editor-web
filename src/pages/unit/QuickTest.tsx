import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {UnitTestUtils} from "./UnitTestUtils";
import {Text} from "../../components/lo/Text";
import React from "react";
import {UnitTest} from "./UnitTest";
import {SelectElement} from "../../components/lo/Select";

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
                <></>
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

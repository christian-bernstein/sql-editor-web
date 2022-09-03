import {UnitTestUtils} from "../UnitTestUtils";
import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";

export class ProjectCardTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "project-card",
        displayName: "Project card",
        element: ProjectCardTest,
        factory: Elem => <Elem/>
    });

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <>ProjectCardTest</>
        );
    }
}



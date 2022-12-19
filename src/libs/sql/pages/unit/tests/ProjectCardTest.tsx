import {UnitTestUtils} from "../UnitTestUtils";
import {BernieComponent} from "../../../../../logic/BernieComponent";
import {Assembly} from "../../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../../logic/style/Themeable";
import {ProjectCard} from "../../../../../components/ho/projectCard/ProjectCard";
import {v4} from "uuid";
import {LoadState} from "../../../../../logic/misc/LoadState";
import {px} from "../../../../../logic/style/DimensionalMeasured";

export class ProjectCardTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "project-card",
        displayName: "Project card",
        element: ProjectCardTest,
        factory: Elem => <Elem/>
    });

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <ProjectCard width={px(350)} data={{
                title: "sql-editor-web",
                description: "SQL-Editor frontend, written in Typescript, using React. \"Learn SQL in our interactive editor and create your database projects\"",
                id: v4(),
                creatorUserID: "root",
                edits: 684,
                state: LoadState.ONLINE,
                internalTags: ["internal", "infrastructure"],
                lastEdited: new Date(),
                stator: true
            }}/>
        );
    }
}



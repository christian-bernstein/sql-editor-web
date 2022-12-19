import {BC} from "../../../logic/BernieComponent";
import {AtlasMain} from "../../../../atlas/AtlasMain";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {UnitTestUtils} from "../UnitTestUtils";
import {InDevAtlasAPI} from "../../../../atlas/api/InDevAtlasAPI";

export class AtlasTest extends BC<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "atlas-test",
        displayName: "Atlas test",
        element: AtlasTest,
        factory: Elem => <Elem/>
    });

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <AtlasMain
                api={new InDevAtlasAPI()}
            />
        );
    }
}

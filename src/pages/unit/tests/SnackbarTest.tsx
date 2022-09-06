import {BernieComponent} from "../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {SnackbarProvider, withSnackbar } from "notistack";
import {Button} from "../../../components/lo/Button";

export class SnackbarTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "snackbar",
        displayName: "Snackbar",
        element: SnackbarTest,
        factory: Elem => <Elem/>
    });

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const C = withSnackbar(props => {
            return (
                <Button text={"Snack"} onClick={() => {
                    props.enqueueSnackbar("Hello world", {
                        variant: "warning"
                    })
                }}/>
            );
        })

        return (
            <SnackbarProvider maxSnack={6} children={
                <C/>
            }/>
        );
    }
}

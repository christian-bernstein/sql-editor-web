import {BernieComponent} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";

export class EditProfilePage extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return super.componentRender(p, s, l, t, a);
    }
}

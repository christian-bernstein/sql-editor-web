import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";

export type ArrayFragmentProps = {
    elements: Array<Array<JSX.Element> | JSX.Element | undefined>
}

class ArrayFragment extends BernieComponent<ArrayFragmentProps, any, any> {

    componentRender(p: ArrayFragmentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <>
                { p.elements.filter(e => e) }
            </>
        );
    }
}

export {
    ArrayFragment as AF,
    ArrayFragment,
};

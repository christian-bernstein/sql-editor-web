import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";

export type WhenProps = {
    test: any,
    cases: Map<(value: any) => boolean, () => JSX.Element>,
    default?: () => JSX.Element
}

export function equals(shouldBe: any): (value: any) => boolean {
    return value => value === shouldBe;
}

export class When extends BernieComponent<WhenProps, any, any> {

    componentRender(p: WhenProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        let renderer = p.default ?? (() => <></>);
        p.cases.forEach((value, key) => {
            if (key(p.test)) {
                renderer = value;
            }
        });
        return renderer();
    }
}

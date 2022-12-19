import {BernieComponent, BernieComponentBaseProps} from "./BernieComponent";
import {Assembly} from "./assembly/Assembly";
import {Themeable} from "./style/Themeable";

export class ComponentMultiplexer<P, S, L extends object> extends BernieComponent<P, S, L> {
    constructor(props: BernieComponentBaseProps<P>, state: S, localState: L, renderers: Map<string, () => JSX.Element>) {
        super(props, state, localState);
    }
}

export class A extends ComponentMultiplexer<any, any, any> {
    constructor() {
        super(undefined, undefined, undefined, new Map([
            ["", () => <></>]
        ]));
    }
}

import {BernieComponent} from "../logic/BernieComponent";
import {Assembly} from "../logic/assembly/Assembly";
import {Themeable} from "../logic/style/Themeable";

export type HOCWrapperProps = {
    body: (wrapper: HOCWrapper) => JSX.Element | undefined,
    componentDidMount?: (wrapper: HOCWrapper) => void
}

export class HOCWrapper extends BernieComponent<HOCWrapperProps, any, any> {
    constructor(props: HOCWrapperProps) {
        super(props, undefined, undefined, {
            enableLocalDialog: true
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.componentDidMount?.(this);
    }

    componentRender(p: HOCWrapperProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.props.body(this);
    }
}

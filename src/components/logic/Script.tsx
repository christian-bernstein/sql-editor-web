import {BC} from "../../logic/BernieComponent";

export type ScriptProps = {
    script: (domEntry: Script) => number | void,
    onError?: (e: any) => void,
    onFinish?: (code: number) => void
}

export class Script extends BC<ScriptProps, any, any> {

    componentDidMount() {
        super.componentDidMount();
        try {
            const code = this.props.script(this) ?? 0;
            this.props.onFinish?.(code);
        } catch (e) {
            this.props.onError?.(e);
        }
    }
}

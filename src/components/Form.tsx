import {BC} from "../logic/BernieComponent";
import {FormDataHub} from "../tests/epicure/components/FormDataHub";
import {FormContext} from "./FormContext";
import {Assembly} from "../logic/assembly/Assembly";
import {Themeable} from "../logic/style/Themeable";
import {FormTransactionType} from "./FormTransactionType";

export type FormProps = {
    formID: string,
    renderer: (ctx: FormContext) => JSX.Element
    onSubmit: (ctx: FormContext, get: (id: string, def?: any) => any) => void
}

export type FormLocalState = {
    fdh: FormDataHub
}

export class Form extends BC<FormProps, any, FormLocalState> {

    constructor(props: FormProps) {
        super(props, undefined, {
            fdh: new FormDataHub(props.formID)
        });
    }

    private onTransaction(type: FormTransactionType) {
        switch (type) {
            case FormTransactionType.SUBMIT:
                const ctx = this.formContext();
                this.props.onSubmit(ctx, (id, def) => ctx.data.get(id, def));
                break;
            case FormTransactionType.CANCEL:
                // TODO Implement
                break;
            case FormTransactionType.CLEAR:
                // TODO Implement
                break;
        }
    }

    private formContext(): FormContext {
        return ({
            form: this,
            data: this.ls().fdh,
            transaction: type => this.onTransaction(type)
        });
    }

    componentRender(p: FormProps, s: any, l: FormLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return p.renderer(this.formContext());
    }
}

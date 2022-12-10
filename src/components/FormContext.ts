import {Form} from "./Form";
import {FormDataHub} from "../tests/epicure/components/FormDataHub";
import {FormTransactionType} from "./FormTransactionType";

export type FormContext = {
    form: Form,
    data: FormDataHub,
    transaction: (type: FormTransactionType) => void
}

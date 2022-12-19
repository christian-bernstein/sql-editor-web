import {ISOInstallMethod} from "./ISOInstallMethod";
import {ISOBase} from "./ISOBase";
import {GenericBC} from "../../sql/logic/BernieComponent";

export interface IISOAdapter {
    install(method: ISOInstallMethod, iso: ISOBase, dialogDOMEntry: GenericBC): void;
    createISO(): Promise<ISOBase>;
}

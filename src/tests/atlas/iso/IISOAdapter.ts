import {ISOInstallMethod} from "./ISOInstallMethod";
import {ISOBase} from "./ISOBase";

export interface IISOAdapter {
    install(method: ISOInstallMethod, iso: ISOBase): void;
    createISO(): Promise<ISOBase>;
}

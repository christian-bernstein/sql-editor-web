import {IHyperionStreamAdapter} from "./IHyperionStreamAdapter";

export interface IHyperionAPI extends IHyperionStreamAdapter {
    setStreamAdapter(adapter: IHyperionStreamAdapter): IHyperionAPI;
}

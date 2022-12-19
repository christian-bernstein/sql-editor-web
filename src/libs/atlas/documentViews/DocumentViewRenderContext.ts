import {DocumentViewRenderContextData} from "./DocumentViewRenderContextData";

export class DocumentViewRenderContext {

    private readonly _data: DocumentViewRenderContextData;

    constructor(data: DocumentViewRenderContextData) {
        this._data = data;
    }

    get data(): DocumentViewRenderContextData {
        return this._data;
    }
}

import {ProjectInfoData} from "../data/ProjectInfoData";
import {format} from "sql-formatter";

export class EditorLogicCompanion {

    private readonly data: ProjectInfoData;

    constructor(data: ProjectInfoData) {
        this.data = data;
    }

    public loadMainEditorContent(defaultValue: string): string {
        const key = `main-editor-content:${this.data.id}`;
        const item = window.localStorage.getItem(key);
        if (item === null) {
            return this.setMainEditorContent(defaultValue);
        } else {
            return item;
        }
    }

    public setMainEditorContent(content: string): string {
        const key = `main-editor-content:${this.data.id}`;
        window.localStorage.setItem(key, content);
        return content;
    }
}

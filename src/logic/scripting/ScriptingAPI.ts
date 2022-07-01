import {Editor} from "../../pages/editor/Editor";
import {SessionCommandType} from "../data/SessionCommandType";
import {App} from "../app/App";
import {ProjectInfoData} from "../data/ProjectInfoData";
import {SQLCommandQueryResponsePacketData} from "../../packets/in/SQLCommandQueryResponsePacketData";

export class ScriptingAPI {

    private editor: Editor;

    private project: ProjectInfoData

    constructor(editor: Editor, project: ProjectInfoData) {
        this.editor = editor;
        this.project = project;
    }

    public push(sql: string, internal: boolean = true): void {
        if (internal) {
            App.app().net().intrinsicSQLUpdate({
                packet: {
                    type: SessionCommandType.PUSH,
                    raw: sql,
                    attributes: new Map<string, string>(),
                    dbID: this.project.id
                }
            });
        } else {
            this.editor.sendCommand(SessionCommandType.PUSH, sql).then(() => {});
        }
    }

    public pull(sql: string, internal: boolean = true): Promise<SQLCommandQueryResponsePacketData> {
        return new Promise<SQLCommandQueryResponsePacketData>((resolve, reject) => {
            if (internal) {
                App.app().net().intrinsicSQLQuery({
                    packet: {
                        type: SessionCommandType.PULL,
                        raw: sql,
                        attributes: new Map<string, string>(),
                        dbID: this.project.id
                    },
                    onCallback: data => {
                        resolve(data);
                    }
                });
            } else {
                this.editor.sendCommand(SessionCommandType.PUSH, sql).then(() => {});
            }
        });

    }

}

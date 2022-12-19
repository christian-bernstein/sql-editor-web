import {EditorLogicCompanion} from "../../../../../logic/editor/EditorLogicCompanion";
import {FormDataHub} from "../../../../epicure/components/FormDataHub";
import {Editor} from "../Editor";
import {ProjectInfoData} from "../../../../../logic/data/ProjectInfoData";

export type TabProps = {
    companion: EditorLogicCompanion,
    fdh: FormDataHub,
    editor: Editor,
    projectInfo: ProjectInfoData

}

import {IconRenderer} from "./IconRenderer";
import {IconDict} from "./IconDict";
import {ReactComponent as DocumentIcon} from "../../../assets/icons/ic-20/ic20-file.svg";
import {ReactComponent as MarkdownIcon} from "../../../assets/icons/markdown-icon.svg";
import {NoteRounded, NotesRounded, PictureAsPdfRounded} from "@mui/icons-material";

export const atlasIconDict: IconDict = {
    name: "atlas",
    table: new Map<string, IconRenderer>([
        ["generic-file", () => <DocumentIcon/>],
        ["pdf-file", () => <PictureAsPdfRounded/>],
        ["md-file", () => <MarkdownIcon/>],
        ["note-file", () => <NotesRounded/>],
    ])
}

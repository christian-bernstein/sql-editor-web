import {LogEntry} from "../../logic/data/LogEntry";
import {Themeable} from "../../logic/style/Themeable";
import {LogPage} from "./LogPage";

export interface LogBodyRenderer {
    render(instance: LogPage, history: Array<LogEntry>, t: Themeable.Theme): JSX.Element
}
